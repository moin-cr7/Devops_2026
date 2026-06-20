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
