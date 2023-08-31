import {Client, Coin, Fee, Message, Transaction, Wallet} from "@bandprotocol/bandchain.js";
import fs from "fs";
import path from "path";
import { execSync } from 'child_process';
import dotenv from "dotenv";
dotenv.config();

export async function buildTransaction(
  client: Client,
  msg: Message.BaseMsg,
  fee: Fee,
  sender: string,
  memo?: string,
): Promise<Transaction> {
  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(msg);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo(memo || '');
  return txn;
}

export function createCreateDataSourceRequest(
  fileName: string,
  treasury: string,
  owner: string,
  sender: string,
  feeCoin: Coin,
  description: string,
): Message.MsgCreateDataSource {
  const filePath = path.join(__dirname, '../src/data_source', fileName);
  const file = fs.readFileSync(filePath, 'utf8');
  const executable = Buffer.from(file).toString('base64');

  const createDataSourceMsg = new Message.MsgCreateDataSource(
    'Hello World',
    executable,
    treasury,
    owner,
    sender,
    [feeCoin],
    description,
  );
  return createDataSourceMsg;
}

export async function createCreateOracleScriptRequest(
  scriptFile: string,
  scriptName: string,
  owner: string,
  sender: string,
  schema: string,
  sourceCodeUrl: string,
  description?: string,
): Promise<Message.MsgCreateOracleScript> {
  const filePath = path.join(__dirname, '../src/data_source', scriptFile);
  const code = fs.readFileSync(filePath);
  const requestMsg = new Message.MsgCreateOracleScript(
    scriptName,
    code,
    owner,
    sender,
    description || '',
    schema,
    sourceCodeUrl,
  )
  return requestMsg;
}

export async function executeTxn(
  txn: Transaction,
  privateKey: Wallet.PrivateKey,
  client: Client,
)  {
  const pubKey = privateKey.toPubkey();
  const signDoc = txn.getSignDoc(pubKey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubKey);
  const sendTx = await client.sendTxBlockMode(txRawBytes);
  return sendTx;
}

export function getRequesterAccount(): { privateKey: Wallet.PrivateKey, publicKey: Wallet.PublicKey, address: string } {
  const privateKey = Wallet.PrivateKey.fromMnemonic(
    process.env.REQUESTER_MNEMONIC || '',
  );
  const publicKey = privateKey.toPubkey();
  const address = publicKey.toAddress().toAccBech32();
  return { privateKey, publicKey, address}
}

export async function faucetAddress(address: string, amount: string) {
  execSync(`bandd tx bank send requester ${address} ${amount}uband --keyring-backend test --node tcp://0.0.0.0:36657 --chain-id bandchain -y`);
  await sleep(3000);
}



async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
