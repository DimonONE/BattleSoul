import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TabNavigation from "@/components/TabNavigation";
import UserProfileHeader from "@/components/UserProfileHeader";
import StatsPanel from "@/components/StatsPanel";
import CommandsList from "@/components/CommandsList";
import PetCard from "@/components/PetCard";
import LeaderboardTable from "@/components/LeaderboardTable";
import BattleHistory from "@/components/BattleHistory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from "@/lib/useWebSocket";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  const { data: wsData, connected } = useWebSocket();
  
  // Fetch commands from API
  const { data: commands = [] as any } = useQuery({
    queryKey: ["/api/commands"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Get current user (first user in the list or mock)
  const currentUser = wsData.users.length > 0 ? wsData.users[0] : {
    id: "1",
    username: "",
    hp: 0,
    maxHp: 0,
    xp: 0,
    lvl: 0,
    wins: 0,
    totalBattles: 0,
    totalDamage: 0,
    status: "⚔️ Готовий до бою",
  };

  // Calculate XP to next level
  const xpToNextLevel = currentUser.lvl * 200;

  // Mock pets for shop (todo: remove mock functionality)
  const pets = [
    {
      name: "Дракончик",
      emoji: "🐉",
      level: 1,
      hp: 120,
      maxHp: 120,
      strength: 45,
      evolutionStage: 1,
      maxEvolutionStage: 5,
      price: 150,
    },
    {
      name: "Фенікс",
      emoji: "🦅",
      level: 1,
      hp: 140,
      maxHp: 140,
      strength: 62,
      evolutionStage: 1,
      maxEvolutionStage: 5,
      price: 300,
      owned: true,
    },
    {
      name: "Вовк",
      emoji: "🐺",
      level: 3,
      hp: 60,
      maxHp: 75,
      strength: 30,
      evolutionStage: 1,
      maxEvolutionStage: 5,
      price: 80,
    },
    {
      name: "Грифон",
      emoji: "🦁",
      level: 6,
      hp: 95,
      maxHp: 110,
      strength: 50,
      evolutionStage: 2,
      maxEvolutionStage: 5,
      price: 200,
    },
  ];

  // Prepare players for leaderboard
  const players = wsData.users
    .sort((a, b) => {
      const aWinRate = a.totalBattles > 0 ? a.wins / a.totalBattles : 0;
      const bWinRate = b.totalBattles > 0 ? b.wins / b.totalBattles : 0;
      return bWinRate - aWinRate || b.wins - a.wins;
    })
    .slice(0, 10)
    .map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.lvl,
      wins: user.wins,
      totalBattles: user.totalBattles,
      isCurrentUser: user.id === currentUser.id,
    }));

  // Prepare battles for history
  const battles = wsData.battles.map((battle, index) => {
    const attacker = wsData.users.find((u) => u.id === battle.attackerId);
    const target = wsData.users.find((u) => u.id === battle.targetId);
    
    return {
      id: index,
      attacker: attacker?.username || "Unknown",
      target: target?.username || "Unknown",
      command: battle.command,
      emoji: battle.emoji,
      value: battle.value,
      type: battle.type,
      timestamp: new Date(battle.createdAt),
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚔️</div>
            <div>
              <h1 className="text-2xl font-bold font-display">BattleSoul RPG</h1>
              <p className="text-xs text-muted-foreground">Telegram Bot Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={connected ? "default" : "destructive"} className="gap-1">
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? "Підключено" : "Не підключено"}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleDarkMode}
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {activeTab === "profile" && (
          <div className="space-y-8">
            <UserProfileHeader
              username={currentUser.username}
              avatar={currentUser.avatar}
              level={currentUser.lvl}
              hp={currentUser.hp}
              maxHp={currentUser.maxHp}
              xp={currentUser.xp}
              xpToNextLevel={xpToNextLevel}
              status={currentUser.status}
            />

            <StatsPanel
              totalBattles={currentUser.totalBattles}
              wins={currentUser.wins}
              totalDamage={currentUser.totalDamage}
            />

            <CommandsList commands={commands} />
          </div>
        )}

        {activeTab === "shop" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Магазин питомців</h1>
              <p className="text-muted-foreground">
                Купуйте питомців, які допоможуть вам у боях
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet, index) => (
                <PetCard
                  key={index}
                  {...pet}
                  onPurchase={() => console.log(`Purchased ${pet.name}`)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">Статистика</h1>
              <p className="text-muted-foreground">
                Рейтинг гравців та історія боїв
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">
                  {wsData.users.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Гравців
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">
                  {wsData.battles.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Боїв сьогодні
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">
                  {wsData.users.reduce((acc, u) => acc + u.totalDamage, 0)}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Всього шкоди
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">
                  {wsData.users.reduce((acc, u) => acc + u.wins, 0)}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Перемоги
                </div>
              </div>
            </div>

            {players.length > 0 && <LeaderboardTable players={players} />}

            {battles.length > 0 && <BattleHistory battles={battles} />}

            {wsData.users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Поки що немає даних. Почніть використовувати бота в Telegram!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t bg-background py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>⚔️ BattleSoul RPG Bot • Telegram RPG Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
