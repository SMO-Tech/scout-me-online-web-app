
import { BaseMatch } from "@/app/dashboard/matches/page";


export const dummyMatches: BaseMatch[] = [
  {
    id: "1",
    userId: "u1",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    lineUpImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400",
    status: "COMPLETED",
    level: "Professional",
    matchDate: "2025-12-20T14:00:00Z",
    competitionName: "Premier League",
    venue: "Stadium A",
    createdAt: "2025-12-19T10:00:00Z",
    updatedAt: "2025-12-19T12:00:00Z",
    result: { homeScore: 2, awayScore: 1 },
    matchClubs: [
      { name: "Red Warriors", isUsersTeam: true, jerseyColor: "red", club: { logoUrl: null }, country: "England" },
      { name: "Blue Knights", isUsersTeam: false, jerseyColor: "blue", club: { logoUrl: null }, country: "England" },
    ],
    user: { name: "Alice Johnson" },
    views: 120,
  },
  {
    id: "2",
    userId: "u2",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    lineUpImage: null,
    status: "PENDING",
    level: "Amateur",
    matchDate: "2025-12-18T16:00:00Z",
    competitionName: "Local Cup",
    venue: "Community Ground",
    createdAt: "2025-12-17T09:00:00Z",
    updatedAt: "2025-12-17T10:00:00Z",
    result: null,
    matchClubs: [
      { name: "Green Tigers", isUsersTeam: true, jerseyColor: "green", club: { logoUrl: null }, country: "USA" },
      { name: "Yellow Eagles", isUsersTeam: false, jerseyColor: "yellow", club: { logoUrl: null }, country: "USA" },
    ],
    user: { name: "Bob Smith" },
    views: 45,
  },
  {
    id: "3",
    userId: "u3",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    lineUpImage: "https://images.unsplash.com/photo-1581091870627-d5d7993abdbb?q=80&w=400",
    status: "COMPLETED",
    level: "Professional",
    matchDate: "2025-12-15T19:30:00Z",
    competitionName: "Champions League",
    venue: "Stadium B",
    createdAt: "2025-12-14T11:00:00Z",
    updatedAt: "2025-12-14T15:00:00Z",
    result: { homeScore: 3, awayScore: 3 },
    matchClubs: [
      { name: "Black Panthers", isUsersTeam: true, jerseyColor: "black", club: { logoUrl: null }, country: "Spain" },
      { name: "White Wolves", isUsersTeam: false, jerseyColor: "white", club: { logoUrl: null }, country: "Spain" },
    ],
    user: { name: "Carlos Diaz" },
    views: 200,
  },
  {
    id: "4",
    userId: "u4",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    lineUpImage: null,
    status: "FAILED",
    level: "Youth",
    matchDate: "2025-12-22T10:00:00Z",
    competitionName: "Youth League",
    venue: "Field C",
    createdAt: "2025-12-21T08:00:00Z",
    updatedAt: "2025-12-21T09:00:00Z",
    result: null,
    matchClubs: [
      { name: "Orange Foxes", isUsersTeam: true, jerseyColor: "orange", club: { logoUrl: null }, country: "Germany" },
      { name: "Purple Sharks", isUsersTeam: false, jerseyColor: "purple", club: { logoUrl: null }, country: "Germany" },
    ],
    user: { name: "Diana Lee" },
    views: 5,
  },
];

export const dummyMatch = {
    id: "match-001",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "COMPLETED" as const,
    level: "PROFESSIONAL",
    matchDate: "2025-12-25T15:00:00Z",
    competitionName: "Champions Cup",
    venue: "Stadium A",
    createdAt: "2025-12-20T12:00:00Z",
    matchClubs: [
        {
            id: "club-001",
            name: "Blue Lions",
            country: "England",
            jerseyColor: "Blue",
            isUsersTeam: true,
            club: { id: "club-001", logoUrl: null }
        },
        {
            id: "club-002",
            name: "Red Tigers",
            country: "Spain",
            jerseyColor: "Red",
            isUsersTeam: false,
            club: { id: "club-002", logoUrl: null }
        }
    ],
    matchPlayers: [
        {
            id: "player-001",
            jerseyNumber: 9,
            position: "Forward",
            playerProfile: {
                firstName: "John",
                lastName: "Doe",
                country: "England",
                primaryPosition: "Forward",
                avatar: null
            },
            stats: {
                goals: 2,
                assists: 1,
                shots: 5,
                shotsOnTarget: 3,
                passes: 30,
                passAccuracy: 85,
                tackles: 1,
                yellowCards: 0,
                redCards: 0,
                minutesPlayed: 90
            }
        },
        {
            id: "player-002",
            jerseyNumber: 10,
            position: "Midfielder",
            playerProfile: {
                firstName: "Alice",
                lastName: "Smith",
                country: "Spain",
                primaryPosition: "Midfielder",
                avatar: null
            },
            stats: {
                goals: 1,
                assists: 0,
                shots: 2,
                shotsOnTarget: 1,
                passes: 45,
                passAccuracy: 90,
                tackles: 2,
                yellowCards: 1,
                redCards: 0,
                minutesPlayed: 90
            }
        }
    ],
    result: {
        homeScore: 3,
        awayScore: 1,
        homePossession: 60,
        awayPossession: 40,
        homeShots: 12,
        awayShots: 8
    },
    user: { name: "Coach Mike" }
};


// Example static goalpost data
export const staticGoalpostData: Record<string, number> = {
  '0': 12.5,  // top-left
  '1': 25.0,  // top-2nd
  '2': 15.0,  // top-3rd
  '3': 20.0,  // top-right
  '4': 5.0,   // bottom-left (Wide Left)
  '5': 7.5,   // bottom-2nd
  '6': 10.0,  // bottom-3rd
  '7': 5.0,   // bottom-right (Wide Right)
}

// Example static donut data
export const staticShotTrajectoryData = {
  attacking: {
    total: 50,
    successful: 30,
    failed: 20,
  },
  defensive: {
    total: 40,
    successful: 25,
    failed: 15,
  },
};
