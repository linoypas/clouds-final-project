import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserProfile.css';
function UserProfile() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem('id'); 

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);

    useEffect(() => {
        if (userInfo) {
            setNewUsername(userInfo.username || '');
        }
    }, [userInfo]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
    };
    const handleSaveChanges = async () => {
        const formData = new FormData();
        if (newImage) {
            formData.append("image", newImage);
        }
        formData.append("username", newUsername);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth/${userInfo._id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserInfo(updatedUser);
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.log("No user ID found, redirecting to login...");
            navigate('/login'); 
            return;
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth/${userId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                  });
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();
                setUserInfo(userData);

                const postsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/posts?owner=${userId}`);
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const postsData = await postsResponse.json();
                setUserPosts(postsData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]); 

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userInfo) {
        return <p>User not found</p>;
    }
    const handlePostClick = (postId: string) => {
        navigate(`/posts/${postId}`);
    };
    return (
        <div className="container">
            <div className="text-center my-12 flex flex-col items-center">
                <div className="relative">
                    {userInfo.image ? (
                        <img
                        src={userInfo.image ? `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}${userInfo.image}` : "default-avatar.png"}
                        alt="Profile"
                        className="profile-picture w-24 h-24 rounded-full object-cover border-4 border-gray-300"                    
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full">
                            <span className="text-gray-600">No Image</span>
                        </div>
                    )}

                    <button
                        className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-800 mt-4">{userInfo.username}</h2>
                <h2 className="text-xl text-gray-600 mt-1">{userInfo.email}</h2>
            </div>

            <h3 className="text-3xl font-semibold mt-8 text-gray-800 mb-6">Your Posts:</h3>
{/* Edit Modal */}
{isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                        <label className="block mb-2">New Profile Picture</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

                        <label className="block mb-2">New Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="flex justify-end">
                            <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveChanges}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            
            {userPosts.length === 0 ? (
                <p className="text-center text-gray-500">No posts available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                    {userPosts.map((post) => (
                        <div
                            key={post._id}
                            className="post-card"
                            onClick={() => handlePostClick(post._id)}
                        >
                            {post.image ? (
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}${post.image}`}
                                    alt={post.title}
                                    className="post-image"
                                />
                            ) : (
                                <div className="p-6 text-gray-700">
                                    <p>{post.content}</p>
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    );
}
    
export default UserProfile;
