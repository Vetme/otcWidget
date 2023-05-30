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
  Message,
  MTitle,
  SwapCon,
} from "./styles";
import { Check } from "./icons";
import { BASE_URL, CONTRACT_ADDRESS, SUPPORTED_NETWORKS } from "../constants";
import TokenBadge from "./TokenBadge";
import { Button } from "./Button";
import { useActiveWeb3 } from "../hooks/useWeb3Provider";
import { useSignature } from "../hooks/useSignature";
import useApproval, { APPROVAL_STATE } from "../hooks/useApproval";
import { useOrder } from "../hooks/useOrder";
import { parseUnits } from "ethers/lib/utils";

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
  height: 28px;
  line-height: 28px;
  /* display: flex; */
  align-items: center;
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

interface TokenSwapI {
  trade: any;
  client?: string;
  close: () => void;
}

const TokenSwap = ({ trade, client, close }: TokenSwapI) => {
  const { chainId, account } = useActiveWeb3();
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<boolean>(false);
  const isUnsupported = !SUPPORTED_NETWORKS.includes(chainId.toString());
  const { match } = useOrder();
  const [success, setSuccess] = useState<string>("");
  const { sign } = useSignature();
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

      await fetch(`${BASE_URL}/lists/completed/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);

      // if (result.status === 200) {
      setSuccess("Swap Completed");
      close();
      // }
    } catch (err: any) {
      alert(err.reason || err.message);
      setLoading(false);
    }
  };

  return (
    <SwapContainer onClick={(e) => e.stopPropagation()}>
      <Body>
        <InputWrapper>
          <ListType>
            {trade.is_friction ? "Frictional Trade" : "Fixed Trade"}
          </ListType>
          {/* <Text className="" uppercase weight="400" size="s3">
            Asks{" "}
            <strong>
              {trade?.amount_in} {trade?.token_in_metadata.symbol}
            </strong>{" "}
            for{" "}
            <strong>
              {trade?.amount_out} {trade?.token_out_metadata.symbol}
            </strong>
          </Text> */}

          {/* <Text className="" uppercase weight="400" size="s3">
            Amount Remaining{" "}
            <strong>
              {trade?.amount_out_balance} {trade?.token_out_metadata.symbol}
            </strong>{" "}
          </Text> */}
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
          <Spacer height={21} />

          <Flex align="center" justify="center">
            <SwapCon>
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.1562 1.65625C10.1562 1.30078 10.457 1 10.8125 1C11.1953 1 11.4688 1.30078 11.4688 1.65625V12.8398L13.6562 10.8164C13.9297 10.5703 14.3398 10.5703 14.5859 10.8438C14.6953 10.9805 14.75 11.1445 14.75 11.2812C14.75 11.4727 14.6953 11.6367 14.5586 11.7734L11.2773 14.8359C11.0312 15.082 10.6211 15.082 10.375 14.8359L7.09375 11.7734C6.82031 11.5273 6.82031 11.1172 7.06641 10.8438C7.3125 10.5703 7.72266 10.5703 7.99609 10.8164L10.1562 12.8398V1.65625ZM5.34375 14.3438C5.34375 14.7266 5.07031 15 4.6875 15C4.33203 15 4.03125 14.7266 4.03125 14.3438L4.03125 3.1875L1.87109 5.21094C1.59766 5.45703 1.1875 5.45703 0.941406 5.18359C0.832031 5.04688 0.75 4.88281 0.75 4.71875C0.75 4.55469 0.832031 4.39062 0.96875 4.25391L4.25 1.19141C4.49609 0.945312 4.90625 0.945312 5.15234 1.19141L8.43359 4.25391C8.70703 4.5 8.70703 4.91016 8.46094 5.18359C8.21484 5.45703 7.80469 5.45703 7.53125 5.21094L5.34375 3.1875L5.34375 14.3438Z"
                  fill="#170728"
                />
              </svg>
            </SwapCon>
          </Flex>
          {/* <Spacer height={10} /> */}

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

          <Spacer height={21} />
          {/* disabled={!isValid()} */}
          <Button
            className="block interactive"
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

      {!!success && (
        <Message className={success ? "show" : "hide"}>
          <Flex direction="column" align="center" justify="center">
            <Check />
            <MTitle>{success}</MTitle>
            <Button onClick={() => setSuccess("")}>Ok</Button>
          </Flex>
        </Message>
      )}
    </SwapContainer>
  );
};

export default TokenSwap;
