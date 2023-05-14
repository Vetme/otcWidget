import {
  ethereumTokens,
  polygonTokens,
  bnbTokens,
  goerliTokens,
} from "./tokens";

export enum ZIndex {
  UNDERLAYER = -1,
  OVERLAY = 100,
  DIALOG = 1000,
  TOOLTIP = 2000,
}

export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
  isImport?: boolean;
}
export const NATIVE_TOKEN: {
  [chainId: number]: TokenInfo;
} = {
  1: {
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
    address: NATIVE_TOKEN_ADDRESS,
    chainId: 1,
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  137: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    address: NATIVE_TOKEN_ADDRESS,
    chainId: 137,
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  },
  56: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    address: NATIVE_TOKEN_ADDRESS,
    chainId: 56,
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
  },
  5: {
    name: "Görli Test Token",
    symbol: "GTT",
    decimals: 18,
    address: NATIVE_TOKEN_ADDRESS,
    chainId: 5,
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const DEFAULT_TOKENS: {
  [chainId: number]: TokenInfo[];
} = {
  1: ethereumTokens,
  137: polygonTokens,
  56: bnbTokens,
  5: goerliTokens,
};

export const MULTICALL_ADDRESS: { [chainId: number]: string } = {
  1: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  137: "0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4",
  56: "0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4",
  5: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
};

export const CONTRACT_ADDRESS: { [chainId: number]: string } = {
  1: "0x2e6013DA3CbE83781A03Aa2cFEeEb0179f610C3F",
  137: "0x54b681922d7696763197147546EbA21a13B3BEBE",
  56: "0x54b681922d7696763197147546EbA21a13B3BEBE",
  5: "0x956663BE8EeBCd23bf9c091B41719597BAb6f550",
};

export const SCAN_LINK: { [chainId: number]: string } = {
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  56: "https://bscscan.com",
  5: "https://goerli.etherscan.io",
};

export const SUPPORTED_NETWORKS = Object.keys(SCAN_LINK);

export const DECIMAL = (chainId: number | undefined, details: any) => {
  switch (chainId) {
    case 1:
      return details.ethereum.decimal_place;
      break;
    case 137:
      return details["polygon-pos"].decimal_place;
      break;
    case 56:
      return details["binance-smart-chain"].decimal_place;
      break;
    default:
      return details.ethereum.decimal_place;
      break;
  }
};

export const BLOCK_NAME = (chainId: number | undefined) => {
  switch (chainId) {
    case 1:
      return "ethereum";
      break;
    case 137:
      return "polygon-pos";
      break;
    case 56:
      return "binance-smart-chain";
      break;
    default:
      return "ethereum";
      break;
  }
};

export const FOREVER = 25256820600;

export const BASE_URL = "http://localhost:4000/api";
