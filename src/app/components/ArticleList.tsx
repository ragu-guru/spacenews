"use client";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { getArticles } from "@/app/actions/getArticles";
import ArticleCard from "@/app/components/ArticleCard";
import { useInView } from "react-intersection-observer";

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
  initialArticles: Article[];
};

/**
 * ArticleList component to display a list of articles with search functionality.
 *
 * @param {UserListProps} props - Initial articles to be displayed.
 * @returns {JSX.Element} The rendered ArticleList component.
 */
export default function ArticleList({ initialArticles }: UserListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [offset, setOffset] = useState(10);
  const { ref, inView } = useInView(); // Intersection observer for lazy loading articles
  const [search, setSearch] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [articleList, setArticleList] = useState<Article[]>(initialArticles);

  /**
   * Load more articles when the user scrolls into view.
   * @param {number} currentOffset - The current offset to load more articles.
   */
  const loadMoreArticles = async (currentOffset: number = 0) => {
    console.log({ currentOffset });
    const newArticles = await getArticles(
      currentOffset,
      NUMBER_OF_ARTICLES_TO_FETCH
    );
    const results = newArticles.results;

    // If new articles are fetched, update the state
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

  /**
   * Handles the search functionality for articles based on title and date range.
   */
  const handleSearch = () => {
    console.log("Searching articles from:", startDate, "to:", endDate);

    const results = articles.filter((article) => {
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

      const matchesSearchTerm = article.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if the article date is within the specified range
      const withinDateRange =
        (!start || articleDate >= start) && (!end || articleDate <= end);
      setSearch(true);
      return matchesSearchTerm && withinDateRange;
    });

    console.log(results);
    const loadingMsgEl = document.getElementById("loadingMsg");
    loadingMsgEl!.style.display = "none"; // Hide loading message
    setArticleList(results); // Update the displayed article list with search results
  };

  /**
   * Resets the search filters and displays the original article list.
   */
  const resetSearch = () => {
    setSearch(false);
    setArticleList(articles); // Reset to the original articles
    const loadingMsgEl = document.getElementById("loadingMsg");
    loadingMsgEl!.style.display = "block"; // Show loading message
  };

  useEffect(() => {
    if (inView && !search) {
      loadMoreArticles(offset); // Load more articles when the component is in view
    }
  }, [inView]);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: "20px" }}>
        {/* Search by Title */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Search by Title"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)} // Update search term on input change
            style={{ marginBottom: "20px" }}
          />
        </Grid>

        {/* Start Date Filter */}
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

        {/* End Date Filter */}
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

        {/* Search Button */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Button variant="contained" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </Grid>

        {/* Reset Button */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Button variant="contained" onClick={resetSearch} fullWidth>
            Reset
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Render the list of articles */}
        {articleList.map((article, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${index}-${article.id}`}>
            <ArticleCard key={article.id} article={article} />
          </Grid>
        ))}

        {/* Loading Message */}
        <div ref={ref} id="loadingMsg">
          Loading...
        </div>
      </Grid>
    </>
  );
}
