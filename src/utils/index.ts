import { getAddress } from "ethers/lib/utils";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const computeUsdPrice = (usd: any, amount: number) => {
  return (usd * amount).toFixed(5);
};

export function copyToClipboard(textToCopy: string) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand("copy") ? res(textToCopy) : rej();
      textArea.remove();
    });
  }
}

export const getTokenPrice = async (tokenName: string, chainId: any) => {
  const apiUrl = `https://api.coingecko.com/api/v3/simple/token_price/${getBlockName(
    chainId
  )}?contract_addresses=${tokenName}&vs_currencies=usd`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const res: any[] = Object.values(data);

    return res[0].usd;
  } catch (error) {
    console.log(error);
  }
};

export const getBlockName = (chainId: any) => {
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
