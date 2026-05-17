#!/usr/bin/env bash
set -euo pipefail

export KUBECONFIG="${KUBECONFIG:-$HOME/.kube/config}"
NAMESPACE="${K8S_NAMESPACE:-digital-smart-city}"

echo "[INFO] Cluster nodes:"
kubectl get nodes -o wide

echo "[INFO] Workloads:"
kubectl -n "$NAMESPACE" get deploy,svc,ingress,pods -o wide

echo "[INFO] Recent pod logs:"
kubectl -n "$NAMESPACE" logs deploy/backend --tail=80 || true
kubectl -n "$NAMESPACE" logs deploy/frontend --tail=80 || true

echo "[OK] Application should be available on:"
echo "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo EC2_PUBLIC_IP)"
echo "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo EC2_PUBLIC_IP)/healthz"
