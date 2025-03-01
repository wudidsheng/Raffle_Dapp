import  { useCallback, useEffect, useState } from "react";
import { ConnectWallet } from "../components/wallet/ConnectWallet";
import { Loading } from "../components/common/Loading";
import { AccountInfo } from "../components/wallet/AccountInfo";
import { PlayHelp } from "../components/Help/Index";

export function Heard() {
  const [isConnect, setIsConnect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const checkWalletConnect = useCallback(() => {
    setLoading(true);
    // @ts-ignore
    window?.ethereum
      ?.request({ method: "eth_accounts" })
      .then((accounts: any) => {
        console.log(accounts);
        if (accounts.length) {
          setAccounts(accounts);
          setIsConnect(true);
        }
      })
      .catch((error: any) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    checkWalletConnect();
    listenForWalletStatus();
  }, []);

  const listenForWalletStatus = () => {
    // 监听钱包连接
    // @ts-ignore
    window?.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length) {
        setAccounts(accounts);
        setIsConnect(true);
      } else {
        setAccounts([]);
        setIsConnect(false);
      }
    });
  };

  return (
    <div className="flex h-16 items-center gap-2.5 justify-end mr-[3%] ml-[10%]">
      <PlayHelp />
      {!isConnect && !loading ? (
        <ConnectWallet />
      ) : (
        <AccountInfo accounts={accounts} />
      )}
      <Loading show={loading} />
    </div>
  );
}
