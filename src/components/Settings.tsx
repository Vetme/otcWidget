import styled from "styled-components";
import { Flex, Spacer, Text } from "./styles";
import Toggle from "./Toggle";

const Container = styled.div``;
const Inner = styled.div`
  padding: 16px;
`;

export const Wrapper = styled.div``;
export const IWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  div:first-child {
    width: 383px;
  }
`;

interface ISetting {
  handleClose: () => void;
  setForm: (arg: any) => void;
  form: any;
}

const Settings = ({ handleClose, setForm, form }: ISetting) => {
  const handleSetting = (e: any) => {
    const name = e.target.name;

    setForm((prevState: any) => {
      return {
        ...prevState,
        [name]: !prevState[name],
      };
    });
  };

  return (
    <>
      <Container onClick={handleClose}>
        <Inner onClick={(e) => e.stopPropagation()}>
          <Wrapper>
            <Flex justify="space-between">
              <Text size="h4" weight="450" color=" #170728">
                Sell coin in fractions
              </Text>

              <Toggle
                checked={form.is_friction}
                onChange={handleSetting}
                name="is_friction"
              />
            </Flex>
            <Spacer height={20} />
            <Flex justify="space-between">
              <Text size="h4" weight="450" color=" #170728">
                List privately?
              </Text>

              <Toggle
                checked={form.is_private}
                onChange={handleSetting}
                name="is_private"
              />
            </Flex>
            <Spacer height={16} />
          </Wrapper>
        </Inner>
      </Container>
    </>
  );
};

export default Settings;
