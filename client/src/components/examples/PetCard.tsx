import PetCard from "../PetCard";

export default function PetCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PetCard
        name="Дракончик"
        emoji="🐉"
        level={5}
        hp={85}
        maxHp={100}
        strength={45}
        evolutionStage={2}
        maxEvolutionStage={5}
        price={150}
        onPurchase={() => console.log("Purchased Dragon")}
      />
      <PetCard
        name="Фенікс"
        emoji="🦅"
        level={8}
        hp={120}
        maxHp={120}
        strength={62}
        evolutionStage={3}
        maxEvolutionStage={5}
        price={300}
        owned={true}
      />
      <PetCard
        name="Вовк"
        emoji="🐺"
        level={3}
        hp={60}
        maxHp={75}
        strength={30}
        evolutionStage={1}
        maxEvolutionStage={5}
        price={80}
        onPurchase={() => console.log("Purchased Wolf")}
      />
    </div>
  );
}
