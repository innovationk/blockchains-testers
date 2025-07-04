#!/bin/bash

set -e


NETWOR_DIR_PATH=./network
MAX_NODES=3


echo "Cleaning up network"
rm -rf $NETWOR_DIR_PATH


for (( iNode=1; iNode <= $MAX_NODES; ++iNode ))
do
    echo "Creating Node$iNode"
    mkdir -p $NETWOR_DIR_PATH/Node$iNode

    geth --datadir $NETWOR_DIR_PATH/Node$iNode account new --password password.txt
done
