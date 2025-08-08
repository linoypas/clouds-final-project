import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/posts.css'

interface IUser {
  _id: string;
  username: string;
}

interface IPost {
  _id: string;
  title: string;
  owner: IUser | string;  
  content: string;
  likes: string[];
  image?: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postsReponse = await fetch(`https://localhost:443/posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
            <Link to={`/posts/${post._id}`} key={post._id} className="post-card-link">
              <div className="post-card">
                {post.image ? (
                  <img src={`https://localhost:443${post.image}`} alt={post.title} className="post-image" />
                ) : (
                  <p className="p-4 text-gray-700">{post.content}</p>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500">By: {typeof post.owner === 'object' && post.owner !== null
                                ? post.owner.username
                                : 'Unknown'}</p>
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
