import axiosInstance from './axios.config';
import type { LoginDto, RegisterDto, AuthResponseDto, RefreshTokenDto } from '../../../../shared/types/api.types';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await axiosInstance.post<AuthResponseDto>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await axiosInstance.post<AuthResponseDto>('/auth/login', data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponseDto> => {
    const response = await axiosInstance.post<AuthResponseDto>('/auth/refresh', data);
    return response.data;
  },

  logout: async (data: RefreshTokenDto): Promise<void> => {
    await axiosInstance.post('/auth/logout', data);
  },
};
