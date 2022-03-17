import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { MintCountdown } from "./MintCountdown";
import { toDate, formatNumber } from "./utils";
import { TweetProgramAccount } from "./program-functions";

type HeaderProps = {
  tweetProgram?: TweetProgramAccount;
};

export const Header = ({ tweetProgram }: HeaderProps) => {
  return (
    <Grid container direction="row" justifyContent="center" wrap="nowrap">
      <Grid container direction="row" wrap="nowrap">
        {tweetProgram && (
          <Grid container direction="row" wrap="nowrap">
            <Grid container direction="column">
              <Typography variant="body2" color="textSecondary">
                Minted
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                style={{
                  fontWeight: "bold",
                }}
              >
                <span className="gradTextFancyFontGreySmally">
                  {`${tweetProgram?.state.numberOfTweetsPosted}`}
                </span>
              </Typography>
            </Grid>

            <Grid container direction="column">
              <Typography variant="body2" color="textSecondary">
                Price
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                style={{ fontWeight: "bold" }}
              >
                {/* ◎ {formatNumber.asNumber(candyMachine?.state.price!)} */}◎
                <span className="gradTextFancyFontGreySmally"> Free</span>
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
