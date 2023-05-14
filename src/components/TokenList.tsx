import React from "react";
import { Flex, Text } from "./styles";
import styled from "styled-components";
import { TokenInfo } from "../constants";
import { Button } from "./Button";
import { useImportedTokens } from "../hooks/useTokens";
import useTheme from "../hooks/useTheme";

const Wrapper = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme, selected }) =>
    selected ? theme.secondary : "transparent"};

  :hover {
    background: ${({ theme }) => theme.secondary};
  }
`;
const Container = styled(Flex)`
  gap: 13px;
  margin: 15px 0px;
  cursor: pointer;
`;

const Avatar = styled.div`
  height: 37px;
  width: 37px;
  border-radius: 50%;
  background: #f4eeee;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    /* width: 100%; */
  }
`;
const Details = styled.div``;
const Balance = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text};
`;

interface IToken {
  token: TokenInfo;
  balance?: number;
  callback: () => void;
  isImported?: boolean;
}
{
  /* symbol == title  */
}
{
  /* name == fullTitle  */
}

const TokenList = ({ token, balance, callback, isImported }: IToken) => {
  const { logoURI, name, symbol, isImport } = token;
  const { addToken, removeToken } = useImportedTokens();
  const theme = useTheme();

  const handleImport = () => {
    addToken(token);
    callback();
  };

  const handleRemove = () => {
    removeToken(token);
  };

  return (
    <Wrapper onClick={() => (isImported ? false : callback())}>
      <Container align="center">
        <Avatar>
          {logoURI ? (
            <img
              src={logoURI}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "/no-token.png";
              }}
              alt="Logo"
            />
          ) : (
            <img src={"/no-token.png"} alt="Logo" />
          )}
        </Avatar>
        <Details>
          <Text size="s1" weight="400">
            {symbol}
          </Text>
          <Text size="tiny" weight="400" color={theme.subtext}>
            {name}
          </Text>
        </Details>
      </Container>
      {isImported ? (
        <Button onClick={() => (isImport ? handleRemove() : handleImport())}>
          {isImport ? "Remove" : "Import"}
        </Button>
      ) : (
        (balance && <Balance>{Number(balance).toFixed(2)}</Balance>) || (
          <div></div>
        )
      )}
    </Wrapper>
  );
};

export default TokenList;
