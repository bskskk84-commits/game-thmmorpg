@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24 LTS, then run this file again.
  echo https://nodejs.org/
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js with npm and reopen this window.
  pause
  exit /b 1
)
if not exist .env copy /Y .env.example .env >nul
if not exist node_modules (
  call npm ci
  if errorlevel 1 (
    echo Dependency installation failed. Copy the error above for troubleshooting.
    pause
    exit /b 1
  )
)
echo.
echo Keep this window open while playing.
echo Wait for Vite ready and Game server, then open http://localhost:5173
echo For a second player, open an Incognito browser window.
echo Press Ctrl+C to stop.
echo.
call npm run dev
if errorlevel 1 (
  echo Startup failed. Copy the error above for troubleshooting.
  pause
)
