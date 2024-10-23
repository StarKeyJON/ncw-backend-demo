import { CryptoClient } from "coinmarketcap-js";

export interface Clients {
  apiKey: string;
  secret: string;
  uid: string;
  passphrase: string;
  cmc: CryptoClient;
}
