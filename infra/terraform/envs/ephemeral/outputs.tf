output "backend_ecr_repository_url" {
  value = module.ecr.repository_urls["backend"]
}

output "frontend_ecr_repository_url" {
  value = module.ecr.repository_urls["frontend"]
}

output "alb_url" {
  value = module.ecs.alb_url
}

output "alb_dns_name" {
  value = module.ecs.alb_dns_name
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "backend_log_group" {
  value = module.ecs.backend_log_group
}

output "frontend_log_group" {
  value = module.ecs.frontend_log_group
}
