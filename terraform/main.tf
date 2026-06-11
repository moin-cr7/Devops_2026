terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "webserver" {
  ami           = "ami-0a524481113ca6b94"
  instance_type = "t3.micro"

  tags = {
    Name = "terraform-webserver"
  }
}
