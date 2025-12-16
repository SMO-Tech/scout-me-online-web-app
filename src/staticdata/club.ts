export const STATIC_METRICS = [
    {
        title: "Attempts",
        value: "60x",
        total: 100, // Total attempts
        made: 60,   // Attempts made
        breakdown: "10x / 30x / 20x", // Breakdown of type/location
        color: "#4ADE80", // Green (for goal-oriented stats)
    },
    {
        title: "Shot On T",
        value: "17x",
        total: 100,
        made: 17,
        breakdown: "5x / 5x / 7x",
        color: "#1E90FF", // Blue
    },
    {
        title: "Shot Off T",
        value: "43x",
        total: 100,
        made: 43,
        breakdown: "6x / 18x / 19x",
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
    logoUrl: "https://example.com/hashtag-logo.png", 
    id: "HAS001",
};