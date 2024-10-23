'use client';
import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Container,
    Alert,
    TextField,
    Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getArticles } from '@/app/actions/getArticles';
import ArticleCard from '@/app/components/ArticleCard';
import { useInView } from 'react-intersection-observer';

// Types
type Article = {
    id: number;
    title: string;
    description: string;
    url: string;
    image_url: string;
    news_site: string;
    summary: string;
    published_at: string;
    updated_at: string;
};

const NUMBER_OF_ARTICLES_TO_FETCH = 10;

type UserListProps = {
    initialArticles: Article[]
}

export default function ArticleList({ initialArticles }: UserListProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [offset, setOffset] = useState(10);
    const { ref, inView } = useInView();
    const [search, setSearch] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [articleList, setArticleList] = useState<Article[]>(initialArticles);

    const loadMoreArticles = async (currentOffset: number = 0) => {
        console.log({ currentOffset });
        const newArticles = await getArticles(currentOffset, NUMBER_OF_ARTICLES_TO_FETCH);
        const results = newArticles.results;
        if (results && results.length > 0) {
            setArticles((prev) => {
                console.log(prev);
                const updatedArticles = [...prev, ...results]; // Combine previous and new articles
                setArticleList(updatedArticles);
                return updatedArticles;
            });

            console.log(articles.length);
            setOffset((prev) => prev + NUMBER_OF_ARTICLES_TO_FETCH); // Update the offset using the previous value
        }
    };

    const handleSearch = () => {
        console.log('Searching articles from:', startDate, 'to:', endDate);

        const results = articles.filter(article => {
            const articleDate = new Date(article.published_at); // Parse article's published date
            const start = startDate ? new Date(startDate) : null; // Parse start date

            // Normalize the start date to midnight (00:00:00)
            if (start) {
                start.setHours(0, 0, 0, 0); // Set to the start of the day
            }

            const end = endDate ? new Date(endDate) : null; // Parse end date

            // Normalize the end date to the end of the day (23:59:59.999)
            if (end) {
                end.setHours(23, 59, 59, 999); // Set to the end of the day
            }

            const matchesSearchTerm = article.title.toLowerCase().includes(searchTerm.toLowerCase());

            // Check if the article date is within the specified range
            const withinDateRange = (!start || articleDate >= start) && (!end || articleDate <= end);
            setSearch(true);
            return matchesSearchTerm && withinDateRange;
        });

        console.log(results);
        const loadingMsgEl = document.getElementById('loadingMsg');
        loadingMsgEl!.style.display = 'none';
        setArticleList(results);
    };

    const resetSearch = () => {
        setSearch(false);
        setArticleList(articles);
        const loadingMsgEl = document.getElementById('loadingMsg');
        loadingMsgEl!.style.display = 'block';
    }

    useEffect(() => {
        if (inView && !search) {
            loadMoreArticles(offset);
        }
    }, [inView]);

    return (
        <>
            <Grid container spacing={2} sx={{ mb: '20px' }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        label="Search by Title"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)} // Update search term on input change
                        style={{ marginBottom: '20px' }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Button variant="contained" onClick={handleSearch} fullWidth>
                        Search
                    </Button>

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>

                    <Button variant="contained" onClick={resetSearch} fullWidth>
                        Reset
                    </Button>
                </Grid>

            </Grid >
            <Grid container spacing={4}>
                {articleList.map((article, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${index}-${article.id}`}>
                        <ArticleCard key={article.id} article={article} />
                    </Grid>
                ))}
                <div ref={ref} id="loadingMsg">
                    Loading...
                </div>
            </Grid>
        </>
    );
}
