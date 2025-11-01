import { Sword, ShoppingBag, BarChart3 } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: Tab[] = [
    { id: "profile", label: "Профіль", icon: <Sword className="w-5 h-5" /> },
    { id: "shop", label: "Магазин", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "stats", label: "Статистика", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="flex h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 font-medium transition-colors hover-elevate ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
            data-testid={`button-tab-${tab.id}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
