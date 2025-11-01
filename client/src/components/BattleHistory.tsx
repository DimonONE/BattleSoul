import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

interface Battle {
  id: number;
  attacker: string;
  target: string;
  command: string;
  emoji: string;
  value: number;
  type: "damage" | "heal" | "curse";
  timestamp: Date;
  won?: boolean;
}

interface BattleHistoryProps {
  battles: Battle[];
}

export default function BattleHistory({ battles }: BattleHistoryProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "damage":
        return "destructive";
      case "heal":
        return "secondary";
      case "curse":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-display">Історія боїв</h2>
      <div className="space-y-3">
        {battles.map((battle) => (
          <Card key={battle.id} className="p-4 hover-elevate" data-testid={`card-battle-${battle.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">{battle.emoji}</span>
                  <p className="text-base">
                    <span className="font-bold">@{battle.attacker}</span>
                    {" → "}
                    <span className="font-bold">@{battle.target}</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {battle.command}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant={getTypeColor(battle.type) as any}>
                    {battle.type === "damage" && `${battle.value} шкоди`}
                    {battle.type === "heal" && `+${battle.value} HP`}
                    {battle.type === "curse" && `-${battle.value}% сили`}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(battle.timestamp, {
                      addSuffix: true,
                      locale: uk,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
