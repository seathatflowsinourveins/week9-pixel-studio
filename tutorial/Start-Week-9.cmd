@echo off
cd /d "%~dp0"
if exist "%ProgramFiles%\nodejs\node.exe" (
  "%ProgramFiles%\nodejs\node.exe" ecosystem\setup.cjs
) else (
  node ecosystem\setup.cjs
)
set "ICM_SETUP_EXIT=%ERRORLEVEL%"
if not "%ICM_SETUP_EXIT%"=="0" pause
exit /b %ICM_SETUP_EXIT%
