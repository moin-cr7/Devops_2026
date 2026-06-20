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

resource "aws_key_pair" "webserver_key" {
  key_name   = "terraform-webserver-key"
  public_key = file("~/.ssh/terraform-webserver-key.pub")
}

resource "aws_security_group" "ssh_access" {
  name        = "terraform-ssh-access"
  description = "Allow SSH access"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # For learning only
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "webserver" {
  ami           = "ami-0a524481113ca6b94"
  instance_type = "t3.micro"

  key_name = aws_key_pair.webserver_key.key_name

  vpc_security_group_ids = [
    aws_security_group.ssh_access.id
  ]

  tags = {
    Name = "terraform-webserver"
  }
}
