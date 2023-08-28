import {Client, Coin, Fee, Wallet} from '@bandprotocol/bandchain.js';
import {buildTransaction, createCreateOracleScriptRequest, executeTxn} from './utils';

const gpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web';

const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  'winter nest benefit zoo team use blanket security card digital stairs often dish ribbon cluster bottom alley hat shaft mask please boss cancel month'
);

(async () => {
  const sender = privateKey.toPubkey().toAddress().toAccBech32();
  const msg = await createCreateOracleScriptRequest(
    'hello_oracle_script.wasm',
    'HelloWorld',
    sender,
    sender,
    '{repeat:u64}/{response:string}',
    'https://ipfs.io/ipfs/QmSSrgJ6QuFDJHyC2SyTgnHKRBhPdLHUD2tJJ86xejrCfn', // source code url
    '',
  );

  const feeCoin = new Coin();
  feeCoin.setDenom('uband');
  feeCoin.setAmount('10000');
  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(700000);
  const txn = await buildTransaction(
    client,
    msg,
    fee,
    sender,
  );

  const response = await executeTxn(
    txn,
    privateKey,
    client,
  );
  console.log(response);
})()