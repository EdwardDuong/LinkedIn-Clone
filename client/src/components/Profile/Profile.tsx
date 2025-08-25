import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import Header from '../Header/Header';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAppSelector((state) => state.auth);

  // For now, show current user's profile
  // Later, fetch user by userId
  const profileUser = user;

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <ProfileCard>
          <CoverImage>
            {profileUser.coverImage ? (
              <img src={profileUser.coverImage} alt="Cover" />
            ) : (
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
            )}
          </CoverImage>
          <ProfileInfo>
            <ProfilePicture>
              <img src={profileUser.profilePicture || '/images/user.svg'} alt={`${profileUser.firstName} ${profileUser.lastName}`} />
            </ProfilePicture>
            <UserInfo>
              <h1>{profileUser.firstName} {profileUser.lastName}</h1>
              {profileUser.headline && <h2>{profileUser.headline}</h2>}
              {profileUser.location && (
                <Location>
                  <span>{profileUser.location}</span>
                </Location>
              )}
            </UserInfo>
          </ProfileInfo>
          {profileUser.about && (
            <AboutSection>
              <h3>About</h3>
              <p>{profileUser.about}</p>
            </AboutSection>
          )}
        </ProfileCard>

        <ActivityCard>
          <h3>Activity</h3>
          <EmptyState>No activity yet</EmptyState>
        </ActivityCard>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1128px;
  margin: 80px auto 0;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  margin-bottom: 16px;
  overflow: hidden;
`;

const CoverImage = styled.div`
  height: 200px;
  width: 100%;

  img, div {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  padding: 0 24px 24px;
  position: relative;
`;

const ProfilePicture = styled.div`
  width: 152px;
  height: 152px;
  border-radius: 50%;
  border: 4px solid white;
  position: relative;
  margin-top: -76px;
  background: white;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  margin-top: 16px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin: 0 0 4px;
  }

  h2 {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin: 0 0 8px;
  }
`;

const Location = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 8px;
`;

const AboutSection = styled.div`
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 12px;
    color: rgba(0, 0, 0, 0.9);
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(0, 0, 0, 0.9);
    margin: 0;
    white-space: pre-wrap;
  }
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 24px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 16px;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
`;

export default Profile;
