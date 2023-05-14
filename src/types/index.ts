export enum ActiveTab {
  List = "list",
  Swap = "swap",
}

export declare type TokenI = {
  id?: string | number;
  address: string;
  symbol?: string;
  logoURI?: string;
  name?: string;
  usd?: number;
  chainId: number;
  _scan?: string;
  decimals: number;
};

export enum ModalType {
  SETTING = "setting",
  LOADING = "loading",
  TOKEN_SELECT = "select_token",
  TOKEN_SWAP = "swap_token",
}

export enum TradeType {
  Counter = "counter",
  Swap = "swap",
}

type statusT = 1 | 2 | 3;

export interface IList {
  _id?: string;
  token_in_metadata: any;
  token_out_metadata: any;
  signatory: string;
  receiving_wallet: string;
  signature: string;
  token_in: string;
  token_out: string;
  amount_in: number | string;
  amount_out: number | string;
  deadline: number;
  nonce?: number | string;
  is_active: boolean;
  is_private: boolean;
  status?: statusT;
  forever?: boolean;
  createdAt?: Date;
  verified?: boolean;
  from_token_verified?: boolean;
  to_token_verified?: boolean;
  is_friction?: boolean;
  amount_out_balance?: any;
  nonce_friction?: any;
  chain?: number;
}
