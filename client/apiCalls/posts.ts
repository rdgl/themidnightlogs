import API from './config';

export interface PostInput {
  title: string;
  content: string;
  tags?: string[] | string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: { id?: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
  likes?: string[];
}

export const createPost = async (data: PostInput): Promise<{ post: Post }> => {
  const res = await API.post('/posts', data);
  return res.data;
};

export const getPosts = async (): Promise<{ posts: Post[] }> => {
  const res = await API.get('/posts');
  return res.data;
};

export const getFeedPosts = async (): Promise<{ posts: Post[] }> => {
  const res = await API.get('/posts/feed');
  return res.data;
};

export const getFollowingFeed = async (): Promise<{ posts: Post[] }> => {
  const res = await API.get('/posts/following');
  return res.data;
};

export const getMyPosts = async (): Promise<{ posts: Post[] }> => {
  const res = await API.get('/posts/mine');
  return res.data;
};

export const getPost = async (id: string): Promise<{ post: Post }> => {
  const res = await API.get(`/posts/${id}`);
  return res.data;
};

export const updatePost = async (id: string, data: Partial<PostInput>): Promise<{ post: Post }> => {
  const res = await API.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePost = async (id: string): Promise<{ success: boolean }> => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};

export const likePost = async (id: string): Promise<{ post: Post }> => {
  const res = await API.post(`/posts/${id}/like`);
  return res.data;
};
