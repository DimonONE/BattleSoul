import { useState } from "react";
import TabNavigation from "../TabNavigation";

export default function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-8 text-center">
        <p className="text-lg">Активна вкладка: <span className="font-bold">{activeTab}</span></p>
      </div>
    </div>
  );
}
