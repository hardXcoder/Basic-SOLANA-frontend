import { BorderBottom } from "@material-ui/icons";
import * as anchor from "@project-serum/anchor";
import * as fs from "fs";

import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
import { sendTransactions } from "./connection";

import {
  getAtaForMint,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from "./utils";

export const PROGRAM_ID = new anchor.web3.PublicKey(
  "BwwdesmeES3kJRxNJduM9rE6DfojzEC6DwQJveWqEW5s"
);

export interface Tweet {
  author: anchor.web3.PublicKey;
  timestamp: number;
  content: String;
  topic: String;
}

export interface TweetProgramState {
  numberOfTweetsPosted: number;
}

export interface TweetProgramAccount {
  id: anchor.web3.PublicKey;
  program: anchor.Program;
  state: TweetProgramState;
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      console.log("Rejecting for timeout...");
      reject({ timeout: true });
    }, timeout);

    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              console.log("REST null result for", txid, status);
            } else if (status.err) {
              console.log("REST error for", txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              console.log("REST no confirmations for", txid, status);
            } else {
              console.log("REST confirmation for", txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            console.log("REST connection error: txid", txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  //@ts-ignore
  if (connection._signatureSubscriptions[subId]) {
    connection.removeSignatureListener(subId);
  }
  done = true;
  console.log("Returning status", status);
  return status;
};

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

export const getTweetCount = async (
  tweetProgram: TweetProgramAccount
): Promise<number> => {
  const tweet = anchor.web3.Keypair.generate();

  const tweetProgramId = tweetProgram.id;
  const signers: anchor.web3.Keypair[] = [tweet];

  const tweetAccounts: anchor.ProgramAccount<Tweet>[] =
    await tweetProgram.program.account.tweet.all();

  console.log(tweetAccounts);

  return tweetAccounts.length;
};

export const getTweetProgramState = async (
  anchorWallet: anchor.Wallet,
  tweetProgramId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
): Promise<TweetProgramAccount> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: "recent",
  });

  console.log("Nandi : " + tweetProgramId);

  const idl = await anchor.Program.fetchIdl(PROGRAM_ID, provider);

  const program = new anchor.Program(idl, tweetProgramId, provider);

  const TWEET_ID = new anchor.web3.PublicKey(
    "6pin1rik2Ny7VSmAAAdstnEicfNmhWGSezAhRZwUQP8k"
  );

  const state: any = await program.account.tweet.fetch(TWEET_ID);

  const numberOfTweetsPosted = state.numberOfTweetsPosted;

  console.log("Hi hi");

  return {
    id: tweetProgramId,
    program,
    state: {
      numberOfTweetsPosted,
    },
  };
};

export const sendTweet = async (
  tweetAccount: TweetProgramAccount,
  payer: anchor.web3.PublicKey
): Promise<(string | undefined)[]> => {
  // We need to ourself pass the tweet acoount id by generating it
  console.log("Now I am in program-functions sendTweet function");
  const tweet = anchor.web3.Keypair.generate();

  const tweetProgramId = tweetAccount.id;
  const signers: anchor.web3.Keypair[] = [tweet];

  const instructions = [];

  var topic = "Topic Tweet";
  var content = "Content Tweet";

  // Putting the instruction in instruction quee, and sending it all as a transaction
  instructions.push(
    await tweetAccount.program.instruction.sendTweet(topic, content, {
      accounts: {
        tweet: tweet.publicKey,
        author: payer,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweet],
    })
  );

  try {
    return (
      await sendTransactions(
        tweetAccount.program.provider.connection,
        tweetAccount.program.provider.wallet,
        [instructions],
        [signers, []]
      )
    ).txs.map((t) => t.txid);
  } catch (e) {
    console.log(e);
  }

  return [];
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
