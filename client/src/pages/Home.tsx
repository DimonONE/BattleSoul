import { useState } from "react";
import TabNavigation from "@/components/TabNavigation";
import UserProfileHeader from "@/components/UserProfileHeader";
import StatsPanel from "@/components/StatsPanel";
import CommandsList from "@/components/CommandsList";
import PetCard from "@/components/PetCard";
import LeaderboardTable from "@/components/LeaderboardTable";
import BattleHistory from "@/components/BattleHistory";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const commands = [
    {
      name: "атака",
      description: "Завдає шкоду ворогу",
      emoji: "⚔️",
      damageRange: [5, 20] as [number, number],
    },
    {
      name: "зцілення",
      description: "Відновлює HP",
      emoji: "💚",
      healRange: [10, 20] as [number, number],
    },
    {
      name: "прокляття",
      description: "Зменшує силу противника",
      emoji: "☠️",
      damageRange: [3, 15] as [number, number],
    },
    {
      name: "захист",
      description: "Підвищує захист на наступний хід",
      emoji: "🛡️",
    },
  ];

  const pets = [
    {
      name: "Дракончик",
      emoji: "🐉",
      level: 5,
      hp: 85,
      maxHp: 100,
      strength: 45,
      evolutionStage: 2,
      maxEvolutionStage: 5,
      price: 150,
    },
    {
      name: "Фенікс",
      emoji: "🦅",
      level: 8,
      hp: 120,
      maxHp: 120,
      strength: 62,
      evolutionStage: 3,
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

  const players = [
    { rank: 1, username: "alex", level: 18, wins: 142, totalBattles: 165 },
    { rank: 2, username: "maria", level: 16, wins: 128, totalBattles: 155 },
    { rank: 3, username: "igor", level: 15, wins: 95, totalBattles: 120 },
    { rank: 4, username: "dimon", level: 12, wins: 32, totalBattles: 47, isCurrentUser: true },
    { rank: 5, username: "olena", level: 11, wins: 45, totalBattles: 68 },
    { rank: 6, username: "petro", level: 10, wins: 28, totalBattles: 52 },
  ];

  const battles = [
    {
      id: 1,
      attacker: "dimon",
      target: "alex",
      command: "атака",
      emoji: "⚔️",
      value: 15,
      type: "damage" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 2,
      attacker: "maria",
      target: "dimon",
      command: "зцілення",
      emoji: "💚",
      value: 12,
      type: "heal" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 3,
      attacker: "igor",
      target: "petro",
      command: "прокляття",
      emoji: "☠️",
      value: 8,
      type: "curse" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 4,
      attacker: "alex",
      target: "maria",
      command: "атака",
      emoji: "⚔️",
      value: 18,
      type: "damage" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ];

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
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleDarkMode}
            data-testid="button-theme-toggle"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {activeTab === "profile" && (
          <div className="space-y-8">
            <UserProfileHeader
              username="dimon"
              level={12}
              hp={250}
              maxHp={300}
              xp={1840}
              xpToNextLevel={2500}
              status="⚔️ Готовий до бою"
            />

            <StatsPanel totalBattles={47} wins={32} totalDamage={1240} />

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
                <div className="text-4xl font-bold font-display text-primary">165</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Всього гравців
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">3,420</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Боїв сьогодні
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">47,892</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Всього шкоди
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-card-border text-center">
                <div className="text-4xl font-bold font-display text-primary">18,240</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  Зцілень
                </div>
              </div>
            </div>

            <LeaderboardTable players={players} />

            <BattleHistory battles={battles} />
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
