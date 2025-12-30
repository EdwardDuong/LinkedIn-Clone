import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../../services/api/notificationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data: notifications, isLoading } = useGetNotificationsQuery(filter === 'unread');
  const [markAsRead] = useMarkAsReadMutation();
  const navigate = useNavigate();

  const handleNotificationClick = async (notificationId: string, link?: string, isRead?: boolean) => {
    try {
      if (!isRead) {
        await markAsRead(notificationId).unwrap();
      }
      if (link) {
        navigate(link);
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Content>
          <Header>
            <Title>Notifications</Title>
          </Header>
          <LoadingText>Loading notifications...</LoadingText>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>Notifications</Title>
          <FilterButtons>
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Unread
            </FilterButton>
          </FilterButtons>
        </Header>

        {notifications && notifications.length > 0 ? (
          <NotificationsList>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification.id, notification.link, notification.isRead)}
              >
                <NotificationIcon isRead={notification.isRead}>
                  {!notification.isRead && <UnreadDot />}
                  <IconText>{getNotificationIcon(notification.type)}</IconText>
                </NotificationIcon>
                <NotificationContent>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))}
          </NotificationsList>
        ) : (
          <EmptyState>
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyText>No notifications</EmptyText>
            <EmptySubtext>
              {filter === 'unread'
                ? "You're all caught up!"
                : "You don't have any notifications yet"}
            </EmptySubtext>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'Like':
      return '👍';
    case 'Comment':
      return '💬';
    case 'ConnectionRequest':
      return '🤝';
    case 'ConnectionAccepted':
      return '✅';
    default:
      return '📢';
  }
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(300px, 7fr) minmax(0, 5fr);
  column-gap: 25px;
  row-gap: 25px;
  margin: 25px auto;
  max-width: 1128px;
`;

const Content = styled.div`
  grid-column: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${(props) => (props.active ? '#0a66c2' : 'rgba(0, 0, 0, 0.6)')};
  background-color: ${(props) => (props.active ? '#e7f3ff' : 'transparent')};
  color: ${(props) => (props.active ? '#0a66c2' : 'rgba(0, 0, 0, 0.6)')};
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#e7f3ff' : 'rgba(0, 0, 0, 0.08)')};
  }
`;

const NotificationsList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  display: flex;
  padding: 12px 20px;
  background-color: ${(props) => (props.isRead ? 'white' : '#f3f6f8')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.isRead ? '#f3f6f8' : '#e8ecef')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ isRead: boolean }>`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => (props.isRead ? '#e8ecef' : '#0a66c2')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #0a66c2;
  border: 2px solid white;
  border-radius: 50%;
`;

const IconText = styled.span`
  font-size: 24px;
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const LoadingText = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 8px 0;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
`;

export default Notifications;
