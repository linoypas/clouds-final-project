import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from 'react-icons/fa';
import '../../styles/post.css';

interface IUser {
  _id: string;
  username: string;
}

interface IPost {
  id: string;
  title: string;
  owner: IUser | string;
  content: string;
  likes: string[];
  image?: string;
}

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // Track whether we are in edit mode
  const [title, setTitle] = useState<string>(''); // Track title when in edit mode
  const [content, setContent] = useState<string>(''); // Track content when in edit mode
  const [newImage, setNewImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('id');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postReponse = await fetch(`https://localhost:443/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!postReponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postReponse.json();
        setPost(postData);
        setLikes(postData.likes.length);
        setTitle(postData.title); // Set initial title for edit mode
        setContent(postData.content); // Set initial content for edit mode
        if (postData.likes.includes(userId)) {
          setIsLiked(true);
        }
        const commentResponse = await fetch(`https://localhost:443/comments?postId=${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!commentResponse.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await commentResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async (e: any) => {
    e.preventDefault();
    if (!post || !userId) return;
    let updatedLikes = [...post.likes];
    if (isLiked) {
      updatedLikes = updatedLikes.filter((id) => id !== userId);
    } else {
      updatedLikes.push(userId);
    }
    try {
      const response = await fetch(`https://localhost:443/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes }),
      });
      if (!response.ok) {
        console.error('Failed to update likes');
      }
      setIsLiked(!isLiked);
      setLikes(updatedLikes.length);
      setPost({ ...post, likes: updatedLikes });
    } catch (error) {
      console.error('Error updating likes', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`https://localhost:443/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to delete post');
        } else {
          navigate('/posts');
        }
      } catch (error) {
        console.error('Error deleting post', error);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file); // Debugging: Log the selected file
      setNewImage(file);
    } else {
      console.log('No file selected'); // Debugging: Log if no file was selected
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleSaveEdit = async () => {
    if (!title || !content) return; // Ensure title and content are not empty

    let updatedImageUrl = post?.image || '';
    
    // If a new image is selected, upload it
    if (newImage) {
      const formData = new FormData();
      formData.append('image', newImage);
      console.log('Uploading new image:', newImage.name); // Debugging: Log the image being uploaded

      try {
        const uploadResponse = await fetch(`https://localhost:443/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        console.log('Image uploaded successfully:', uploadData); // Debugging: Log the upload response
        updatedImageUrl = uploadData.imageUrl; // Assuming the server returns an image URL
      } catch (error) {
        console.error('Error uploading image:', error); // Debugging: Log the error if image upload fails
        return;
      }
    }

    const updatedPost = { ...post, title, content, image: updatedImageUrl };

    try {
      const response = await fetch(`https://localhost:443/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to save post changes');
      }
      const updatedPostData = await response.json();
      console.log('Post updated successfully:', updatedPostData); // Debugging: Log the response after updating post
      setPost(updatedPostData);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error saving post edit:', error); // Debugging: Log the error if post edit fails
    }
  };

  if (!post || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-gray-300">
        {isEditing ? (
          <div className="p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
              placeholder="Edit the title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
              placeholder="Edit your content here"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

            <button
              onClick={handleSaveEdit}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-center p-4 text-gray-800">{post.title}</h3>
            <p className="text-lg text-center text-gray-600 mb-4">
              By: {post.owner && typeof post.owner !== 'string' ? post.owner.username : 'Unknown'}
            </p>

            {post.owner && typeof post.owner !== 'string' && post.owner._id === userId && (
              <div className="flex justify-center space-x-6 mb-6">
                <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800">
                  <FaEdit className="text-2xl" />
                </button>
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
                  <FaTrash className="text-2xl" />
                </button>
              </div>
            )}

            <div>
              <p className="p-6 text-lg text-gray-700">{post.content}</p>
              {post.image && (
                <div className="post-image-container">
                  <img
                    src={`https://localhost:443${post.image}`}
                    alt="Post content"
                    className="w-full h-auto object-cover"
                    onError={() => console.error('Error loading image from:', post.image)} // Debugging: Log error if image fails to load
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="p-6 flex justify-between items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            {isLiked ? (
              <FaHeart className="text-3xl" />
            ) : (
              <FaRegHeart className="text-3xl" />
            )}
            <span className="ml-3 font-semibold text-xl">{likes} Likes</span>
          </button>
          <a href={`/comments/${postId}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
            {comments.length} Comments
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;
