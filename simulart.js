export default async function handler(req, res) {
  // SimulArt API KEY'in BURADA TUTULMAYACAK, environment'tan okunacak
  const API_KEY = process.env.SIMULART_API_KEY;
  const BASE = "https://dudullu.euframing.studio/api/v7/";

  if (!API_KEY) {
    return res.status(500).json({ error: "SIMULART_API_KEY not set" });
  }

  // Shopify App Proxy'den gelecek endpoint: getFrame, getMats, getMouldings vs.
  const { endpoint, ...rest } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Missing endpoint" });
  }

  // Tüm query parametrelerini SimulArt'a geçir + API key ekle
  const params = new URLSearchParams(rest);
  params.set("key", API_KEY);

  const url = `${BASE}${endpoint}?${params.toString()}`;

  try {
    const resp = await fetch(url);
    const text = await resp.text(); // JSON string gelecek

    res.setHeader("Content-Type", "application/json");
    return res.status(resp.status).send(text);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Proxy error", detail: e.message });
  }
}
