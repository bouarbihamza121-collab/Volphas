@echo off
REM ════════════════════════════════════════════════════════════════════════
REM   Volphas — one-click launcher
REM   Double-click this file. First time: generates voices (2-3 min, needs
REM   internet + Python). Every time after: just opens the app in Brave.
REM ════════════════════════════════════════════════════════════════════════

setlocal EnableDelayedExpansion
cd /d "%~dp0"

title Volphas

REM ── Decide whether voices need to be generated ────────────────────────
set "needs_gen=1"
if exist "audio\stories\l1_s1_0.mp3" (
  for %%A in ("audio\stories\l1_s1_0.mp3") do (
    if %%~zA GTR 1000 set "needs_gen=0"
  )
)

if "%needs_gen%"=="0" goto launch

REM ── First-time setup ──────────────────────────────────────────────────
echo.
echo ========================================================
echo   Volphas - First-time voice setup
echo ========================================================
echo.
echo This will download ~126 high-quality voice files for the
echo stories (Sonia for female speakers, Ryan for male speakers).
echo.
echo   * Takes 2-3 minutes
echo   * Needs internet
echo   * Only runs once
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo.
  echo ---------------------------------------------------------
  echo  Python is not installed yet.
  echo ---------------------------------------------------------
  echo  1. Go to https://python.org/downloads
  echo  2. Download and install Python.
  echo  3. VERY IMPORTANT: tick "Add Python to PATH" during install.
  echo  4. Then double-click START.bat again.
  echo.
  echo  The app also works without this step, just with robotic
  echo  browser voices instead of Sonia/Ryan.
  echo ---------------------------------------------------------
  echo.
  pause
  goto launch
)

python tools\generate_story_audio.py
if errorlevel 1 (
  echo.
  echo Something went wrong generating voices. The app will still
  echo work with browser voices. Press any key to open it anyway.
  pause >nul
)

:launch
echo.
echo Opening Volphas...
start "" "volphas-app.html"
REM Auto-close this window after launching the app.
exit
