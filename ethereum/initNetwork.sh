#!/bin/bash

set -e


NETWOR_DIR_PATH=./network
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

    
done


# for (( iNode = 0; iNode < $MAX_NODES; ++iNode ))
# do
#     printf "${NODES_ADDRESSES[0]}"
# done