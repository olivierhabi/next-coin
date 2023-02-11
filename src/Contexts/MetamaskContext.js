import React, { createContext } from "react";

export const MetamaskContext = createContext({
  checkConnection: () => {},
  connectWeb3: () => {},
});
