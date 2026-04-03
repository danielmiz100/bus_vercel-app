export default async function handler(req, res) {
  try {
    const r = await fetch(
      "https://api-v3.mbta.com/predictions?filter[stop]=place-sstat&include=route"
    );

    const json = await r.json();

    const now = Date.now();

    const buses = json.data.slice(0, 10).map(item => {
      const arrival = new Date(item.attributes.arrival_time).getTime();

      return {
        route: item.relationships.route.data.id,
        destination: "Inbound",
        direction: item.attributes.direction_id === 0 ? "EB" : "WB",
        minutes: Math.max(0, Math.round((arrival - now) / 60000))
      };
    });

    res.status(200).json(buses);

  } catch (e) {
    res.status(500).json({ error: "failed", details: e.message });
  }
}
