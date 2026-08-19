#!/usr/bin/env python3
"""Haalt de speler-gemiddelden van de MODUS Super Series op en aggregeert ze per Series.

Bron: https://modussuperseries.com/week-averages.php (server-gerenderde PHP, geen
API-sleutel nodig, geen JavaScript-rendering nodig). Alleen Python-stdlib, in lijn
met de rest van deze scriptmap.

BELANGRIJK — wat "Accumulative Averages" op die site betekent:
De tabel per week is cumulatief *binnen die week* (groepswedstrijden + finalegroep
+ halve finales + finale van dat ene evenement), niet cumulatief over de hele
Series. Elke week heeft een eigen spelersveld. De laatste week van een Series is
dus NIET het eindgemiddelde van die Series — dat moet berekend worden door alle
weken van een Series op te tellen. Geverifieerd op 2026-08-19: Series 1 week 6,
week 9 en week 13 delen vrijwel geen spelers, en Ciaran Teehan staat in week 6
met 4 gespeelde partijen en in week 13 met 8 — losse tellingen, geen doorlopende.

Het Series-gemiddelde wordt daarom berekend als 3 x (som punten) / (som darts)
over alle weken waarin de speler binnen die Series uitkwam. Die formule is
geverifieerd tegen de site zelf: week 6 van Series 1 geeft James Hurrell
4722 punten / 159 darts -> 3 x 29,698 = 89,09, exact het getoonde gemiddelde.

Gebruik:
    python3 "Team Knowledge/scripts/modus-super-series-averages.py" --uit MAP
    python3 "Team Knowledge/scripts/modus-super-series-averages.py" --uit MAP --cache CACHEMAP
    python3 "Team Knowledge/scripts/modus-super-series-averages.py" --uit MAP --series 1 2 3

Schrijft drie CSV's in de opgegeven map:
    modus-super-series-per-series.csv   speler-eindgemiddelde per Series (hoofdresultaat)
    modus-super-series-per-week.csv     ruwe brondata, een rij per speler per week
    modus-super-series-alltime.csv      speler-gemiddelde over alle Series samen

en een leesbaar rapport (stdout) met de controles die tijdens het ophalen zijn gedaan.
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
import time
import urllib.error
import urllib.request
from html import unescape  # als functie geimporteerd: 'html' is hier een parameternaam
from pathlib import Path

BASIS_URL = "https://modussuperseries.com"
AVERAGES_URL = BASIS_URL + "/week-averages.php"
HONOURS_URL = BASIS_URL + "/honours-board"

# Een echte browser-UA: de site serveert gewone HTML, maar een lege UA wordt
# door sommige hosts geweigerd.
KOPPEN = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    )
}

OPTIE_RE = re.compile(r'<option\s+value="(\d+)"\s*(selected)?\s*>\s*(.*?)\s*</option>', re.S)
H1_RE = re.compile(r"<h1>(.*?)</h1>", re.S)
HONOUR_NR_RE = re.compile(r'<div class="honour-number">\s*(\d+)\s*</div>', re.S)

# De punten- en darts-kolom staan altijd in de HTML; de site verbergt ze puur met
# CSS onder 900px schermbreedte. Ze zijn hier toch optioneel gemaakt, zodat een
# oudere of afwijkende pagina niet stilzwijgend de hele rij laat wegvallen.
RIJ_RE = re.compile(
    r'<div class="table-row">\s*'
    r'<div class="position">(.*?)</div>\s*'
    r'<div class="name">(.*?)</div>\s*'
    r'<div class="stat">(.*?)</div>\s*'
    r'(?:<div class="stat points-cell">(.*?)</div>\s*)?'
    r'(?:<div class="stat darts-cell">(.*?)</div>\s*)?'
    r'<div class="average">(.*?)</div>',
    re.S,
)


def haal_op(url: str, cache_dir: Path | None, sleutel: str, vertraging: float) -> str:
    """Haalt een pagina op, met optionele schijf-cache zodat herhaalde runs de
    site niet onnodig belasten."""
    if cache_dir is not None:
        bestand = cache_dir / f"{sleutel}.html"
        if bestand.exists():
            return bestand.read_text(encoding="utf-8", errors="replace")

    laatste_fout: Exception | None = None
    for poging in range(3):
        try:
            verzoek = urllib.request.Request(url, headers=KOPPEN)
            with urllib.request.urlopen(verzoek, timeout=30) as antwoord:
                html = antwoord.read().decode("utf-8", "replace")
            break
        except (urllib.error.URLError, TimeoutError, OSError) as fout:
            laatste_fout = fout
            time.sleep(2 * (poging + 1))
    else:
        raise RuntimeError(f"{url} niet op te halen na 3 pogingen: {laatste_fout}")

    if cache_dir is not None:
        cache_dir.mkdir(parents=True, exist_ok=True)
        (cache_dir / f"{sleutel}.html").write_text(html, encoding="utf-8")
    time.sleep(vertraging)
    return html


def lees_dropdown(html: str, select_id: str) -> list[tuple[int, str]]:
    """Geeft [(waarde, label)] van een <select> terug, in paginavolgorde."""
    treffer = re.search(r'<select id="%s".*?</select>' % re.escape(select_id), html, re.S)
    if not treffer:
        return []
    return [
        (int(waarde), re.sub(r"\s+", " ", unescape(label)).strip())
        for waarde, _sel, label in OPTIE_RE.findall(treffer.group(0))
    ]


def normaliseer_naam(naam: str) -> str:
    """De site schrijft samengestelde achternamen met underscores in plaats van
    spaties ('Jeffrey de_Zwaan', 'Gian van_Veen'), soms met een underscore aan het
    eind ('Rusty-Jake Rodriguez_'). Dat is een bronartefact, geen echte schrijfwijze.
    Zonder deze normalisatie valt dezelfde speler in twee varianten uiteen zodra de
    site het ergens wel en ergens niet doet. De onbewerkte brontekst blijft bewaard
    in de kolom `speler_bron` van de weekdata, zodat dit controleerbaar blijft."""
    return re.sub(r"\s+", " ", naam.replace("_", " ")).strip()


def lees_rijen(html: str) -> list[dict]:
    rijen = []
    for positie, naam, gespeeld, punten, darts, gemiddelde in RIJ_RE.findall(html):
        # unescape is nodig: de site levert apostrofs als &#039; (Tony O&#039;Shea).
        bron_naam = re.sub(r"\s+", " ", unescape(naam)).strip()
        rijen.append(
            {
                "positie": int(positie.strip()),
                "speler": normaliseer_naam(bron_naam),
                "speler_bron": bron_naam,
                "gespeeld": int(gespeeld.strip()),
                "punten": int(punten.strip()) if punten and punten.strip() else None,
                "darts": int(darts.strip()) if darts and darts.strip() else None,
                "gemiddelde": float(gemiddelde.strip()),
            }
        )
    return rijen


def haal_afgeronde_series(cache_dir: Path | None, vertraging: float) -> set[int]:
    """De Honours Board toont alleen Series die een winnaar hebben, dus alleen
    afgeronde Series. Dat is de bron voor 'afgerond' vs 'lopend' — bewust niet
    hardcoded, zodat het klopt blijft zodra Series 15 afloopt."""
    html = haal_op(HONOURS_URL, cache_dir, "honours-board", vertraging)
    return {int(n) for n in HONOUR_NR_RE.findall(html)}


def gemiddelde_uit_totalen(punten: int, darts: int) -> float:
    return round(3 * punten / darts, 2)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--uit", required=True, type=Path, help="map waarin de CSV's worden geschreven")
    parser.add_argument("--cache", type=Path, default=None, help="map om opgehaalde HTML in te bewaren")
    parser.add_argument("--vertraging", type=float, default=0.4, help="seconden tussen verzoeken (default 0.4)")
    parser.add_argument("--series", type=int, nargs="*", default=None, help="alleen deze series_id's ophalen")
    args = parser.parse_args()

    uit: Path = args.uit
    uit.mkdir(parents=True, exist_ok=True)

    print("MODUS Super Series — gemiddelden ophalen", file=sys.stderr)

    afgerond = haal_afgeronde_series(args.cache, args.vertraging)
    print(f"Honours Board noemt {len(afgerond)} afgeronde Series: {sorted(afgerond)}", file=sys.stderr)

    start_html = haal_op(AVERAGES_URL, args.cache, "series-index", args.vertraging)
    series_lijst = lees_dropdown(start_html, "seriesSelect")
    if not series_lijst:
        print("FOUT: geen series-dropdown gevonden — is de pagina veranderd?", file=sys.stderr)
        return 1
    if args.series:
        series_lijst = [s for s in series_lijst if s[0] in set(args.series)]

    print(f"Dropdown geeft {len(series_lijst)} onderdelen: "
          f"{', '.join(f'{label} (id {sid})' for sid, label in series_lijst)}", file=sys.stderr)

    per_week: list[dict] = []
    notities: list[str] = []
    weken_zonder_data: list[str] = []

    for series_id, series_label in series_lijst:
        nummer_treffer = re.fullmatch(r"Series (\d+)", series_label)
        series_nr = int(nummer_treffer.group(1)) if nummer_treffer else None
        if series_nr is None:
            status = "los evenement"
        elif series_nr in afgerond:
            status = "afgerond"
        else:
            status = "lopend (tussenstand)"

        series_html = haal_op(
            f"{AVERAGES_URL}?series_id={series_id}", args.cache, f"series-{series_id}", args.vertraging
        )
        weken = lees_dropdown(series_html, "weekSelect")
        if not weken:
            notities.append(f"{series_label}: geen weken in de dropdown — overgeslagen")
            continue

        print(f"  {series_label} (id {series_id}, {status}) — {len(weken)} weken", file=sys.stderr)

        for week_id, week_label in weken:
            week_html = haal_op(
                f"{AVERAGES_URL}?series_id={series_id}&week_id={week_id}",
                args.cache,
                f"series-{series_id}-week-{week_id}",
                args.vertraging,
            )
            rijen = lees_rijen(week_html)
            if not rijen:
                weken_zonder_data.append(f"{series_label} / {week_label}")
                continue
            for rij in rijen:
                per_week.append(
                    {
                        "series": series_label,
                        "series_id": series_id,
                        "series_status": status,
                        "week": week_label,
                        "week_id": week_id,
                        **rij,
                    }
                )

    if not per_week:
        print("FOUT: geen enkele rij opgehaald.", file=sys.stderr)
        return 1

    # --- CSV 1: ruwe data per week ---
    pad_week = uit / "modus-super-series-per-week.csv"
    with pad_week.open("w", newline="", encoding="utf-8") as f:
        schrijver = csv.DictWriter(
            f,
            fieldnames=[
                "series", "series_id", "series_status", "week", "week_id",
                "positie", "speler", "speler_bron", "gespeeld", "punten", "darts", "gemiddelde",
            ],
        )
        schrijver.writeheader()
        schrijver.writerows(per_week)

    # --- CSV 2: per Series geaggregeerd (hoofdresultaat) ---
    zonder_punten: list[str] = []
    per_series: dict[tuple[str, str], dict] = {}
    for rij in per_week:
        sleutel = (rij["series"], rij["speler"])
        bak = per_series.setdefault(
            sleutel,
            {
                "series": rij["series"],
                "series_id": rij["series_id"],
                "series_status": rij["series_status"],
                "speler": rij["speler"],
                "weken": 0,
                "gespeeld": 0,
                "punten": 0,
                "darts": 0,
                "_compleet": True,
            },
        )
        bak["weken"] += 1
        bak["gespeeld"] += rij["gespeeld"]
        if rij["punten"] is None or rij["darts"] is None:
            bak["_compleet"] = False
            zonder_punten.append(f"{rij['series']} / {rij['week']} / {rij['speler']}")
        else:
            bak["punten"] += rij["punten"]
            bak["darts"] += rij["darts"]

    series_rijen = []
    for bak in per_series.values():
        if bak["_compleet"] and bak["darts"]:
            gemiddelde = gemiddelde_uit_totalen(bak["punten"], bak["darts"])
        else:
            gemiddelde = None
        series_rijen.append(
            {
                "series": bak["series"],
                "series_id": bak["series_id"],
                "series_status": bak["series_status"],
                "speler": bak["speler"],
                "weken_gespeeld": bak["weken"],
                "gespeeld": bak["gespeeld"],
                "punten": bak["punten"],
                "darts": bak["darts"],
                "gemiddelde": gemiddelde,
            }
        )

    # Sorteren op series_id, dan gemiddelde aflopend; rijen zonder gemiddelde onderaan.
    series_rijen.sort(key=lambda r: (r["series_id"], -(r["gemiddelde"] or 0)))
    # positie per Series toekennen na het sorteren
    huidige_series = None
    teller = 0
    for rij in series_rijen:
        if rij["series"] != huidige_series:
            huidige_series = rij["series"]
            teller = 0
        teller += 1
        rij["positie"] = teller

    pad_series = uit / "modus-super-series-per-series.csv"
    with pad_series.open("w", newline="", encoding="utf-8") as f:
        schrijver = csv.DictWriter(
            f,
            fieldnames=[
                "series", "series_id", "series_status", "positie", "speler",
                "weken_gespeeld", "gespeeld", "punten", "darts", "gemiddelde",
            ],
        )
        schrijver.writeheader()
        schrijver.writerows(series_rijen)

    # --- CSV 3: all-time per speler ---
    alltime: dict[str, dict] = {}
    for rij in per_week:
        bak = alltime.setdefault(
            rij["speler"],
            {"speler": rij["speler"], "series": set(), "weken": 0, "gespeeld": 0, "punten": 0, "darts": 0},
        )
        bak["series"].add(rij["series"])
        bak["weken"] += 1
        bak["gespeeld"] += rij["gespeeld"]
        bak["punten"] += rij["punten"] or 0
        bak["darts"] += rij["darts"] or 0

    alltime_rijen = [
        {
            "speler": b["speler"],
            "aantal_series": len(b["series"]),
            "weken_gespeeld": b["weken"],
            "gespeeld": b["gespeeld"],
            "punten": b["punten"],
            "darts": b["darts"],
            "gemiddelde": gemiddelde_uit_totalen(b["punten"], b["darts"]) if b["darts"] else None,
        }
        for b in alltime.values()
    ]
    alltime_rijen.sort(key=lambda r: -(r["gemiddelde"] or 0))
    for index, rij in enumerate(alltime_rijen, start=1):
        rij["positie"] = index

    pad_alltime = uit / "modus-super-series-alltime.csv"
    with pad_alltime.open("w", newline="", encoding="utf-8") as f:
        schrijver = csv.DictWriter(
            f,
            fieldnames=["positie", "speler", "aantal_series", "weken_gespeeld", "gespeeld", "punten", "darts", "gemiddelde"],
        )
        schrijver.writeheader()
        schrijver.writerows(alltime_rijen)

    # --- rapport ---
    print()
    print("=== Resultaat ===")
    print(f"Weekrijen opgehaald : {len(per_week)}")
    print(f"Series x speler     : {len(series_rijen)}")
    print(f"Unieke spelers      : {len(alltime_rijen)}")
    print()
    print(f"  {pad_series}")
    print(f"  {pad_week}")
    print(f"  {pad_alltime}")
    print()
    print("=== Controles ===")
    if weken_zonder_data:
        print(f"Weken zonder tabelrijen ({len(weken_zonder_data)}): {', '.join(weken_zonder_data)}")
    else:
        print("Weken zonder tabelrijen: geen")
    if zonder_punten:
        print(f"Rijen zonder punten/darts ({len(zonder_punten)}) — gemiddelde daar leeg gelaten:")
        for regel in zonder_punten[:20]:
            print(f"  - {regel}")
        if len(zonder_punten) > 20:
            print(f"  ... en nog {len(zonder_punten) - 20}")
    else:
        print("Rijen zonder punten/darts: geen — alle Series hebben dezelfde kolommen")
    for notitie in notities:
        print(f"Let op: {notitie}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
