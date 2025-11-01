import BattleHistory from "../BattleHistory";

export default function BattleHistoryExample() {
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
  ];

  return <BattleHistory battles={battles} />;
}
