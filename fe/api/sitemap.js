export default async function handler(req, res) {
  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    return res.status(500).send("VITE_API_URL is not configured.");
  }

  try {
    const apiOrigin = new URL(apiUrl).origin;
    const response = await fetch(`${apiOrigin}/sitemap.xml`);
    const xml = await response.text();

    if (!response.ok) {
      console.error(`Backend sitemap request failed: ${response.status}`);
      return res.status(502).send("Could not retrieve sitemap from backend.");
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/xml; charset=utf-8"
    );
    res.setHeader(
      "Cache-Control",
      response.headers.get("cache-control") ||
        "public, max-age=3600, stale-while-revalidate=86400"
    );
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Could not retrieve sitemap from backend:", error);
    return res.status(502).send("Could not retrieve sitemap from backend.");
  }
}
