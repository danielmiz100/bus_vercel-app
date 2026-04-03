export default async function handler(req, res) {
  const { stop } = req.query;

  // Define stops with realistic routes
  const stops = {
    "52035": [
      { route: "145", destination: "SFU", direction: "N" },
      { route: "136", destination: "Lougheed Station", direction: "W" },
      { route: "180", destination: "Moody Centre", direction: "E" }
    ],
    "52813": [
      { route: "156", destination: "Braid Station", direction: "E" },
      { route: "159", destination: "Coquitlam Central", direction: "W" }
    ]
  };

  const routes = stops[stop] || stops["52035"];

  function generateArrivals() {
    const buses = [];

    routes.forEach(r => {
      const count = Math.floor(Math.random() * 2) + 1;

      let base = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < count; i++) {
        buses.push({
          route: r.route,
          destination: r.destination,
          direction: r.direction,
          minutes: base + i * (5 + Math.floor(Math.random() * 5))
        });
      }
    });

    return buses.sort((a, b) => a.minutes - b.minutes);
  }

  res.status(200).json(generateArrivals());
}
