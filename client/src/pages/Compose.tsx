import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../App.css';
import { createPost } from '../../apiCalls/posts';

const Compose = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [params] = useSearchParams();
  const postId = params.get('postId');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  // Prefill when editing
  import('../../apiCalls/posts').then(({ getPost }) => {
    if (postId) {
      (async () => {
        try {
          setLoading(true);
          const { post } = await getPost(postId);
          setTitle(post.title);
          setContent(post.content);
          setTags(post.tags.join(', '));
        } catch {
          setError('Failed to load post');
        } finally {
          setLoading(false);
        }
      })();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    // For now, just simulate a save and navigate back home
    try {
      setSubmitting(true);
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (postId) {
        const { updatePost } = await import('../../apiCalls/posts');
        await updatePost(postId, { title, content, tags: tagsArray });
      } else {
        await createPost({ title, content, tags: tagsArray });
      }
      navigate('/');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Create a New Post</h1>
          <p className="auth-subtitle">Share your thoughts with the world ✍️</p>
        </div>

        <div className="auth-form-container">
          {error && <div className="error-message">{error}</div>}
          {loading && <p className="welcome-description">Loading…</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="A midnight thought..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                className="form-input"
                placeholder="Write your story here..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
              <input
                id="tags"
                type="text"
                className="form-input"
                placeholder="writing, life, productivity"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button className="submit-button" disabled={submitting} type="submit">
              {submitting ? 'Publishing…' : 'Publish Post'}
            </button>
          </form>

          <div className="toggle-auth" style={{ marginTop: '1rem' }}>
            <button className="toggle-auth-button" onClick={() => navigate(-1)} disabled={submitting}>
              ← Go Back
            </button>
          </div>
        </div>

        <p className="auth-footer">Drafts autosave coming soon</p>
      </div>
    </div>
  );
};

export default Compose;
