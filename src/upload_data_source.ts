import {Client, Coin, Fee, Wallet} from '@bandprotocol/bandchain.js';
import {buildTransaction, createCreateDataSourceRequest, executeTxn} from './utils';

const gpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web';

const client = new Client(gpcUrl);
const privateKey = Wallet.PrivateKey.fromMnemonic(
  'winter nest benefit zoo team use blanket security card digital stairs often dish ribbon cluster bottom alley hat shaft mask please boss cancel month'
);

const pubKey = privateKey.toPubkey();
const sender = pubKey.toAddress().toAccBech32();

(async () => {
  const coin = new Coin();
  coin.setDenom('uband');
  coin.setAmount('50000');
  const msg = await createCreateDataSourceRequest(
    "gold_price.py",
    sender,
    sender,
    sender,
    coin,
    "",
  );

  const fee = new Fee();
  fee.setAmountList([coin]);
  fee.setGasLimit(80000);

  const txn = await buildTransaction(
    client,
    msg,
    fee,
    sender,
  );

  const response = await executeTxn(txn, privateKey, client);
  console.log(response);
})()
