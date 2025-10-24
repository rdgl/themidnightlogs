import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Compose from './pages/Compose';
import MyPosts from './pages/MyPosts';
import PostDetails from './pages/PostDetails';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/" /> : <Auth />} 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} 
      />
      <Route
        path="/post/:id"
        element={isAuthenticated ? <PostDetails /> : <Navigate to="/auth" />}
      />
      <Route
        path="/my-posts"
        element={isAuthenticated ? <MyPosts /> : <Navigate to="/auth" />}
      />
      <Route
        path="/compose"
        element={isAuthenticated ? <Compose /> : <Navigate to="/auth" />}
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
    </Routes>
  );
}

export default App;
