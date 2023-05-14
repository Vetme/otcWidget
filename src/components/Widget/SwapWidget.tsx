import { useState, ChangeEvent } from "react";
import TokenSelect, { InputWrapper, ResultCon } from "../TokenSelect";
import { ChevronLeft, LSearch } from "../icons";
import {
  Back,
  ContentWrapper,
  InputCon,
  ModalHeader,
  ModalWrapper,
  Spacer,
  SwapContainer,
  Text,
  Title,
} from "../styles";
import { useTokenFetch } from "../../hooks/useTokens";
import ListCard from "../ListCard";
import { IList, ModalType, TokenI, TradeType } from "../../types";
import { useActiveWeb3 } from "../../hooks/useWeb3Provider";
import TokenSwap from "../TokenSwap";

const SwapWidget = ({ client }: { client?: string }) => {
  const { loading, data, setQuery, query } = useTokenFetch();
  const [showModal, setShowModal] = useState<ModalType | null>(null);
  const [selectedTrade, setTrade] = useState<IList | undefined>(undefined);

  // const { chainId, account } = useActiveWeb3();

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }

  const modalTitle = (() => {
    switch (showModal) {
      case ModalType.TOKEN_SWAP:
        return "Trade Swap";
      case ModalType.LOADING:
        return "Loading";
      case ModalType.TOKEN_SELECT:
        return "Select an asset";
      default:
        return null;
    }
  })();

  const handleSelected = (t: any) => {
    console.log(t);
  };

  const handleTrade = (type: TradeType, list: IList) => {
    if (type == TradeType.Swap) {
      setTrade(list);
      setShowModal(ModalType.TOKEN_SWAP);
    }
  };

  const modalContent = (() => {
    switch (showModal) {
      case ModalType.TOKEN_SWAP:
        return (
          <TokenSwap
            close={() => setShowModal(null)}
            trade={selectedTrade}
            client={client}
          />
        );
      case ModalType.LOADING:
        return <div>Loading</div>;
      default:
        return null;
    }
  })();

  return (
    <SwapContainer>
      <InputCon>
        <InputWrapper>
          <LSearch />
          <input
            placeholder="Type a name or address"
            value={query}
            type="text"
            onChange={handleSearch}
          />
        </InputWrapper>

        <Spacer height={15} />

        <ResultCon>
          {loading && <div>Loading..</div>}
          {data.length < 1 ? (
            query.length ? (
              <Text>No Result Found</Text>
            ) : (
              <Text>Search for OTC Listed Token</Text>
            )
          ) : (
            <>
              {data.map((list: IList, i) => (
                <ListCard
                  list={list}
                  key={i}
                  callback={(type) => handleTrade(type, list)}
                />
              ))}
            </>
          )}
        </ResultCon>
      </InputCon>

      <ModalWrapper className={showModal ? "open" : "close"}>
        <ContentWrapper>
          <ModalHeader>
            <Back onClick={() => setShowModal(null)}>
              <ChevronLeft />
            </Back>
            <Title>
              <Text className="header" weight="400" size="s3" uppercase>
                {modalTitle}
              </Text>
            </Title>
          </ModalHeader>
        </ContentWrapper>

        {modalContent}
        {/* <PoweredBy style={{ marginTop: "0" }}>
          Powered By
          <KyberSwapLogo />
        </PoweredBy> */}
      </ModalWrapper>
    </SwapContainer>
  );
};

export default SwapWidget;
