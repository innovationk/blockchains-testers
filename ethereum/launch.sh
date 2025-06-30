#!/bin/bash

echo "Ethereum"

MAX_NODES=3

for (( iNode=0; iNode < $MAX_NODES; ++iNode ))
do
    echo "Deleting node $iNode..."
    rm -rf "node$iNode"
    
    echo "Creating node $iNode..."
    mkdir "node$iNode"
done