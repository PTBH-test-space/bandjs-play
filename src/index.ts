import {Client, Wallet} from '@bandprotocol/bandchain.js';
import dotenv from 'dotenv';
import {faucetAddress} from './utils';
dotenv.config();

const gpcUrl = process.env.LOCAL_GRPC_URL || '';


const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  process.env.MNEMONIC || '',
);

const pubKey = privateKey.toPubkey();
const sender = pubKey.toAddress().toAccBech32();



async function makeRequest() {
  await faucetAddress(sender, '1000000');
  console.log(`address is ${sender}`);
  const balance =  await client.getAllBalances(sender);
  console.log(`balance is`, balance);
}

(async () => {
  await makeRequest();
})();