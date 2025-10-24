import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import '../App.css';
import { useEffect, useState } from 'react';
import { getPosts, getFollowingFeed, likePost, type Post } from '../../apiCalls/posts';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feed, setFeed] = useState<'recent' | 'following'>('recent');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = feed === 'recent' ? await getPosts() : await getFollowingFeed();
        setPosts(data.posts);
      } catch (e: any) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [feed]);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">The Midnight Logs</h1>
          <div className="navbar-actions" style={{ position: 'relative' }}>
            <span className="navbar-welcome">Welcome, {user?.name}!</span>
            <ProfileMenu onLogout={handleLogout} onMyPosts={() => navigate('/my-posts')} onCompose={() => navigate('/compose')} />
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="welcome-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="welcome-title" style={{ marginBottom: 0 }}>{feed === 'recent' ? 'Recent Posts' : 'Following'}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={feed === 'recent' ? 'submit-button' : 'logout-button'}
                onClick={() => setFeed('recent')}
              >
                Recent
              </button>
              <button
                className={feed === 'following' ? 'submit-button' : 'logout-button'}
                onClick={() => setFeed('following')}
              >
                Following
              </button>
            </div>
          </div>
          {loading && <p className="welcome-description">Loading…</p>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && (
            <div className="posts-wrapper">
              <div className="posts-list">
              {posts.length === 0 && (
                <p className="welcome-description">No posts yet. Be the first to write one!</p>
              )}
              {posts.map((p) => (
                <article key={p.id} className="post-card">
                  <h4 className="post-title" style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${p.id}`)}>{p.title}</h4>
                  <div className="post-meta">
                    <span>by {p.author?.name || 'Unknown'}</span>
                    <span> • {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="post-excerpt">{p.content.slice(0, 160)}{p.content.length > 160 ? '…' : ''}</p>
                  <div className="post-tags">
                    {p.tags?.map((t) => (
                      <span className="tag-badge" key={t}>#{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="submit-button"
                      onClick={() => navigate(`/post/${p.id}`)}
                    >
                      Read more
                    </button>
                    <button
                      className="like-button"
                      onClick={async () => {
                        try {
                          const { post } = await likePost(p.id);
                          setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, likes: post.likes } : x)));
                        } catch {}
                      }}
                    >
                      ❤ {p.likes?.length || 0}
                    </button>
                  </div>
                </article>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

// Simple inline profile menu component
function ProfileMenu({ onLogout, onMyPosts, onCompose }: { onLogout: () => void; onMyPosts: () => void; onCompose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="logout-button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Profile ▾
      </button>
      {open && (
        <div className="dropdown-menu" role="menu" onMouseLeave={() => setOpen(false)}>
          <button className="dropdown-item" onClick={onCompose}>Create Post</button>
          <button className="dropdown-item" onClick={onMyPosts}>My Posts</button>
          <button className="dropdown-item" onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
