import React from "react";
import { Flex, Spacer, Text } from "./styles";
import styled, { css } from "styled-components";
import { Button } from "./Button";
import { IList, TradeType } from "../types";
import TokenBadge from "./TokenBadge";
import { Swap } from "./icons";
import useTheme from "../hooks/useTheme";

const common = css`
  position: absolute;
  color: ${({ theme }) => theme.text};
`;

const SwapContainer = styled.div`
  max-width: 100%;
  margin-bottom: 27px;
  background: ${({ theme }) => theme.secondary};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-bottom: ${({ theme }) => `2px solid ${theme.accent}`};
`;
const Header = styled.div`
  position: relative;
`;
const Body = styled.div`
  position: relative;
`;
const Details = styled.div``;
const ListType = styled.div`
  font-size: 12px;
  position: absolute;
  bottom: 0px;
  background: ${({ theme }) => theme.accent};
  padding: 0px 10px;
  border-bottom: none;
  height: 20px;
  line-height: 20px;
  color: ${({ theme }) => theme.text};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
`;

const TopFLeft = styled.div`
  ${common};
  left: 20px;
  top: 10px;
`;

const DetailWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  padding: 18px;
  position: relative;
  gap: 10px;
`;

const DetailWrapperT = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 39px 18px 18px;
`;

const Price = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 25px;
  top: -20px;
  position: relative;
`;

const List = ({
  list,
  callback,
}: {
  list: IList;
  callback: (type: TradeType) => void;
}) => {
  const theme = useTheme();
  const handleChart = (token: any) => {
    // alert();
  };
  return (
    <SwapContainer className="guest">
      <Header>
        <TopFLeft>
          <Text style={{ fontSize: "12px" }} uppercase>
            {list.token_out_metadata?.symbol}/{list.token_in_metadata?.symbol}
          </Text>
        </TopFLeft>
      </Header>
      <Body>
        <DetailWrapperT>
          <Flex align="center">
            <TokenBadge
              token={list.token_out_metadata}
              handleClick={() => handleChart(list)}
              hasChart={true}
            />
            <Spacer width={15} widthM={10} />
          </Flex>
          <Swap />
          <Flex align="center">
            <Spacer width={15} widthM={10} />
            <TokenBadge
              token={list.token_in_metadata}
              handleClick={() => handleChart(list)}
              hasChart={true}
            />
          </Flex>
        </DetailWrapperT>
        <Price>
          <Text
            style={{ whiteSpace: "nowrap" }}
            uppercase
            size="small"
            color={theme.subtext}
          >
            {Number(list.amount_out).toFixed(2)} &nbsp;
            {list.token_out_metadata?.symbol}
          </Text>

          <Text
            uppercase
            size="small"
            color={theme.subtext}
            style={{ whiteSpace: "nowrap" }}
          >
            {Number(list.amount_in).toFixed(2)} &nbsp;
            {list.token_in_metadata?.symbol}
          </Text>
        </Price>

        <DetailWrapper>
          <Details>
            {/* {Number(list.amount_in).toFixed(2)} &nbsp;
              {list.token_in_metadata?.symbol} */}
            {/* 
            <Text size="s3" color="#5D5169" uppercase>
              Expiry Time :{" "}
              {list.deadline == getForever
                ? "Forever"
                : formatSecTime(list.deadline)}
            </Text> */}
          </Details>

          <Button onClick={() => callback(TradeType.Swap)}>Trade</Button>
        </DetailWrapper>

        <ListType>
          {list.is_friction ? "Frictional Trade" : "Fixed Trade"}
        </ListType>
      </Body>
    </SwapContainer>
  );
};

export default List;
