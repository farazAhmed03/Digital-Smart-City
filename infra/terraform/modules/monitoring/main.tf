variable "project" { type = string }
variable "environment" { type = string }
variable "alb_arn_suffix" { type = string }
variable "target_group_suffix" { type = string }

resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.environment}-${var.project}-alb-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  treat_missing_data  = "notBreaching"
  dimensions = { LoadBalancer = var.alb_arn_suffix }
}
