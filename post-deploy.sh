if [ ! -f .env ]; then
  export $(cat .env | xargs)
fi

sed -E 's/__(([^_]|_[^_])*)__/${\1}/g' ./apcupsd-scripts/apcupsd.conf.tpl |envsubst > ./apcupsd-scripts/apcupsd.conf
sudo cp -rf ./apcupsd-scripts/* /etc/apcupsd
#rm ./apcupsd-scripts/apcupsd.conf

sudo /etc/init.d/apcupsd start

cd ./app && npm install
cd ..