import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserProfileHeaderProps {
  username: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  xpToNextLevel: number;
  status: string;
}

export default function UserProfileHeader({
  username,
  level,
  hp,
  maxHp,
  xp,
  xpToNextLevel,
  status,
}: UserProfileHeaderProps) {
  const hpPercentage = (hp / maxHp) * 100;
  const xpPercentage = (xp / xpToNextLevel) * 100;

  return (
    <Card className="p-8" data-testid="card-user-profile">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative">
          <Avatar className="w-32 h-32" data-testid="avatar-user">
            <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Badge
            className="absolute -top-2 -right-2 px-3 py-1 text-sm font-bold"
            data-testid="badge-level"
          >
            Рівень {level}
          </Badge>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h1 className="text-3xl font-bold font-display" data-testid="text-username">
              @{username}
            </h1>
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-status">
              {status}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Здоров'я
                </span>
                <span className="text-sm font-bold font-mono" data-testid="text-hp">
                  {hp}/{maxHp} HP
                </span>
              </div>
              <div className="relative h-8 rounded-full bg-secondary overflow-hidden">
                <Progress
                  value={hpPercentage}
                  className="h-full"
                  data-testid="progress-hp"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold mix-blend-difference text-white">
                    {hp}/{maxHp} HP
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Досвід
                </span>
                <span className="text-sm font-bold font-mono" data-testid="text-xp">
                  {xp}/{xpToNextLevel} XP
                </span>
              </div>
              <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                <Progress
                  value={xpPercentage}
                  className="h-full"
                  data-testid="progress-xp"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Рівень {level} → {level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
