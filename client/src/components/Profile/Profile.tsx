import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import Header from '../Header/Header';
import {
  useGetUserExperiencesQuery,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useGetUserEducationQuery,
  useAddEducationMutation,
  useDeleteEducationMutation,
  CreateExperienceDto,
  CreateEducationDto,
} from '../../services/api/profileApi';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);

  // For now, show current user's profile
  // Later, fetch user by userId
  const profileUser = user;
  const profileUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  const { data: experiences, isLoading: experiencesLoading } = useGetUserExperiencesQuery(
    profileUserId || '',
    { skip: !profileUserId }
  );
  const { data: education, isLoading: educationLoading } = useGetUserEducationQuery(
    profileUserId || '',
    { skip: !profileUserId }
  );

  const [addExperience] = useAddExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [addEducation] = useAddEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const handleAddExperience = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const experienceData: CreateExperienceDto = {
        title: formData.get('title') as string,
        company: formData.get('company') as string,
        location: formData.get('location') as string || undefined,
        description: formData.get('description') as string || undefined,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('isCurrent') === 'on' ? undefined : (formData.get('endDate') as string || undefined),
        isCurrent: formData.get('isCurrent') === 'on',
      };

      await addExperience(experienceData).unwrap();
      setShowAddExperience(false);
      toast.success('Experience added successfully');
    } catch (error) {
      toast.error('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await deleteExperience(experienceId).unwrap();
      toast.success('Experience deleted successfully');
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const handleAddEducation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const educationData: CreateEducationDto = {
        school: formData.get('school') as string,
        degree: formData.get('degree') as string,
        fieldOfStudy: formData.get('fieldOfStudy') as string || undefined,
        description: formData.get('description') as string || undefined,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string || undefined,
        grade: formData.get('grade') ? parseFloat(formData.get('grade') as string) : undefined,
      };

      await addEducation(educationData).unwrap();
      setShowAddEducation(false);
      toast.success('Education added successfully');
    } catch (error) {
      toast.error('Failed to add education');
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;

    try {
      await deleteEducation(educationId).unwrap();
      toast.success('Education deleted successfully');
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

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

        <SectionCard>
          <SectionHeader>
            <h3>Experience</h3>
            {isOwnProfile && (
              <AddButton onClick={() => setShowAddExperience(!showAddExperience)}>
                {showAddExperience ? 'Cancel' : '+ Add'}
              </AddButton>
            )}
          </SectionHeader>

          {showAddExperience && isOwnProfile && (
            <Form onSubmit={handleAddExperience}>
              <FormGroup>
                <label>Title *</label>
                <input type="text" name="title" required />
              </FormGroup>
              <FormGroup>
                <label>Company *</label>
                <input type="text" name="company" required />
              </FormGroup>
              <FormGroup>
                <label>Location</label>
                <input type="text" name="location" />
              </FormGroup>
              <FormGroup>
                <label>Start Date *</label>
                <input type="month" name="startDate" required />
              </FormGroup>
              <FormGroup>
                <label>
                  <input type="checkbox" name="isCurrent" /> Currently working here
                </label>
              </FormGroup>
              <FormGroup>
                <label>End Date</label>
                <input type="month" name="endDate" />
              </FormGroup>
              <FormGroup>
                <label>Description</label>
                <textarea name="description" rows={4} />
              </FormGroup>
              <FormActions>
                <SubmitButton type="submit">Save</SubmitButton>
              </FormActions>
            </Form>
          )}

          {experiencesLoading ? (
            <EmptyState>Loading...</EmptyState>
          ) : experiences && experiences.length > 0 ? (
            experiences.map((exp) => (
              <ExperienceItem key={exp.id}>
                <ExperienceContent>
                  <h4>{exp.title}</h4>
                  <CompanyName>{exp.company}</CompanyName>
                  <DateRange>
                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                  </DateRange>
                  {exp.location && <Location>{exp.location}</Location>}
                  {exp.description && <Description>{exp.description}</Description>}
                </ExperienceContent>
                {isOwnProfile && (
                  <DeleteButton onClick={() => handleDeleteExperience(exp.id)}>Delete</DeleteButton>
                )}
              </ExperienceItem>
            ))
          ) : (
            <EmptyState>No experience added</EmptyState>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <h3>Education</h3>
            {isOwnProfile && (
              <AddButton onClick={() => setShowAddEducation(!showAddEducation)}>
                {showAddEducation ? 'Cancel' : '+ Add'}
              </AddButton>
            )}
          </SectionHeader>

          {showAddEducation && isOwnProfile && (
            <Form onSubmit={handleAddEducation}>
              <FormGroup>
                <label>School *</label>
                <input type="text" name="school" required />
              </FormGroup>
              <FormGroup>
                <label>Degree *</label>
                <input type="text" name="degree" required />
              </FormGroup>
              <FormGroup>
                <label>Field of Study</label>
                <input type="text" name="fieldOfStudy" />
              </FormGroup>
              <FormGroup>
                <label>Start Date *</label>
                <input type="month" name="startDate" required />
              </FormGroup>
              <FormGroup>
                <label>End Date (or expected)</label>
                <input type="month" name="endDate" />
              </FormGroup>
              <FormGroup>
                <label>Grade</label>
                <input type="number" name="grade" step="0.01" />
              </FormGroup>
              <FormGroup>
                <label>Description</label>
                <textarea name="description" rows={4} />
              </FormGroup>
              <FormActions>
                <SubmitButton type="submit">Save</SubmitButton>
              </FormActions>
            </Form>
          )}

          {educationLoading ? (
            <EmptyState>Loading...</EmptyState>
          ) : education && education.length > 0 ? (
            education.map((edu) => (
              <ExperienceItem key={edu.id}>
                <ExperienceContent>
                  <h4>{edu.school}</h4>
                  <CompanyName>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</CompanyName>
                  <DateRange>
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </DateRange>
                  {edu.grade && <Location>Grade: {edu.grade}</Location>}
                  {edu.description && <Description>{edu.description}</Description>}
                </ExperienceContent>
                {isOwnProfile && (
                  <DeleteButton onClick={() => handleDeleteEducation(edu.id)}>Delete</DeleteButton>
                )}
              </ExperienceItem>
            ))
          ) : (
            <EmptyState>No education added</EmptyState>
          )}
        </SectionCard>

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

const SectionCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 24px;
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e7f3ff;
  }
`;

const Form = styled.form`
  background-color: #f3f6f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 4px;
  }

  input[type='text'],
  input[type='month'],
  input[type='number'],
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #0a66c2;
    }
  }

  input[type='checkbox'] {
    margin-right: 8px;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 24px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #004182;
  }
`;

const ExperienceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const ExperienceContent = styled.div`
  flex: 1;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin: 0 0 4px;
  }
`;

const CompanyName = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
`;

const DateRange = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  margin: 8px 0 0;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: #d11124;
  border: 1px solid #d11124;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  height: fit-content;
  transition: all 0.2s;

  &:hover {
    background-color: #fff0f0;
  }
`;

export default Profile;
