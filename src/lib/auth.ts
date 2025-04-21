import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUserInfo = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};