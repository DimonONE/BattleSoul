import CommandsList from "../CommandsList";

export default function CommandsListExample() {
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

  return <CommandsList commands={commands} />;
}
