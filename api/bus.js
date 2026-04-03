export default async function handler(req, res) {
  const { stop } = req.query;

  if (!stop) {
    return res.status(400).json({ error: "Missing stop parameter" });
  }

  const apiKey = "h2kQJcW1liXq6pSOQpLn";

  const url = `https://api.translink.ca/rttiapi/v1/stops/${stop}/estimates?apikey=${apiKey}&count=10&timeframe=60`;

  try {
    const r = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/xml"
      }
    });

    if (!r.ok) {
      return res.status(500).json({ error: "TransLink API error" });
    }

    const text = await r.text();

    const matches = text.match(/<NextBus>[\s\S]*?<\/NextBus>/g) || [];

    const buses = matches.map(block => {
      const get = (tag) => {
        const x = block.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
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
