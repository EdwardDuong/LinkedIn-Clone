import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { useGetNotificationsQuery } from '../../services/api/notificationApi';
import { useGetConversationsQuery } from '../../services/api/messageApi';
import './header.css';

const Header: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data: notifications } = useGetNotificationsQuery(true);
  const { data: conversations } = useGetConversationsQuery();
  const unreadNotificationsCount = notifications?.length || 0;
  const unreadMessagesCount = conversations?.reduce((sum, conv) => sum + conv.unreadCount, 0) || 0;

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
            <input
              type="text"
              placeholder="Search"
              onClick={() => navigate('/search')}
              readOnly
              style={{ cursor: 'pointer' }}
            />
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
                href="/network"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(1);
                  navigate('/network');
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
                href="/messages"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(3);
                  navigate('/messages');
                }}
                className={active === 3 ? 'actived' : ''}
                style={{ position: 'relative' }}
              >
                <img src="/images/nav-messaging.svg" alt="Messaging" />
                <span>Message</span>
                {unreadMessagesCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '20px',
                      backgroundColor: '#d11124',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </a>
            </div>
            <div className="header-nav_item">
              <a
                href="/notifications"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(4);
                  navigate('/notifications');
                }}
                className={active === 4 ? 'actived' : ''}
                style={{ position: 'relative' }}
              >
                <img src="/images/nav-notifications.svg" alt="Notifications" />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '20px',
                      backgroundColor: '#d11124',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </a>
            </div>
            <div className="header-nav_user">
              <img
                src={user?.profilePicture || '/images/user.svg'}
                alt="User"
                onClick={() => navigate('/profile')}
                style={{ cursor: 'pointer' }}
              />
              <a href="/" className="user" onClick={(e) => {
                e.preventDefault();
                navigate('/profile');
              }}>
                <span>
                  {user ? `${user.firstName} ${user.lastName}` : 'Me'}
                </span>
                <img src="/images/down-icon.svg" alt="Dropdown" />
              </a>

              <div className="sign-out">
                <button type="button" onClick={handleSignOut}>Sign out</button>
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
