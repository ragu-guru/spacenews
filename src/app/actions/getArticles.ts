'use server'

export const getArticles = async (offset: number, limit: number) => {
    try {
        console.log({ offset });
        const url = `${process.env.NEXT_PUBLIC_SPACE_NEWS_API}?limit=${limit}&offset=${offset}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        return data;
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
