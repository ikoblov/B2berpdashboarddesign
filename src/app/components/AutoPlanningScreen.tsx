import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Activity, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { PlanningDashboard } from './autoplanning/PlanningDashboard';
import { HealthDashboard } from './autoplanning/HealthDashboard';
import { SupplyDemandDashboard } from './autoplanning/SupplyDemandDashboard';
import { TodayPoolScreen } from './autoplanning/TodayPoolScreen';

type TabView = 'dashboard' | 'health' | 'supply-demand' | 'today-pool';

export function AutoPlanningScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse current tab from URL hash or default to dashboard
  const getCurrentTab = (): TabView => {
    const hash = location.hash.replace('#', '');
    if (['dashboard', 'health', 'supply-demand', 'today-pool'].includes(hash)) {
      return hash as TabView;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<TabView>(getCurrentTab());

  const handleTabChange = (tab: TabView) => {
    setActiveTab(tab);
    navigate(`/auto-planning#${tab}`, { replace: true });
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Планирование', icon: LayoutDashboard },
    { id: 'health' as const, label: 'Дашборд зон', icon: Activity },
    { id: 'supply-demand' as const, label: 'Прогноз С/П', icon: TrendingUp },
    { id: 'today-pool' as const, label: 'Today-Pool', icon: Users },
  ];

  return (
    <div className="min-h-screen">
      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center gap-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'dashboard' && <PlanningDashboard />}
        {activeTab === 'health' && <HealthDashboard />}
        {activeTab === 'supply-demand' && <SupplyDemandDashboard />}
        {activeTab === 'today-pool' && <TodayPoolScreen />}
      </div>
    </div>
  );
}