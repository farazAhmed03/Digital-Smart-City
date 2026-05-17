SHELL := /bin/sh
PROJECT := digital-smart-city
AWS_REGION ?= us-east-1
ENV ?= prod

.PHONY: docker-build-backend docker-build-frontend compose-up compose-down tf-init tf-plan tf-apply

docker-build-backend:
	docker build -f Backend/Dockerfile -t $(PROJECT)-backend:local Backend

docker-build-frontend:
	docker build -f Frontend/Dockerfile -t $(PROJECT)-frontend:local Frontend

compose-up:
	docker compose up --build

compose-down:
	docker compose down --remove-orphans

tf-init:
	cd infra/terraform/envs/$(ENV) && terraform init

tf-plan:
	cd infra/terraform/envs/$(ENV) && terraform plan

tf-apply:
	cd infra/terraform/envs/$(ENV) && terraform apply
