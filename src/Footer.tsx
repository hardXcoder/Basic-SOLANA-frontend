import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faDiscord,
//     faTwitter,
//     faMedium,
// } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  return (
    <div className="social-container">
      <div className="social-links">
        <div className="pink-link copyrightContainer">
          Copyright &#169; {currentYear} SolanaTwitter
        </div>

        {/* <Link className = "pink-link" to="/tc" >

                    <a className="footerLinks social">
                        Terms and Conditions
                    </a>
                </Link> */}

        {/* <a href="mailto:contact@.com"
                    className="pink-link social" >
                    Contact us
                    </a> */}

        {/* <Link className="pink-link" to="/faq" >
                    <a className="social">
                        FAQ
                    </a>
                </Link> */}

        {/* <Link className="pink-link" to="/disclaimer" >
                    <a className="social">
                        Disclaimer
                    </a>
                </Link> */}

        {/* <a
                    href="https://discord.gg/akncVEYvRW"

                    className="discord social"
                >
                    <FontAwesomeIcon icon={faDiscord} size="2x" />
                </a> */}

        {/* <a 
                 href="https://twitter.com/"

                className="twitter social">
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a> */}
      </div>
    </div>
  );
}
