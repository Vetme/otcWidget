import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { BASE_URL, DEFAULT_TOKENS, TokenInfo } from "../constants";
import { useActiveWeb3 } from "./useWeb3Provider";

const TokenContext = createContext<{
  tokenList?: TokenInfo[];
  importedTokens: TokenInfo[];
  addToken: (token: TokenInfo) => void;
  removeToken: (token: TokenInfo) => void;
}>({
  tokenList: [],
  importedTokens: [],
  addToken: () => {
    //
  },
  removeToken: () => {
    //
  },
});

export const TokenListProvider = ({
  tokenList,
  children,
}: {
  tokenList?: TokenInfo[];
  children: ReactNode;
}) => {
  const { chainId } = useActiveWeb3();

  const [importedTokens, setImportedTokens] = useState<TokenInfo[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const localStorageTokens = JSON.parse(
          localStorage.getItem("importedTokens") || "[]"
        );

        return localStorageTokens;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const addToken = (token: TokenInfo) => {
    const newTokens = [
      ...importedTokens.filter((t) => t.address !== token.address),
      token,
    ];
    setImportedTokens(newTokens);
    if (typeof window !== "undefined")
      localStorage.setItem("importedTokens", JSON.stringify(newTokens));
  };

  const removeToken = (token: TokenInfo) => {
    const newTokens = importedTokens.filter(
      (t) =>
        t.address.toLowerCase() !== token.address.toLowerCase() &&
        t.chainId === token.chainId
    );

    setImportedTokens(newTokens);
    if (typeof window !== "undefined")
      localStorage.setItem("importedTokens", JSON.stringify(newTokens));
  };

  return (
    <TokenContext.Provider
      value={{
        tokenList: tokenList?.length ? tokenList : DEFAULT_TOKENS[chainId],
        importedTokens,
        addToken,
        removeToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const { tokenList, importedTokens } = useContext(TokenContext);
  const { chainId } = useActiveWeb3();

  return [
    ...importedTokens
      .filter((item) => item.chainId === chainId)
      .map((item) => ({ ...item, isImport: true })),
    ...(tokenList || []),
  ];
};

export const useImportedTokens = () => {
  const { addToken, removeToken, importedTokens } = useContext(TokenContext);

  return {
    addToken,
    removeToken,
    importedTokens,
  };
};

export const useTokenFetch = () => {
  const [loading, setStatus] = useState(false);
  const [query, setQuery] = useState("cool");
  const [data, setData] = useState<any[]>([]);
  const { chainId } = useActiveWeb3();

  useEffect(() => {
    if (query.length > 1) {
      setStatus(true);
      fetch(`${BASE_URL}/lists?s=${query}&chain=${chainId}`)
        .then((response) => {
          response.json().then((result) => {
            setData(result.listings);
          });
        })
        .catch((error: any) => {
          alert();
        })
        .finally(() => {
          setStatus(false);
        });
    }
  }, [query]);

  return { loading, data, query, setQuery };
};
