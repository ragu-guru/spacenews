// File: app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; // Adjust the path according to your project structure

/**
 * Fetches metrics related to comments, including top commenters and average comments per day.
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} The response containing the metrics or an error message.
 */
export async function GET(request: Request) {
    try {
        // Fetch top 3 commenters
        const topCommentersQuery = await db.query(`
            SELECT users.username, COUNT(*) as comment_count
            FROM comments
            JOIN users ON users.id = comments.user_id
            GROUP BY users.username
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

        // Return metrics as a JSON response
        return NextResponse.json(metrics, { status: 200 });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching metrics:', error);

        // Return a JSON response with an error message and a 500 status code
        return NextResponse.json({ message: 'Error fetching metrics' }, { status: 500 });
    }
}
