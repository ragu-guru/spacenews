// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

// export async function GET() {
//     try {
//         const { rows } = await pool.query('SELECT users.username, comments.comment FROM comments JOIN users ON comments.user_id = users.id'); // Adjust your SQL query as needed
//         return NextResponse.json(rows);
//     } catch (error) {
//         console.error('Error fetching comments:', error);
//         return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
//     }
// }

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    try {
        // Use a JOIN to fetch comments along with associated usernames
        const { rows } = await db.query(
            `
            SELECT users.username, comments.comment, comments.created_at FROM comments JOIN users ON comments.user_id = users.id
            WHERE comments.article_id = $1
            `,
            [articleId]
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        // Optionally fetch updated comments if needed
        const comments = await db.query('SELECT * FROM comments WHERE article_id = $1', [articleId]);

        // Return the newly added comment along with all comments for the article
        return NextResponse.json({ newComment, comments: comments.rows }, { status: 201 });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
    }

}
