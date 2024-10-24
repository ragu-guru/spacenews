'use server';

/**
 * Fetches articles from the API with pagination.
 *
 * @param {number} offset - The number of articles to skip.
 * @param {number} limit - The maximum number of articles to fetch.
 * @returns {Promise<any>} The fetched articles data.
 * @throws {Error} If the fetch operation fails or if the response is not ok.
 */
export const getArticles = async (offset: number, limit: number): Promise<any> => {
    try {
        console.log({ offset, limit }); // Log both offset and limit for better debugging
        const url = `${process.env.NEXT_PUBLIC_SPACE_NEWS_API}?limit=${limit}&offset=${offset}`;
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching articles:', error); // Log the error for debugging
        throw new Error(`An error occurred while fetching articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
