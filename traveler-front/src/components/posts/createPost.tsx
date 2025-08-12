import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreatePost.css'; 

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    try {
      const response = await fetch("/api/posts",{
        method: 'POST',
        headers: {
        },
        body: formData,
        });
        console.log('Post creation response status:', response.status);
      if (response.status === 201) {
        console.log('Post created');
        const data = await response.json();
        console.log('Post data:', data);
        setPopupMessage("Post created successfully!");
        setTimeout(() => setPopupMessage(null), 3000);
        navigate(`/posts/${data.id}`);

      } else {
        console.log('Failed to create post');
        setPopupMessage("Failed to create post. Please try again.");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setPopupMessage("Failed to create post. Please try again.");
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            type="text"
            className="input-field"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="textarea-field"
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input 
            type="file" 
            className="file-input"
            accept="image/*"
            onChange={handleFileChange} 
          />
          <button type="submit" className="submit-btn">Create Post</button>
        </form>
        {popupMessage && (
          <div className="popup-message">
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;