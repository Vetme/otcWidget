import styled from "styled-components";

export const Button = styled.button.attrs((props) => ({
  className: props.className,
}))<{ disabled?: boolean; bg?: string }>`
  outline: none;
  border: 1px solid
    ${({ theme, disabled }) => (disabled ? "transparent" : theme.stroke)};
  border-radius: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  padding: 9px 26px;
  white-space: nowrap;
  height: 40px;
  border-radius: 100px;
  /* identical to box height */
  font-size: 14px;
  letter-spacing: 0.03em;
  transition: 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.activeText};
  background: ${({ theme }) => theme.active};

  &.block {
    width: 100%;
    flex: 1;
    border-radius: 8px;
  }

  &.interactive {
    background: ${({ theme }) => theme.interactive};
    border: 1px solid ${({ theme }) => theme.interactive};
  }

  &:hover,
  &:target,
  &:active {
    background: ${({ theme, disabled }) =>
      disabled ? theme.active : theme.activeHover};
    border: 1px solid
      ${({ theme, disabled }) => (disabled ? "none" : theme.stroke)};
  }
`;
