output "backend_ecr_repository_url" { value = module.ecr.repository_urls["backend"] }
output "frontend_bucket_name" { value = module.frontend.bucket_name }
output "cloudfront_distribution_id" { value = module.frontend.distribution_id }
output "ecs_cluster_name" { value = module.ecs.cluster_name }
output "ecs_service_name" { value = module.ecs.service_name }
