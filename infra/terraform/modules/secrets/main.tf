variable "project" { type = string }
variable "environment" { type = string }
variable "secret_names" { type = list(string) }

resource "aws_secretsmanager_secret" "this" {
  for_each = toset(var.secret_names)
  name     = "/${var.environment}/${var.project}/api/${each.key}"
}

output "secret_arns" { value = { for k, v in aws_secretsmanager_secret.this : k => v.arn } }
