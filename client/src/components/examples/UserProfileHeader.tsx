import UserProfileHeader from "../UserProfileHeader";

export default function UserProfileHeaderExample() {
  return (
    <UserProfileHeader
      username="dimon"
      level={12}
      hp={250}
      maxHp={300}
      xp={1840}
      xpToNextLevel={2500}
      status="⚔️ Готовий до бою"
    />
  );
}
