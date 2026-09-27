@echo off
title Quality Education Website Host
echo ========================================================
echo Starting Quality Education Website Server & Tunnel...
echo ========================================================
cd /d "%~dp0"

echo [1/2] Starting Node.js backend on http://localhost:3000...
start "Node Server" /min node server.js

echo Waiting for server to initialize...
timeout /t 3 /nobreak > nul

echo [2/2] Launching Public HTTPS Tunnel via Cloudflare...
echo Look for your active https://xxx.trycloudflare.com link below:
echo ========================================================
.\bin\cloudflared.exe tunnel --url http://127.0.0.1:3000
pause
