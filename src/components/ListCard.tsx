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
  margin: 50px 0px;
  background: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 0px 12px 12px 12px;
`;
const Header = styled.div`
  position: relative;
`;
const Body = styled.div`
  position: relative;
  padding: 12px;
`;
const Details = styled.div``;
const ListType = styled.div`
  font-size: 12px;
  position: absolute;
  top: -30px;
  border-radius: 6px 6px 0px 0px;
  background: ${({ theme }) => theme.accent};
  border: ${({ theme }) => `1px solid ${theme.accent}`};
  padding: 0px 10px;
  border-bottom: none;
  height: 28px;
  line-height: 28px;
  color: ${({ theme }) => theme.text};
  left: -1px;
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
  flex-direction: column;
  justify-content: space-between;
  padding: 39px 18px 18px;
  gap: 12px;
`;

const Price = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 25px;
  top: -20px;
  position: relative;
`;

const SwapDesc = styled.div`
  height: 30px;
  border-radius: 8px;
  color: ${({ theme }) => theme.activeText};
  background: ${({ theme }) => theme.active};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const ImgWrap = styled.div`
  height: 36px;
  width: 36px;
  flex-shrink: 0;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
  }
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
    console.log(token);
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
        <SwapDesc>
          {list.token_out_metadata.symbol}/{list.token_in_metadata.symbol}
        </SwapDesc>
        <DetailWrapperT>
          <Flex justify="space-between">
            <Text uppercase>Swap:</Text>
            <Flex style={{ width: "70%" }} align="center">
              <ImgWrap>
                <img
                  onError={(e: any) => (e.target.src = "/no-token.png")}
                  src={list.token_out_metadata.logoURI || "/no-token.png"}
                  alt="Logo"
                />
              </ImgWrap>
              <Spacer width={10} />
              <Text
                uppercase
                size="small"
                color={theme.subtext}
                style={{ whiteSpace: "nowrap" }}
              >
                {Number(list.amount_in).toFixed(2)} &nbsp;
                {list.token_in_metadata?.symbol}
              </Text>
            </Flex>
          </Flex>
          <Flex justify="space-between">
            <Text uppercase>For:</Text>
            <Flex style={{ width: "70%" }} align="center">
              <ImgWrap>
                <img
                  onError={(e: any) => (e.target.src = "/no-token.png")}
                  src={list.token_out_metadata.logoURI || "/no-token.png"}
                  alt="Logo"
                />
              </ImgWrap>
              <Spacer width={10} />
              <Text
                style={{ whiteSpace: "nowrap" }}
                uppercase
                size="small"
                color={theme.subtext}
              >
                {Number(list.amount_out).toFixed(2)} &nbsp;
                {list.token_out_metadata?.symbol}
              </Text>
            </Flex>
          </Flex>
        </DetailWrapperT>

        <Button
          className="block interactive"
          onClick={() => callback(TradeType.Swap)}
        >
          Trade
        </Button>
        <ListType>
          {list.is_friction ? "Frictional Trade" : "Fixed Trade"}
        </ListType>
      </Body>
    </SwapContainer>
  );
};

export default List;
