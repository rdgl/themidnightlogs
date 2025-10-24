import { Router } from 'express';
import { getUserProfile, followUser, unfollowUser } from '../controllers/usersController.js';
import auth from '../middlewares/auth.js';

const router = Router();

// Profile can be fetched without auth, but isFollowing will be false if not authed
router.get('/:id', auth, getUserProfile);
// If you want public profile without auth, duplicate and make a non-auth variant that omits isFollowing

router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);

export default router;
