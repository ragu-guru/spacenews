// server.ts
import express from 'express';
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

    // API Route for fetching users
    server.get('/api/users', async (req, res) => {
        try {
            const client = await pool.connect();
            const { rows } = await client.query('SELECT * FROM users'); // Assuming a 'users' table
            client.release();
            res.status(200).json(rows);
        } catch (error: any) {
            console.error('Database query error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Handle all other requests with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
