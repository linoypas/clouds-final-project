import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import '../../styles/post.css';

interface IPost {
  id: string;
  title: string;
  content: string;
  image?: string;
}

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await fetch(`/api/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postResponse.json();
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } catch (error) {
        console.error('Error fetching post ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
          headers: {
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
      console.log('Selected file:', file);
      setNewImage(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!title || !content) return;

    let updatedImageUrl = post?.image || '';

    if (newImage) {
      const formData = new FormData();
      formData.append('image', newImage);
      console.log('Uploading new image:', newImage.name);

      try {
        const uploadResponse = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        console.log('Image uploaded successfully:', uploadData);
        updatedImageUrl = uploadData.imageUrl || uploadData.image; // support either key
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    const updatedPost = { ...post, title, content, image: updatedImageUrl };

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to save post changes');
      }
      const updatedPostData = await response.json();
      console.log('Post updated successfully:', updatedPostData);

      // Add timestamp query param to force image refresh
      const refreshedImageUrl = updatedPostData.image
        ? `${updatedPostData.image}?t=${Date.now()}`
        : '';

      setPost({
        ...updatedPostData,
        image: refreshedImageUrl,
      });

      setIsEditing(false);
      setNewImage(null); // reset selected image
    } catch (error) {
      console.error('Error saving post edit:', error);
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
            <div className="flex justify-center space-x-6 mb-6">
              <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800">
                <FaEdit className="text-2xl" />
              </button>
              <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
                <FaTrash className="text-2xl" />
              </button>
            </div>

            <div>
              <p className="p-6 text-lg text-gray-700">{post.content}</p>
              {post.image && (
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-auto object-cover"
                    onError={() => console.error('Error loading image from:', post.image)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
