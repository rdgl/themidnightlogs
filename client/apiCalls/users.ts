import API from './config';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const getUserProfile = async (id: string): Promise<{ user: UserProfile }> => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const followUser = async (id: string): Promise<{ followersCount: number; followingCount: number; isFollowing: boolean }> => {
  const res = await API.post(`/users/${id}/follow`);
  return res.data;
};

export const unfollowUser = async (id: string): Promise<{ followersCount: number; followingCount: number; isFollowing: boolean }> => {
  const res = await API.post(`/users/${id}/unfollow`);
  return res.data;
};
