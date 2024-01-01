import { useEffect, useState } from "react";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

import { SiEthereum } from "react-icons/si";

import artifact from "../artifacts/contracts/BridgeCoinSale.sol/BridgeCoinSale.json";
const CONTRACT_ADDRESS = "0x669e629Df706BA32C6aB53f1EA7fb2DD51B517d1";

function App() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    getConnectedWalletAddress();
    addWalletListener();
  }, [signerAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          artifact.abi,
          provider
        );

        setContract(contract);
        /* set active wallet address */
        setSignerAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getConnectedWalletAddress = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */

          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            artifact.abi,
            provider
          );

          setContract(contract);
          /* set active wallet address */
          setSignerAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setSignerAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setSignerAddress("");
      console.log("Please install MetaMask");
    }
  };

  const isConnected = () => signer !== undefined;

  const toWei = (ether) => ethers.utils.parseEther(ether);

  const buyTokens = async () => {
    try {
      const wei = toWei(amount);
      await contract.connect(signer).buyTokens(signerAddress, { value: wei });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-800 via-[#060417] to-[#060417] min-h-screen">
      {isConnected() ? (
        <div className="flex flex-col place-items-center pt-40 space-y-4">
          <div className="flex space-x-4 items-center">
            <SiEthereum className="text-sky-500 w-12 h-12 animate-pulse" />
            <p className="font-semibold text-xl">
              <span className="bg-slate-600 rounded-l-sm p-2 font-semibold text-center">
                {" "}
                Connected to :{" "}
              </span>

              <span className="bg-neutral-200 text-neutral-800 px-3 py-2 rounded-r-sm">
                {signerAddress
                  ? signerAddress.slice(0, 6) +
                    "..." +
                    signerAddress.slice(
                      signerAddress.length - 6,
                      signerAddress.length
                    )
                  : "------"}
              </span>
            </p>
          </div>

          <div className="w-2/5 px-10 space-y-4 py-10">
            <div className="flex w-full">
              <div className="w-5/6">
                <input
                  className="w-full px-3 py-2 rounded-l-sm text-neutral-800 bg-neutral-50"
                  placeholder="Enter Amount Here... 0.0"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="w-1/6 text-center bg-slate-600 rounded-r-sm p-2 font-semibold">
                BGC
              </div>
            </div>

            <div className="w-full">
              <button
                className="w-full bg-sky-700 rounded-md p-2 font-semibold hover:bg-sky-600"
                onClick={() => buyTokens()}
              >
                Buy Coins
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col place-items-center pt-40 space-y-4">
          <h1 className="text-6xl font-medium text-neutral-300">
            Welcome to BGC Coin ICO
          </h1>
          <p className="pb-10 text-xl font-normal text-neutral-200">
            You are not connected. Please Connect Wallet to buy Coins
          </p>
          <button
            className="py-2 px-3 w-fit border-2 border-sky-700 bg-sky-700
             text-neutral-200 rounded-md font-semibold hover:bg-transparent "
            onClick={connectWallet}
          >
            Connect Metamask
          </button>
        </div>
      )}
      <div></div>
    </div>
  );
}

export default App;
