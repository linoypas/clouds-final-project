import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreatePost from './components/posts/createPost';
import Post from './components/posts/post';
import Header from './components/header';
import Profile from './components/user/profile';
import Comments from './components/posts/comments';
import AiPosts from './components/posts/AIPosts';
import Posts from './components/posts/posts';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/comments/:postId" element={<Comments />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/ai-posts" element={<AiPosts />} />
        <Route path="/user/" element={<Profile/>} />

      </Routes>
    </Router>
  );
}

export default App;
