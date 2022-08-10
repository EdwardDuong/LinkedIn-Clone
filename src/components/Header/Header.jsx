import React from "react";
import { useState } from "react";
import "./header.css";
const Header = (props) => {
  const [active, setActive] = useState();
  return (
    <div className="header-container">
      <div className="header-content">
        <a href="/home" className="header-logo">
          <img src="/images/home-logo.svg" alt="" />
        </a>
        <div className="header-search">
          <div className="header-search_container">
            <img src="/images/search-icon.svg" alt="" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="hearder-nav">
          <div className="header-nav_wrap">
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={() => setActive(0)}
                className={active === 0 ? "actived" : ""}
              >
                <img src="/images/nav-home.svg" alt="" />
                <span>Home</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={() => setActive(1)}
                className={active === 1 ? "actived" : ""}
              >
                <img src="/images/nav-network.svg" alt="" />
                <span>Network</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={() => setActive(2)}
                className={active === 2 ? "actived" : ""}
              >
                <img src="/images/nav-jobs.svg" alt="" />
                <span>Jobs</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={() => setActive(3)}
                className={active === 3 ? "actived" : ""}
              >
                <img src="/images/nav-messaging.svg" alt="" />
                <span>Message</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={() => setActive(4)}
                className={active === 4 ? "actived" : ""}
              >
                <img src="/images/nav-notifications.svg" alt="" />
                <span>Notifications</span>
              </a>
            </div>
            <div className="header-nav_user">
              <img src="/images/user.svg" alt="" />
              <a href="/" className="user">
                <span>Me</span>
                <img src="/images/down-icon.svg" alt="" />
              </a>

              <div className="sign-out">
                <a>Sign out</a>
              </div>
            </div>
            <div className="header-nav_work">
              <img src="/images/nav-work.svg" alt="" />
              <a href="/" className="work">
                <span>Work</span>
                <img src="/images/down-icon.svg" alt="" />
              </a>
            </div>
            <div className="text">
              <span>Try premium for</span>
              <span> free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
