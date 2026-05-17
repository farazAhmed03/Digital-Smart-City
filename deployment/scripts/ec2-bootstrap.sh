#!/usr/bin/env bash
set -euo pipefail

echo "[INFO] Updating packages..."
sudo apt-get update -y || true

echo "[INFO] Installing base packages..."
sudo apt-get install -y ca-certificates curl git gnupg lsb-release unzip

if ! command -v docker >/dev/null 2>&1; then
  echo "[INFO] Installing Docker..."
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "[INFO] Installing Docker Compose plugin..."
  sudo apt-get install -y docker-compose-plugin || true
fi

sudo systemctl enable docker
sudo systemctl start docker

echo "[OK] EC2 bootstrap completed."
docker --version || true
docker compose version || true
