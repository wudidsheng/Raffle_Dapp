import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { EIP1193Provider, EIP6963AnnounceProviderEvent } from "./types";
import { throttle } from "lodash";
import { Loading } from "../common/Loading";

declare global {
  // 添加自定义钱包广播事件
  interface WindowEventMap {
    "eip6963:announceProvider": EIP6963AnnounceProviderEvent;
  }
}

function decimalToHex(num: number, length = 2) {
  return num.toString(16).padStart(length, "0").toUpperCase();
}

export function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [WalletList, setWalletList] = useState<
    EIP6963AnnounceProviderEvent["detail"][]
  >([]);

  useEffect(() => {
    const handleProviderAnnounce = (event: EIP6963AnnounceProviderEvent) => {
      console.log("dsadsadsa", event);
      // event.detail
      setWalletList((prev) => {
        const hasWallet = prev?.find(
          (item) => item.info.uuid === event.detail.info.uuid
        );
        if (hasWallet) {
          return prev;
        }
        const newWallet = [...prev, event.detail];
        return newWallet;
      });
      setShow(true);
    };
    //显示所有钱包
    window.addEventListener("eip6963:announceProvider", handleProviderAnnounce);
    //移除事件避免重复渲染
    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleProviderAnnounce
      );
    };
  }, []);

  const requestAllWallet = useCallback(() => {
    // 触发钱包链接请求
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }, []);

  const connectWallet = useCallback(
    (providerDetail: EIP6963AnnounceProviderEvent["detail"]) => {
      const provider = providerDetail.provider;
      setLoading(true);

      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts: any) => {
          console.log("Connected to:", accounts[0]);
          //  切换到sepolia
          switchSepolia(provider);
          setShow(false);
        })
        .catch((error) => console.error("Connection error:", error))
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const walletListElement = useMemo(() => {
    return WalletList?.map((item) => {
      return (
        <div
          key={item.info.uuid}
          onClick={() => connectWallet(item)}
          className="flex group  gap-2 m-4 justify-center cursor-pointer w-auto  hover:text-blue-400 items-center"
        >
          <img
            className="w-[28px] h-[28px]"
            src={item.info.icon}
            alt={item.info.icon}
          />
          <h3 className="text-white text-xl group-hover:text-blue-500">
            {item.info.name}
          </h3>
        </div>
      );
    });
  }, [WalletList, connectWallet]);

  const switchSepolia = useCallback(async (provider: EIP1193Provider) => {
    const chainId = await provider.request({
      method: "eth_chainId",
      params: [],
    });
    if (`${chainId}` !== `${11155111}`) {
      // 切换到sepolia
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${decimalToHex(11155111)}` }],
      });
    }
  }, []);
  return (
    <>
      <Loading show={loading} />
      <div
        id="modal"
        className={`duration-300 ease-out fixed top-1/2 left-1/2 translate-y-[-50%] rounded-xl translate-x-[-50%] inset-0 w-xs overflow-auto max-h-[200px] bg-gray-900  z-51 ${
          show ? "" : "hidden"
        }`}
      >
        {walletListElement}
      </div>
      <button
        className="w-21 h-7 cursor-pointer text-[16px]  text-center font-[600] text-white bg-[#3898ff] rounded-xl"
        onClick={throttle(requestAllWallet, 3000)}
      >
        连接钱包
      </button>
      ;
    </>
  );
}
