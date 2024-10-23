'use server'

export async function getMetrics() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}metrics`, {
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
