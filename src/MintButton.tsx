import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { TweetProgramAccount } from "./program-functions";
import { CircularProgress } from "@material-ui/core";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { useEffect, useState } from "react";

export const CTAButton = styled(Button)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #00ffa3 0%, #dc1fff 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your own styles here
// color: linear-gradient(50.4deg, #00ffa3, #dc1fff);
// -webkit-linear-gradient(#00ffa3, #dc1fff);
export const MintButton = ({
  tweetProgram,
  onSendTweet,
  isMinting,
}: {
  tweetProgram?: TweetProgramAccount;
  onSendTweet: () => Promise<void>;
  isMinting: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  return (
    <CTAButton
      onClick={async () => {
        setClicked(true);
        await onSendTweet();
        setClicked(false);
      }}
      variant="contained"
    >
      Send Tweet
    </CTAButton>
  );
};
