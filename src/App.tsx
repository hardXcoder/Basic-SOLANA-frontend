import "./App.css";
import { useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import Home from "./Home";
import Footer from "./Footer";
import Navbar from "./Navbar";
// import QueenDisplay from "./QueenDisplay";
// import Roadmap2 from "./Roadmap2";

// import Team from "./Team";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";

import { ThemeProvider, createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

const getProgramId = (): anchor.web3.PublicKey | undefined => {
  try {
    const programId = new anchor.web3.PublicKey(
      process.env.REACT_APP_PROGRAM_ID!
    );
    console.log("I am in getprogramID function : " + programId);

    return programId;
  } catch (e) {
    console.log("Failed to construct PROGRAMID", e);
    return undefined;
  }
};

const programId = getProgramId();
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeoutInMilliseconds = 30000;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <div className="backgroundPaper">
              <Navbar />
              <Home
                programId={programId}
                connection={connection}
                txTimeout={txTimeoutInMilliseconds}
                rpcHost={rpcHost}
              />

              <Footer />
            </div>
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
