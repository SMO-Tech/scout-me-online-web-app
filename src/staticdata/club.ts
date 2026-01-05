export const STATIC_METRICS = [
    {
        title: "Attempts",
        value: "60x",
        total: 100, // Total attempts
        made: 60,   // Attempts made
        breakdown: "10x", // Breakdown of type/location
        color: "#4ADE80", // Green (for goal-oriented stats)
    },
    {
        title: "Shot On T",
        value: "17x",
        total: 100,
        made: 17,
        breakdown: "5x",
        color: "#1E90FF", // Blue
    },
    {
        title: "Shot Off T",
        value: "43x",
        total: 100,
        made: 43,
        breakdown: "6x",
        color: "#B388FF", // Purple/Violet
    },
    {
        title: "Goal",
        value: "5x",
        total: 100,
        made: 5,
        breakdown: "2x / 1x / 2x",
        color: "#FF4500", // Orange/Red
    },
];

// Static Data for the Club Card
export const STATIC_CLUB_DATA = {
    name: "Hashtag United FC",
    logoUrl: "/images/default/club_default.PNG", 
    id: "HAS001",
};

// dummy-metrics.ts
export const DUMMY_METRICS = [
  {
    title: "Attempts",
    value: 45,
    total: 45,
    made: 0,          // not really used for this card
    color: "#38bdf8",
  },
  {
    title: "Goals",
    value: 12,
    total: 45,
    made: 12,
    color: "#a855f7",
  },
  {
    title: "Assists",
    value: 7,
    total: 7,
    made: 7,
    color: "#22c55e",
  },
];
