#!/usr/bin/env python3
"""One-shot idempotent inbox scan; launchd WatchPaths invokes this on the Mac mini."""
from __future__ import annotations
import json, shutil, subprocess, sys, time
from datetime import datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]; STATE=Path.home()/'.local/state/gewoonsander/food-capture'
PROCESS=Path(__file__).with_name('process-food-capture.py')

def digest(path, attempts=3, initial_delay=1):
    delay=initial_delay
    for attempt in range(1, attempts+1):
        try:
            result=subprocess.run(['/usr/bin/shasum','-a','256',str(path)],capture_output=True,text=True,timeout=10,check=True)
            return result.stdout.split()[0]
        except (OSError, subprocess.SubprocessError):
            if attempt == attempts: raise
            time.sleep(delay); delay *= 2
def done(key): return (STATE/f'{key}.done').exists() or (STATE/f'{key}.nonfood').exists()
def mark(key,status):
    STATE.mkdir(parents=True,exist_ok=True)
    (STATE/f'{key}.{status}').write_text(datetime.now().astimezone().isoformat(),encoding='utf-8')
def run(path, source_type, text=''):
    try: key=digest(path)
    except (OSError, subprocess.SubprocessError) as exc:
        print(json.dumps({'event':'food_capture_deferred','file':path.name,'error':str(exc)}),file=sys.stderr)
        return
    if done(key): return
    cmd=[sys.executable,str(PROCESS),'--source-type',source_type,'--source-id',key,'--logged-at',datetime.fromtimestamp(path.stat().st_mtime).astimezone().isoformat()]
    target=None
    if source_type=='photo':
        target=ROOT/'PKM/Images'/datetime.fromtimestamp(path.stat().st_mtime).strftime('%Y/%m')/(datetime.fromtimestamp(path.stat().st_mtime).strftime('%Y-%m-%d-')+key[:10]+path.suffix.lower())
        cmd += ['--photo',str(path),'--photo-path',str(target.relative_to(ROOT/'PKM'))]
    else: cmd += ['--text',text]
    result=subprocess.run(cmd,capture_output=True,text=True)
    if result.returncode==0:
        if target is not None:
            target.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(path,target)
        mark(key,'done')
        if source_type=='audio': path.unlink(missing_ok=True)
    elif 'geen voedingsregistratie' in result.stderr:
        mark(key,'nonfood')
        if source_type=='audio': path.unlink(missing_ok=True)
    else: print(json.dumps({'event':'food_capture_failed','file':path.name,'error':result.stderr[-500:]}),file=sys.stderr)

def scan():
    photos=(p for p in (ROOT/'Team Inbox/Documents').glob('*') if p.suffix.lower() in {'.jpg','.jpeg','.png','.heic','.webp'})
    for p in sorted(photos,key=lambda item:item.stat().st_mtime,reverse=True):
        run(p,'photo')
    for p in sorted((ROOT/'Team Inbox/Audio Captures').glob('*')) if (ROOT/'Team Inbox/Audio Captures').exists() else []:
        if p.suffix.lower() in {'.txt','.md'}: run(p,'audio',p.read_text(encoding='utf-8'))

if __name__ == '__main__': scan()
