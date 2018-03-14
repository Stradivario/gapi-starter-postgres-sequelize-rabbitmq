export const CREATE_ETHEREUM_TRANSACTION_MUTATION = `
  mutation createEthereumTransaction($message: String!, $walletId: Int!) {
    createEthereumTransaction(message: $message, walletId: $walletId) {
      id
      message
      status
      walletId
    }
  }
`;
