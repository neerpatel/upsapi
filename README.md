***UPSAPI***


# *Setup*

Once you have your Raspberry Pi loaded with the OS on the network. SSH into it and run the following command

Step #1
   curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/setup.sh | sudo -E bash -

Step #2 setup ssh keys to enable password less authentication.
    From your primary machine or your first Raspberry Pi (do this even if you are installing it to itself)
    ssh-keygen -t rsa
    ssh-copy-id pi@<ipaddress of new PI>

