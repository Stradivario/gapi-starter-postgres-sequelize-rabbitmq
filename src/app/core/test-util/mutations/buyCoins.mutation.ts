export const BUY_COINS_MUTATION = `mutation buyCoins($address: String!, $amount: String!) {
    buyCoins(address: $address, amount: $amount) {
      tx
    }
  }`;
