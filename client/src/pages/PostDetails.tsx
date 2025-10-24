import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import '../App.css';
import { getPost, likePost, type Post } from '../../apiCalls/posts';
import { getUserProfile, followUser, unfollowUser, type UserProfile } from '../../apiCalls/users';

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getPost(id);
        setPost(data.post);
        const authorId = (data.post.author as any)?.id || (data.post.author as any)?._id;
        if (authorId) {
          try {
            const prof = await getUserProfile(authorId);
            setAuthorProfile(prof.user);
          } catch {}
        }
      } catch (e) {
        setError('Failed to load the post');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="welcome-card">
          <button className="logout-button" onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start' }}>
            ← Back
          </button>
          {loading && <p className="welcome-description">Loading…</p>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && post && (
            <article className="post-card" style={{ boxShadow: 'none', padding: 0 }}>
              <h2 className="post-title" style={{ fontSize: '1.8rem' }}>{post.title}</h2>
              <div className="post-meta" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>by {post.author?.name || 'Unknown'}</span>
                <span> • {new Date(post.createdAt).toLocaleDateString()}</span>
                {authorProfile && (
                  <button
                    className="logout-button"
                    onClick={async () => {
                      const authorId = (post.author as any)?.id || (post.author as any)?._id;
                      if (!authorId) return;
                      try {
                        if (authorProfile.isFollowing) {
                          const res = await unfollowUser(authorId);
                          setAuthorProfile({ ...authorProfile, isFollowing: res.isFollowing, followersCount: res.followersCount });
                        } else {
                          const res = await followUser(authorId);
                          setAuthorProfile({ ...authorProfile, isFollowing: res.isFollowing, followersCount: res.followersCount });
                        }
                      } catch {}
                    }}
                  >
                    {authorProfile.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
              <div className="post-tags" style={{ marginBottom: '1rem' }}>
                {post.tags?.map((t) => (
                  <span key={t} className="tag-badge">#{t}</span>
                ))}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} className="post-excerpt">
                {post.content}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  className="like-button"
                  onClick={async () => {
                    try {
                      const { post: updated } = await likePost(post.id);
                      setPost({ ...post, likes: updated.likes });
                    } catch {}
                  }}
                >
                  ❤ {post.likes?.length || 0}
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
