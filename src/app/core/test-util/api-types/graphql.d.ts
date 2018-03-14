// tslint:disable
// graphql typescript definitions


export interface IGraphQLResponseRoot {
  data?: IQuery | IMutation | ISubscription;
  errors?: Array<IGraphQLResponseError>;
}

export interface IGraphQLResponseError {
  message: string;            // Required for all errors
  locations?: Array<IGraphQLResponseErrorLocation>;
  [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
}

export interface IGraphQLResponseErrorLocation {
  line: number;
  column: number;
}

/**
  description: Query type for all get requests which will not change persistent data
*/
export interface IQuery {
  __typename: "Query";
  listUsers: Array<IUserType> | null;
  findUser: IUserType | null;
  login: IUserLoginType | null;
  checkTokenValidity: IUserCheckValidityType | null;
  listCredentials: Array<ICredentialsType> | null;
  findCredential: ICredentialsType | null;
  listTickets: Array<ITicketType> | null;
  findTicket: ITicketType | null;
  generateClientToken: IGenerateTokenType | null;
  getBalance: IEthereumGetBalanceOutputType | null;
  getBlock: IEthereumGetBlockType | null;
  getLocalAccounts: IGetLocalAcountsType | null;
  getTokenBalance: IGetTokenBalanceType | null;
  getTransactionsByAddress: Array<IGetTransactionsByAddressType> | null;
  getUserAddresses: Array<IWalletType> | null;
  getTokenAddress: IGetTokenAddressType | null;
  search: Array<ISearchType> | null;
  serverStatus: IServerStatusType | null;
  serverErrors: IServerErrorsType | null;
  listEthereumTransactions: Array<ITransactionType> | null;
  findEthereumTransaction: ITransactionType | null;
  listRelationships: Array<IRelationshipType> | null;
  findRelationship: Array<IUserRelationshipType> | null;
  sendRelationshipInvite: IRelationshipType | null;
}


export interface IUserType {
  __typename: "UserType";
  id: number | null;
  type: string | null;
  name: string | null;
  settings: IUserSettingsType | null;
  wallet: Array<IWalletType> | null;
  credential: Array<ICredentialsType> | null;
  ticket: Array<ITicketType> | null;
  transactions: Array<ITicketType> | null;
  relationship: Array<IUserRelationshipType> | null;
}


export interface IUserSettingsType {
  __typename: "UserSettingsType";
  sidebar: boolean | null;
}


export interface IWalletType {
  __typename: "WalletType";
  id: number | null;
  address: string | null;
  balance: string | null;
  tokenBalance: string | null;
  type: string | null;
  name: string | null;
}


export interface ICredentialsType {
  __typename: "CredentialsType";
  id: number | null;
  email: string | null;
  password: string | null;
}


export interface ITicketType {
  __typename: "TicketType";
  id: string | null;
  message: string | null;
  productId: number | null;
  userId: number | null;
}


export interface IUserRelationshipType {
  __typename: "UserRelationshipType";
  friendId: number | null;
  user: IUserTypeRelationship | null;
}


export interface IUserTypeRelationship {
  __typename: "UserTypeRelationship";
  name: string | null;
  settings: IUserSettingsType | null;
  wallet: Array<IWalletType> | null;
  credential: Array<ICredentialsType> | null;
}


export interface IUserLoginType {
  __typename: "UserLoginType";
  email: string | null;
  token: string | null;
  user: IUserType | null;
}


export interface IUserCheckValidityType {
  __typename: "UserCheckValidityType";
  validity: boolean | null;
}


export interface IGenerateTokenType {
  __typename: "GenerateTokenType";
  token: string | null;
}


export interface IEthereumGetBalanceOutputType {
  __typename: "EthereumGetBalanceOutputType";
  balance: string | null;
}


export interface IEthereumGetBlockType {
  __typename: "EthereumGetBlockType";
  difficulty: string | null;
  extraData: string | null;
  gasLimit: string | null;
  gasUsed: string | null;
  hash: string | null;
  logsBloom: string | null;
  miner: string | null;
  mixHash: string | null;
  nonce: string | null;
  number: string | null;
  parentHash: string | null;
  receiptsRoot: string | null;
  sha3Uncles: string | null;
  size: string | null;
  stateRoot: string | null;
  timestamp: string | null;
  totalDifficulty: string | null;
  transactionsRoot: string | null;
  uncles: Array<string> | null;
}


export interface IGetLocalAcountsType {
  __typename: "GetLocalAcountsType";
  accounts: Array<string> | null;
}


export interface IGetTokenBalanceType {
  __typename: "GetTokenBalanceType";
  balance: string | null;
}


export interface IGetTransactionsByAddressType {
  __typename: "GetTransactionsByAddressType";
  hash: string | null;
  nonce: string | null;
  blockHash: string | null;
  blockNumber: string | null;
  transactionIndex: string | null;
  from: string | null;
  to: string | null;
  value: string | null;
  gasPrice: string | null;
  gas: string | null;
  input: string | null;
  timestamp: string | null;
}

/**
  description: This type will return only address of the atc smart contract
*/
export interface IGetTokenAddressType {
  __typename: "GetTokenAddressType";
  address: string | null;
}


export interface ISearchType {
  __typename: "SearchType";
  id: number | null;
  name: string | null;
}

/**
  description: Server status
*/
export interface IServerStatusType {
  __typename: "ServerStatusType";
  status: boolean | null;
}

/**
  description: Server errors 
*/
export interface IServerErrorsType {
  __typename: "ServerErrorsType";
  errors: Array<IServerErrorMessagesType> | null;
}


export interface IServerErrorMessagesType {
  __typename: "ServerErrorMessagesType";
  name: string | null;
  data: IServerErrorMessageLanguages | null;
}


export interface IServerErrorMessageLanguages {
  __typename: "ServerErrorMessageLanguages";
  en: IServerErrorMessagesDataType | null;
  bg: IServerErrorMessagesDataType | null;
}


export interface IServerErrorMessagesDataType {
  __typename: "ServerErrorMessagesDataType";
  message: string | null;
}


export interface ITransactionType {
  __typename: "TransactionType";
  id: string | null;
  message: string | null;
  status: string | null;
  hash: string | null;
  subtypeData: ITransactionSubtypeDataType | null;
  walletId: number | null;
  userId: number | null;
  creationDate: number | null;
  deletionDate: number | null;
  updatedOn: number | null;
}


export interface ITransactionSubtypeDataType {
  __typename: "TransactionSubtypeDataType";
  test: string | null;
}


export interface IRelationshipType {
  __typename: "RelationshipType";
  id: string | null;
  friendId: string | null;
  userId: number | null;
  status: string | null;
  inviteKey: string | null;
  lastEditedBy: string | null;
  user: Array<IUserType> | null;
  creationDate: number | null;
  deletionDate: number | null;
  updatedOn: number | null;
}

/**
  description: Mutation type for all requests which will change persistent data
*/
export interface IMutation {
  __typename: "Mutation";
  createUser: IUserType | null;
  register: IUserTypeRegister | null;
  destroyUser: IUserType | null;
  updateUser: IUserType | null;
  createCredential: ICredentialsType | null;
  destroyCredential: ICredentialsType | null;
  updateCredential: ICredentialsType | null;
  createTicket: ITicketType | null;
  destroyTicket: ITicketType | null;
  updateTicket: ITicketType | null;
  createTransaction: IBrainTreeType | null;
  createWallet: IEthereumCreateWalletType | null;
  buyCoins: IBuyCoinsType | null;
  sendTransaction: ISendTransactionType | null;
  createRelationship: IRelationshipType | null;
  destroyRelationship: IRelationshipType | null;
  updateRelationship: IRelationshipType | null;
  createSignal: ISignalType | null;
  createEthereumTransaction: ITransactionType | null;
  destroyEthereumTransaction: ITransactionType | null;
  updateEthereumTransaction: ITransactionType | null;
}


export interface IUserTypeRegister {
  __typename: "UserTypeRegister";
  id: number | null;
  name: string | null;
  credential: ICredentialsType | null;
}


export interface IUserPayloadType {
  __typename: "UserPayloadType";
  name: string;
  settings: IUserPayloadSettingsType | null;
}


export interface IUserPayloadSettingsType {
  __typename: "UserPayloadSettingsType";
  sidebar: boolean;
}


export interface ICredentialPayloadType {
  __typename: "CredentialPayloadType";
  name: string | null;
}


export interface ITicketUpdatePayloadType {
  __typename: "TicketUpdatePayloadType";
  name: string | null;
}


export interface IBrainTreeType {
  __typename: "BrainTreeType";
  additionalProcessorResponse: number | null;
  addOns: string | null;
  amount: string | null;
  androidPayCard: string | null;
  applePayCard: string | null;
  authorizationAdjustments: string | null;
  authorizedTransactionId: string | null;
  avsErrorResponseCode: string | null;
  avsPostalCodeResponseCode: string | null;
  avsStreetAddressRResponseCode: string | null;
  billing: string | null;
  channel: string | null;
  coinbaseAccount: string | null;
  createdAt: string | null;
  creditCard: string | null;
  currencyIsoCode: string | null;
  customer: string | null;
  customFields: string | null;
  cvvResponseCode: string | null;
  descriptor: string | null;
  disbursmentDetails: string | null;
  discountAmount: string | null;
  discounts: string | null;
  disputes: string | null;
  escrowStatus: string | null;
  gatewayRejectionReason: string | null;
  id: string | null;
  masterMerchantAccountId: string | null;
  masterpassCard: string | null;
  merchantAccountId: string | null;
  orderId: string | null;
  partialSettlemementTransactionIds: string | null;
  paymentInstrumentType: string | null;
  paypalAccount: string | null;
  planId: string | null;
  processorAuthorizationCode: string | null;
  processorResponseCode: string | null;
  processorResponseText: string | null;
  processorSettlementResponseCode: string | null;
  processorSettlementResponseText: string | null;
  purchaseOrderNumber: string | null;
  recurring: string | null;
  refundedTransactionId: string | null;
  refundId: string | null;
  refundIds: string | null;
  serviceFeeAmount: string | null;
  settlementBatchId: string | null;
  shipping: string | null;
  shippingAmount: string | null;
  shipsFromPostalCode: string | null;
  status: string | null;
  statusHistory: string | null;
  subMerchantAccountId: string | null;
  subscription: string | null;
  subscriptionId: string | null;
  taxAmount: string | null;
  taxExempt: string | null;
  threeDSecureInfo: string | null;
  type: string | null;
  updatedAt: string | null;
  visaCheckoutCard: string | null;
  voiceReferralNumber: string | null;
}


export interface IEthereumCreateWalletType {
  __typename: "EthereumCreateWalletType";
  id: string | null;
  address: string | null;
  name: string | null;
}


export interface IBuyCoinsType {
  __typename: "BuyCoinsType";
  tx: string | null;
}


export interface ISendTransactionType {
  __typename: "SendTransactionType";
  transactionHash: string | null;
}


export interface IRelationshipUpdatePayloadType {
  __typename: "RelationshipUpdatePayloadType";
  message: string | null;
  walletId: string | null;
}


export interface ISignalType {
  __typename: "SignalType";
  id: number | null;
  name: string | null;
  message: string | null;
  avatar: string | null;
  userId: number | null;
}


export interface ITransactionUpdatePayloadType {
  __typename: "TransactionUpdatePayloadType";
  message: string | null;
  walletId: string | null;
}

/**
  description: Subscription type for all rabbitmq subscriptions via pub sub
*/
export interface ISubscription {
  __typename: "Subscription";
  listSignals: Array<ISignalType> | null;
  transactionSubscription: IWalletEventSubscriptionType | null;
}


export interface IWalletEventSubscriptionType {
  __typename: "WalletEventSubscriptionType";
  wallet: IWalletType | null;
  transaction: ITransactionType | null;
}


// tslint:enable
