@echo off
cd /d "%~dp0"
if exist "%ProgramFiles%\nodejs\node.exe" (
  "%ProgramFiles%\nodejs\node.exe" ecosystem\setup.cjs --check-only
) else (
  node ecosystem\setup.cjs --check-only
)
set "ICM_CHECK_EXIT=%ERRORLEVEL%"
pause
exit /b %ICM_CHECK_EXIT%
