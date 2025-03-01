import React, { useCallback, useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

const getCryptoUint = (chainId: string) => {
  const defaultUint = {
    "1": "ETH",
    "56": "BNB",
    "11155111": "ETH",
  };
  // @ts-ignore
  const uint = defaultUint[`${chainId}`];

  if (!uint) {
    return "ETH";
  }
  return uint;
};

const truncateMiddle = (str: string, startLength = 6, endLength = 4) => {
  if (!str || str.length <= startLength + endLength) return str;
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
};
export function AccountInfo({ accounts }: { accounts: string[] }) {
  const [balance, setBalance] = useState<string>();

  const getUserBalance = useCallback(async () => {
    // @ts-ignore
    const browserProvider = new BrowserProvider(window?.ethereum);
    const balance = await browserProvider.getBalance(accounts[0]);
    const newWork = await browserProvider.getNetwork();

    setBalance(
      `${formatEther(balance)} ${getCryptoUint(`${newWork.chainId}`)}`
    );
  }, [accounts]);

  //监听网络变化
  const checkNetwork = useCallback(() => {
    // @ts-ignore
    // Or window.ethereum if you don't support EIP-6963
    window?.ethereum.on("chainChanged", (chainId) => {
      getUserBalance();
    });
  }, [getUserBalance]);

  useEffect(() => {
    if (!accounts.length) return;
    getUserBalance();
    checkNetwork();
  }, [accounts]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(accounts[0])
      .then(() => alert("copy ok"))
      .catch((err) => alert("copy error" + err));
  }, [accounts]);

  //断开连接
  const disConnect = useCallback(() => {
    // @ts-ignore
    window?.ethereum?.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  }, []);
  return (
    <div className="flex gap-2">
      <div className="text-white rounded-xl text-center leading-5 h-5 pl-1 pr-1 text-xs bg-[#1A1B1F] w-[130px] text-ellipsis overflow-hidden text-nowrap">
        {truncateMiddle(`${balance}`, 10, 5)}
      </div>
      <div
        onClick={copyToClipboard}
        className="text-white rounded-xl cursor-pointer text-center h-5 leading-5  pl-1 pr-1 text-xs bg-[#1A1B1F] w-[130px] text-ellipsis overflow-hidden text-nowrap"
      >
        {truncateMiddle(`${accounts}`, 10, 5)}
      </div>
      <div
        onClick={disConnect}
        className="text-white rounded-xl cursor-pointer text-center h-5 leading-5  pl-1 pr-1 text-xs bg-[#1A1B1F] w-[60px] text-ellipsis overflow-hidden text-nowrap"
      >
        断开连接
      </div>
    </div>
  );
}
