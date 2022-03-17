import React, { Component } from "react";

import "./App.css";
import styled from "styled-components";

import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

const ConnectButton = styled(WalletDialogButton)``;

class Navbar extends Component {
  render() {
    return (
      <nav className="navBarItems">
        <div className="navbarLogo">
          <h2 className="gradTextFancyFont">SolanaTwitter</h2>
        </div>

        <ul className="navMenu">
          <li className="navLinks"></li>

          <li className="navLinks"></li>

          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>
          <li className="navLinks"></li>

          <li className="navLinks">
            <ConnectButton className="gradientClass">
              <b>Connect Wallet</b>
            </ConnectButton>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
