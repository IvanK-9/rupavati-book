@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ========================================================
echo   Запуск демонстрационного сервера для Рупавати...
echo   Пища с любовью • Food with Love
echo ========================================================
echo.

if exist "C:\Users\1v\.gemini\antigravity\scratch\.venv\Scripts\python.exe" (
    "C:\Users\1v\.gemini\antigravity\scratch\.venv\Scripts\python.exe" server.py
) else (
    python server.py
)

if errorlevel 1 (
    echo.
    echo Запуск через стандартный модуль http.server...
    start http://localhost:3000
    python -m http.server 3000
)

pause
