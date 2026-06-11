# DevOps 2026 - AWS + Terraform + Ansible + Docker + GitHub Actions

## Project Objective

Build a complete DevOps pipeline:

GitHub → GitHub Actions → Terraform → AWS EC2 → Ansible → Docker → Application Deployment

---

# Phase 1: AWS Setup

## Step 1: Create AWS Account

- Create AWS Account
- Enable MFA for Root User
- Never use Root User for daily activities

### Learning

Root User = Account Owner

IAM User = Daily Administration

IAM Role = Temporary Permissions

---

## Step 2: Create IAM User

### User Details

Username:

devops-admin

### Permissions

AdministratorAccess

### Why?

Terraform and AWS CLI require permissions to create and manage AWS resources.

---

# Phase 2: Create Control Server

## Purpose

This EC2 instance will act as the central server from which:

- Terraform will run
- Ansible will run
- Git commands will run
- AWS CLI commands will run

### Configuration

Operating System: Ubuntu

Instance Type: t3.micro

Region: ap-south-1 (Mumbai)

### IAM Role

Attach:

DevOpsControlServerRole

---

# Phase 3: Connect to EC2

## SSH Command

```bash
ssh -i key.pem ubuntu@PUBLIC_IP
```

### Learning

SSH is used to securely access Linux servers remotely.

---

# Phase 4: Update Linux Server

## Commands

```bash
sudo apt update
sudo apt upgrade -y
```

### Why?

Ensures all packages are updated before installing software.

---

# Phase 5: Install Git

## Installation

```bash
sudo apt install git -y
```

## Verify

```bash
git --version
```

### Why?

Git is used for source code management and version control.

---

# Phase 6: Install AWS CLI

## Installation

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

sudo apt install unzip -y

unzip awscliv2.zip

sudo ./aws/install
```

## Verify

```bash
aws --version
```

### Why?

AWS CLI allows AWS operations from the command line.

Examples:

```bash
aws sts get-caller-identity
aws ec2 describe-instances
aws s3 ls
```

---

# Phase 7: Verify IAM Role

## Command

```bash
aws sts get-caller-identity
```

### Expected Result

Shows:

- AWS Account ID
- IAM Role ARN

### Learning

This confirms EC2 can communicate with AWS securely.

---

# Phase 8: Install Terraform

## Why Terraform?

Terraform is Infrastructure as Code (IaC).

Instead of manually creating resources in AWS Console, we define them in code.

---

## Installation

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

## Verify

```bash
terraform version
```

---

# Phase 9: Clone GitHub Repository

## Clone Repository

```bash
git clone git@github.com:moin-cr7/Devops_2026.git
```

## Enter Repository

```bash
cd Devops_2026
```

---

# Phase 10: Create Terraform Configuration

## Directory Structure

```text
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
└── .terraform.lock.hcl
```

### Purpose

main.tf

Infrastructure definition

variables.tf

Input variables

outputs.tf

Display values after deployment

---

# Phase 11: Terraform Workflow

## Initialize Terraform

```bash
terraform init
```

### Purpose

Downloads AWS Provider and prepares Terraform.

---

## Validate Configuration

```bash
terraform validate
```

### Purpose

Checks Terraform syntax.

---

## Review Changes

```bash
terraform plan
```

### Purpose

Shows resources Terraform will create.

No resources are created at this stage.

---

## Create Infrastructure

```bash
terraform apply
```

Type:

```text
yes
```

### Purpose

Creates AWS resources.

---

# Phase 12: Terraform State

## What is terraform.tfstate?

Terraform's memory file.

Stores:

- Instance IDs
- Public IPs
- Resource Metadata

### Why Important?

Terraform compares:

Desired State = main.tf

Current State = terraform.tfstate

and decides what changes are required.

### Never Commit

```text
terraform.tfstate
terraform.tfstate.backup
```

---

# Phase 13: Git Best Practices

## Create .gitignore

```gitignore
.terraform/
*.tfstate
*.tfstate.backup
terraform.tfvars
```

### Why?

Prevents large files and sensitive data from being committed.

---

## Git Workflow

Check status:

```bash
git status
```

Add files:

```bash
git add .
```

Commit changes:

```bash
git commit -m "message"
```

Push to GitHub:

```bash
git push origin master
```

Pull latest changes:

```bash
git pull origin master
```

---

# Common Issues Faced

## Problem

GitHub rejected push because Terraform provider files exceeded GitHub size limits.

## Cause

Accidentally committed:

```text
.terraform/
```

## Fix

Added:

```gitignore
.terraform/
*.tfstate
*.tfstate.backup
terraform.tfvars
```

Removed tracked files and recommitted.

---

# Commands Reference

## Terraform

```bash
terraform init
terraform validate
terraform plan
terraform apply
terraform destroy
```

## AWS CLI

```bash
aws sts get-caller-identity
aws ec2 describe-instances
aws s3 ls
```

## Git

```bash
git status
git add .
git commit -m "message"
git push origin master
```

---

# Project Progress

- [x] AWS Account Setup
- [x] IAM User Creation
- [x] IAM Role Creation
- [x] Control Server Creation
- [x] Git Installation
- [x] AWS CLI Installation
- [x] Terraform Installation
- [x] Terraform Configuration
- [ ] EC2 Creation using Terraform
- [ ] Ansible Installation
- [ ] Docker Installation
- [ ] GitHub Actions Pipeline
- [ ] Application Deployment

---

# Final Goal

Code Push

↓

GitHub

↓

GitHub Actions

↓

Terraform Creates Infrastructure

↓

Ansible Configures Server

↓

Docker Deploys Application

↓

Website Available to Users
