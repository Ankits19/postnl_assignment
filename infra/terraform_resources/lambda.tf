resource "aws_lambda_function" "my_lambda" {
  function_name = var.lambda_name
  role          = data.aws_iam_role.lambda_iam_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  filename      = "${path.module}/lambda/lambda.zip"
  timeout       = 10
  environment {
    variables = {
      SNS_TOPIC_ARN = "data.aws_sns_topic.sns.arn"
    }
  }
}