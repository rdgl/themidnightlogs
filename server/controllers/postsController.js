import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await Post.create({
      title: title.trim(),
      content,
      tags: tagsArray,
      author: req.user.id,
    });

    return res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPosts = async (_req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 }).limit(50);
    return res.json({ posts });
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: { $ne: req.user?.id } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ posts });
  } catch (err) {
    console.error('Get feed error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ posts });
  } catch (err) {
    console.error('Get my posts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFollowingFeed = async (req, res) => {
  try {
    const following = req.user.following || [];
    if (!following.length) return res.json({ posts: [] });
    const posts = await Post.find({ author: { $in: following } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ posts });
  } catch (err) {
    console.error('Get following feed error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json({ post });
  } catch (err) {
    console.error('Get post by id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }
    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user.id;
    const hasLiked = post.likes?.some((u) => u.toString() === userId);
    if (hasLiked) {
      post.likes = post.likes.filter((u) => u.toString() !== userId);
    } else {
      post.likes = [...(post.likes || []), userId];
    }
    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error('Toggle like error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
