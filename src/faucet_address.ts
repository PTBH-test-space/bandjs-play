const bandAddress = 'band17evyxfa4625gqsdppufde9x9g7vrfzpsrk3drk';
const bandFaucetEndpoint = 'https://laozi-testnet6.bandchain.org/faucet';

async function getFaucet() {
  const body = {
    address: bandAddress,
    amount: '10',
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  }

  let response = await fetch(`${bandFaucetEndpoint}`, options);
  console.log(response);
}

(async () => { await getFaucet()})();