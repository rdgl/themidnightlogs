import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { getMyPosts, deletePost, type Post } from '../../apiCalls/posts';

const MyPosts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyPosts();
        setPosts(data.posts);
      } catch {
        setError('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="welcome-card">
          <h2 className="welcome-title">My Posts</h2>
          <div style={{ marginBottom: '1rem' }}>
            <button className="submit-button" onClick={() => navigate('/compose')}>+ Create New Post</button>
          </div>
          {loading && <p className="welcome-description">Loading…</p>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && (
            <div className="posts-list">
              {posts.length === 0 && (
                <p className="welcome-description">You haven't published any posts yet.</p>
              )}
              {posts.map((p) => (
                <article key={p.id} className="post-card">
                  <h4 className="post-title" style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${p.id}`)}>{p.title}</h4>
                  <div className="post-meta">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="post-excerpt">{p.content.slice(0, 160)}{p.content.length > 160 ? '…' : ''}</p>
                  <div className="post-tags">
                    {p.tags?.map((t) => (
                      <span className="tag-badge" key={t}>#{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="submit-button" onClick={() => navigate(`/compose?postId=${p.id}`)}>
                      Edit
                    </button>
                    <button className="logout-button" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
