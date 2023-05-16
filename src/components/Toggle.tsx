import styled from "styled-components";

interface IToggle {
  text?: string;
  name: string;
  checked?: boolean;
  onChange: (arg: any) => void;
}

const Label = styled.label`
  input {
    display: none;
  }
`;

const Wrapper = styled.span<{ checked?: boolean }>`
  height: 28px;
  width: 60px;
  background: ${({ theme, checked }) =>
    checked ? theme.active : theme.active};
  display: flex;
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
  padding: 2px;
`;
const Circle = styled.span<{ checked?: boolean }>`
  position: relative;
  display: block;
  height: 26px;
  width: 26px;
  border-radius: 100px;
  transition: 0.3s;
  background: ${({ theme, checked }) =>
    checked ? theme.interactive : theme.secondary};
  left: ${({ checked }) => (checked ? "33px" : "1px")};
`;

const Toggle = ({ text, name, checked, onChange }: IToggle) => {
  const displayStyle = checked ? "checked" : "";

  return (
    <>
      <Label>
        <Wrapper checked={checked}>
          <input
            type="checkbox"
            checked={checked}
            name={name}
            onChange={(e) => onChange(e)}
          />
          <Circle checked={checked} className={`${displayStyle} switch`}>
            <span className="switch-handle" />
          </Circle>
        </Wrapper>
        <span className="switch-label">{text}</span>
      </Label>
    </>
  );
};

export default Toggle;
