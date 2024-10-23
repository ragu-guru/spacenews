'use server'

export const getArticles = async (offset: number, limit: number) => {
  try {
    console.log({offset});
     const url = `https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}&offset=${offset}`;
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
