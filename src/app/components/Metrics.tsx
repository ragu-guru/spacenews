import { Box, Typography, Paper, Divider } from "@mui/material";
import { getMetrics } from "@/app/actions/getMetrics";

async function fetchMetrics() {
  const res = await fetch("/api/metrics", {
    method: "GET",
    cache: "no-cache", // Ensures you get fresh data on every request
  });

  if (!res.ok) {
    throw new Error("Failed to fetch metrics");
  }

  const data = await res.json();
  console.log("Fetched metrics:", data); // Log the fetched data
  return data;
}

const MetricsPage = async () => {
  let metrics = null;
  try {
    metrics = await getMetrics();
  } catch (error: any) {
    return <Typography color="error">{error?.message}</Typography>;
  }

  console.log(metrics);
  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Engagement Metrics
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Average Comments per Day: {parseInt(metrics.averageComments) || "N/A"}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Top 3 Commenters:
        </Typography>
        {metrics.topCommenters.map((commenter, index) => (
          <Typography key={index} variant="span" sx={{ mb: 0.5 }}>
            <strong>{commenter.username}:</strong> {commenter.comment_count}{" "}
            comments {index !== 2 ? ", " : ""}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
};

export default MetricsPage;
