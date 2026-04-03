export default async function handler(req, res) {
  const { stop } = req.query;

  if (!stop) {
    return res.status(400).json({ error: "Missing stop parameter" });
  }

  const apiKey = "h2kQJcW1liXq6pSOQpLn";

  const url = `https://api.translink.ca/rttiapi/v1/stops/${stop}/estimates?apikey=${apiKey}&count=10&timeframe=60`;

  console.log("=== REQUEST START ===");
  console.log("Stop:", stop);
  console.log("URL:", url);

  try {
    const r = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/xml",
        "User-Agent": "Mozilla/5.0"
      }
    });

    console.log("Response status:", r.status);
    console.log("Response ok:", r.ok);

    const text = await r.text();

    console.log("=== RAW API RESPONSE START ===");
    console.log(text);
    console.log("=== RAW API RESPONSE END ===");

    if (!r.ok) {
      return res.status(500).json({
        error: "TransLink API error",
        status: r.status,
        body: text
      });
    }

    const matches = text.match(/<NextBus>[\s\S]*?<\/NextBus>/g) || [];

    console.log("NextBus matches found:", matches.length);

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

    console.log("Parsed buses:", buses);

    console.log("=== REQUEST SUCCESS ===");

    res.status(200).json(buses);

  } catch (e) {
    console.log("=== ERROR ===");
    console.log(e);

    res.status(500).json({
      error: "failed",
      details: e.message,
      stack: e.stack
    });
  }
}
