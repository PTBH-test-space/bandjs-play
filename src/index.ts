import {Client, Coin, Fee, Message, Obi, Transaction, Wallet} from '@bandprotocol/bandchain.js';
import {buildTransaction} from './utils';

const gpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web';

const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  'winter nest benefit zoo team use blanket security card digital stairs often dish ribbon cluster bottom alley hat shaft mask please boss cancel month'
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