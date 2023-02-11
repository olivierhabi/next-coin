import "../styles/globals.css";
import ConnectToMetamaskProvider from "../src/Contexts/ConnectToMetamaskProvider";

function MyApp({ Component, pageProps }) {
  return (
    <ConnectToMetamaskProvider>
      <Component {...pageProps} />
    </ConnectToMetamaskProvider>
  );
}

export default MyApp;
