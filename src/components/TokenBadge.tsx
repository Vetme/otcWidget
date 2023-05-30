import styled from "styled-components";
import { Spacer, Text } from "./styles";
import { DropDown } from "./icons";
import useTheme from "../hooks/useTheme";
// import { Caret, Chart, DropDown } from "./Icons";

const Container = styled.div`
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 2px 15px;
  color: ${({ theme }) => theme.activeText};
  background: ${({ theme }) => theme.interactive};
  cursor: pointer;
  height: 32px;
`;
const ImgWrap = styled.div`
  height: 20px;
  width: 20px;
  background: ${({ theme }) => theme.activeText};
  flex-shrink: 0;
  border-radius: 50%;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    object-fit: contain;
  }
`;

// interface BadgeI {
//   token: any;
//   icon?: string;
//   hasCaret?: boolean;
//   hasChart?: boolean;
//   handleClick: () => void;
// }

const TokenBadge = ({ token, handleClick }: any) => {
  const theme = useTheme();
  return (
    <Container onClick={() => handleClick()}>
      {token ? (
        <>
          <ImgWrap>
            <img
              onError={(e: any) => (e.target.src = "/no-token.png")}
              src={token.logoURI || "/no-token.png"}
              alt="Logo"
            />
          </ImgWrap>
          <Spacer width={6} />
          <Text color={theme.activeText} size="s3" uppercase weight="400">
            {token.symbol}
          </Text>
          <Spacer width={6} />
          <DropDown />
        </>
      ) : (
        <>
          <Text color={theme.activeText} size="s3" uppercase weight="400">
            Select Token
          </Text>
          <Spacer width={6} />

          <DropDown />
        </>
      )}
    </Container>
  );
};

export default TokenBadge;
