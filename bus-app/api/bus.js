export default async function handler(req, res) {
  const { stop } = req.query;

  const apiKey = "h2kQJcW1liXq6pSOQpLn";

  const url = `https://api.translink.ca/rttiapi/v1/stops/${stop}/estimates?apikey=${apiKey}&count=10&timeframe=60`;

  try {
    const r = await fetch(url, {
      headers: { "Accept": "application/xml" }
    });

    const text = await r.text();

    // Parse XML ? JSON (simple regex approach)
    const matches = [...text.matchAll(/<NextBus>([\s\S]*?)<\/NextBus>/g)];

    const buses = matches.map(m => {
      const get = (tag) => {
        const x = m[1].match(new RegExp(`<${tag}>(.*?)</${tag}>`));
        return x ? x[1] : "";
      };

      return {
        route: get("RouteNo"),
        destination: get("Destination"),
        minutes: parseInt(get("ExpectedCountdown") || "0"),
        direction: get("Direction")
      };
    });

    res.status(200).json(buses);

  } catch (e) {
    res.status(500).json({ error: "failed" });
  }
}