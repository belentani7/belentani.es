@echo off
cd /d "%~dp0"
echo.
echo  BELENTANI — arrancando app en http://localhost:4321
echo  Ctrl+C para parar
echo.
start "" "http://localhost:4321/"
call npm run start
