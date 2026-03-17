import { Activity, User, CheckCircle, AlertCircle, FileText, Users, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface DashboardActivityStreamProps {
  onNavigate?: (view: string) => void;
}

type ActivityFilter = 'personal' | 'team' | 'critical';

const activities = {
  personal: [
    { id: 1, type: 'task', icon: CheckCircle, text: 'Вы завершили задачу "Проверка заявки #1234"', time: '5 мин назад', color: 'text-green-600' },
    { id: 2, type: 'request', icon: FileText, text: 'Вы создали новую заявку для ООО "СтройГрупп"', time: '1 час назад', color: 'text-blue-600' },
    { id: 3, type: 'shift', icon: Clock, text: 'Вы одобрили смену для Иванова И.И.', time: '2 часа назад', color: 'text-purple-600' },
  ],
  team: [
    { id: 4, type: 'task', icon: Users, text: 'Петрова М.А. завершила задачу "Укомплектование объекта"', time: '10 мин назад', color: 'text-blue-600' },
    { id: 5, type: 'worker', icon: User, text: 'Сидоров П.И. отметил начало смены', time: '30 мин назад', color: 'text-green-600' },
    { id: 6, type: 'request', icon: FileText, text: 'Козлова А.В. создала заявку #1245', time: '1 час назад', color: 'text-blue-600' },
    { id: 7, type: 'shift', icon: Clock, text: 'Иванов И.И. завершил смену на объекте "Бизнес-центр А"', time: '2 часа назад', color: 'text-purple-600' },
  ],
  critical: [
    { id: 8, type: 'alert', icon: AlertCircle, text: 'Критическая нехватка исполнителей на объекте "Складской комплекс"', time: '15 мин назад', color: 'text-red-600' },
    { id: 9, type: 'alert', icon: AlertCircle, text: 'Просроченная заявка #1198 требует внимания', time: '45 мин назад', color: 'text-orange-600' },
    { id: 10, type: 'alert', icon: AlertCircle, text: 'Клиент ООО "БыстроСтрой" не отвечает на запросы', time: '3 часа назад', color: 'text-red-600' },
  ],
};

export function DashboardActivityStream({ onNavigate }: DashboardActivityStreamProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('personal');

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Лента активности</h2>
        <button 
          className="text-sm text-blue-600 hover:text-blue-700"
          onClick={() => onNavigate?.('activity')}
        >
          Показать все
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200">
          <button
            onClick={() => setActiveFilter('personal')}
            className={cn(
              "px-4 py-2 rounded-md text-sm transition-all",
              activeFilter === 'personal'
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Личные действия
          </button>
          <button
            onClick={() => setActiveFilter('team')}
            className={cn(
              "px-4 py-2 rounded-md text-sm transition-all",
              activeFilter === 'team'
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Действия команды
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={cn(
              "px-4 py-2 rounded-md text-sm transition-all",
              activeFilter === 'critical'
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Критические события
          </button>
        </div>

        {/* Activity List */}
        <div className="divide-y divide-gray-100">
          {activities[activeFilter].map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={cn("p-2 rounded-lg", 
                  activeFilter === 'critical' ? 'bg-red-50' : 
                  activity.type === 'task' ? 'bg-green-50' : 
                  activity.type === 'request' ? 'bg-blue-50' : 
                  activity.type === 'shift' ? 'bg-purple-50' : 
                  'bg-gray-50'
                )}>
                  <Icon className={cn("w-5 h-5", activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}