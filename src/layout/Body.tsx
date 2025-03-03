import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import { ABI, contractAddress } from "../assets/abi.ts";
import { JoinGame } from "../components/JoinGame/index.tsx";

export const Body: React.FC<any> = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const time = useRef<any>(null);
  const [allPlay, setAllPlay] = useState<number>(0);
  const [allBalance, setAllBalance] = useState<string>("");
  const [winNumber, setWinNumber] = useState<string[]>([]);
  const [status, setStatus] = useState<string>();
  const ref = useRef<ethers.Contract>(null);
  const JsonProvider = useRef<ethers.JsonRpcProvider>(null);

  useEffect(() => {
    time.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev >= 1) {
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
    return () => {
      clearInterval(time.current);
    };
  }, []);

  useLayoutEffect(() => {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
    );
    const contract = new ethers.Contract(contractAddress, ABI, provider);

    contract.on("JoinGame", async () => {
      const balance = await provider?.getBalance(contractAddress);
      setAllBalance(ethers.formatEther(balance!));
      setAllPlay((p) => p + 1);
    });
    ref.current = contract;
    JsonProvider.current = provider;
  }, []);

  //获取参与合约资金
  const getPalyUser = useCallback(async () => {
    const contract = ref.current;
    const provider = JsonProvider.current;
    const latestBlock = await provider?.getBlockNumber();
    const fromBlock = latestBlock! - 10000; // 查询最近 10000 个区块
    const toBlock = "latest";
    const events = await contract?.queryFilter("JoinGame", fromBlock, toBlock);
    const balance = await provider?.getBalance(contractAddress);
    const status = await contract?.status();
    setAllPlay(events!.length || 0);
    setAllBalance(ethers.formatEther(balance!));
    //上次时间
    const lastTime = await contract?.lastTime();
    const block = await provider?.getBlock("latest");
    //当前时间
    const nowTimestamp = block?.timestamp;

    if (`${status}` === `0`) {
      const newTime = 24 * 24 * 60 * 3 + Number(lastTime);
      const timesLeft = newTime - Number(nowTimestamp);
      setTimeLeft(timesLeft);
    } else {
      const newTime = 24 * 24 * 60 + Number(lastTime);
      const timesLeft = newTime - Number(nowTimestamp);
      setTimeLeft(timesLeft);
    }
    setStatus(() => {
      if (`${status}` === "0") {
        return "OPENING";
      }
      return "FINISHED";
    });
  }, []);

  // 获取开奖号码
  const getWinNumber = useCallback(async () => {
    const contract = ref.current;
    const winNumber = await contract?.getWinNumbers();

    setWinNumber([...winNumber] as unknown as string[]);
  }, []);

  useEffect(() => {
    getPalyUser();
    getWinNumber();
  }, []);

  const tipsText = useMemo(() => {
    if (status === "OPENING") {
      return (
        <h3 className="text-blue-300 text-2xl">Participation time countdown</h3>
      );
    } else {
      return (
        <h3 className="text-blue-300 text-2xl">
          Countdown to the next lottery number
        </h3>
      );
    }
  }, [status]);
  return (
    <div className="bg-[url(/bg.svg)] bg-no-repeat bg-[350px,100%] bg-[position:80%,25%] pb-[2%] pr-2.5 h-[320px]">
      <div className="text-white  pt-[2%] text-center flex justify-center gap-1.5 items-center">
        {tipsText}
        <span className="text-red-500 text-2xl"> {timeLeft}s</span>
      </div>
      <p className="text-white text-center">Winning Numbers</p>
      <div className="mr-[15%]  ml-[15%]  mb-[15px] pt-[1%] text-white flex items-center gap-1.5 justify-center">
        {winNumber.map((item, index) => (
          <div
            key={index}
            className="w-20 h-20 border-2 border-blue-700 text-3xl leading-20 text-white text-center align-middle"
          >{`${ethers.toBigInt(item) || "*"}`}</div>
        ))}
      </div>
      <div className="text-center text-white">
        <JoinGame open={`${status}` === "OPENING"} />
      </div>

      <div className="mr-[15%] ml-[15%] pt-[1%] mb-[15px]">
        <div className="text-left text-blue-400 text-5xl">Win Big Prizes </div>
        <p className="text-left   text-blue-600 text-[12px]">Pick 3 numbers</p>
      </div>
      <div className="bg-white mt-1.5 mr-[15%] ml-[15%] rounded-2xl">
        <div className="h-10 flex items-center justify-between w-full pr-3 pl-3">
          <div className="flex gap-1.5 items-center">
            <img className="w-5 h-5" src="/user.svg" alt="user" />
            <p className="text-gray-600">{allPlay}</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <img className="w-5 h-5" src="/ETH.svg" alt="eth" />
            <p className="text-gray-600 ">{allBalance}ETH</p>
          </div>
          <div className="flex  gap-1.5 items-center">
            <img className="w-5 h-5" src="/status.svg" alt="status" />
            <p className="text-gray-600">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
