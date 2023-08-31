import {Client, Wallet} from '@bandprotocol/bandchain.js';
import dotenv from 'dotenv';
dotenv.config();

const gpcUrl = process.env.LOCAL_GRPC_URL || '';


const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  process.env.MNEMONIC || '',
);

const pubKey = privateKey.toPubkey();
const sender = pubKey.toAddress().toAccBech32();



async function makeRequest() {
  console.log(`address is ${sender}`);
  console.log(`balance is ${await client.getAllBalances(sender)}`);
}

(async () => {
  await makeRequest();
})();