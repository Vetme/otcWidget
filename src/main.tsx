// import ReactDOM from "react-dom/client";
import Widget from "./components/Widget";

import { init, useWallets, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";

const injected = injectedModule();

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://rpc.ankr.com/eth",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://rpc.ankr.com/polygon",
    },
  ],
});

const App = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  let ethersProvider: any;

  if (wallet) {
    // ethersProvider = new ethers.BrowserProvider(wallet.provider);
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
  }

  const [chainId, setChainId] = useState(1);

  console.log(chainId);

  useEffect(() => {
    ethersProvider?.getNetwork().then((res: any) => setChainId(res.chainId));
  }, [ethersProvider]);

  const connectedWallets = useWallets();

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }: any) => label
    );
    if (typeof window !== "undefined")
      window.localStorage.setItem(
        "connectedWallets",
        JSON.stringify(connectedWalletsLabelArray)
      );
  }, [connectedWallets, wallet]);
  // change
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets") || "[]"
    );

    if (previouslyConnectedWallets?.length) {
      // eslint-disable-next-line no-inner-declarations
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  // const defaultTokenOut: { [chainId: number]: string } = {
  //   1: "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
  //   137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //   56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  //   43114: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  //   250: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
  //   25: "0x66e428c3f67a68878562e79A0234c1F83c208770",
  //   42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  //   199: "0x9B5F27f6ea9bBD753ce3793a07CbA3C74644330d",
  //   106: "0x01445C31581c354b7338AC35693AB2001B50b9aE",
  //   1313161554: "0x4988a896b1227218e4a686fde5eabdcabd91571f",
  //   42262: "0x6Cb9750a92643382e020eA9a170AbB83Df05F30B",
  //   10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  // };

  return (
    <div className="App">
      {/* client="viet-nv" tokenList={[]} provider={ethersProvider} defaultTokenOut={defaultTokenOut[chainId]} */}
      <div className="card">
        <button onClick={() => (wallet ? disconnect(wallet) : connect())}>
          {!wallet ? "connect wallet" : "disconnect"}
        </button>
      </div>
      <Widget
        defaultTokenName="Cool"
        client="vetMe"
        provider={ethersProvider}
      />
    </div>
  );
};

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <App />
// );

const root = document.getElementById("root"); // <- This is the correct method call for React version 17
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);
