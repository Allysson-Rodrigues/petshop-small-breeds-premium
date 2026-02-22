#!/bin/bash

# Setup Antigravity Auto-Services
# Garante a persistência de Docker e Chromium CDP no WSL2

echo "🔧 Configurando serviços de persistência..."

# 1. Docker Persistence (via systemd se habilitado)
if systemctl is-enabled docker >/dev/null 2>&1; then
    echo "   [OK] Docker já está habilitado no systemd."
else
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "   [FIXED] Docker habilitado via systemd."
fi

# 2. Chromium CDP Persistence (Porta 9222)
# Criar um serviço systemd simples para o Chromium
CHROME_BIN="/home/allys/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome"
SERVICE_FILE="/etc/systemd/system/antigravity-browser.service"

if [ ! -f "$SERVICE_FILE" ]; then
    sudo bash -c "cat <<EOF > $SERVICE_FILE
[Unit]
Description=Antigravity Browser CDP Service
After=network.target

[Service]
Type=simple
User=allys
ExecStart=$CHROME_BIN --remote-debugging-port=9222 --headless --no-sandbox --disable-dev-shm-usage --disable-gpu --user-data-dir=/tmp/antigravity-profile
Restart=always

[Install]
WantedBy=multi-user.target
EOF"
    sudo systemctl daemon-reload
    sudo systemctl enable antigravity-browser
    sudo systemctl start antigravity-browser
    echo "   [FIXED] Serviço Chromium CDP criado e habilitado."
else
    echo "   [OK] Serviço Chromium CDP já existe."
fi

echo "✅ Todos os serviços essenciais foram configurados para auto-run!"
