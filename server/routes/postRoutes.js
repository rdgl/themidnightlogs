import { Router } from 'express';
import { createPost, getPosts, getFeedPosts, getMyPosts, getPostById, updatePost, deletePost, toggleLike, getFollowingFeed } from '../controllers/postsController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/', getPosts);
router.get('/feed', auth, getFeedPosts);
router.get('/following', auth, getFollowingFeed);
router.get('/mine', auth, getMyPosts);
router.get('/:id', getPostById);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, toggleLike);

export default router;
