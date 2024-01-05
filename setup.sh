#!/bin/bash

NODE_MAJOR=18

sudo apt update
sudo apt upgrade
# Check if Node.js is installed
if node -v > /dev/null 2>&1; then
    echo "Node.js is already installed"
else
    echo "Node.js is not installed, installing now..."
    sudo apt install -y ca-certificates curl gnupg git
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt update
    sudo apt install nodejs
    node -v
    #install pm2
    curl -sL https://raw.githubusercontent.com/Unitech/pm2/master/packager/setup.deb.sh | sudo -E bash -
    echo "Node.js has been installed"
fi    

# Check if apcupsd is installed
if apcaccess status > /dev/null 2>&1; then
    echo "apcupsd is already installed"
else
    echo "apcupsd is not installed, installing now..."
    sudo apt install apcupsd
    echo "apcupsd has been installed"
fi