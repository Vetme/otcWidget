import { useState } from "react";
import styled from "styled-components";
import {
  Flex,
  InputBox,
  InputCon,
  InputInner,
  Spacer,
  Text,
  Input,
} from "./styles";
import { LSearch } from "./icons";
import { useTokens } from "../hooks/useTokens";
import TokenList from "./TokenList";
import {
  BASE_URL,
  CONTRACT_ADDRESS,
  NATIVE_TOKEN,
  SUPPORTED_NETWORKS,
  TokenInfo,
} from "../constants";
import { isAddress } from "../utils";
import { useToken } from "../hooks/useToken";
import TokenBadge from "./TokenBadge";
import { Button } from "./Button";
import { useActiveWeb3 } from "../hooks/useWeb3Provider";
import { useSignature } from "../hooks/useSignature";
import useApproval, { APPROVAL_STATE } from "../hooks/useApproval";
import { useOrder } from "../hooks/useOrder";
import { parseUnits } from "ethers/lib/utils";
import { IList } from "../types";

const SwapContainer = styled.div`
  max-width: 100%;
  margin-bottom: 114px;
  margin: auto;
  position: relative;

  .header {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Body = styled.div`
  padding: 16px;
`;

export const ResultCon = styled.div`
  background: #ffffff;
  border: 1px solid #2e203e;
  border-radius: 10px;
  max-height: 319px;
  overflow-y: auto;
  padding: 21px 16px;

  @media (max-width: 640px) {
    padding: 21px 16px;
  }
`;

const ListType = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.accent};
  padding: 2px 8px;
  font-size: 12px;
  display: inline-block;
  margin: 10px 0px;
`;

export const InputWrapper = styled.div``;

const ADown = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: ${({ theme }) => `1px solid ${theme.stroke}`};
  margin: 20px auto;
  display: grid;
  place-content: center;
`;

const Msg = styled.div`
  padding: 10px;
`;

interface TokenSwapI {
  trade: any;
  client?: string;
  close: () => void;
}

const TokenSwap = ({ trade, client, close }: TokenSwapI) => {
  const { chainId, account } = useActiveWeb3();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const isUnsupported = !SUPPORTED_NETWORKS.includes(chainId.toString());
  const { match } = useOrder();
  const [success, setSuccess] = useState<string>("");
  const { sign, signature } = useSignature();
  const [form, setForm] = useState({
    amount_in: trade?.amount_out_balance,
    amount_out:
      (trade?.amount_in * trade?.amount_out_balance) /
      (trade?.amount_out as number),
  });

  const {
    loading: checkingAllowance,
    approve,
    approvalState,
  } = useApproval(
    (form?.amount_in as unknown as string) || "0",
    trade.token_in,
    CONTRACT_ADDRESS[chainId]
  );

  const handleChangeGive = (e: any) => {
    const value = e.target.value;
    const amountComputed = (value * trade.amount_out) / trade.amount_in;

    setForm((prevState: any) => ({
      ...prevState,
      amount_out: value,
      amount_in: amountComputed,
    }));
  };

  const handleChangeGet = (e: any) => {
    const value = e.target.value;
    const amountComputed = (value * trade.amount_in) / trade.amount_out;

    setForm((prevState: any) => ({
      ...prevState,
      amount_out: amountComputed,
      amount_in: value,
    }));
  };

  const processSwap = async () => {
    const aIn = trade?.is_friction ? form.amount_out : trade?.amount_in;
    const aOut = trade?.is_friction
      ? form.amount_in
      : trade?.amount_out_balance;
    const listingCopy: any = { ...trade };

    const signatureData = {
      signatory: account,
      receivingWallet: account,
      tokenIn: trade?.token_out,
      tokenOut: trade?.token_in,
      amountOut: parseUnits(
        aIn.toString(),
        trade?.token_in_metadata.decimal_place
      ).toString(),
      amountIn: parseUnits(
        aOut.toString(),
        trade?.token_out_metadata.decimal_place
      ).toString(),
      deadline: trade?.deadline,
      nonce: trade?.nonce_friction,
    };

    listingCopy.aIn = aIn;
    listingCopy.aOut = aOut;

    try {
      setLoading(true);
      const sig = await sign(signatureData, CONTRACT_ADDRESS[chainId]);

      const response = await match(listingCopy, sig);
      setLoading(false);

      const data = {
        buyerSignature: sig,
        sellerSignature: trade?.signature,
        id: trade?._id,
        account,
        transactionHash: response.transactionHash,
        amount: trade?.is_friction ? form.amount_in : trade?.amount_out,
        client: client,
      };

      const result = await fetch(`${BASE_URL}/lists/completed/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);

      if (result.status === 200) {
        setSuccess("List Created");
        close();
      }

      // console.log(response);
    } catch (err: any) {
      alert(err.reason || err.message);
      setLoading(false);
    }
  };

  // const tokenAddress = tokens.map((item) => item.address);

  return (
    <SwapContainer onClick={(e) => e.stopPropagation()}>
      <Body>
        <InputWrapper>
          <ListType>
            {trade.is_friction ? "Frictional Trade" : "Fixed Trade"}
          </ListType>
          <Text className="" uppercase weight="400" size="s3">
            Asks{" "}
            <strong>
              {trade?.amount_in} {trade?.token_in_metadata.symbol}
            </strong>{" "}
            for{" "}
            <strong>
              {trade?.amount_out} {trade?.token_out_metadata.symbol}
            </strong>
          </Text>

          <Text className="" uppercase weight="400" size="s3">
            Amount Remaining{" "}
            <strong>
              {trade?.amount_out_balance} {trade?.token_out_metadata.symbol}
            </strong>{" "}
          </Text>
          <Spacer />
          <InputCon>
            <InputBox>
              <label htmlFor="">You give</label>
              <InputInner>
                <Input
                  onChange={handleChangeGive}
                  name="amount_our"
                  placeholder="0.0"
                  type="number"
                  value={form.amount_out}
                  step={0.1}
                  disabled={!trade?.is_friction}
                  className={!trade?.is_friction ? "disabled" : ""}
                />
                <div>
                  <TokenBadge
                    token={trade?.token_in_metadata}
                    hasCaret={false}
                    handleClick={() => null}
                  />
                </div>
              </InputInner>
            </InputBox>
          </InputCon>

          <ADown>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </ADown>
          <InputCon>
            <InputBox>
              <label htmlFor="">You get</label>
              <InputInner>
                <Input
                  onChange={handleChangeGet}
                  name="amount_in"
                  value={form.amount_in}
                  type="number"
                  step={0.1}
                  placeholder="0.0"
                  disabled={!trade?.is_friction}
                  className={!trade?.is_friction ? "disabled" : ""}
                />
                <div>
                  <TokenBadge
                    token={trade?.token_out_metadata}
                    hasCaret={false}
                    handleClick={() => null}
                  />
                </div>
              </InputInner>
            </InputBox>
          </InputCon>

          <Spacer height={20} />
          {/* disabled={!isValid()} */}
          <Button
            disabled={
              loading ||
              checkingAllowance ||
              approvalState === APPROVAL_STATE.PENDING ||
              isUnsupported ||
              !account
            }
            onClick={async () => {
              if (approvalState === APPROVAL_STATE.NOT_APPROVED) {
                approve();
              } else {
                processSwap();
              }
            }}
          >
            {isUnsupported ? (
              <div style={{ fontSize: "16px", marginTop: "0" }}>
                <div style={{ width: "24px", height: "24px" }}></div>
                Unsupported network
              </div>
            ) : loading ? (
              <div>Loading..</div>
            ) : error ? (
              error
            ) : checkingAllowance ? (
              <div>Checking Allowance</div>
            ) : approvalState === APPROVAL_STATE.NOT_APPROVED ? (
              "Approve"
            ) : approvalState === APPROVAL_STATE.PENDING ? (
              <div>Approving</div>
            ) : (
              "Swap"
            )}
          </Button>
        </InputWrapper>
      </Body>
    </SwapContainer>
  );
};

export default TokenSwap;
