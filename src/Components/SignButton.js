import React, { useState, useEffect, useContext } from "react";
import { ethers, Wallet } from "ethers";
import { signMessage } from "../../utils/sign";
import { MetamaskContext } from "../Contexts/MetamaskContext";

const SignButton = () => {
  //   const { isConnected, client, haveMetamask, checkConnection, connectWeb3 } =
  //     useContext(MetamaskContext);

  //   const dataFetch = () => {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     try {
  //       signer.signMessage("Hello World").then((result) => {
  //         console.log(result);
  //       });
  //     } catch (error) {
  //       // handle error
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     checkConnection();
  //   }, []);

  return (
    <div>
      <button onClick={signMessage}>CLICK NOW !</button>
    </div>
  );
};

export default SignButton;
