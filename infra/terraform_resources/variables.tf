variable "aws_region" {
  default = "us-east-1"
}

variable "lambda_role_name" {
  description = "LambdaRoleName which is used for the permission to SNS"
}

variable "lambda_name" {
  default = "DistanceCalculator"
  description = "Lambda to calculate and send alerts"
}

variable "sns_name" {
  default = ""
  description = "SNS name to which alert will be sent"
}