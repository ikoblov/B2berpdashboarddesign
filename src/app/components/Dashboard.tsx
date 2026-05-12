import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { PersonalPerformance } from "./dashboard/PersonalPerformance";
import { TeamPerformance } from "./dashboard/TeamPerformance";
import { DepartmentPerformance } from "./dashboard/DepartmentPerformance";
import { CompanyWideMetrics } from "./dashboard/CompanyWideMetrics";
import { DashboardActivityStream } from "./dashboard/DashboardActivityStream";

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

type UserRole = 'ceo' | 'manager' | 'operator' | 'hr' | 'field-curator' | 'recruiter';
type Period = 'day' | 'week' | 'month';

export function Dashboard({ onNavigate }: DashboardProps) {
  // Simulated user role - in production, this would come from auth context
  const [userRole] = useState<UserRole>('manager');
  const [period, setPeriod] = useState<Period>('week');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const hasSubordinates = ['ceo', 'manager'].includes(userRole);
  const isDepartmentHead = ['ceo', 'manager'].includes(userRole);
  const isCEO = userRole === 'ceo';

  return (
    <div className="p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Filters */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">Дашборд</h1>
              <p className="text-gray-600">Ваши показатели и активность компании</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            {/* Period Filter */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setPeriod('day')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  period === 'day'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                День
              </button>
              <button
                onClick={() => setPeriod('week')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  period === 'week'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Неделя
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  period === 'month'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Месяц
              </button>
            </div>

            {/* Department Filter (for managers/CEO) */}
            {hasSubordinates && (
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>Отдел: {selectedDepartment === 'all' ? 'Все' : selectedDepartment}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Performance Section (ALL ROLES) */}
        <PersonalPerformance period={period} onNavigate={onNavigate} />

        {/* Team Performance Section (Managers & CEO only) */}
        {hasSubordinates && (
          <TeamPerformance period={period} onNavigate={onNavigate} />
        )}

        {/* Department Performance Section (Department Heads & CEO) */}
        {isDepartmentHead && (
          <DepartmentPerformance period={period} onNavigate={onNavigate} />
        )}

        {/* Company-Wide Metrics (CEO only) */}
        {isCEO && (
          <CompanyWideMetrics period={period} onNavigate={onNavigate} />
        )}

        {/* Activity Stream */}
        <DashboardActivityStream onNavigate={onNavigate} />
      </div>
    </div>
  );
}