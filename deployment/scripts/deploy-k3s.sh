#!/usr/bin/env bash
set -euo pipefail

export KUBECONFIG="${KUBECONFIG:-$HOME/.kube/config}"

IMAGES_FILE="${IMAGES_FILE:-deployment/runtime/k8s-images.env}"
ENV_FILE="${ENV_FILE:-deployment/env/.env.k8s}"

if [ ! -s "$IMAGES_FILE" ]; then
  echo "[ERROR] Missing images file: $IMAGES_FILE"
  exit 1
fi

if [ ! -s "$ENV_FILE" ]; then
  echo "[ERROR] Missing env file: $ENV_FILE"
  exit 1
fi

set -a
. "$IMAGES_FILE"
set +a

NAMESPACE="${K8S_NAMESPACE:-digital-smart-city}"

echo "[INFO] Deploying namespace: $NAMESPACE"
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo "[INFO] Creating app runtime secret from env file..."
kubectl -n "$NAMESPACE" delete secret app-env --ignore-not-found=true
kubectl -n "$NAMESPACE" create secret generic app-env --from-env-file="$ENV_FILE"

echo "[INFO] Creating ECR image pull secret..."
ECR_PASSWORD="$(aws ecr get-login-password --region "$AWS_REGION")"
kubectl -n "$NAMESPACE" delete secret ecr-registry --ignore-not-found=true
kubectl -n "$NAMESPACE" create secret docker-registry ecr-registry \
  --docker-server="$ECR_REGISTRY" \
  --docker-username=AWS \
  --docker-password="$ECR_PASSWORD"

echo "[INFO] Rendering Kubernetes manifests..."
tmpdir="$(mktemp -d)"
cp -r k8s/* "$tmpdir/"

sed -i "s|__BACKEND_IMAGE__|${BACKEND_IMAGE}|g" "$tmpdir"/*.yaml
sed -i "s|__FRONTEND_IMAGE__|${FRONTEND_IMAGE}|g" "$tmpdir"/*.yaml
sed -i "s|__NAMESPACE__|${NAMESPACE}|g" "$tmpdir"/*.yaml

echo "[INFO] Applying manifests..."
kubectl apply -f "$tmpdir/namespace.yaml"
kubectl apply -n "$NAMESPACE" -f "$tmpdir/backend.yaml"
kubectl apply -n "$NAMESPACE" -f "$tmpdir/frontend.yaml"
kubectl apply -n "$NAMESPACE" -f "$tmpdir/ingress.yaml"

echo "[INFO] Waiting for rollout..."
kubectl -n "$NAMESPACE" rollout status deployment/backend --timeout=300s
kubectl -n "$NAMESPACE" rollout status deployment/frontend --timeout=300s

echo "[INFO] Waiting for health endpoint through ingress..."
for i in $(seq 1 36); do
  if curl -fsS http://127.0.0.1/healthz >/dev/null 2>&1; then
    echo "[OK] Ingress health check passed."
    exit 0
  fi
  echo "[INFO] Waiting for ingress health... attempt ${i}/36"
  sleep 5
done

echo "[ERROR] Ingress health check failed."
kubectl -n "$NAMESPACE" get all
kubectl -n "$NAMESPACE" get ingress
kubectl -n "$NAMESPACE" describe pods
exit 1
