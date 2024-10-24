// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

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
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
    }
}

