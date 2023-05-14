import styled from "styled-components";

export const Wrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  width: 375px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  font-family: ${({ theme }) =>
    theme.fontFamily || `"Work Sans", "Inter var", sans-serif`};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border: ${({ theme }) => `1px solid ${theme.stroke}`};
`;

export const ActionSwitch = styled.div`
  padding: 6px 7px;
  background: ${({ theme }) => theme.primary};

  border: ${({ theme }) => `1px solid ${theme.stroke}`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 24px;
  /* width: 396px; */
  max-width: 100%;
  gap: 7px;

  @media (max-width: 640px) {
    width: 200px;

    &.list {
      width: 100%;
    }
  }
`;

export const SwitchItem = styled.div`
  cursor: pointer;
  height: 44px;
  display: flex;
  width: 50%;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 1px;
  text-transform: uppercase;
  justify-content: center;
  transition: 0.3s;
  border-radius: 8px;

  align-items: center;
  &.active,
  &:hover {
    /* White/Main (100) */
    color: ${({ theme }) => theme.activeText};
    background: ${({ theme }) => theme.active};
  }
`;

export const WBody = styled.div`
  margin: 20px 0px;
  border: ${({ theme }) => `1px solid ${theme.stroke}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 10px;
`;

export const ListContainer = styled.div``;
export const SwapContainer = styled.div``;

export const InputCon = styled.div`
  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: ${({ theme }) => theme.text};

    text-transform: uppercase;
  }
`;

export const InputInner = styled.div`
  display: flex;
  top: 11.5px;
  align-items: center;
  position: relative;
  padding-right: 10px;

  border: ${({ theme }) => `1px solid ${theme.stroke}`};
  border-radius: ${({ theme }) => theme.inputRadius};

  justify-content: space-between;
  width: 100%;
`;

export const InputBox = styled.div`
  display: flex;
  height: 75px;
  align-items: center;
  position: relative;

  input {
    text-transform: uppercase;
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      display: none;
      -webkit-appearance: none;
    }
  }

  label {
    position: absolute;
    top: 0px;
    text-transform: uppercase;
    left: 10px;
  }

  @media (max-width: 640px) {
    /* height: 58px; */
  }

  &.standard {
    width: 383px;
    @media (max-width: 640px) {
      width: 100%;
    }

    div {
      width: 100% !important;
    }
  }
`;
export const Input = styled.input`
  height: 50px;
  position: relative;
  border: none;
  outline: none;
  flex: 1;
  font-weight: 700;
  font-weight: 400;
  font-size: 18px;
  width: 30%;
  color: ${({ theme }) => theme.text};
  margin-left: 10px;

  &.disabled {
    pointer-events: none;
  }

  @media (max-width: 640px) {
    /* font-size: 30px; */
  }
`;

export const Flex = styled.div<{
  direction?: "row" | "column";
  align?: string;
  gap?: number;
  justify?:
    | "space-between"
    | "space-evenly"
    | "space-around"
    | "center"
    | "flex-end";
  directionM?: string;
  margin?: string;
  wrap?: boolean;
  expand?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction }) => (direction ? direction : "row")};
  align-items: ${({ align }) => (align ? align : "flex-start")};
  justify-content: ${({ justify }) => (justify ? justify : "flex-start")};
  margin: ${({ margin }) => (margin ? margin : "0")};
  flex-wrap: ${({ wrap }) => wrap && "wrap"};
  width: ${({ expand }) => expand && "100%"};
  gap: ${({ gap }) => gap + "px"};
`;

export const Text = styled.span<{
  weight?: string;
  size?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "big"
    | "normal"
    | "small"
    | "tiny"
    | "s1"
    | "s2"
    | "s3"
    | "s4";
  color?: string;
  sizeM?: string;
  padding?: string;
  uppercase?: boolean;
}>`
  display: block;
  font-weight: ${({ weight }) => (weight ? weight : "400")};
  font-size: ${({ size }) =>
    size == "h1"
      ? "56px"
      : size == "h2"
      ? "40px"
      : size == "h3"
      ? "26px"
      : size == "h4"
      ? "18px"
      : size == "h5"
      ? "14px"
      : size == "big"
      ? "20px"
      : size == "normal"
      ? "18px"
      : size == "small"
      ? "16px"
      : size == "tiny"
      ? "14px"
      : size == "s1"
      ? "18px"
      : size == "s2"
      ? "16px"
      : size == "s3"
      ? "14px"
      : size == "s4"
      ? "14px"
      : "18px"};
  line-height: 150%;
  color: ${({ theme, color }) => (color ? color : theme.text)};

  letter-spacing: 0.02em;
  text-transform: ${({ uppercase }) => uppercase && "Uppercase"};

  @media (max-width: 640px) {
    font-size: ${({ sizeM }) =>
      sizeM == "h1"
        ? "56px"
        : sizeM == "h2"
        ? "40px"
        : sizeM == "h3"
        ? "26px"
        : sizeM == "h4"
        ? "18px"
        : sizeM == "h5"
        ? "14px"
        : sizeM == "big"
        ? "20px"
        : sizeM == "normal"
        ? "18px"
        : sizeM == "small"
        ? "16px"
        : sizeM == "tiny"
        ? "14px"
        : sizeM == "tiny-2"
        ? "10px"
        : sizeM == "s1"
        ? "18px"
        : sizeM == "s2"
        ? "16px"
        : sizeM == "s3"
        ? "14px"
        : sizeM == "s4"
        ? "14px"
        : "14px"};
  }
`;

export const Spacer = styled.div<{
  height?: number;
  width?: number;
  heightM?: number;
  widthM?: number;
}>`
  height: 10px;
  height: ${({ height }) => height && height + "px"};
  width: 0px;
  width: ${({ width }) => width && width + "px"};
  flex-shrink: 0;

  @media (max-width: 640px) {
    height: ${({ heightM }) => heightM && heightM + "px"};
    width: ${({ widthM }) => widthM && widthM + "px"};
  }
`;

export const DurationInput = styled.div`
  flex: 1;
  input {
    background: ${({ theme }) => theme.primary};
    border: ${({ theme }) => `1px solid ${theme.borderRadius}`};
    border-radius: 20px;
    padding: 10px;
    outline: none;
  }
`;

export const SwapCon = styled.div`
  cursor: pointer;
`;

export const ModalWrapper = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 0px;
  background: ${({ theme }) => theme.primary};
  width: 100%;
  background: ;
  left: 0px;
  height: 100%;
  border-top-left-radius: ${({ theme }) => theme.borderRadius};
  border-top-right-radius: ${({ theme }) => theme.borderRadius};
  transition: 0.4s;
  padding: 10px;
  box-sizing: border-box;

  &.open {
    transform: translateY(0);
  }

  &.close {
    transform: translateY(100%);
  }
`;

// Madel
export const ContentWrapper = styled.div``;
export const ModalHeader = styled.div`
  padding: 10px;
  display: flex;
`;
export const Back = styled.div`
  display: inline-block;
  cursor: pointer;
`;
export const Title = styled.div`
  .header {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const UsdVal = styled.span`
  overflow-wrap: anywhere;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  position: absolute;
  bottom: -23px;
  left: 15px;
`;

export const Message = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 80%;
  border-radius: ${({ theme }) => `${theme.borderRadius}`};
  min-height: 248px;
  text-align: center;
  background: ${({ theme }) => `${theme.dialog}`};
  display: flex;
  justify-content: center;
`;
export const MTitle = styled.h2`
  font-size: 18px;
`;
