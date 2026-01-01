import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './axios.config';

export interface Experience {
  id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  userId: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  grade?: number;
}

export interface CreateExperienceDto {
  title: string;
  company: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface CreateEducationDto {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  grade?: number;
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Experiences', 'Education'],
  endpoints: (builder) => ({
    getUserExperiences: builder.query<Experience[], string>({
      query: (userId) => `/Profile/${userId}/experiences`,
      providesTags: ['Experiences'],
    }),
    addExperience: builder.mutation<Experience, CreateExperienceDto>({
      query: (data) => ({
        url: '/Profile/experiences',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Experiences'],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (experienceId) => ({
        url: `/Profile/experiences/${experienceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experiences'],
    }),
    getUserEducation: builder.query<Education[], string>({
      query: (userId) => `/Profile/${userId}/education`,
      providesTags: ['Education'],
    }),
    addEducation: builder.mutation<Education, CreateEducationDto>({
      query: (data) => ({
        url: '/Profile/education',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Education'],
    }),
    deleteEducation: builder.mutation<void, string>({
      query: (educationId) => ({
        url: `/Profile/education/${educationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Education'],
    }),
  }),
});

export const {
  useGetUserExperiencesQuery,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useGetUserEducationQuery,
  useAddEducationMutation,
  useDeleteEducationMutation,
} = profileApi;
