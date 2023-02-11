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
          <div className="flex flex-col justify-center pt-[100px]">
            <div>{!isConnected ? <ConnectToMetamask /> : <TokenData />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
