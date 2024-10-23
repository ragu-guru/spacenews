
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Container,
    Alert,
} from '@mui/material';
import Link from 'next/link';

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

export default function ArticleCard({ article }: { article: Article }) {
    const publishedDate = new Date(article.published_at);
    const formattedDate = `${publishedDate.getDate().toString().padStart(2, '0')}/${(publishedDate.getMonth() + 1).toString().padStart(2, '0')}/${publishedDate.getFullYear()}`;

    return (

        <Card>


            <Link href={`/articles/${article.id}`} ><CardMedia
                component="img"
                height="200"
                image={article.image_url}
                alt={article.title}
            />
            </Link>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    <Link href={`/articles/${article.id}`} >{article.title}</Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {article.summary.length > 100 ? `${article.summary.substring(0, 100)}...` : article.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" marginTop={2}>
                    Published on: {formattedDate}
                </Typography>

                <Typography variant="body2" color="primary" component="a" href={`/articles/${article.id}`} >
                    Read more
                </Typography>
            </CardContent>

        </Card >
    );
}
