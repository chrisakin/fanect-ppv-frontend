import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

export const setTokens = (accessToken: string, refreshToken: string, sessionToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
  sessionStorage.setItem('sessionToken', sessionToken)
};

export const setLoggedinUser = (user: {
    username: string;
    firstName: string;
    email: string;
  }) => {
  localStorage.setItem('user', JSON.stringify(user) )
}

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => sessionStorage.getItem('refreshToken');
export const getSessionToken = () => sessionStorage.getItem('sessionToken');

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('sessionToken')
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return false;
  }
};

// export const getUserInfo = () => {
//   const token = getAccessToken();
//   if (!token) return null;

//   try {
//     return jwtDecode<DecodedToken>(token);
//   } catch {
//     return null;
//   }
// };