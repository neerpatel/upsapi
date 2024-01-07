if [ ! -f .env ]; then
  export $(cat .env | xargs)
fi
sudo cp -rf ./apcupsd-scripts/* /etc/apcupsd

sudo sed -E 's/__(([^_]|_[^_])*)__/${\1}/g' /etc/apcupsd/apcupsd.conf |envsubst > /etc/apcupsd/apcupsd.conf
sudo /etc/init.d/apcupsd start

cd ./app && npm install
cd ..