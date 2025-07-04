import Web3 from 'web3';
import * as fs from 'node:fs';

const TRANSACTION_COUNT = 10000;
const OUTPUT_FILE_PATH = `${process.cwd()}/results.csv`;

// Connect to all nodes (adjust RPC URLs as per your network setup)
const web3Node0 = new Web3('http://127.0.0.1:8540'); // Node 0
const web3Node1 = new Web3('http://127.0.0.1:8541'); // Node 1
const web3Node2 = new Web3('http://127.0.0.1:8542'); // Node 2

const NODE0_PASSWORD = 'poiuyt';
const NODE0_KEYSTOREFILE_PATH = `${process.cwd()}/network/Node0/keystore/UTC--2025-07-04T16-37-40.261101978Z--9838c79cf56c8e7dc2c2af494680a9ffda114aa3`;

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
        const keystoreFile = fs.readFileSync(NODE0_KEYSTOREFILE_PATH, 'utf8');
        const keystoreJSON = JSON.parse(keystoreFile);
        const wallet = await web3Node0.eth.accounts.decrypt(keystoreJSON, NODE0_PASSWORD);
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

            const message = web3Node0.utils.toHex(`transaction ${iTx}`);
            let tx = {
                from: wallet.address,
                to: wallet.address,
                data: message,
                // value: web3Node1.utils.toWei('1', 'ether'),
                gasPrice: web3Node0.utils.toHex(web3Node0.utils.toWei('0.00000001', 'gwei')),
            };
            const estimatedGas = await web3Node0.eth.estimateGas(tx);
            tx.gas = estimatedGas;

            const signedTx = await web3Node0.eth.accounts.signTransaction(tx, wallet.privateKey);
            const txHash = await web3Node0.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(txHash.transactionHash);

            let txTime = Date.now() - startTime;
            
            // Wait until the transaction is mined on all nodes

            
            let propagationStartTime = Date.now();


            let receipt = null;
            while (!receipt) {
                try {
                    receipt = await Promise.all([
                        web3Node0.eth.getTransactionReceipt(txHash.transactionHash),
                        web3Node1.eth.getTransactionReceipt(txHash.transactionHash),
                        web3Node2.eth.getTransactionReceipt(txHash.transactionHash),
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