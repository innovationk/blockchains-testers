#!/bin/bash

echo "Ethereum"

MAX_NODES=3

for (( iNode=0; iNode < $MAX_NODES; ++iNode ))
do
    echo "Deleting node $iNode..."
    rm -rf "node$iNode"
done

generatedKeys=""

for (( iNode=0; iNode < $MAX_NODES; ++iNode ))
do
    echo "Creating node $iNode..."
    mkdir -p "node$iNode"

    echo "Creating account node $iNode..."
    password="pwdwallet$iNode"

    geth --datadir "node$iNode" account new --password <(echo -n $password) >> node$iNode/account.logs
    echo -n "$password" > node$iNode/password.txt

    publicKey=`cat node$iNode/account.logs | grep -i "Public address of the key:   " | cut -d":" -f2 | tr -d '[:space:]'` 
    echo -n $publicKey > node$iNode/publicKey.txt
    generatedKeys="$generatedKeys$publicKey\n"

    # echo "Initialising node $iNode..."
    # geth --datadir "node$iNode" init genesis.json
done

echo "Generated publick keys:"
printf $generatedKeys