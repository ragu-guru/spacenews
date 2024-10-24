// File: app/api/comments/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

/**
 * Fetch comments for a specific article.
 *
 * @param {Request} request - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.articleId - The ID of the article for which to fetch comments.
 * @returns {NextResponse} The response containing the comments or an error message.
 */
export async function GET(request: Request, { params }: { params: { articleId: string } }) {
    const { articleId } = params; // Extract articleId from the URL segment

    try {
        // Use a JOIN to fetch comments along with associated usernames
        const { rows } = await db.query(
            `
            SELECT users.username, comments.comment, comments.created_at 
            FROM comments 
            JOIN users ON comments.user_id = users.id
            WHERE comments.article_id = $1
            `,
            [articleId]
        );

        // Return the fetched comments as a JSON response
        return NextResponse.json(rows);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching comments:', error);

        // Return a JSON response with an error message and a 500 status code
        return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
    }
}
