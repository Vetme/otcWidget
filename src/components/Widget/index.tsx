import { StrictMode, useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import useTheme from "../../hooks/useTheme";
import { defaultTheme, Theme } from "../../theme";
import { useActiveWeb3, Web3Provider } from "../../hooks/useWeb3Provider";
import SwapWidget from "./SwapWidget";
import ListWidget from "./ListWidget";
import { ActionSwitch, SwitchItem, Wrapper, WBody } from "../styles";
import { ActiveTab } from "../../types";
import { TokenListProvider } from "../../hooks/useTokens";
import { TokenInfo } from "../../constants";

interface WidgetI {
  client: string;
  provider?: any;
  tokenList?: TokenInfo[];
  theme?: Theme;
  defaultTokenIn?: string;
  defaultTokenOut?: string;
}

const MainWidget = ({ client, theme, provider, tokenList }: WidgetI) => {
  const [active, setActive] = useState<ActiveTab>(ActiveTab.List);

  return (
    <StrictMode>
      <ThemeProvider theme={theme || defaultTheme}>
        <Web3Provider provider={provider}>
          <TokenListProvider tokenList={tokenList}>
            {/* <Widget
              defaultTokenIn={defaultTokenIn}
              defaultTokenOut={defaultTokenOut}
              feeSetting={feeSetting}
              client={client}
            /> */}

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
                {active === ActiveTab.Swap && <SwapWidget client={client} />}
              </WBody>
            </Wrapper>
          </TokenListProvider>
        </Web3Provider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default MainWidget;
