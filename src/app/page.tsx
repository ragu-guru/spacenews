// src/app/page.tsx
import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Container,
    Alert,
} from '@mui/material';
import { getArticles } from '@/app/actions/getArticles';
import ArticleList from '@/app/components/ArticleList';
import Metrics from '@/app/components/Metrics';


// type ArticleResponse = {
//     count: number;
//     next: string | null;    // URL for the next page of results
//     previous: string | null; // URL for the previous page of results
//     results: Article[];      // Array of Article objects
// };

// Types
type Article = {
    id: number;
    title: string;
    description: string;
    url: string;
    image_url: string; // Use snake_case as per the API response
    news_site: string;
    summary: string;
    published_at: string; // Consider using Date if you plan to parse it
    updated_at: string;   // Consider using Date if you plan to parse it
};

const NUMBER_OF_ARTICLES_TO_FETCH = 10;


export default async function NewsFeed() {
    // const [articles, setArticles] = useState<Article[]>([]);
    // const [offset, setOffset] = useState(0);
    // const { ref, inView } = useInView()

    const initialArticles = await getArticles(0, NUMBER_OF_ARTICLES_TO_FETCH);
    let articles = [];
    if (initialArticles?.results) {
        articles = initialArticles?.results;
    }


    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" marginTop={5}>
                Spaceflight News
            </Typography>
            <Metrics />
            <ArticleList initialArticles={articles} />
        </Container>

    );
}
