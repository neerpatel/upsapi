#!/bin/bash


# Check if Node.js is installed
if node -v > /dev/null 2>&1; then
    echo "Node.js is already installed"
else
    echo "Node.js is not installed, installing now..."
    sudo apt install -y ca-certificates curl gnupg git nodejs npm
    node -v
    npm -v
    echo "Node.js has been installed"
    #install pm2
    sudo npm install pm2@latest -g
    echo "pm2 has been installed"
fi    

# Check if apcupsd is installed
if apcaccess status > /dev/null 2>&1; then
    echo "apcupsd is already installed"
else
    echo "apcupsd is not installed, installing now..."
    sudo apt install apcupsd
    echo "apcupsd has been installed"
fi

if [ ! -d "/opt/upsapi" ]; then
  echo "/opt/upsap does not exist."
  sudo mkdir /opt/upsapi
  sudo chown pi:pi /opt/upsapi
fi
if [ "$(stat -c '%U:%G' /opt/upsapi)" != "pi:pi" ]; then
    echo "Updating folder ownership for /opt/upsapi and sub"
    sudo chown -R pi:pi /opt/upsapi
fi

curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/app/ecosystem.config.js -O 
pm2 deploy production setup 

echo "What is the name of your UPS?"
printf 'What is the name of your UPS?\n' "$UPSNAME" >.env



cd /opt/upsapi/app/
pm2 deploy production