import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import Button from "react-bootstrap/Button";

import styled from "styled-components";
import { Container, Snackbar } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  TweetProgramAccount,
  PROGRAM_ID,
  TweetProgramState,
  Tweet,
  getTweetCount,
  sendTweet,
  getTweetProgramState,
} from "./program-functions";
import twitterGif from "./twitter.gif";

import { AlertState } from "./utils";
import { Header } from "./Header";
import { MintButton } from "./MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #b38728 0%, #fbf5b7 100%);

  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  programId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [numberOfTweets, setNumberOfTweets] = useState(0);
  const [tweetProgram, setTweetProgram] = useState<TweetProgramAccount>();
  const [tweetContent, setTweetContent] = useState("");
  const [tweetTopic, setTweetTopic] = useState("");
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  var tweet = {
    topic: "Empty topic",
    content: "Empty Content",
  };

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    console.log("I am here in refresh machine");
    if (!anchorWallet) {
      return;
    }

    console.log("I am here in  code");

    if (props.programId) {
      try {
        const cndy = await getTweetProgramState(
          anchorWallet,
          props.programId,
          props.connection
        );
        setTweetProgram(cndy);
        console.log("cndy is :" + cndy);

        const tweetsNum = await getTweetCount(cndy);
        setNumberOfTweets(tweetsNum);
        console.log("Total number of Tweets are :" + tweetsNum);
      } catch (e) {
        console.log("There was a problem fetching Tweet program state");
        console.log(e);
      }
    }
  }, [anchorWallet, props.programId, props.connection]);

  const onSendTweet = async () => {
    try {
      console.log(
        "I am in sendTweet function " +
          wallet.connected +
          " : " +
          tweetProgram?.program +
          " : " +
          wallet.publicKey
      );

      setIsUserMinting(true);
      document.getElementById("#identity")?.click();

      if (wallet.connected && tweetProgram?.program && wallet.publicKey) {
        const mintTxId = (await sendTweet(tweetProgram, wallet.publicKey))[0];
        console.log("The tx id is :" + mintTxId);

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.programId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <div className="mainHomeBlock">
      <div className="experimental50">
        <div className=" mainComponentFrame">
          <img alt=" " className="mainSolqueenGif" src={twitterGif} />
        </div>

        <div className="combinedIntroAndBuy">
          <div className="introContent">
            <h1 className="celebrate gradText">SolanaTwitter</h1>
            <p>
              <b className="celebrate">
                <i>
                  {" "}
                  <h4 className="celebrate"> Let's roll the luck ! </h4>
                </i>{" "}
              </b>
              <br></br>
            </p>
            {/* 
            <Container>
              <Container maxWidth="xs" style={{ position: "relative" }}>
                <Paper
                  style={{
                    padding: 24,
                    backgroundColor: "#1C1B1A",
                    borderRadius: 6,
                  }}
                >
                  {!wallet.connected ? (
                    <ConnectButton className="gradientClass">
                      Connect Wallet
                    </ConnectButton>
                  ) : (
                    <>
                      <Header tweetProgram={tweetProgram} />

                      <MintButton
                        tweetProgram={tweetProgram}
                        onSendTweet={onSendTweet}
                        isMinting={isUserMinting}
                      />
                    </>
                  )}
                </Paper>
              </Container>

              <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({ ...alertState, open: false })}
              >
                <Alert
                  onClose={() => setAlertState({ ...alertState, open: false })}
                  severity={alertState.severity}
                >
                  {alertState.message}
                </Alert>
              </Snackbar>
            </Container> */}

            <Button onClick={onSendTweet}>Send tweet</Button>

            {/* <h4 className="celebrate">Find as many accessories for your Queen</h4> */}

            <h4 className="gradText">Tweet Count is : {numberOfTweets} </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
