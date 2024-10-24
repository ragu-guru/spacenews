// src/app/page.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import { getArticles } from "@/app/actions/getArticles"; // Importing the function to fetch articles
import ArticleList from "@/app/components/ArticleList"; // Importing the ArticleList component for displaying articles
import Metrics from "@/app/components/Metrics"; // Importing the Metrics component for displaying metrics

// Types
type Article = {
  id: number; // Unique identifier for the article
  title: string; // Title of the article
  description: string; // Brief description of the article
  url: string; // URL to the full article
  image_url: string; // Image URL associated with the article (snake_case)
  news_site: string; // The news site where the article is published
  summary: string; // Summary of the article
  published_at: string; // Date the article was published
  updated_at: string; // Date the article was last updated
};

const NUMBER_OF_ARTICLES_TO_FETCH = 10; // Constant defining how many articles to fetch

// The NewsFeed component which will display the articles
export default async function NewsFeed() {
  // Fetching the initial articles when the component mounts
  const initialArticles = await getArticles(0, NUMBER_OF_ARTICLES_TO_FETCH);
  let articles = []; // Initialize an empty array for articles

  // Check if articles were fetched successfully
  if (initialArticles?.results) {
    articles = initialArticles?.results; // Assign the fetched articles to the variable
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
