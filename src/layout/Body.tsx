import React, { useEffect } from "react";
import { ethers } from "ethers";
import { ABI, contractAddress } from "../assets/abi";

export const Body: React.FC<any> = () => {
  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(
      "https://shape-sepolia.g.alchemy.com/v2/08qD2KkgPPCneY_2XVygsdVq8H8NbdKx"
    );

    const contract = new ethers.Contract(contractAddress, ABI, provider);

    console.log(contract, "==");
    contract
      .status()
      .then((res) => {
        console.log(`${res}`);
      })
      .catch((error) => {
        console.log(error, "err");
      });
  }, []);
  return (
    <div className="bg-[url(/bg.svg)] bg-no-repeat bg-[300px,100%] bg-right-top pb-[2%] pr-2.5 h-[300px]">
      <div className="mr-[15%] ml-[15%] pt-[15%] mb-[15px]">
        <div className="text-left text-blue-400 text-2xl">Win Big Prizes </div>
        <p className="text-left   text-blue-600 text-[12px]">Pick 3 numbers</p>
      </div>
      <div className="bg-white mt-1.5 mr-[15%] ml-[15%] rounded-2xl">
        <div className="h-10 flex items-center justify-between w-full pr-3 pl-3">
          <div className="flex gap-1.5 items-center">
            <img className="w-5 h-5" src="/user.svg" alt="user" />
            <p className="text-gray-600">1344</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <img className="w-5 h-5" src="/ETH.svg" alt="eth" />
            <p className="text-gray-600 ">1231231 eth</p>
          </div>
          <div className="flex  gap-1.5 items-center">
            <img className="w-5 h-5" src="/status.svg" alt="status" />
            <p className="text-gray-600">pengidng</p>
          </div>
        </div>
      </div>
    </div>
  );
};
