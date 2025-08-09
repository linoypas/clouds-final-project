import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/posts.css'

interface IPost {
  id: string;
  title: string;
  content: string;
  image?: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postsReponse = await fetch(`http://localhost:3000/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!postsReponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postsData = await postsReponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []); 

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        <div className="grid">
          {posts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="post-card-link">
              <div className="post-card">
                {post.image ? (
                  <img src={`${post.image}`} alt={post.title} className="post-image" />
                ) : (
                  <p className="p-4 text-gray-700">{post.content}</p>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    {post.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );  
};

export default Posts;
