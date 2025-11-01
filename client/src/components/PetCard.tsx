import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart } from "lucide-react";

interface PetCardProps {
  name: string;
  emoji: string;
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  evolutionStage: number;
  maxEvolutionStage: number;
  price: number;
  owned?: boolean;
  onPurchase?: () => void;
}

export default function PetCard({
  name,
  emoji,
  level,
  hp,
  maxHp,
  strength,
  evolutionStage,
  maxEvolutionStage,
  price,
  owned = false,
  onPurchase,
}: PetCardProps) {
  const hpPercentage = (hp / maxHp) * 100;

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-pet-${name}`}>
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
        <div className="text-8xl">{emoji}</div>
        <Badge className="absolute top-2 right-2" data-testid={`badge-pet-level-${name}`}>
          Рівень {level}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold font-display" data-testid={`text-pet-name-${name}`}>
            {name}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              HP
            </span>
            <span className="text-sm font-bold font-mono">
              {hp}/{maxHp}
            </span>
          </div>
          <Progress value={hpPercentage} className="h-3" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Сила
          </span>
          <span className="text-lg font-bold font-mono" data-testid={`text-pet-strength-${name}`}>
            ⚡ {strength}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Еволюція
            </span>
            <span className="text-xs font-mono">
              {evolutionStage}/{maxEvolutionStage}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxEvolutionStage }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < evolutionStage ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          variant={owned ? "secondary" : "default"}
          disabled={owned}
          onClick={onPurchase}
          data-testid={`button-purchase-${name}`}
        >
          {owned ? (
            "У власності"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="font-bold">{price} 💎</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
