'use server';

/**
 * Fetches metrics from the API.
 *
 * @returns {Promise<any>} The fetched metrics data.
 * @throws {Error} If the fetch operation fails or if the response is not ok.
 */
export async function getMetrics(): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEWS_COMMENTS_DB_API}metrics`, {
            method: "GET",
            cache: "no-cache", // Ensures you get fresh data on every request
        });

        // Check if the response is OK
        if (!res.ok) {
            throw new Error(`Failed to fetch metrics: ${res.statusText}`);
        }

        // Parse the JSON response
        const data = await res.json();
        console.log("Fetched metrics:", data); // Log the fetched data
        return data;
    } catch (error) {
        console.error('Error fetching metrics:', error); // Log the error for debugging
        throw new Error(`An error occurred while fetching metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
