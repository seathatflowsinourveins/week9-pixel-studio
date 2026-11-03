@echo off
cd /d "%~dp0"
node ecosystem\stop.cjs
if errorlevel 1 pause
