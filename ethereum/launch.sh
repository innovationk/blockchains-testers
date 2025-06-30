#!/bin/bash

echo "Ethereum"

MAX_NODES=3

for (( iNode=0; iNode < $MAX_NODES; ++iNode ))
do
    echo "Deleting node $iNode..."
    rm -rf "node$iNode"
    
    echo "Creating node $iNode..."
    mkdir -p "node$iNode/data"

    echo "Creating account node $iNode..."
    # Create a password file
    echo "password$iNode" > "node$iNode/password.txt"
    geth --datadir "node$iNode/data" account new --password "node$iNode/password.txt"
    geth --datadir "node$iNode/data" account list

    # echo "Initialising node $iNode..."
    # geth --datadir node$iNode/data init genesis.json
done