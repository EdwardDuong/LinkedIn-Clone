import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Header from '../Header/Header';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:5265/api/v1/Users/search?q=${encodeURIComponent(searchTerm)}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to search users');

      const data = await response.json();
      setResults(data);
    } catch (err) {
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5265/api/v1/Connections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresseeId: userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send connection request');
      }

      toast.success('Connection request sent!');
      // Remove user from results after sending request
      setResults(results.filter(u => u.id !== userId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to send connection request');
    }
  };

  return (
    <>
      <Header />
      <Container>
        <SearchCard>
          <h2>Search People</h2>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search by name or headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </SearchButton>
          </SearchForm>

          {loading && <LoadingText>Searching...</LoadingText>}

          {!loading && searched && results.length === 0 && (
            <EmptyState>
              <p>No users found</p>
              <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>
                Try a different search term
              </p>
            </EmptyState>
          )}

          {!loading && results.length > 0 && (
            <ResultsList>
              {results.map((user) => (
                <UserCard key={user.id}>
                  <UserAvatar>
                    <img
                      src={user.profilePicture || '/images/user.svg'}
                      alt={user.firstName}
                    />
                  </UserAvatar>
                  <UserInfo>
                    <h3>{user.firstName} {user.lastName}</h3>
                    {user.headline && <p className="headline">{user.headline}</p>}
                    {user.location && <p className="location">{user.location}</p>}
                  </UserInfo>
                  <ConnectButton onClick={() => sendConnectionRequest(user.id)}>
                    Connect
                  </ConnectButton>
                </UserCard>
              ))}
            </ResultsList>
          )}
        </SearchCard>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1128px;
  margin: 80px auto 0;
  padding: 20px;
`;

const SearchCard = styled.div`
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

const SearchForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #0a66c2;
  }
`;

const SearchButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #004182;
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

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.div`
  img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.9);
  }

  .headline {
    font-size: 14px;
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.6);
  }

  .location {
    font-size: 12px;
    margin: 0;
    color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const ConnectButton = styled.button`
  background: white;
  color: #0a66c2;
  border: 2px solid #0a66c2;
  border-radius: 16px;
  padding: 8px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0a66c2;
    color: white;
  }
`;

export default Search;
