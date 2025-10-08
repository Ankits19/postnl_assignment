terraform {
  backend "s3" {
    bucket         = "s3statefilebucketlambda" 
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true      
  }
}