import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';  

interface IUser {
    _id: string;
    username: string;
  }
interface IComment {
    _id: string;
    owner: IUser | string;
    content: string;
    postId: string;
  }
  

const Comments = () => {
    const { postId } = useParams<{ postId: string }>();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('id'); 
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchComments = async () => {
          try {
            const commentResponse = await fetch(`${SERVER_URL}:${SERVER_PORT}/comments?postId=${postId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!commentResponse.ok) {
                throw new Error("Failed to fetch comments");
            }
            const commentsData= await commentResponse.json();
            setComments(commentsData);
          } catch (error) {
            console.error("Error fetching comments ", error);
          } finally {
            setLoading(false);
          }

        };
    
        fetchComments();
      }, [postId]); 
    
    const handleComment = async (e: any) => {
        e.preventDefault();
        if(!userId || !postId)
            return;
        
        try {
            const response = await fetch(`${SERVER_URL}:${SERVER_PORT}/comments/`, {
                method: "POST",
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment, postId: postId }),
            });
            if (response.ok) {
                setComment(""); 
                const responseData: { id: string } = await response.json();
                setComments(prevComments => [...prevComments, { _id: responseData.id, owner: userId , content: comment, postId: postId }]);
                window.location.reload();

            } else {
                console.error("Failed to post comment");
            }
            } catch (error) {
                console.error("Error posting comment", error);
            };
        };

        const handleDeleteComment = async (commentId : string) => {
            if (!userId) return;
            console.log(commentId);
            try {
                const response = await fetch(`${SERVER_URL}:${SERVER_PORT}/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
                } else {
                    console.error("Failed to delete comment");
                }
            } catch (error) {
                console.error("Error deleting comment", error);
            }
        };
  
    if ( loading) {
        return <p>Loading...</p>; 
    }
    return (
    <div>
        <form onSubmit={handleComment}>
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
        />
        <button type="submit">Post Comment</button>
        </form>
        <div>
            <h4>Comments:</h4>
            {comments.length > 0 ? (
                    comments.map((comment, idx) => (
                        <div key={idx}>
                            <strong>{typeof comment.owner === 'object' ? comment.owner.username : comment.owner}</strong>: {comment.content}
                            {typeof comment.owner === 'object' ? comment.owner.username : comment.owner === userId && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                    }}
                                >
                                    <FaTrash size={18} color="red" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No comments yet</p>
                )}
        </div>
    </div>
    );
}

export default Comments;
