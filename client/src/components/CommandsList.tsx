import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Command {
  name: string;
  description: string;
  emoji: string;
  damageRange?: [number, number];
  healRange?: [number, number];
}

interface CommandsListProps {
  commands: Command[];
}

export default function CommandsList({ commands }: CommandsListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-4">Доступні команди</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((command, index) => (
          <Card
            key={index}
            className="p-4 hover-elevate"
            data-testid={`card-command-${index}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">{command.emoji}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold font-display" data-testid={`text-command-name-${index}`}>
                  {command.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {command.description}
                </p>
                {command.damageRange && (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    Шкода: {command.damageRange[0]}-{command.damageRange[1]}
                  </Badge>
                )}
                {command.healRange && (
                  <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Зцілення: {command.healRange[0]}-{command.healRange[1]} HP
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
