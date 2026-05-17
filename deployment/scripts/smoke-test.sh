#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"
if [ -z "$BASE_URL" ]; then
  echo "Usage: $0 http://alb-dns-name" >&2
  exit 1
fi

BASE_URL="${BASE_URL%/}"

echo "[INFO] Waiting for ALB and ECS service to become healthy: $BASE_URL"
for i in $(seq 1 40); do
  if curl -fsS --max-time 5 "$BASE_URL/healthz" >/tmp/dsc-health.json; then
    echo "[OK] /healthz passed"
    cat /tmp/dsc-health.json
    break
  fi
  echo "[WAIT] health check not ready yet ($i/40)"
  sleep 15
  if [ "$i" -eq 40 ]; then
    echo "[ERROR] health check failed after waiting" >&2
    exit 1
  fi
done

curl -fsS --max-time 10 "$BASE_URL/" >/tmp/dsc-home.html
if grep -qi "<html" /tmp/dsc-home.html; then
  echo "[OK] frontend HTML loaded"
else
  echo "[ERROR] frontend did not return HTML" >&2
  exit 1
fi

echo "[OK] smoke test completed: $BASE_URL"
