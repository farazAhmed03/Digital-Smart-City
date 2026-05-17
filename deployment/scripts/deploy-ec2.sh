#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/digital-smart-city}"
ENV_FILE="${ENV_FILE:-deployment/env/.env.ec2}"

cd "$APP_DIR"

echo "[INFO] Current directory: $(pwd)"
echo "[INFO] Ensuring env file exists..."
test -f "$ENV_FILE"

echo "[INFO] Stopping old containers..."
docker compose -f docker-compose.ec2.yml down --remove-orphans || true

echo "[INFO] Building and starting containers..."
docker compose -f docker-compose.ec2.yml up -d --build

echo "[INFO] Waiting for services..."
sleep 20

echo "[INFO] Container status:"
docker compose -f docker-compose.ec2.yml ps

echo "[INFO] Health check:"
curl -fsS http://127.0.0.1/healthz || {
  echo "[ERROR] Health check failed. Showing logs..."
  docker compose -f docker-compose.ec2.yml logs --tail=120
  exit 1
}

echo "[OK] Deployment completed."
