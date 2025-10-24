import API from './config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await API.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to get user';
  }
};
