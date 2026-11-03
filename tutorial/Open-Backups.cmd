@echo off
cd /d "%~dp0"
if exist "%~dp0backups\" (
  start "" explorer.exe "%~dp0backups"
) else (
  echo No local backups yet. Run Start-Week-9.cmd first.
  pause
)
