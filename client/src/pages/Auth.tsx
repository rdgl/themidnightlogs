import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { setLoading, setError, loginSuccess, signupSuccess, clearError } from '../redux/authSlice';
import { loginUser, signupUser } from '../../apiCalls/authCalls.ts';
import { ClipLoader } from 'react-spinners';
import '../App.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Validation
    if (!formData.email || !formData.password) {
      dispatch(setError('Please fill in all required fields'));
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        dispatch(setError('Name is required'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        dispatch(setError('Passwords do not match'));
        return;
      }
      if (formData.password.length < 6) {
        dispatch(setError('Password must be at least 6 characters'));
        return;
      }
    }

    dispatch(setLoading(true));

    try {
      if (isLogin) {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        dispatch(loginSuccess(data));
        navigate('/');
      } else {
        const data = await signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        dispatch(signupSuccess(data));
        navigate('/');
      }
    } catch (err: any) {
      dispatch(setError(err));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    dispatch(clearError());
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">The Midnight Logs</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back!' : 'Join our community'}
          </p>
        </div>

        {/* Form Container */}
        <div className="auth-form-container">
          <h2 className="auth-form-title">{isLogin ? 'Login' : 'Sign Up'}</h2>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field (Signup only) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span className="spinner-container"><ClipLoader size={20} color="#ffffff" /></span>
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="toggle-auth">
            <span className="toggle-auth-text">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={toggleMode}
              className="toggle-auth-button"
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="auth-footer">© 2025 The Midnight Logs. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Auth;
