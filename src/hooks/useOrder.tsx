import { parseUnits } from "ethers/lib/utils";
import { useMatchContract } from "./useContract";
import { useActiveWeb3 } from "./useWeb3Provider";
import { useCallback, useState } from "react";
import { Contract, providers } from "ethers";

export const useOrder = () => {
  const { chainId, account, provider } = useActiveWeb3();
  const contract = useMatchContract();

  const match = useCallback(
    async (value: any, signature: string | undefined) => {
      try {
        const sellerValue = {
          signatory: value.signatory,
          receivingWallet: value.receiving_wallet,
          tokenIn: value.token_in,
          tokenOut: value.token_out,
          amountOut: parseUnits(
            value.amount_out.toString(),
            value.token_out_metadata.decimal_place
          ).toString(),
          amountIn: parseUnits(
            value.amount_in.toString(),
            value.token_in_metadata.decimal_place
          ).toString(),
          deadline: value.deadline,
          nonce: value.nonce,
        };

        const buyerValue = {
          signatory: account,
          receivingWallet: account,
          tokenIn: value.token_out,
          tokenOut: value.token_in,
          amountOut: parseUnits(
            value.aIn.toString(),
            value.token_in_metadata.decimal_place
          ).toString(),
          amountIn: parseUnits(
            value.aOut.toString(),
            value.token_out_metadata.decimal_place
          ).toString(),
          deadline: value.deadline,
          nonce: value.nonce_friction,
        };

        const buy = generateOrder(signature, buyerValue);
        const sell = generateOrder(value.signature, sellerValue);

        const p = provider as providers.Web3Provider;

        const signer = contract?.connect(p.getSigner()) as Contract;

        console.log(buy, sell);

        const trxn = await signer.matchSupportFraction(
          sell.order,
          sell.signature,
          buy.order,
          buy.signature
          // {
          //   gasLimit: 20000000,
          // }
        );
        const transaction = await trxn.wait();
        return Promise.resolve(transaction);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    [chainId]
  );

  return { match };
};

const generateOrder = (signature: string | undefined, value: any) => {
  return {
    order: { ...value },
    signature,
  };
};
