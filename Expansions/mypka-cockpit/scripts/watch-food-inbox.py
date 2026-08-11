#!/usr/bin/env python3
"""One-shot idempotent inbox scan; launchd WatchPaths invokes this on the Mac mini."""
from __future__ import annotations
import hashlib, json, shutil, subprocess, sys
from datetime import datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]; STATE=Path.home()/'.local/state/gewoonsander/food-capture'; STATE.mkdir(parents=True,exist_ok=True)
PROCESS=Path(__file__).with_name('process-food-capture.py')
def digest(path):
    h=hashlib.sha256(); h.update(path.read_bytes()); return h.hexdigest()
def done(key): return (STATE/f'{key}.done').exists() or (STATE/f'{key}.nonfood').exists()
def mark(key,status): (STATE/f'{key}.{status}').write_text(datetime.now().astimezone().isoformat(),encoding='utf-8')
def run(path, source_type, text=''):
    key=digest(path); 
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
    elif 'geen voedingsregistratie' in result.stderr: mark(key,'nonfood')
    else: print(json.dumps({'event':'food_capture_failed','file':path.name,'error':result.stderr[-500:]}),file=sys.stderr)
for p in sorted((ROOT/'Team Inbox/Documents').glob('*')):
    if p.suffix.lower() in {'.jpg','.jpeg','.png','.heic','.webp'}: run(p,'photo')
for p in sorted((ROOT/'Team Inbox/Audio Captures').glob('*')) if (ROOT/'Team Inbox/Audio Captures').exists() else []:
    if p.suffix.lower() in {'.txt','.md'}: run(p,'audio',p.read_text(encoding='utf-8'))
