data "aws_sns_topic" "sns" {
  name = var.sns_name
  }

  data "aws_iam_role" "lambda_iam_role" {
  name = var.lambda_role_name
}