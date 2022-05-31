import React from "react";

import "./WelcomeScreen.css";

function WelcomeScreen(props) {

  return props.showWelcomeScreen ? (



    <><div className="middleText">
      <h1 className="h1">Welcome to </h1>
      <h1 className="h1">Meet <span id="navSpan">React </span> App</h1>

    </div><div className="google-btn-position">
        <div className="google-btn">
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="google-icon" />
          </div>

          <p
            className="btn-text"
            onClick={() => {
              props.getAccessToken();
            }}
            rel="nofollow noopener"
          >
            <b>Sign in with Google</b>
          </p>
        </div>
      </div><div className="transbox bottomText">
        <p>Login to see upcoming events around the WORLD for full-stack developers.</p>

      </div><div className="middleText">
        <p className="middleDownText">
          <a
            className="a"
            href="https://donalmac.github.io/meet6/privacy.html"
            rel="nofollow noopener"
          >
            Privacy policy
          </a>
        </p>
      </div></>

  ) : null;
}

export default WelcomeScreen;