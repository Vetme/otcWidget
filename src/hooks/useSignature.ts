import { useActiveWeb3 } from "./useWeb3Provider";
import { useCallback, useState } from "react";

const types = {
  Order: [
    { name: "signatory", type: "address" },
    { name: "receivingWallet", type: "address" },
    { name: "tokenIn", type: "address" },
    { name: "tokenOut", type: "address" },
    { name: "amountOut", type: "uint256" },
    { name: "amountIn", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
};

export const useSignature = () => {
  const { chainId, provider } = useActiveWeb3();
  const [signature, setSignature] = useState<string | undefined>("");

  const signer = provider?.getSigner();

  const sign = useCallback(
    async (value: any, contractAddress: string) => {
      const domain = {
        name: "VetMe Escrow",
        version: "1.0.1",
        chainId: chainId,
        verifyingContract: contractAddress,
      };
      const signature = await signer?._signTypedData(domain, types, value);

      setSignature(signature);
    },
    [chainId]
  );

  return { signature, sign };
};
