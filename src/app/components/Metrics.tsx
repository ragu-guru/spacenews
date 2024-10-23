import { Box, Typography, Paper, Divider } from "@mui/material";
import { getMetrics } from "@/app/actions/getMetrics";

interface Commenter {
    username: string;
    comment_count: number;
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
                {metrics.topCommenters.map((commenter: Commenter, index: number) => (
                    <Typography key={index} component="span" sx={{ mb: 0.5 }}>
                        <strong>{commenter.username}:</strong> {commenter.comment_count}{" "}
                        comments {index !== 2 ? ", " : ""}
                    </Typography>
                ))}
            </Paper>
        </Box>
    );
};

export default MetricsPage;
