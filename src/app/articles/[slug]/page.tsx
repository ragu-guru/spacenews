// File: src/app/articles/[slug]/page.tsx
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import CommentSection from '@/app/components/CommentSection'; // Import CommentSection

// Types
type ArticleDetail = {
    id: number;
    title: string;
    summary: string;
    published_at: string;
    news_site: string;
    image_url: string;
    content: string;
};

// This is a Server Component by default
export default async function ArticleDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    // Fetch article data from the API server-side
    const res = await fetch(
        `https://api.spaceflightnewsapi.net/v4/articles/${slug}`
    );
    if (!res.ok) {
        return (
            <Container>
                <Typography variant="h6">Failed to load article.</Typography>
            </Container>
        );
    }

    const article: ArticleDetail = await res.json();
    console.log(article);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Link href="/">
                <Button variant="contained" color="primary" sx={{ mb: 4 }}>
                    &larr; Back to feed
                </Button>
            </Link>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {article.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                {article.news_site}
            </Typography>
            <Box
                component="img"
                src={article.image_url}
                alt={article.title}
                sx={{ width: "100%", borderRadius: 2, mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
                {article.summary}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Published at: {new Date(article.published_at).toLocaleString()}
            </Typography>


            {/* Add the Comment Section here */}
            <CommentSection articleId={article.id} />
        </Container>
    );
}
