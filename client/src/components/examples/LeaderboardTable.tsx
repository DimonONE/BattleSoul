import LeaderboardTable from "../LeaderboardTable";

export default function LeaderboardTableExample() {
  const players = [
    { rank: 1, username: "alex", level: 18, wins: 142, totalBattles: 165 },
    { rank: 2, username: "maria", level: 16, wins: 128, totalBattles: 155 },
    { rank: 3, username: "igor", level: 15, wins: 95, totalBattles: 120 },
    { rank: 4, username: "dimon", level: 12, wins: 32, totalBattles: 47, isCurrentUser: true },
    { rank: 5, username: "olena", level: 11, wins: 45, totalBattles: 68 },
    { rank: 6, username: "petro", level: 10, wins: 28, totalBattles: 52 },
  ];

  return <LeaderboardTable players={players} />;
}
