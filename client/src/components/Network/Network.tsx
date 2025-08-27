import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Header from '../Header/Header';
import { useAppSelector } from '../../app/hooks';

interface Connection {
  id: string;
  requesterId: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    headline?: string;
    profilePicture?: string;
  };
  addresseeId: string;
  addressee: {
    id: string;
    firstName: string;
    lastName: string;
    headline?: string;
    profilePicture?: string;
  };
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

const Network: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5265/api/v1/Connections/my-connections', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch connections');

      const data = await response.json();
      setConnections(data);
    } catch (err) {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const acceptConnection = async (connectionId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5265/api/v1/Connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 1 }), // Accepted
      });

      if (!response.ok) throw new Error('Failed to accept connection');

      toast.success('Connection accepted!');
      fetchConnections();
    } catch (err) {
      toast.error('Failed to accept connection');
    }
  };

  const rejectConnection = async (connectionId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5265/api/v1/Connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 2 }), // Rejected
      });

      if (!response.ok) throw new Error('Failed to reject connection');

      toast.success('Connection rejected');
      fetchConnections();
    } catch (err) {
      toast.error('Failed to reject connection');
    }
  };

  const getConnectionUser = (connection: Connection) => {
    return connection.requesterId === user?.id ? connection.addressee : connection.requester;
  };

  const isPendingRequest = (connection: Connection) => {
    return connection.status === 'Pending' && connection.addresseeId === user?.id;
  };

  return (
    <>
      <Header />
      <Container>
        <NetworkCard>
          <h2>My Network</h2>
          {loading && <LoadingText>Loading...</LoadingText>}
          {!loading && connections.length === 0 && (
            <EmptyState>
              <p>No connections yet</p>
              <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>
                Start connecting with professionals!
              </p>
            </EmptyState>
          )}
          <ConnectionsList>
            {connections.map((connection) => {
              const connectionUser = getConnectionUser(connection);
              const isPending = isPendingRequest(connection);

              return (
                <ConnectionItem key={connection.id}>
                  <UserAvatar>
                    <img
                      src={connectionUser.profilePicture || '/images/user.svg'}
                      alt={connectionUser.firstName}
                    />
                  </UserAvatar>
                  <UserInfo>
                    <h3>{connectionUser.firstName} {connectionUser.lastName}</h3>
                    {connectionUser.headline && <p>{connectionUser.headline}</p>}
                    {connection.status === 'Pending' && (
                      <Status pending>{isPending ? 'Pending your response' : 'Request sent'}</Status>
                    )}
                    {connection.status === 'Accepted' && <Status>Connected</Status>}
                  </UserInfo>
                  {isPending && (
                    <Actions>
                      <AcceptButton onClick={() => acceptConnection(connection.id)}>
                        Accept
                      </AcceptButton>
                      <RejectButton onClick={() => rejectConnection(connection.id)}>
                        Ignore
                      </RejectButton>
                    </Actions>
                  )}
                </ConnectionItem>
              );
            })}
          </ConnectionsList>
        </NetworkCard>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1128px;
  margin: 80px auto 0;
  padding: 20px;
`;

const NetworkCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 24px;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(0, 0, 0, 0.6);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;

  p {
    margin: 8px 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConnectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.div`
  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.9);
  }

  p {
    font-size: 14px;
    margin: 0;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const Status = styled.span<{ pending?: boolean }>`
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props => props.pending ? '#fef3c7' : '#d1fae5'};
  color: ${props => props.pending ? '#92400e' : '#065f46'};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const AcceptButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #004182;
  }
`;

const RejectButton = styled.button`
  background: white;
  color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.9);
    color: rgba(0, 0, 0, 0.9);
  }
`;

export default Network;
