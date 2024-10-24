import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Link from "next/link";

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
  updated_at: string; // Consider using Date if you plan to parse it
};

/**
 * ArticleCard component to display an individual article's details.
 *
 * @param {Object} props - The component props.
 * @param {Article} props.article - The article data to be displayed.
 * @returns {JSX.Element} The rendered ArticleCard component.
 */
export default function ArticleCard({ article }: { article: Article }) {
  // Parse the published date
  const publishedDate = new Date(article.published_at);

  // Format the date to DD/MM/YYYY
  const formattedDate = `${publishedDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${(publishedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${publishedDate.getFullYear()}`;

  return (
    <Card>
      {/* Link to the article details page with the article ID */}
      <Link href={`/articles/${article.id}`}>
        <CardMedia
          component="img"
          height="200"
          image={article.image_url}
          alt={article.title}
        />
      </Link>
      <CardContent>
        {/* Article title with a link to the article details */}
        <Typography variant="h6" component="div" gutterBottom>
          <Link href={`/articles/${article.id}`}>{article.title}</Link>
        </Typography>

        {/* Shortened summary with a maximum length of 100 characters */}
        <Typography variant="body2" color="text.secondary">
          {article.summary.length > 100
            ? `${article.summary.substring(0, 100)}...`
            : article.summary}
        </Typography>

        {/* Display the published date */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          marginTop={2}
        >
          Published on: {formattedDate}
        </Typography>

        {/* Link to read more about the article */}
        <Typography
          variant="body2"
          color="primary"
          component="a"
          href={`/articles/${article.id}`}
        >
          Read more
        </Typography>
      </CardContent>
    </Card>
  );
}
