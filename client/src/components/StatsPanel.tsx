import { Card } from "@/components/ui/card";
import { Sword, Heart, Trophy } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  testId: string;
}

function StatCard({ icon, label, value, testId }: StatCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid={testId}>
      <div className="flex items-center gap-3">
        <div className="text-primary text-2xl">{icon}</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-bold font-display mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
}

interface StatsPanelProps {
  totalBattles: number;
  wins: number;
  totalDamage: number;
}

export default function StatsPanel({ totalBattles, wins, totalDamage }: StatsPanelProps) {
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Sword />}
        label="Боїв"
        value={totalBattles}
        testId="card-stat-battles"
      />
      <StatCard
        icon={<Trophy />}
        label="Перемоги"
        value={`${wins} (${winRate}%)`}
        testId="card-stat-wins"
      />
      <StatCard
        icon={<Heart />}
        label="Шкода"
        value={totalDamage}
        testId="card-stat-damage"
      />
    </div>
  );
}
