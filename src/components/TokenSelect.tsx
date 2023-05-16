import { useState } from "react";
import styled from "styled-components";
import { Flex, Spacer, Text } from "./styles";
import { LSearch } from "./icons";
import { useTokens } from "../hooks/useTokens";
import TokenList from "./TokenList";
import { NATIVE_TOKEN, TokenInfo } from "../constants";
import { isAddress } from "../utils";
import { useToken } from "../hooks/useToken";

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
const InputCon = styled.div`
  label {
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #848892;
  }
`;

export const ResultCon = styled.div`
  background: ${({ theme }) => `1px solid ${theme.primary}`};
  border: ${({ theme }) => `1px solid ${theme.stroke}`};
  border-radius: 10px;
  max-height: 319px;
  overflow-y: auto;
  padding: 21px 16px;

  @media (max-width: 640px) {
    padding: 21px 16px;
  }
`;
const NFTCon = styled(Flex)`
  align-items: center;
  justify-content: center;
  padding: 100px 0px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;
const Tab = styled.div<{ active: boolean }>`
  padding: 0px 10px;
  cursor: pointer;
  color: ${({ theme, active }) => (active ? theme.accent : theme.text)};
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

export const InputWrapper = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  /* background: #ffffff; */
  border-radius: 10px;
  padding: 0px 9px 0px 20px;
  font-size: 18px;

  /* color: #170728; */
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 12px;

  svg {
    flex-shrink: 0;
  }

  input {
    /* height: 45px; */
    outline: none;
    border: none;
    font-size: 18px;
    padding: 0px 19px;
    width: 90%;
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
`;

const Msg = styled.div`
  padding: 10px;
`;

interface TokenSelect {
  handleSelected: (arg: TokenInfo) => void;
  chainId: number;
}

const ImportToken = ({
  address,
  onImport,
}: {
  address: string;
  onImport: (token: TokenInfo) => void;
}) => {
  const token = useToken(address);
  if (!token) return null;

  return (
    <div>
      <TokenList
        token={token}
        callback={() => onImport(token)}
        isImported={true}
      />
    </div>
  );
};

const TokenSelect = ({ handleSelected, chainId }: TokenSelect) => {
  const [query, setQuery] = useState<string>("");
  const [active] = useState<"coin" | "nft">("coin");
  const [activeTab, setActiveTab] = useState<"all" | "imported">("all");
  const tokens = useTokens();
  // const tokenAddress = tokens.map((item) => item.address);

  const filteredTokens = [
    {
      ...NATIVE_TOKEN[chainId],
    },
    ...tokens,
  ].filter(
    (token) =>
      token.address.toLowerCase() === query.trim().toLowerCase() ||
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e: any) => {
    const val = e.target.value;
    setQuery(val);
  };

  const callback = async (token: TokenInfo) => {
    setQuery("");
    handleSelected(token);
  };

  return (
    <SwapContainer onClick={(e) => e.stopPropagation()}>
      <Body>
        {/* <ActionSwitch className="list">
          <SwitchItem
            onClick={() => setActive("coin")}
            className={active == "coin" ? "active" : ""}
          >
            Coin
          </SwitchItem>
          <SwitchItem
            className={active == "nft" ? "active" : ""}
            onClick={() => setActive("nft")}
          >
            Nft
          </SwitchItem>
        </ActionSwitch> */}
        {/* <Spacer height={15} /> */}
        {active == "coin" && (
          <>
            {" "}
            <InputCon>
              <InputWrapper>
                <LSearch />
                <input
                  placeholder="Type a name or address"
                  value={query}
                  type="text"
                  onChange={handleSearch}
                />
              </InputWrapper>
            </InputCon>
            <Spacer height={15} />
            <TabContainer>
              <Tab
                onClick={() => setActiveTab("all")}
                active={activeTab === "all"}
                role="button"
              >
                All
              </Tab>
              <Tab
                active={activeTab === "imported"}
                onClick={() => setActiveTab("imported")}
                role="button"
              >
                Imported
              </Tab>
            </TabContainer>
            <ResultCon className="custom-scroll">
              {!filteredTokens.length && isAddress(query.trim()) && (
                <ImportToken
                  address={query.trim()}
                  onImport={(token) => callback(token)}
                ></ImportToken>
              )}
              {!filteredTokens.filter((item) =>
                activeTab === "imported" ? item.isImport : true
              ).length &&
                !isAddress(query.trim()) && (
                  <Msg>
                    <Text>Not Found</Text>
                  </Msg>
                )}
              {filteredTokens
                .filter((item) =>
                  activeTab === "imported" ? item.isImport : true
                )
                .map((token: TokenInfo, i: number) => (
                  <TokenList
                    token={token}
                    callback={() => callback(token)}
                    isImported={token.isImport}
                    key={i}
                  />
                ))}
            </ResultCon>
          </>
        )}

        {active == "nft" && (
          <NFTCon>
            <Text>Coming Soon</Text>
          </NFTCon>
        )}
      </Body>
    </SwapContainer>
  );
};

export default TokenSelect;
