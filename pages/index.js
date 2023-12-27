import { useEffect, useState } from "react";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

import { CiMoneyBill } from "react-icons/ci";

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
    const wei = toWei(amount);
    await contract.connect(signer).buyTokens(signerAddress, { value: wei });
  };

  return (
    <div className="App">
      <header className="App-header">
        {isConnected() ? (
          <div>
            <p>Welcome {signerAddress?.substring(0, 10)}...</p>
            <div className="list-group">
              <div className="list-group-item">
                <div className="row py-3">
                  <div className="col-md-2">
                    <CiMoneyBill
                      className="rounded-circle"
                      width="36"
                      height="36"
                    />
                  </div>

                  <div className="col-md-5">
                    <input
                      className="inputField"
                      placeholder="0.0"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-4 col-md-3">RXC</div>

                  <div className="d-flex gap-4 col-md-2">
                    <button class="btn btn-success" onClick={() => buyTokens()}>
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>You are not connected</p>
            <button onClick={connectWallet} className="btn btn-primary">
              Connect Metamask
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
