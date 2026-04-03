export default async function handler(req, res) {
  const { stop } = req.query;

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

  function getEarlyBias() {
    return Math.random() < 0.2 ? -1 : 0; // 20% early
  }

  function generateArrivals() {
    const buses = [];

    routes.forEach(r => {
      const baseTimes = [3, 8, 15];

      baseTimes.forEach(t => {
        const adjustment = getEarlyBias();

        const minutes = Math.max(0, t + adjustment);

        buses.push({
          route: r.route,
          destination: r.destination,
          direction: r.direction,
          minutes
        });
      });
    });

    return buses.sort((a, b) => a.minutes - b.minutes);
  }

  res.status(200).json(generateArrivals());
}
