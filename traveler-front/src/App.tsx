import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreatePost from './components/posts/createPost';
import Post from './components/posts/post';
import Header from './components/header';
import Posts from './components/posts/posts';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
