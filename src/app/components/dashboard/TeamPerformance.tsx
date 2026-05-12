import { Users, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

interface TeamPerformanceProps {
  period: 'day' | 'week' | 'month';
  onNavigate?: (view: string) => void;
}

const teamMembers = [
  { id: 1, name: 'Иванов Иван', role: 'Оператор', kpi: 92, tasks: 24, errors: 2, bonus: 15000, efficiency: 95 },
  { id: 2, name: 'Петрова Мария', role: 'Куратор', kpi: 88, tasks: 18, errors: 1, bonus: 12000, efficiency: 92 },
  { id: 3, name: 'Сидоров Петр', role: 'Оператор', kpi: 76, tasks: 15, errors: 5, bonus: 8000, efficiency: 78 },
  { id: 4, name: 'Козлова Анна', role: 'Рекрутер', kpi: 85, tasks: 20, errors: 3, bonus: 10000, efficiency: 87 },
];

const topPerformers = [
  { name: 'Иванов Иван', metric: 'KPI', value: 92 },
  { name: 'Петрова Мария', metric: 'Скорость', value: 88 },
  { name: 'Козлова Анна', metric: 'Качество', value: 85 },
];

const problemEmployees = [
  { name: 'Сидоров Петр', issues: ['Частые ошибки', 'Низкая реакция'] },
  { name: 'Кузнецов Сергей', issues: ['Просрочки', 'Много несостыковок'] },
];

export function TeamPerformance({ period, onNavigate }: TeamPerformanceProps) {
  return (
    <section className="mb-8">
      <h2 className="text-gray-900 mb-6">Команда / Подчинённые</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Employee Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Таблица сотрудников</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Сотрудник</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Роль</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">KPI</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Задачи</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Ошибки</th>
                  <th className="text-right py-3 px-2 text-sm text-gray-600">Премии</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Эффект-ть</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{member.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{member.role}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${
                        member.kpi >= 90 ? 'bg-green-50 text-green-700' :
                        member.kpi >= 80 ? 'bg-blue-50 text-blue-700' :
                        'bg-orange-50 text-orange-700'
                      }`}>
                        {member.kpi}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-gray-900">{member.tasks}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${
                        member.errors <= 2 ? 'bg-gray-100 text-gray-600' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {member.errors}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-gray-900">₽{member.bonus.toLocaleString()}</td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              member.efficiency >= 90 ? 'bg-green-500' :
                              member.efficiency >= 80 ? 'bg-blue-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${member.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{member.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => onNavigate?.('workers')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">ТОП исполнителей</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900">{performer.name}</span>
                  <span className="text-sm text-gray-600">{performer.value}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        index === 0 ? 'bg-yellow-400' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-orange-400'
                      }`}
                      style={{ width: `${performer.value}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{performer.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Employees */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Проблемные сотрудники</h3>
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problemEmployees.map((employee, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 mb-2">{employee.name}</p>
                <div className="flex flex-wrap gap-1">
                  {employee.issues.map((issue, i) => (
                    <span key={i} className="px-2 py-1 bg-white text-orange-700 rounded text-xs border border-orange-200">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                className="text-orange-600 hover:text-orange-700"
                onClick={() => onNavigate?.('workers')}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
