import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Player {
  rank: number;
  username: string;
  level: number;
  wins: number;
  totalBattles: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getWinRate = (wins: number, total: number) => {
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-7 gap-4 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <div>Ранг</div>
        <div className="col-span-2">Гравець</div>
        <div>Рівень</div>
        <div>Перемоги</div>
        <div>Боїв</div>
        <div>Winrate</div>
      </div>

      <div className="space-y-2">
        {players.map((player) => {
          const winRate = getWinRate(player.wins, player.totalBattles);
          const rankEmoji = getRankBadge(player.rank);

          return (
            <Card
              key={player.rank}
              className={`p-4 ${
                player.isCurrentUser
                  ? "border-primary border-2 bg-primary/5"
                  : "hover-elevate"
              }`}
              data-testid={`row-player-${player.rank}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-bold font-display ${
                      player.rank <= 3 ? "text-3xl" : ""
                    }`}
                    data-testid={`text-rank-${player.rank}`}
                  >
                    {rankEmoji || `#${player.rank}`}
                  </span>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold" data-testid={`text-username-${player.rank}`}>
                      @{player.username}
                    </p>
                    {player.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Ви
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Badge className="font-bold">Рівень {player.level}</Badge>
                </div>

                <div>
                  <p className="text-lg font-bold font-mono text-green-600 dark:text-green-400">
                    {player.wins}
                  </p>
                  <p className="text-xs text-muted-foreground md:hidden">Перемоги</p>
                </div>

                <div>
                  <p className="text-lg font-bold font-mono">{player.totalBattles}</p>
                  <p className="text-xs text-muted-foreground md:hidden">Боїв</p>
                </div>

                <div>
                  <p className="text-lg font-bold font-mono" data-testid={`text-winrate-${player.rank}`}>
                    {winRate}%
                  </p>
                  <p className="text-xs text-muted-foreground md:hidden">Win rate</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
