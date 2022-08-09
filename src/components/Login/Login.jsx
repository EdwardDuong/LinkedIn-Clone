import React from "react";
import "./login.css";
const Login = (props) => {
  return (
    <div className="login-container">
      <div className="nav">
        <a href="">
          <img src="/images/login-logo.svg" alt=""></img>
        </a>

        <div className="login-join">
          <a className="join"> Login</a>
          <a className="sign-in">Sign in</a>
        </div>
      </div>
      <div className="login-section">
        <div className="login-hero">
          <div className="hero-text">
            <h1>Welcome to your professional comunity</h1>
            <div className="google-form">
              <button className="google-btn">
                <img src="/images/google.svg"></img>
                Sign in with Google
              </button>
            </div>
          </div>
          <img src="/images/login-hero.svg"></img>
        </div>
      </div>
    </div>
  );
};

export default Login;
