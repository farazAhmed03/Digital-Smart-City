#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/digital-smart-city}"
cd "$APP_DIR"

echo "[INFO] Rolling back to previous git commit..."
git reset --hard HEAD~1

echo "[INFO] Rebuilding containers from previous commit..."
docker compose -f docker-compose.ec2.yml down --remove-orphans || true
docker compose -f docker-compose.ec2.yml up -d --build

sleep 20
curl -fsS http://127.0.0.1/healthz
echo "[OK] Rollback completed."
