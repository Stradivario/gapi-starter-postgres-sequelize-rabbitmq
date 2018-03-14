export const SEND_TRANSACTION_MUTATION = `mutation sendTransaction($from: String!, $to: String!, $amount: String!) {
    sendTransaction(from: $from, to: $to, amount: $amount) {
      transactionHash
    }
  }`;
