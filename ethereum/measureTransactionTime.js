import Web3 from 'web3';
import * as fs from 'node:fs';

const TRANSACTION_COUNT = 10000;
const OUTPUT_FILE_PATH = `${process.cwd()}/results.csv`;

// const web3 = new Web3();

// Connect to all nodes (adjust RPC URLs as per your network setup)
const web3Node1 = new Web3('http://127.0.0.1:8545'); // Node 1
const web3Node2 = new Web3('http://127.0.0.1:8546'); // Node 2
const web3Node3 = new Web3('http://127.0.0.1:8547'); // Node 3

const NODE1_PASSWORD = 'poiuyt';
const NODE1_KEYSTOREFILEPATH = `${process.cwd()}/eth-private-network/node1/keystore/UTC--2025-07-01T17-54-40.477870415Z--e698c3676f9e2592cde727c0ebe483f4f2d5b25a`;

/*
return {
  address: '0x...',
  privateKey: '0x...',
  signTransaction: [Function: signTransaction],
  sign: [Function: sign],
  encrypt: [Function: encrypt]
}
*/
async function getWallet() {
    try {
        const keystoreFile = fs.readFileSync(NODE1_KEYSTOREFILEPATH, 'utf8');
        const keystoreJSON = JSON.parse(keystoreFile);
        const wallet = await web3Node1.eth.accounts.decrypt(keystoreJSON, NODE1_PASSWORD);
        return wallet;
    } catch (error) {
        console.error('Error decrypting keystore:', error);
        throw error;
    }
}


async function main() {
    // try {
        const wallet = await getWallet();

        if( fs.existsSync(OUTPUT_FILE_PATH) ) {
            fs.unlinkSync(OUTPUT_FILE_PATH);
        }
        fs.writeFileSync(OUTPUT_FILE_PATH, `transaction,txTime (ms),propagationTime (ms)\n`);

        for (let iTx = 0; iTx < TRANSACTION_COUNT; iTx++) {
            console.log("transaction:", iTx);


            let startTime = Date.now();

            const message = web3Node1.utils.toHex(`transaction ${iTx}`);
            let tx = {
                from: wallet.address,
                to: wallet.address,
                data: message,
                // value: web3Node1.utils.toWei('1', 'ether'),
                gasPrice: web3Node1.utils.toHex(web3Node1.utils.toWei('0.00000001', 'gwei')),
            };
            const estimatedGas = await web3Node1.eth.estimateGas(tx);
            tx.gas = estimatedGas;

            const signedTx = await web3Node1.eth.accounts.signTransaction(tx, wallet.privateKey);
            const txHash = await web3Node1.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(txHash.transactionHash);

            let txTime = Date.now() - startTime;
            
            // Wait until the transaction is mined on all nodes

            
            let propagationStartTime = Date.now();


            let receipt = null;
            while (!receipt) {
                try {
                    receipt = await Promise.all([
                        web3Node1.eth.getTransactionReceipt(txHash.transactionHash),
                        web3Node2.eth.getTransactionReceipt(txHash.transactionHash),
                        web3Node3.eth.getTransactionReceipt(txHash.transactionHash),
                    ]);

                    if (!receipt[0]) {
                        console.log('Transaction not mined yet, retrying...');
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch(e) {
                    console.log('Transaction not mined yet, retrying...');
                    // await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            let propagationTime = Date.now() - propagationStartTime;

            fs.appendFileSync(OUTPUT_FILE_PATH, `${iTx},${txTime},${propagationTime}\n`);
        }
        
    // } catch (error) {
    //     console.error(error);
    // }

}




main();