// File: app/api/comments/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

/**
 * Handle adding a new comment to an article.
 *
 * @param {Request} request - The incoming request object containing the comment data.
 * @returns {NextResponse} The response containing the new comment and all comments for the article or an error message.
 */
export async function POST(request: Request) {
    // Extract username, comment, and articleId from the request body
    const { username, comment, articleId } = await request.json();

    try {
        // Fetch the user ID based on the username
        let userIdQuery = await db.query(
            'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
            [username]
        );

        let userId;

        if (userIdQuery.rowCount === 0) {
            // User not found, insert the username into the users table
            const insertUserQuery = await db.query(
                'INSERT INTO users (username) VALUES ($1) RETURNING id',
                [username]
            );

            userId = insertUserQuery.rows[0].id; // Get the ID of the newly inserted user
        } else {
            userId = userIdQuery.rows[0].id; // Get the ID of the existing user
        }

        console.log('User ID:', userId);

        // Insert the comment with the user ID
        const res = await db.query(
            'INSERT INTO comments (user_id, comment, article_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [userId, comment, articleId]
        );

        const newComment = res.rows[0];

        // Optionally fetch updated comments for the article
        const comments = await db.query('SELECT * FROM comments WHERE article_id = $1', [articleId]);

        // Return the newly added comment along with all comments for the article
        return NextResponse.json({ newComment, comments: comments.rows }, { status: 201 });

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error adding comment:', error);

        // Return a JSON response with an error message and a 500 status code
        return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
    }
}
