import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; // Adjust the path according to your project structure

export async function GET(request: Request) {
    try {
        // Your logic to fetch metrics
        // For example, top 3 commenters and average comments per day

        // Fetch top 3 commenters
        const topCommentersQuery = await db.query(`
            SELECT users.username, COUNT(*) as comment_count
            FROM comments
            JOIN users ON users.id = comments.user_id
            GROUP BY username
            ORDER BY comment_count DESC
            LIMIT 3
        `);
        const topCommenters = topCommentersQuery.rows;

        // Fetch average comments per day
        const avgCommentsQuery = await db.query(`
            SELECT AVG(comment_count) as average_comments
            FROM (
                SELECT DATE(created_at) as comment_date, COUNT(*) as comment_count
                FROM comments
                GROUP BY comment_date
            ) as daily_counts
        `);
        const averageComments = avgCommentsQuery.rows[0]?.average_comments || 0;

        // Combine the metrics into a response object
        const metrics = {
            topCommenters,
            averageComments,
        };

        return NextResponse.json(metrics, { status: 200 });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json({ message: 'Error fetching metrics' }, { status: 500 });
    }
}
