import { useState, useEffect, useContext } from "react";
import Metamask from "./metamask";
import { MetamaskContext } from "../Contexts/MetamaskContext";
import { provider } from "../../utils/Contract";
import { ethers, Wallet } from "ethers";

const ConnectToMetamask = () => {
  const {
    isConnected,
    client,
    haveMetamask,
    checkConnection,
    setWallet,
    wallet,
    setclient,
    connectWeb3,
    setIsConnected,
    setAddress,
  } = useContext(MetamaskContext);

  const [privateKey, sePrivateKey] = useState("");
  const [connectMessage, setConnectMessage] = useState();
  const [connectLoading, setConnectLoading] = useState(false);

  const connectWallet = () => {
    setConnectMessage("");
    if (!privateKey)
      return setConnectMessage("Please paste your wallet privatekey");
    setConnectLoading(true);
    try {
      const wallet = new ethers.Wallet(`0x${privateKey}`, provider);
      setWallet(wallet);
      setIsConnected(true);
      setAddress(wallet?.address);
      console.log(wallet);
      setConnectLoading(false);
    } catch (error) {
      setConnectLoading(false);
      console.log(error);
      return setConnectMessage("Please use correct wallet privatekey");
    }
  };

  return (
    <div>
      <div>
        <div>
          <div className="space-x-3">
            <input
              placeholder="Your account Privatekey"
              className="px-3 bg-gray-200 w-[400px] h-[40px] rounded-md border border-2px border-gray-900"
              value={privateKey}
              onChange={(e) => sePrivateKey(e.target.value)}
            />
            <button
              onClick={connectWallet}
              className="h-[40px] w-[200px] bg-gray-800 text-white rounded-md"
            >
              {!connectLoading ? (
                <div>Connect your Wallet</div>
              ) : (
                <div className="flex justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </button>
          </div>
          <div className="text-[12px] px-2 pt-2">
            {connectMessage && connectMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectToMetamask;
