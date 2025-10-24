import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name email followers following avatar bio');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const followersCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;
    const isFollowing = !!req.user && user.followers?.some((u) => u.toString() === req.user.id);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followersCount,
        followingCount,
        isFollowing,
      },
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const meId = req.user.id;
    if (targetId === meId) return res.status(400).json({ message: "You can't follow yourself" });

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndUpdate(meId, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: meId } });

    const updated = await User.findById(targetId).select('followers following');
    return res.json({
      followersCount: updated.followers?.length || 0,
      followingCount: updated.following?.length || 0,
      isFollowing: true,
    });
  } catch (err) {
    console.error('Follow user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const meId = req.user.id;
    if (targetId === meId) return res.status(400).json({ message: "You can't unfollow yourself" });

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndUpdate(meId, { $pull: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followers: meId } });

    const updated = await User.findById(targetId).select('followers following');
    return res.json({
      followersCount: updated.followers?.length || 0,
      followingCount: updated.following?.length || 0,
      isFollowing: false,
    });
  } catch (err) {
    console.error('Unfollow user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
