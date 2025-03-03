import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import { ABI, contractAddress } from "../assets/abi.ts";

function shortenText(text: string, start = 4, end = 4) {
  if (text.length <= start + end) return text;
  return text.slice(0, start) + "..." + text.slice(-end);
}

export function Footer() {
  const [events, setEvents] = useState<any[]>([]);
  const ref = useRef<ethers.Contract>(null);
  const JsonProvider = useRef<ethers.JsonRpcProvider>(null);

  useLayoutEffect(() => {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
    );

    const contract = new ethers.Contract(contractAddress, ABI, provider);
    ref.current = contract;
    JsonProvider.current = provider;
    contract?.on("JoinGame", (_events) => {
      queryAllEvent();
    });
  }, []);

  const queryAllEvent = useCallback(async () => {
    const provider = JsonProvider.current;
    const contract = ref.current;
    const latestBlock = await provider?.getBlockNumber();
    const fromBlock = latestBlock! - 10000; // 查询最近 10000 个区块
    const toBlock = "latest";
    const events = await contract?.queryFilter("JoinGame", fromBlock, toBlock);
    setEvents(events!);
  }, []);

  useEffect(() => {
    queryAllEvent();
  }, []);
  return (
    <div className="mt-36 min-w-120 w-fit pr-2 pl-2  pt-0.5 pb-0.5 ml-[50%] translate-x-[-50%] overflow-hidden  text-white h-24 text-center border-2 border-blue-300">
        <h3 className="text-white">activity</h3>
      {events.map((item, index) => {
        return (
          <p key={index} className="mt-1 h-5 truncate">
            {shortenText(item.args["user"])} Join the Game
          </p>
        );
      })}
    </div>
  );
}
