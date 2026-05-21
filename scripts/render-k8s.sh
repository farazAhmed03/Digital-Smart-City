#!/usr/bin/env bash
# Render k8s manifests with environment-specific values.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${RENDER_DIR:-$ROOT/k8s-rendered}"

: "${BACKEND_IMAGE:?Set BACKEND_IMAGE}"
: "${FRONTEND_IMAGE:?Set FRONTEND_IMAGE}"
: "${APP_DOMAIN:?Set APP_DOMAIN}"
: "${API_DOMAIN:?Set API_DOMAIN}"
ACM_CERTIFICATE_ARN="${ACM_CERTIFICATE_ARN:-}"

mkdir -p "$OUT"
for f in "$ROOT"/k8s/*.yaml; do
  base=$(basename "$f")
  [[ "$base" == "secret.example.yaml" ]] && continue
  cp "$f" "$OUT/$base"
done

for f in "$OUT"/*.yaml; do
  sed -i.bak \
    -e "s|BACKEND_IMAGE_PLACEHOLDER|${BACKEND_IMAGE}|g" \
    -e "s|FRONTEND_IMAGE_PLACEHOLDER|${FRONTEND_IMAGE}|g" \
    -e "s|APP_DOMAIN_PLACEHOLDER|${APP_DOMAIN}|g" \
    -e "s|API_DOMAIN_PLACEHOLDER|${API_DOMAIN}|g" \
    -e "s|ACM_CERTIFICATE_ARN_PLACEHOLDER|${ACM_CERTIFICATE_ARN}|g" \
    "$f"
  rm -f "${f}.bak"
done

echo "Rendered manifests in $OUT"
