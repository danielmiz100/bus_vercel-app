export default async function handler(req, res) {
  try {
    const r = await fetch(
      "https://api-v3.mbta.com/predictions?filter[stop]=place-sstat&include=route"
    );

    const json = await r.json();

    const now = Date.now();

    const buses = json.data
      .map(item => {
        const arrivalTime = item.attributes.arrival_time;

        if (!arrivalTime) return null; // skip invalid

        const arrival = new Date(arrivalTime).getTime();
        const minutes = Math.round((arrival - now) / 60000);

        if (minutes < 0) return null; // skip past buses

        return {
          route: item.relationships.route.data.id,
          destination: "Inbound",
          direction: item.attributes.direction_id === 0 ? "EB" : "WB",
          minutes
        };
      })
      .filter(Boolean)
      .slice(0, 10);

    res.status(200).json(buses);

  } catch (e) {
    res.status(500).json({ error: "failed", details: e.message });
  }
}
