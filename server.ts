// server.ts
import express, { Request, Response } from 'express';
import next from 'next';
import pool from './lib/db';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Middleware for parsing JSON
    server.use(express.json());

    // Health check endpoint
    server.get('/api/health', async (req, res) => {
        try {
            const client = await pool.connect();
            await client.query('SELECT 1'); // A simple query to test the connection
            client.release();
            res.status(200).json({ status: 'Database connection successful' });
        } catch (error: any) {
            console.error('Database connection error:', error.message);
            res.status(500).json({ status: 'Database connection failed', error: error.message });
        }
    });

    // API Route for fetching comments
    server.get('/api/v1/comments/:articleId', async (req, res) => {
        try {
            const { articleId } = req.params; // Get articleId from the URL
            const client = await pool.connect();

            const { rows } = await client.query(
                `SELECT users.username, comments.comment, comments.created_at 
             FROM comments 
             JOIN users ON comments.user_id = users.id
             WHERE comments.article_id = $1`, [articleId]
            ); // Assuming a 'users' table

            client.release();
            res.status(200).json(rows);
        } catch (error: any) {
            console.error('Database query error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    // POST route for adding a comment
    server.post('/api/v1/comments', async (req: Request, res: Response) => {
        const { username, comment, articleId } = req.body;

        // Validate request parameters
        if (!username || !comment || !articleId) {
            return res.status(400).json({ message: 'Username, comment, and articleId are required.' });
        }

        const client = await pool.connect(); // Acquire the database connection
        try {
            // Check if the user already exists
            const userIdQuery = await client.query(
                'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
                [username]
            );

            let userId;

            if (userIdQuery.rowCount === 0) {
                // Insert the new user if not found
                const insertUserQuery = await client.query(
                    'INSERT INTO users (username) VALUES ($1) RETURNING id',
                    [username]
                );
                userId = insertUserQuery.rows[0].id;
            } else {
                // Use the existing user's ID
                userId = userIdQuery.rows[0].id;
            }

            // Insert the comment with the user ID and article ID
            const commentInsertQuery = await client.query(
                'INSERT INTO comments (user_id, comment, article_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
                [userId, comment, articleId]
            );

            const newComment = commentInsertQuery.rows[0];

            // Fetch all comments for the article
            const commentsQuery = await client.query(
                'SELECT * FROM comments WHERE article_id = $1',
                [articleId]
            );

            // Return the newly added comment and the list of all comments for the article
            return res.status(201).json({ newComment, comments: commentsQuery.rows });


        } catch (error: any) {
            console.error('Error adding comment:', error.message);
            return res.status(500).json({ message: 'Error adding comment' });
        } finally {
            client.release(); // Release the database connection back to the pool
        }
    });



    // Handle all other requests with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3003;
    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
