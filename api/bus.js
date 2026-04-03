export default async function handler(req, res) {
  const { stop } = req.query;

  if (!stop) {
    return res.status(400).json({ error: "Missing stop parameter" });
  }

  // Simulated routes for Vancouver-style stops
  const routes = [
    { route: "99", destination: "UBC" },
    { route: "25", destination: "Brentwood" },
    { route: "R4", destination: "Joyce Station" },
    { route: "14", destination: "Hastings" },
    { route: "9", destination: "Downtown" }
  ];

  // Generate realistic arrival times
  function generateArrivals() {
    return routes.map(r => ({
      route: r.route,
      destination: r.destination,
      minutes: Math.floor(Math.random() * 20) + 1,
      direction: "EB"
    }));
  }

  // Sort by soonest arrival
  const buses = generateArrivals().sort((a, b) => a.minutes - b.minutes);

  res.status(200).json(buses);
}
