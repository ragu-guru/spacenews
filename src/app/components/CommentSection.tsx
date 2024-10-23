'use client';

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, List, ListItem, Divider, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

type Comment = {
    id?: number;  // id is optional initially (for optimistic updates)
    username: string;
    comment: string;
    created_at: string;
};

type CommentSectionProps = {
    articleId: number; // Pass the article ID to fetch related comments
};

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch comments for the specific article when the component mounts
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/comments?articleId=${articleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    setError("Failed to fetch comments.");
                }
            } catch (err) {
                setError("Error occurred while fetching comments.");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [articleId]);

    // Handle comment submission
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !comment) return;

        // Create a temporary comment with a current date
        const newComment: Comment = {
            username,
            comment,
            created_at: new Date().toISOString() // Temporary date for optimistic UI
        };
        setComments((prevComments) => [...prevComments, newComment]); // Optimistic UI update

        try {
            const response = await fetch(`/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, comment, articleId }), // Send comment data to API
            });

            if (!response.ok) {
                setError("Failed to submit comment.");
                // Revert optimistic update in case of failure
                setComments((prevComments) =>
                    prevComments.filter((c) => c !== newComment)
                );
            } else {
                const savedComment = await response.json();

                console.log({ newComment });
                // Update the comment with the data returned from the server (such as 'id')
                setComments((prevComments) =>
                    prevComments.map((c) =>
                        c === newComment ? { ...newComment, id: savedComment.id } : c
                    )
                );
            }
        } catch (err) {
            setError("Error occurred while submitting comment.");
            // Revert optimistic update in case of error
            setComments((prevComments) => prevComments.filter((c) => c !== newComment));
        }

        setUsername("");
        setComment("");
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Comments
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleCommentSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit Comment"}
                </Button>
            </form>
            {loading ? (
                <CircularProgress sx={{ mt: 2 }} />
            ) : (
                <List sx={{ mt: 2 }}>
                    {comments.length === 0 && (
                        <Typography variant="body2" color="textSecondary">
                            No comments yet. Be the first to comment!
                        </Typography>
                    )}
                    {comments.map((comment) => (
                        <Paper key={comment.id || comment.comment} sx={{ mb: 2, p: 2 }}>

                            <Typography variant="body2">

                                <strong>{comment.username}:</strong> {comment.comment}

                                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>

                                    Posted on: {new Date(comment.created_at).toLocaleString() || 'Invalid Date'}
                                </Typography>
                            </Typography>

                        </Paper>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default CommentSection;
