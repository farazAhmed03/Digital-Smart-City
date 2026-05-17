#!/usr/bin/env bash
set -euo pipefail

echo "[INFO] Bootstrapping k3s Kubernetes runtime..."

if ! command -v curl >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y curl
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y curl
  fi
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "[INFO] Installing AWS CLI v2..."
  tmpdir="$(mktemp -d)"
  cd "$tmpdir"
  curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  if command -v apt-get >/dev/null 2>&1; then sudo apt-get update -y && sudo apt-get install -y unzip; fi
  if command -v yum >/dev/null 2>&1; then sudo yum install -y unzip; fi
  unzip -q awscliv2.zip
  sudo ./aws/install --update
fi

if ! command -v k3s >/dev/null 2>&1; then
  echo "[INFO] Installing k3s single-node Kubernetes..."
  curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode=644 --disable=servicelb" sh -
else
  echo "[INFO] k3s already installed."
fi

sudo systemctl enable k3s
sudo systemctl start k3s

mkdir -p "$HOME/.kube"
sudo cp /etc/rancher/k3s/k3s.yaml "$HOME/.kube/config"
sudo chown "$USER:$USER" "$HOME/.kube/config"
export KUBECONFIG="$HOME/.kube/config"

echo "[INFO] Waiting for node readiness..."
for i in $(seq 1 40); do
  if kubectl get nodes | grep -q " Ready "; then
    kubectl get nodes -o wide
    echo "[OK] k3s is ready."
    exit 0
  fi
  sleep 3
done

echo "[ERROR] k3s node did not become ready."
kubectl get nodes || true
exit 1
