const API_URL = 'http://159.194.202.140:5000';

export interface User {
  id: string;
  email: string;
  role: string;
  school_id?: string;
  profile?: {
    username?: string;
    bio?: string;
    grade?: string;
    avatar_url?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const api = {
  auth: {
    register: async (email: string, password: string, teacher_code?: string, school_id?: string) => {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, teacher_code, school_id }),
      });
      return res.json() as Promise<AuthResponse>;
    },
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return res.json() as Promise<AuthResponse>;
    },
  },
  schools: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/api/schools`);
      return res.json();
    },
  },
  users: {
    getMe: async (token: string) => {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    updateProfile: async (token: string, data: any) => {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },
  posts: {
    getAll: async (token: string) => {
      const res = await fetch(`${API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    create: async (token: string, content: string, image_url?: string) => {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, image_url }),
      });
      return res.json();
    },
    like: async (token: string, postId: string) => {
      const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    comment: async (token: string, postId: string, content: string) => {
      const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      return res.json();
    },
  },
  leaderboard: {
    getGlobal: async (token: string) => {
      const res = await fetch(`${API_URL}/api/leaderboard/global`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    getSchool: async (token: string) => {
      const res = await fetch(`${API_URL}/api/leaderboard/school`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  },
};
