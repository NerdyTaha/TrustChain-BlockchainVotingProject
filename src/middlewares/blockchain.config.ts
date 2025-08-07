import { ethers } from "ethers";
import ElectionSystem from "../../build/contracts/ElectionSystem.json";

const CONTRACT_ABI: any[] = ElectionSystem.abi;
const CONTRACT_ADDRESS: string | undefined =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("Contract address is not set in environment variables.");
}
export const getContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "Ethereum provider not available. Make sure MetaMask is installed."
    );
  }
  const url = process.env.NEXT_PUBLIC_RPC_URL;
  const provider = new ethers.JsonRpcProvider(url);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const initBlockchain = async (): Promise<void> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "Ethereum provider not available. Make sure MetaMask is installed."
    );
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  console.log(accounts);
  console.log("Blockchain initialized");
};
