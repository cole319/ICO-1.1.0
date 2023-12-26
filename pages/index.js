import { useEffect, useState } from "react";
import { ethers } from "ethers";
// import "./App.css";
import dotenv from "dotenv";
dotenv.config();

import { CiMoneyBill } from "react-icons/ci";

// import artifact from "./artifacts/contracts/BridgeCoinSale.sol/BridgeCoinSale.json";
import artifact from "../artifacts/contracts/BridgeCoinSale.sol/BridgeCoinSale.json";
const CONTRACT_ADDRESS = "0x669e629Df706BA32C6aB53f1EA7fb2DD51B517d1";

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [signerAddress, setSignerAddress] = useState();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const contract = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi,
        provider
      );
      setContract(contract);
    };
    onLoad();
  }, []);

  const isConnected = () => signer !== undefined;

  const connect = () => {
    getSigner(provider).then((signer) => {
      setSigner(signer);
    });
  };

  const getSigner = async (provider) => {
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const signer = provider.getSigner();

    signer.getAddress().then((address) => {
      setSignerAddress(address);
    });

    return signer;
  };

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
            <button onClick={connect} className="btn btn-primary">
              Connect Metamask
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
