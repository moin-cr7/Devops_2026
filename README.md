# Devops_2026
Hosting website using github action


Step 1: Generate GitHub SSH Key

Run: ssh-keygen -t ed25519 -C "github"

When prompted:Enter 
file in which to save the key:Press Enter.
when prompted for passphrase:Enter passphrase:
Press Enter twice.
You should get:
Your identification has been saved in /home/ubuntu/.ssh/id_ed25519
Your public key has been saved in /home/ubuntu/.ssh/id_ed25519.pub

Step 2: Verify Key Creation 
Run: ls -la ~/.ssh
You should now see:
id_ed25519
id_ed25519.pub 

Step 3: Display Public Key
Run: cat ~/.ssh/id_ed25519.pub
Example:
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...... github
Copy the entire line.

Step 4: Add Key to GitHub
Go to:
GitHub SSH Keys Settings
Click:
New SSH Key
Fill:
Title: Control Server
Key Type: Authentication Key
Key: <paste public key>
Save.

Step 5: Test GitHub Connection
Run:
ssh -T git@github.com
Expected:
Hi moin-cr7! You've successfully authenticated,
but GitHub does not provide shell access.

After that, clone your repository:
git clone git@github.com:moin-cr7/Devops_2026.git
cd Devops_2026

Paste the output of:
ssh -T git@github.com
once you've added the key.

-------------------------------------------------------------------------------------------------------------------

Terraform Step-by-Step Guide

cd ~/Devops_2026/terraform

git pull origin master

terraform init

terraform fmt

terraform validate

terraform plan

terraform apply

-----------------------------------------------------------------------------------------------------------------------

Generate SSH Key Pair on Control Server

Before creating the EC2 instance, generate an SSH key pair.

Command
ssh-keygen -t rsa -b 4096 \
-f ~/.ssh/terraform-webserver-key \
-N ""
What This Creates
Private Key: ~/.ssh/terraform-webserver-key

Public Key: ~/.ssh/terraform-webserver-key.pub
Purpose
Private Key stays on the Control Server
Public Key is uploaded to AWS
Enables secure SSH access to EC2 instances
Terraform Configuration
Create AWS Key Pair
Terraform uploads the public key to AWS.
resource "aws_key_pair" "webserver_key" {
  key_name   = "terraform-webserver-key"
  public_key = file("/home/ubuntu/.ssh/terraform-webserver-key.pub")
}
Important Learning

Terraform cannot use: file("~/.ssh/terraform-webserver-key.pub")

because Terraform does not understand ~.

Always use the full path:
file("/home/ubuntu/.ssh/terraform-webserver-key.pub")
Create Security Group

Allow SSH access.
resource "aws_security_group" "ssh_access" {
  name = "terraform-ssh-access"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
Purpose

Allows:
Control Server
        ↓
SSH
        ↓
EC2 Instance
Create EC2 Instance
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
Terraform Workflow
Initialize Terraform

Downloads required providers.

terraform init
Why?
Downloads:
hashicorp/aws provider
Required for Terraform to communicate with AWS.

Validate Configuration
terraform validate
Purpose

Checks:
Syntax errors
Missing resources
Invalid configuration
Review Changes
terraform plan
Purpose

Shows:
Resources to create
Resources to modify
Resources to destroy

No changes are made yet.
Create Infrastructure
terraform apply

Type:
yes
Purpose

Creates:
Key Pair
Security Group
EC2 Instance
Verify Created Resources
List EC2 Instances
aws ec2 describe-instances \
--query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]" \
--output table
Verify Key Pair
aws ec2 describe-key-pairs \
--query "KeyPairs[*].KeyName" \
--output table
Verify Security Group
aws ec2 describe-security-groups \
--query "SecurityGroups[*].[GroupName,GroupId]" \
--output table
Common Errors and Fixes
Error 1
Invalid function argument
file("~/.ssh/terraform-webserver-key.pub")
Cause
Terraform does not understand ~.
Fix

Use:
file("/home/ubuntu/.ssh/terraform-webserver-key.pub")
Error 2
InvalidKeyPair.Duplicate
Cause

AWS already contains:
terraform-webserver-key
Terraform tries to create it again.
Fix
Delete the existing key pair:
aws ec2 delete-key-pair \
--key-name terraform-webserver-key

Then run:
terraform apply
again.

Error 3
InvalidGroup.Duplicate
Cause

Security group already exists.
Fix
Delete the existing security group or import it into Terraform state.
Error 4
Permission denied (publickey)
Cause

The EC2 instance is using a different key pair than the local private key.
Verify

Check local keys:
ls -l ~/.ssh

Check EC2 key:
aws ec2 describe-instances \
--filters "Name=tag:Name,Values=terraform-webserver" \
--query "Reservations[*].Instances[*].[KeyName,PublicIpAddress]" \
--output table
Correct SSH Command
ssh -i ~/.ssh/terraform-webserver-key ubuntu@PUBLIC_IP

Do NOT use:
ssh -i terraform-webserver-key.pem ubuntu@PUBLIC_IP
unless that file actually exists.
Verify SSH Connection

Connect to EC2:
ssh -i ~/.ssh/terraform-webserver-key ubuntu@PUBLIC_IP

Example:
ssh -i ~/.ssh/terraform-webserver-key ubuntu@15.206.73.219

Expected:
Welcome to Ubuntu
ubuntu@ip-172-31-xx-xx:~$
