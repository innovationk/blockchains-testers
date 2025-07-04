# Genesis

## Archi

.
├── eth-private-network
├── measureTransactionTime.js
├── node_modules
├── package.json
├── package-lock.json
├── README.md
└── results.csv

## Commands

list all running Geth processes:

    ps aux | grep geth

    user+   60603  0.4  0.4 2204104 72028 pts/2   Sl+  17:44   0:02 geth --datadir node1 --networkid 2025 --http --http.addr 127.0.0.1 --http.port 8545 --port 30303 --unlock 0xe698c3676F9e2592CDE727C0EBe483F4F2D5B25A --password ./passwordNode1.txt --mine --allow-insecure-unlock --miner.etherbase 0xe698c3676F9e2592CDE727C0EBe483F4F2D5B25A --nodiscover --ipcdisable console
    user+   63442  0.3  0.4 1937460 65724 pts/3   Sl+  17:49   0:00 geth --datadir node2 --networkid 2025 --port 30304 --http --http.addr 127.0.0.1 --http.port 8546 --authrpc.port 8552 --nodiscover --ipcdisable console
    user+   63595  0.4  0.4 1937208 67176 pts/4   Sl+  17:49   0:00 geth --datadir node3 --networkid 2025 --port 30305 --http --http.addr 127.0.0.1 --http.port 8547 --authrpc.port 8553 --nodiscover --ipcdisable console
    user+   65099  0.0  0.0   6632  2176 pts/1    S+   17:52   0:00 grep --color=auto geth

1 Node console

    geth attach http://127.0.0.1:8545


Stop node
    
    # attach or open console
    exit

Reset nodes

  rm -rf ./eth-private-network/node1/*
  rm -rf ./eth-private-network/node2/*
  rm -rf ./eth-private-network/node3/*


## Difficulty

    Minimal Difficulty: 0x1 (1 in decimal)
    Maximal Difficulty: Theoretically unbounded, but commonly set to 0x20000 (131072 in decimal) for PoW networks.

## Manual

```
mkdir -p ./eth-private-network
cd ./eth-private-network

# Create genesis.json

mkdir node1 node2 node3

# Create accounts (signers), password = poiuyt for all and save it in passwordNode1.txt

geth --datadir node1 account new --password passwordNode1.txt
geth --datadir node2 account new --password passwordNode1.txt
geth --datadir node3 account new --password passwordNode1.txt

# Copy the address 

Public address of the key:   0x611a2876C7EC7F4854fc4a822094A5A7F99c7896
Path of the secret key file: node1/keystore/UTC--2025-07-03T17-47-39.878686618Z--611a2876c7ec7f4854fc4a822094a5a7f99c7896

Public address of the key:   0xfD4653f7F7BdB8c98eD7A3cC7d2F4256B4ABbeF4

Public address of the key:   0xee156BF450b9e573820494Accf460A6980927F0F

# update extra data in genesis.json : extraData = 32 bytes vanity + signer addresses + 65 bytes of padding.

{
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}

where aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa is replaced by node1 public key 5cf170a4f0041D6F18DAfa3FfdE58D40830AEbA5

# Initialize the Nodes

geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json
geth --datadir node3 init genesis.json

# Start the Nodes

## POA

geth --datadir node1 \
 --networkid 2025 \
 --http --http.addr 127.0.0.1 --http.port 8545 \
 --authrpc.port 8551 \
 --port 30303 \
 --unlock "0x611a2876C7EC7F4854fc4a822094A5A7F99c7896" \
 --password ./passwordNode1.txt \
 --mine \
 --allow-insecure-unlock \
 --miner.etherbase "0x611a2876C7EC7F4854fc4a822094A5A7F99c7896" \
 --nodiscover \
 --ipcdisable \
 console

 geth --datadir node1/data \
  --networkid 2025 \
  --rpc --rpcport 8545 --rpccorsdomain "*" --rpcapi "eth,net,web3,personal,miner,admin" \
  --port 30303  \
  --nodiscover \
  --maxpeers 2 --mine --minerthreads 1 \
  --etherbase <node1-address> --unlock <node1-address> --password <password-file>


geth --datadir node2 \
 --networkid 2025 \
 --port 30304 \
 --http --http.addr 127.0.0.1 --http.port 8546 \
 --authrpc.port 8552 \
 --nodiscover \
 --ipcdisable \
 console

geth --datadir node3 \
 --networkid 2025 \
 --port 30305 \
 --http --http.addr 127.0.0.1 --http.port 8547 \
 --authrpc.port 8553 \
 --nodiscover \
 --ipcdisable \
 console

# Connect Peers

In Node1 console, get the enode:
    admin.nodeInfo.enode

    Copy that enode URL (e.g.,
        "enode://237c7fc4b47beb33ff1b0d8720433049cd19fde34649335dc6237446becc74163eaa6d4623b55574ad342ac2a64ff35b76031a6f1034e72201280d3087ba6b0c@82.66.248.212:30303?discport=0"
    )

In Node2 and Node3 consoles, add peer:

    admin.addPeer("enode://237c7fc4b47beb33ff1b0d8720433049cd19fde34649335dc6237446becc74163eaa6d4623b55574ad342ac2a64ff35b76031a6f1034e72201280d3087ba6b0c@82.66.248.212:30303?discport=0")


# check

In any node console :

    admin.peers

[{
    caps: ["eth/68", "snap/1"],
    enode: "enode://1f5364bf6a6ad0d2a50988afaeb1a26ae817866f726a3f804c747e6700fa5b9a44ecf50692d5fdcc773ad7f3fd53edad4b3725168217b38ce5b248da0409771d@192.168.1.254:56752",
    id: "a71857fcbd09543f1155d08aad64c8e7ad8fc69f90f19b4d33292fef64e2677e",
    name: "Geth/v1.13.15-stable-c5ba367e/linux-amd64/go1.21.6",
    network: {
      inbound: true,
      localAddress: "192.168.1.25:30303",
      remoteAddress: "192.168.1.254:56752",
      static: false,
      trusted: false
    },
    protocols: {
      eth: {
        version: 68
      },
      snap: {
        version: 1
      }
    }
}, {
    caps: ["eth/68", "snap/1"],
    enode: "enode://48c6e03898ef0251b82294fd26c2bade1158e8fbe9b0043abf4ab3fc796c54e20d1769840a30e31b845715f75487794e0a1d52183a4440e12a53261845cd0eb7@192.168.1.254:56738",
    id: "c90e1731e66c198eee3388a0028ddf250b71e085996e965e132d8fc7a209684a",
    name: "Geth/v1.13.15-stable-c5ba367e/linux-amd64/go1.21.6",
    network: {
      inbound: true,
      localAddress: "192.168.1.25:30303",
      remoteAddress: "192.168.1.254:56738",
      static: false,
      trusted: false
    },
    protocols: {
      eth: {
        version: 68
      },
      snap: {
        version: 1
      }
    }
}]

```

## Tester Node JS 20.

configure in measureTransactionTime.js :

```
NODE1_PASSWORD
NODE1_KEYSTOREFILEPATH
```

node measureTransactionTime.js