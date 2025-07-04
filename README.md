# Blockchains Testers

## Ethereum - geth 1.13.15-stable

### Requirements

Install

    cd geth
    tar -xvzf geth-alltools-linux-amd64-1.13.15-c5ba367e.tar.gz
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/abigen /usr/local/bin/
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/bootnode /usr/local/bin/
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/clef /usr/local/bin/
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/evm /usr/local/bin/
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/geth /usr/local/bin/
    sudo cp geth-alltools-linux-amd64-1.13.15-c5ba367e/rlpdump /usr/local/bin/

Reboot terminal and check

    geth version
    Geth
    Version: 1.13.15-stable
    Git Commit: c5ba367eb6232e3eddd7d6226bfd374449c63164
    Git Commit Date: 20240417

### Launch

```
cd ethereum
chmod +x initNetwork.sh
./initNetwork.sh
```