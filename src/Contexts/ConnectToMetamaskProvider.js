import React, { useState } from "react";
import Web3 from "web3";
import { MetamaskContext } from "./MetamaskContext";

const ConnectToMetamaskProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);

  const [haveMetamask, sethaveMetamask] = useState(true);
  const [client, setclient] = useState({
    isConnected: false,
  });

  const [wallet, setWallet] = useState(null);

  return (
    <MetamaskContext.Provider
      value={{
        isConnected,
        address,
        client,
        haveMetamask,
        setWallet,
        wallet,
        setclient,
        setIsConnected,
        setAddress,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export default ConnectToMetamaskProvider;
