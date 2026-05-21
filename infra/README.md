# AWS Infrastructure Setup

One-time AWS setup before the GitHub Actions pipeline can deploy.

## 1. EKS cluster

```bash
eksctl create cluster -f infra/eksctl-cluster.yaml
```

## 2. ECR repositories

Created automatically by CI on first run, or manually:

```bash
aws ecr create-repository --repository-name digital-smart-city-backend
aws ecr create-repository --repository-name digital-smart-city-frontend
```

## 3. AWS Load Balancer Controller

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=digital-smart-city-cluster \
  --set serviceAccount.create=true \
  --set serviceAccount.name=aws-load-balancer-controller
```

## 4. Cluster Autoscaler

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
```

Edit the deployment: set `--node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/digital-smart-city-cluster`

## 5. ACM certificate

Request a certificate in ACM for `app.yourdomain.com` and `api.yourdomain.com` (DNS validation).

## 6. Route53

Create alias A records pointing to the ALB hostnames created by the Ingress resources after first deploy.

## 7. MongoDB Atlas

- Create a cluster and database user.
- Allow EKS NAT gateway egress IPs in Atlas Network Access.
- Store connection string as GitHub secret `DB_URL`.

## 8. GitHub OIDC (recommended)

Create an IAM role trusted by GitHub Actions OIDC with policies for ECR push and EKS deploy. Set repository secret `AWS_ROLE_ARN`.

See [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for the full secrets/variables list.
