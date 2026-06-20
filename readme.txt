# DevOps 2026 Project

## AWS + Terraform + Ansible + Docker + GitHub Actions

---

# Project Objective

Build a complete DevOps CI/CD pipeline from scratch using:

- AWS
- Terraform
- Ansible
- Docker
- GitHub Actions

Final Architecture:

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ▼
Terraform
    │
    ▼
AWS Infrastructure
    │
    ▼
Ansible
    │
    ▼
Docker
    │
    ▼
Application Deployment
```

---

# Skills Covered

- Linux Administration
- Git & GitHub
- AWS IAM
- AWS EC2
- AWS Security Groups
- AWS CLI
- Terraform
- Infrastructure as Code (IaC)
- Ansible
- Docker
- CI/CD
- GitHub Actions

---

# Phase 1 - AWS Account Setup

## Create AWS Account

- Create AWS Account
- Enable MFA on Root User
- Never use Root User for daily activities

### Learning

```text
Root User  = Account Owner
IAM User   = Daily Administration
IAM Role   = Temporary Permissions
```

---

# Phase 2 - Create IAM User

## IAM User

```text
devops-admin
```

## Permissions

```text
AdministratorAccess
```

### Why?

Terraform and AWS CLI require permissions to create AWS resources.

---

# Phase 3 - Create Control Server

## Purpose

This EC2 Instance acts as:

- Terraform Server
- Ansible Server
- Git Server
- AWS CLI Server

### Configuration

```text
OS            : Ubuntu Server
Instance Type : t3.micro
Region        : ap-south-1
```

### Important

Attach IAM Role:

```text
DevOpsControlServerRole
```

Enable:

```text
Termination Protection
```

---

# Phase 4 - Connect to Control Server

```bash
ssh -i devops-key.pem ubuntu@PUBLIC_IP
```

Example:

```bash
ssh -i devops-key.pem ubuntu@13.233.xx.xx
```

---

# Phase 5 - Update Linux

```bash
sudo apt update
sudo apt upgrade -y
```

---

# Phase 6 - Install Git

Install:

```bash
sudo apt install git -y
```

Verify:

```bash
git --version
```

---

# Phase 7 - Install AWS CLI

Install:

```bash
sudo apt install awscli -y
```

Verify:

```bash
aws --version
```

Verify AWS Access:

```bash
aws sts get-caller-identity
```

---

# Common Issue

## Error

```text
Unable to locate credentials
```

## Solution

### Option 1

Attach IAM Role

```text
DevOpsControlServerRole
```

### Option 2

Configure manually:

```bash
aws configure
```

---

# Phase 8 - Install Terraform

Install Terraform:

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update

sudo apt install terraform -y
```

Verify:

```bash
terraform version
```

---

# Phase 9 - Install Ansible

Install:

```bash
sudo apt update

sudo apt install ansible -y
```

Verify:

```bash
ansible --version
```

---

# Phase 10 - Configure GitHub SSH

Generate SSH Key:

```bash
ssh-keygen -t ed25519 -C "github"
```

Display Public Key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Add key to GitHub:

```text
GitHub
 ↓
Settings
 ↓
SSH and GPG Keys
 ↓
New SSH Key
```

Test:

```bash
ssh -T git@github.com
```

Clone Repository:

```bash
git clone git@github.com:moin-cr7/Devops_2026.git
```

---

# Project Structure

```text
Devops_2026/
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│
├── ansible/
│   ├── inventory
│   └── playbooks/
│
├── app/
│
├── .github/
│   └── workflows/
│
└── README.md
```

---

# Phase 11 - Create SSH Key for Terraform EC2

Generate:

```bash
ssh-keygen -t rsa -b 4096 \
-f ~/.ssh/terraform-webserver-key \
-N ""
```

Files Created:

```text
~/.ssh/terraform-webserver-key
~/.ssh/terraform-webserver-key.pub
```

### Learning

```text
Private Key → Used for SSH Login
Public Key  → Uploaded to AWS
```

---

# Phase 12 - Terraform Configuration

## main.tf

```hcl
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
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
  name = "terraform-ssh-access"

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

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
```

---

# Phase 13 - Terraform Workflow

Initialize:

```bash
terraform init
```

Validate:

```bash
terraform validate
```

Plan:

```bash
terraform plan
```

Apply:

```bash
terraform apply
```

Destroy:

```bash
terraform destroy
```

---

# Terraform State

Files:

```text
terraform.tfstate
terraform.tfstate.backup
```

Purpose:

Terraform memory file.

Stores:

- Resource IDs
- Public IPs
- Metadata

Never commit these files.

---

# .gitignore

Create:

```gitignore
.terraform/
*.tfstate
*.tfstate.backup
terraform.tfvars
```

---

# Issue Faced

## GitHub Push Failed

Error:

```text
terraform-provider-aws exceeds GitHub 100MB limit
```

Cause:

```text
.terraform/
```

was committed.

Fix:

```bash
git rm -r --cached .terraform
```

Commit again:

```bash
git add .
git commit -m "Removed terraform provider files"
git push origin master
```

---

# Phase 14 - Connect to Terraform EC2

Get Public IP:

```bash
aws ec2 describe-instances
```

Connect:

```bash
ssh -i ~/.ssh/terraform-webserver-key ubuntu@PUBLIC_IP
```

Example:

```bash
ssh -i ~/.ssh/terraform-webserver-key ubuntu@13.206.xxx.xxx
```

---

# Issue Faced

## SSH Timeout

Error:

```text
ssh: connect to host x.x.x.x port 22: Connection timed out
```

Cause:

Security Group did not allow SSH.

Fix:

Open:

```text
Port 22
```

in Security Group.

---

# Phase 15 - Ansible Inventory

Create:

```bash
mkdir ansible
cd ansible

nano inventory
```

Add:

```ini
[webservers]
PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/terraform-webserver-key
```

---

# Phase 16 - Test Ansible Connectivity

```bash
ansible all -i inventory -m ping
```

Expected:

```json
{
  "ping": "pong"
}
```

---

# Current Progress

## Completed

- AWS Account
- IAM User
- IAM Role
- Control Server
- Git Installation
- AWS CLI Installation
- Terraform Installation
- Ansible Installation
- GitHub SSH Setup
- SSH Key Pair Creation
- Terraform EC2 Creation
- Security Group Creation
- SSH Access to EC2

## Pending

- Ansible Inventory
- Ansible Ping
- Docker Installation
- Docker Deployment
- GitHub Actions
- Complete CI/CD Pipeline

---

# Next Step

```text
Terraform
    ↓
Ansible Inventory
    ↓
Ansible Ping
    ↓
Install Docker
    ↓
Deploy Nginx Container
    ↓
GitHub Actions CI/CD
```

---

# Lessons Learned

- Always use `.gitignore`
- Never commit `.terraform`
- Never commit `terraform.tfstate`
- Prefer IAM Roles over Access Keys
- Enable Termination Protection on important EC2 instances
- Verify Security Groups before troubleshooting SSH
- Test connectivity with Ansible Ping before running playbooks
