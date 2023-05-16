import { StrictMode, useState } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, Theme } from "../../theme";
import { Web3Provider } from "../../hooks/useWeb3Provider";
import SwapWidget from "./SwapWidget";
import ListWidget from "./ListWidget";
import { ActionSwitch, SwitchItem, Wrapper, WBody, PoweredBy } from "../styles";
import { ActiveTab } from "../../types";
import { TokenListProvider } from "../../hooks/useTokens";
import { TokenInfo } from "../../constants";
import { VetMeLogoSVG } from "../icons";

interface WidgetI {
  client: string;
  provider?: any;
  tokenList?: TokenInfo[];
  theme?: Theme;
  defaultTokenIn?: string;
  defaultTokenOut?: string;
  defaultTokenName?: string;
}

const MainWidget = ({
  client,
  theme,
  provider,
  tokenList,
  defaultTokenName,
}: WidgetI) => {
  const [active, setActive] = useState<ActiveTab>(ActiveTab.List);

  return (
    <StrictMode>
      <ThemeProvider theme={theme || defaultTheme}>
        <Web3Provider provider={provider}>
          <TokenListProvider tokenList={tokenList}>
            <Wrapper>
              <ActionSwitch className="list" style={{ margin: "auto" }}>
                <SwitchItem
                  onClick={() => setActive(ActiveTab.List)}
                  className={active == ActiveTab.List ? "active" : ""}
                >
                  List
                </SwitchItem>
                <SwitchItem
                  onClick={() => setActive(ActiveTab.Swap)}
                  className={active == ActiveTab.Swap ? "active" : ""}
                >
                  Swap
                </SwitchItem>
              </ActionSwitch>

              <WBody>
                {active === ActiveTab.List && <ListWidget client={client} />}
                {active === ActiveTab.Swap && (
                  <SwapWidget
                    client={client}
                    defaultTokenName={defaultTokenName}
                  />
                )}
              </WBody>

              <PoweredBy style={{ marginTop: "0" }}>
                Powered By
                <VetMeLogoSVG />
              </PoweredBy>
            </Wrapper>
          </TokenListProvider>
        </Web3Provider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default MainWidget;
