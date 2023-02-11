import { useState, useEffect, useContext } from "react";
import TokenData from "../src/Components/TokenData";
import ConnectToMetamask from "../src/Components/ConnectToMetamask";
import { MetamaskContext } from "../src/Contexts/MetamaskContext";
import SignButton from "../src/Components/SignButton";

const Index = () => {
  const { isConnected, client, haveMetamask, checkConnection, connectWeb3 } =
    useContext(MetamaskContext);

  return (
    <div>
      <div>
        <div className="flex justify-center">
          <div className="flex flex-col min-w-[800px]">
            <div className="flex flex-col justify-center pt-[100px]">
              <div>{!isConnected ? <ConnectToMetamask /> : <TokenData />}</div>
            </div>
            <div>
              <div className="pt-[70px]">
                Use the following wallet privatekey demo purpose:
                <p>1. 3883353606dab14aaf86b170527455e3fbd957785c5f951e48ba015959d1094b</p>
                <p>2. f73adeaa281ec77672ce8c8c76ebc49546b34a6dda39ea65cc26bab93f0d31b2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
