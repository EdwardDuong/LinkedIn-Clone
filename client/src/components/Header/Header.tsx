import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import './header.css';

const Header: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <a href="/home" className="header-logo">
          <img src="/images/home-logo.svg" alt="LinkedIn Logo" />
        </a>
        <div className="header-search">
          <div className="header-search_container">
            <img src="/images/search-icon.svg" alt="Search" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="hearder-nav">
          <div className="header-nav_wrap">
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(0);
                }}
                className={active === 0 ? 'actived' : ''}
              >
                <img src="/images/nav-home.svg" alt="Home" />
                <span>Home</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(1);
                }}
                className={active === 1 ? 'actived' : ''}
              >
                <img src="/images/nav-network.svg" alt="Network" />
                <span>Network</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(2);
                }}
                className={active === 2 ? 'actived' : ''}
              >
                <img src="/images/nav-jobs.svg" alt="Jobs" />
                <span>Jobs</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(3);
                }}
                className={active === 3 ? 'actived' : ''}
              >
                <img src="/images/nav-messaging.svg" alt="Messaging" />
                <span>Message</span>
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(4);
                }}
                className={active === 4 ? 'actived' : ''}
              >
                <img src="/images/nav-notifications.svg" alt="Notifications" />
                <span>Notifications</span>
              </a>
            </div>
            <div className="header-nav_user">
              <img
                src={user?.profilePicture || '/images/user.svg'}
                alt="User"
              />
              <a href="/" className="user" onClick={(e) => e.preventDefault()}>
                <span>
                  {user ? `${user.firstName} ${user.lastName}` : 'Me'}
                </span>
                <img src="/images/down-icon.svg" alt="Dropdown" />
              </a>

              <div className="sign-out">
                <a onClick={handleSignOut}>Sign out</a>
              </div>
            </div>
            <div className="header-nav_work">
              <img src="/images/nav-work.svg" alt="Work" />
              <a href="/" className="work" onClick={(e) => e.preventDefault()}>
                <span>Work</span>
                <img src="/images/down-icon.svg" alt="Dropdown" />
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
