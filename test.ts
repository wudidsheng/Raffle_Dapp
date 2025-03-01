import { ethers } from "ethers";
import { ABI, contractAddress } from "./src/assets/abi";
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