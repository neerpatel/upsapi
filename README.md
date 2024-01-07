***UPSAPI***


# *Setup*

## Once you have your Raspberry Pi loaded with the OS on the network. SSH into it and run the following command
  

## Step #1 setup ssh keys to enable password less authentication.
From your primary machine or your first Raspberry Pi (do this even if you are installing it to itself)

```bash
ssh-keygen -t rsa
ssh-copy-id pi@<ipaddress of new PI> or copy ~/.ssh/id_rsa.pub to ~/.ssh/authorized_keys
```

Step #2
Install required software
```bash
curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/setup.sh | sudo -E bash -
```
Then setup / deploy the application
```bash
curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/app/ecosystem.config.js | pm2 deploy production setup && pm2 deploy production
```




