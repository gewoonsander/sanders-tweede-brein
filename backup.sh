#!/bin/bash
cd ~/Documents/sanders-tweede-brein
git add .
git commit -m "Session backup $(date '+%Y-%m-%d %H:%M')"
git push
