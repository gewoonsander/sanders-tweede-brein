// IntegrationMark.tsx — het icoontje dat elke koppeling in de lijst- en
// kaartweergave van "Koppelingen & software" aanvoert.
//
// WAAROM GEEN ECHTE MERKLOGO'S
// De referentie (claude.ai/settings/connectors) toont volle-kleur merklogo's.
// Dat kan hier niet: GL-003 §2.3 staat één markermoment per view toe en §2.5
// bindt kleur aan functie, niet aan decoratie. De huisregel staat al zwart op
// wit in components/planner/SourceMark.tsx: "de kalme donkere palette kan geen
// Todoist-rood + ClickUp-gradient + Google Calendar-multicolour hosten." Dus:
// MONOCHROOM, currentColor, en de kleur komt van de omliggende tekstlaag.
//
// WAAROM LUCIDE EN GEEN simple-icons
// SourceMark inlinet drie geverifieerde simple-icons-paden. Voor 34 koppelingen
// zou dat 34 handmatig overgeschreven SVG-paden betekenen — pad-data die ik niet
// kan verifiëren mag ik niet verzinnen, en een nieuwe npm-afhankelijkheid is een
// beslissing voor Sander, niet voor mij. Lucide is de huis-iconenset (§5.5) en
// is er al: elke koppeling krijgt een SEMANTISCH glyph (post → Mail, agenda →
// CalendarDays, betalingen → CreditCard). Wil Sander later echte merkmarken,
// dan is `simple-icons` toevoegen de enige nette route — zie het rapport.
//
// GEEN GL-018-SCHEMAWIJZIGING
// Het canonieke register (GL-018) kent geen icoonveld en krijgt er ook geen.
// De koppeling id → glyph is puur een presentatielaag en leeft hier. Een
// onbekend `integration_id` (nieuw record, typefout, toekomstige koppeling)
// crasht niets: die valt terug op een monogram-tegel met de eerste letter van
// de naam, precies zoals claude.ai "G" toont voor Google Contacts.

import {
  Box, CalendarDays, Clapperboard, ClipboardList, Contact, CreditCard, FileText, Film,
  Flame, FolderSync, Gauge, Github, Globe, HardDrive, KeyRound, Landmark, Mail,
  MessagesSquare, Palette, PenTool, Podcast, Receipt, Search, SquareCheck, Target,
  Users, Utensils, Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * integration_id → huisglyph. De sleutels komen letterlijk uit het `integrations`
 * blok van GL-018; staat een id hier niet in, dan valt IntegrationMark terug op
 * het monogram. Nieuwe GL-018-records hoeven hier dus NIET te landen om te
 * werken — een regel toevoegen is een verfijning, geen vereiste.
 */
const GLYPH_BY_ID: Record<string, LucideIcon> = {
  // MCP-servers en API's
  'n8n-mcp': Workflow,
  'n8n-public-api': Workflow,
  'firecrawl-mcp': Flame,
  'davinci-resolve-mcp': Clapperboard,
  'davinci-resolve-studio': Film,
  'todoist-api': SquareCheck,
  'calendar-ical': CalendarDays,
  'jortt-api': Receipt,
  'perplexity-api': Search,
  'google-contacts-n8n': Contact,
  'google-people-api-mcp': Users,
  'bunq-api': Landmark,

  // claude.ai-connectors
  'gmail-connector': Mail,
  'google-drive-connector': HardDrive,
  'google-calendar-connector': CalendarDays,
  'todoist-connector': SquareCheck,
  'dropbox-connector': Box,
  'dropbox-mcp': Box,
  'canva-connector': Palette,
  'github-connector': Github,
  'plugandpay-mcp': CreditCard,

  // Databronnen
  'dt-irritant-forms': ClipboardList,
  'teambeheer-source': Target,
  'apple-podcasts': Podcast,
  'voedingsdata-nederland': Utensils,

  // Software
  'mypka-cockpit': Gauge,
  lastpass: KeyRound,
  formflow: FileText,
  canva: Palette,
  huddle: MessagesSquare,
  plugandpay: CreditCard,
  'affinity-suite': PenTool,
  'wpmu-dev': Globe,
  rclone: FolderSync,
};

/** Eerste letter van de naam, hoofdletter — het monogram voor onbekende id's. */
function monogramFor(name: string): string {
  const first = name.trim().charAt(0);
  return first ? first.toLocaleUpperCase('nl-NL') : '?';
}

export interface IntegrationMarkProps {
  /** Het `integration_id` uit GL-018. */
  integrationId: string;
  /** De weergavenaam; levert het monogram bij een onbekend id. */
  name: string;
}

/**
 * Altijd decoratief (`aria-hidden`): de naam van de koppeling staat er direct
 * naast, dus een tweede stem voor de schermlezer is ruis, geen informatie.
 */
export function IntegrationMark({ integrationId, name }: IntegrationMarkProps) {
  const Glyph = GLYPH_BY_ID[integrationId];
  if (!Glyph) {
    return (
      <span className="intg-mark intg-mark--monogram" aria-hidden="true">
        {monogramFor(name)}
      </span>
    );
  }
  return (
    <span className="intg-mark" aria-hidden="true">
      <Glyph size={16} strokeWidth={1.75} />
    </span>
  );
}
