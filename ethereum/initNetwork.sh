#!/bin/bash

set -e


NETWOR_DIR_PATH=./network
GENESIS_PATH=$NETWOR_DIR_PATH/genesis.json
MAX_NODES=3


echo "Cleaning up network"
rm -rf $NETWOR_DIR_PATH


NODES_ADDRESSES=()
NODES_KEYFILES=()
for (( iNode = 0; iNode < $MAX_NODES; ++iNode ))
do
    printf "\n\nCreating Node$iNode\n"
    mkdir -p $NETWOR_DIR_PATH/Node$iNode

    outputNewAccount=$( geth --datadir $NETWOR_DIR_PATH/Node$iNode account new --password password.txt )
    address=$( echo "$outputNewAccount" | grep 'Public address of the key:' | awk '{print $6}' )
    keyfile=$( echo "$outputNewAccount" | grep 'Path of the secret key file:' | awk '{print $7}' )
    echo "Address: $address"
    echo "Keyfile: $keyfile"

    NODES_ADDRESSES+=($address)
    NODES_KEYFILES+=($keyfile)

    echo "Copy and customise genesis"
    cp genesisPoA.json $GENESIS_PATH
    ADDRESS_NO_PREFIX=$(echo ${NODES_ADDRESSES[0]} | sed 's/^0x//')
    sed -i "s/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/$ADDRESS_NO_PREFIX/g" $GENESIS_PATH

    echo "Init the node"
    geth --datadir $NETWOR_DIR_PATH/Node$iNode init $GENESIS_PATH

    # For ubuntu : gnome-terminal --title="Geth Node$iNode" -- bash -c 'geth ...'
    CMD="ls -al"
    NODE_HTTP_PORT=$(( 8540 + $iNode ))
    NODE_AUTHRPC_PORT=$(( 8550 + $iNode ))
    NODE_PORT=$(( 30300 + $iNode ))
    if [[ "$iNode" -eq 1 ]]; then
        CMD="geth --datadir '$NETWOR_DIR_PATH/Node${iNode}' \
            --networkid 2025 \
            --http --http.addr 127.0.0.1 --http.port $NODE_HTTP_PORT \
            --authrpc.port $NODE_AUTHRPC_PORT \
            --port $NODE_PORT \
            --unlock '$address' \
            --password password.txt \
            --mine \
            --allow-insecure-unlock \
            --miner.etherbase '$address' \
            --nodiscover \
            --ipcdisable \
        console"
        echo $CMD
    else
        CMD="geth --datadir '$NETWOR_DIR_PATH/Node${iNode}' \
                --networkid 2025 \
                --port $NODE_PORT \
                --http --http.addr 127.0.0.1 --http.port $NODE_HTTP_PORT \
                --authrpc.port $NODE_AUTHRPC_PORT \
                --nodiscover \
                --ipcdisable \
        console"
    fi
    konsole --hold --new-tab --title "Node$iNode" -e bash -c "$CMD" &
    
done


# for (( iNode = 0; iNode < $MAX_NODES; ++iNode ))
# do
#     printf "${NODES_ADDRESSES[0]}"
# done