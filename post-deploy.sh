if [ ! -f .env ]; then
  export $(cat .env | xargs)
fi

sed -E 's/__(([^_]|_[^_])*)__/${\1}/g' ./apcupsd-scripts/apcupsd.conf.tpl |envsubst > ./apcupsd-scripts/apcupsd.conf

echo "Stopping apcupsd service"
sudo systemctl stop apcupsd.service

echo "Copying apcupsd-scripts to /etc/apcupsd/"
sudo cp -rfv ./apcupsd-scripts/ /etc/apcupsd

echo "Stopping apcupsd service"
sudo systemctl start apcupsd.service

echo "Running npm install"
cd ./app && npm install
cd ..