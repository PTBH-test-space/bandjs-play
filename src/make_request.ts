import {Client, Coin, Fee, Message, Obi, Transaction, Wallet} from '@bandprotocol/bandchain.js';
import {buildTransaction} from './utils';
import dotenv from 'dotenv';
dotenv.config();

const gpcUrl = process.env.GRPC_URL || '';


const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  process.env.MNEMONIC || '',
);

const pubKey = privateKey.toPubkey();
const sender = pubKey.toAddress().toAccBech32();

const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}');
const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 100 });


function buildRequestMessage(): Message.MsgRequestData {
  const oracleScriptId = 37;
  const askCount = 4;
  const mintCount = 3;
  const clientId = 'from_bandchain.js';

  const feeLimit = new Coin();
  feeLimit.setDenom('uband');
  feeLimit.setAmount('100000');

  const prepareGas = 100000;
  const executeGas = 200000;

  const requestMessage = new Message.MsgRequestData(
    oracleScriptId,
    calldata,
    askCount,
    mintCount,
    clientId,
    sender,
    [feeLimit],
    prepareGas,
    executeGas,
  )

  return requestMessage;
}

async function makeRequest() {
  const requestMsg = buildRequestMessage();
  const feeCoin = new Coin();
  feeCoin.setDenom('uband');
  feeCoin.setAmount('50000');
  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const txn = await buildTransaction(
    client,
    requestMsg,
    fee,
    sender,
  )
  const signDoc = txn.getSignDoc(pubKey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubKey);
  const sendTx = await client.sendTxBlockMode(txRawBytes);
  console.log(sendTx);
}

(async () => {
  await makeRequest();
})();