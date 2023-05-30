import { useState, useEffect } from "react";
import { parseUnits } from "@ethersproject/units";

import {
  InputBox,
  ListContainer,
  InputInner,
  Input,
  InputCon,
  InputDurationCon,
  SettingWrap,
  Flex,
  Spacer,
  DurationInput,
  Text,
  SwapCon,
  ModalWrapper,
  ContentWrapper,
  ModalHeader,
  Back,
  Title,
  UsdVal,
  Message,
  MTitle,
} from "./../styles";
import TokenBadge from "../TokenBadge";
import { ModalType, TokenI } from "../../types";
import {
  Check,
  ChevronLeft,
  Settings as SettingsIcon,
  SwapIcon2,
} from "../icons";
import useApproval, { APPROVAL_STATE } from "../../hooks/useApproval";
import { useActiveWeb3 } from "../../hooks/useWeb3Provider";
import {
  BASE_URL,
  CONTRACT_ADDRESS,
  FOREVER,
  SUPPORTED_NETWORKS,
} from "../../constants";
import { Button } from "../Button";
import TokenSelect from "../TokenSelect";
import Toggle from "../Toggle";
import Settings from "../Settings";
import { useSignature } from "../../hooks/useSignature";
import { computeUsdPrice, getTokenPrice } from "../../utils";
import useTheme from "../../hooks/useTheme";

const initialState = {
  amount_in: "",
  amount_out: "",
  is_friction: false,
  is_private: false,
  deadline: FOREVER,
  nonce: 0,
};

const ListWidget = ({ client }: { client?: string }) => {
  const [form, setForm] = useState<typeof initialState>(initialState);
  const [showModal, setShowModal] = useState<ModalType | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [give, setGive] = useState<TokenI | undefined>(undefined);
  const [get, setGet] = useState<TokenI | undefined>(undefined);
  const [hasDeadline, setHasDeadline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<boolean>(false);
  const [action, setAction] = useState<"giving" | "getting">("giving");
  const { chainId, account } = useActiveWeb3();
  const isUnsupported = !SUPPORTED_NETWORKS.includes(chainId.toString());
  const { sign } = useSignature();
  const theme = useTheme();

  const handleDChange = () => {
    setHasDeadline((prev) => !prev);
  };

  useEffect(() => {
    if (account) {
      getNonce(account);
    }
  }, [account]);

  const setAccount = async (account: string) => {
    const req = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account }),
    }).then((r) => r.json());

    if (req) {
      getNonce(account);
    }
  };

  const getNonce = async (account: string) => {
    const response = await fetch(`${BASE_URL}/users/${account}`);
    const data = await response.json();
    if (data.account) {
      setForm((prev: any) => ({
        ...prev,
        nonce: data.account.nonce,
      }));
    } else {
      setAccount(account);
    }
  };

  const modalTitle = (() => {
    switch (showModal) {
      case ModalType.SETTING:
        return "Trade Settings";
      case ModalType.LOADING:
        return "Loading";
      case ModalType.TOKEN_SELECT:
        return "Select an asset";
      default:
        return null;
    }
  })();

  const {
    loading: checkingAllowance,
    approve,
    approvalState,
  } = useApproval(
    (form?.amount_out as unknown as string) || "0",
    give?.address as string,
    CONTRACT_ADDRESS[chainId]
  );

  const processListing = async () => {
    setLoading(true);
    const signatureData = {
      signatory: account,
      receivingWallet: account,
      tokenIn: get?.address,
      tokenOut: give?.address,
      amountOut: parseUnits(form.amount_out, give?.decimals),
      amountIn: parseUnits(form.amount_in, get?.decimals),
      deadline: form.deadline,
      nonce: form.nonce,
    };

    try {
      const sig = await sign(signatureData, CONTRACT_ADDRESS[chainId]);

      const data = {
        ...form,
        chain: chainId,
        nonce: form.nonce,
        signature: sig,
        receiving_wallet: account,
        token_in: get?.address,
        token_out: give?.address,
        signatory: account,
        token_in_metadata: {
          ...get,
          icon: get?.logoURI,
          decimal_place: get?.decimals,
        },
        token_out_metadata: {
          ...give,
          icon: give?.logoURI,
          decimal_place: give?.decimals,
        },
        forever: hasDeadline ? false : true,
        client,
      };

      const result = await fetch(`${BASE_URL}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);

      if (result.status === 200) {
        setSuccess("List Created");
        setForm(initialState);
        setGive(undefined);
        setGet(undefined);
      }
    } catch (err: any) {
      alert(err.reason || err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name == "amount_in" || name == "amount_out") {
      value = value.replace(/,/g, ".");
      const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group
      if (
        value === "" ||
        inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      ) {
        console.log("");
      } else {
        return;
      }
    }

    if (name == "deadline") {
      const date = new Date(value);
      const seconds = Math.floor(date.getTime() / 1000);
      value = seconds;
    }
    setForm((initialState: any) => {
      return { ...initialState, [name]: value };
    });
  };
  const handleSelect = (action: "giving" | "getting") => {
    setAction(action);
    setShowModal(ModalType.TOKEN_SELECT);
  };

  const handleSelected = async (token: any) => {
    setShowModal(null);
    if (action == "getting") {
      setGet(token);
      const usd = await getTokenPrice(token.address, chainId);
      setGet((prev: any) => {
        return {
          ...prev,
          usd,
        };
      });
    }
    if (action == "giving") {
      setGive(token);
      const usd = await getTokenPrice(token.address, chainId);
      setGive((prev: any) => {
        return {
          ...prev,
          usd,
        };
      });
    }
  };

  const handleSwap = () => {
    setForm((init: any) => {
      return {
        ...init,
        amount_in: init.amount_out,
        amount_out: init.amount_in,
      };
    });
    setGive(get);
    setGet(give);
  };

  const modalContent = (() => {
    switch (showModal) {
      case ModalType.SETTING:
        return (
          <Settings
            form={form}
            setForm={setForm}
            handleClose={() => setShowModal(null)}
          />
        );
      case ModalType.TOKEN_SELECT:
        return (
          <TokenSelect
            handleSelected={(token: TokenI) => handleSelected(token)}
            chainId={chainId}
          />
        );
      case ModalType.LOADING:
        return <div>Loading</div>;
      default:
        return null;
    }
  })();

  const invalidInput = !form.amount_in || !form.amount_out || !give || !get;

  return (
    <ListContainer>
      <InputCon>
        <InputBox>
          <label htmlFor="">You give</label>
          <InputInner>
            <Input
              onChange={handleChange}
              name="amount_out"
              placeholder="0.0"
              type="number"
              value={form.amount_out}
              step={0.1}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minLength={1}
              maxLength={79}
              spellCheck="false"
            />
            {give && Number(form.amount_out) > 0 && (
              <UsdVal>
                ~${computeUsdPrice(give.usd, Number(form.amount_out))}
              </UsdVal>
            )}
            <div>
              <TokenBadge
                token={give}
                hasCaret={true}
                handleClick={() => handleSelect("giving")}
              />
            </div>
          </InputInner>
        </InputBox>
      </InputCon>

      <Spacer height={31} />

      <Flex align="center" justify="center">
        <SwapCon onClick={handleSwap}>
          <SwapIcon2 />
        </SwapCon>
      </Flex>

      <Spacer height={6} />

      <InputCon>
        <InputBox>
          <label htmlFor="">You get</label>
          <InputInner>
            <Input
              onChange={handleChange}
              name="amount_in"
              value={form.amount_in}
              type="number"
              step={0.1}
              placeholder="0.0"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minLength={1}
              maxLength={79}
              spellCheck="false"
            />
            {get && +form.amount_in > 0 && (
              <UsdVal>
                ~${computeUsdPrice(get.usd, Number(form.amount_in))}
              </UsdVal>
            )}
            <div>
              <TokenBadge
                token={get}
                hasCaret={true}
                handleClick={() => handleSelect("getting")}
              />
            </div>
          </InputInner>
        </InputBox>
      </InputCon>
      <Spacer height={30} />

      <InputDurationCon>
        <label htmlFor="">Time of Contract</label>
        <Flex align="center" style={{ height: "50px" }}>
          <DurationInput>
            {hasDeadline ? (
              <input
                type="datetime-local"
                name="deadline"
                onChange={handleChange}
              />
            ) : (
              <Text weight="700">Off (Set as Forever)</Text>
            )}
          </DurationInput>
          <Toggle
            checked={hasDeadline}
            onChange={handleDChange}
            name="hasDeadlione"
          />
        </Flex>
      </InputDurationCon>
      <Spacer height={30} />

      <Flex justify="center" align="center" gap={10}>
        <Button
          className="block"
          disabled={
            loading ||
            checkingAllowance ||
            approvalState === APPROVAL_STATE.PENDING ||
            isUnsupported ||
            !account ||
            invalidInput
          }
          onClick={async () => {
            if (approvalState === APPROVAL_STATE.NOT_APPROVED) {
              approve();
            } else {
              processListing();
            }
          }}
        >
          {isUnsupported ? (
            <div style={{ fontSize: "16px", marginTop: "0" }}>
              <div style={{ width: "24px", height: "24px" }}></div>
              Unsupported network
            </div>
          ) : loading ? (
            <div>Listing..</div>
          ) : error ? (
            error
          ) : checkingAllowance ? (
            <div>Checking Allowance</div>
          ) : approvalState === APPROVAL_STATE.NOT_APPROVED ? (
            "Approve"
          ) : approvalState === APPROVAL_STATE.PENDING ? (
            <div>Approving</div>
          ) : (
            "List"
          )}
        </Button>
        <SettingWrap onClick={() => setShowModal(ModalType.SETTING)}>
          <SettingsIcon />
        </SettingWrap>
      </Flex>

      {/* {account ? (
        <Center>
          <ActionBtn disabled={!isValid()} onClick={handleContinue}>
            Continue{" "}
            <div>
              <ArrowRight />
            </div>
          </ActionBtn>
        </Center>
      ) : (
        <Button className="primary block m-sm" onClick={() => setShow(true)}>
          Connect Your wallet
        </Button>
      )} */}

      {/* <ModalWrapper className={showModal ? "open" : "close"}>
        <ContentWrapper>{modalContent}</ContentWrapper>
        <PoweredBy style={{ marginTop: "0" }}>
          Powered By
          <KyberSwapLogo />
        </PoweredBy>
      </ModalWrapper> */}

      <ModalWrapper className={showModal ? "open" : "close"}>
        <ContentWrapper>
          <ModalHeader>
            <Back onClick={() => setShowModal(null)}>
              <ChevronLeft />
            </Back>
            <Title>
              <Text className="header" weight="400" size="s3" uppercase>
                {modalTitle}
              </Text>
            </Title>
          </ModalHeader>
        </ContentWrapper>

        {modalContent}
      </ModalWrapper>

      {!!success && (
        <Message className={success ? "show" : "hide"}>
          <Flex direction="column" align="center" justify="center">
            <Check />
            <MTitle>{success}</MTitle>
            <Button onClick={() => setSuccess("")}>Ok</Button>
          </Flex>
        </Message>
      )}
    </ListContainer>
  );
};

export default ListWidget;
