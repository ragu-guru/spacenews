// File: src/app/articles/[slug]/page.tsx
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import CommentSection from "@/app/components/CommentSection"; // Import CommentSection

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

/**
 * ArticleDetailPage component to display the details of a specific article.
 *
 * @param {Object} params - The route parameters.
 * @param {string} params.slug - The slug used to fetch the article.
 * @returns {JSX.Element} The rendered ArticleDetailPage component.
 */
export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch article data from the API server-side
  const res = await fetch(`${process.env.NEXT_PUBLIC_SPACE_NEWS_API}${slug}`);
  if (!res.ok) {
    // Return an error message if the fetch fails
    return (
      <Container>
        <Typography variant="h6">Failed to load article.</Typography>
      </Container>
    );
  }

  const article: ArticleDetail = await res.json(); // Parse the response JSON

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Link to go back to the feed */}
      <Link href="/">
        <Button variant="contained" color="primary" sx={{ mb: 4 }}>
          &larr; Back to feed
        </Button>
      </Link>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {article.title} {/* Display article title */}
      </Typography>
      <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
        {article.news_site} {/* Display the news site name */}
      </Typography>
      <Box
        component="img"
        src={article.image_url}
        alt={article.title} // Alternative text for the image
        sx={{ width: "100%", borderRadius: 2, mb: 2 }} // Image styles
      />
      <Typography variant="body1" sx={{ mb: 2 }}>
        {article.summary} {/* Display the article summary */}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Published at: {new Date(article.published_at).toLocaleString()}{" "}
        {/* Display published date */}
      </Typography>
      {/* Add the Comment Section here */}
      <CommentSection articleId={article.id} />{" "}
      {/* Render the Comment Section */}
    </Container>
  );
}
