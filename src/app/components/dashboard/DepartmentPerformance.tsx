import { Building2, TrendingUp, AlertCircle, MessageSquare } from "lucide-react";

interface DepartmentPerformanceProps {
  period: 'day' | 'week' | 'month';
  onNavigate?: (view: string) => void;
}

export function DepartmentPerformance({ period, onNavigate }: DepartmentPerformanceProps) {
  return (
    <section className="mb-8">
      <h2 className="text-gray-900 mb-6">Отдел / Операционная картина</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Request Fulfillment */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Укомплектованность заявок</h3>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mb-4">
            <div className="text-3xl text-gray-900 mb-1">87%</div>
            <p className="text-sm text-gray-500">За {period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Понедельник</span>
              <span className="text-gray-900">92%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '92%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Вторник</span>
              <span className="text-gray-900">85%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '85%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Среда</span>
              <span className="text-gray-900">88%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* Shifts Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Смены за период</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Создано</span>
                <span className="text-gray-900">342</span>
              </div>
              <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Закрыто</span>
                <span className="text-gray-900">298</span>
              </div>
              <div className="h-2 bg-green-50 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '87%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Проблемные</span>
                <span className="text-gray-900">18</span>
              </div>
              <div className="h-2 bg-red-50 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
          {/* Mini line chart */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-end justify-between h-16 gap-1">
              <div className="flex-1 bg-blue-200 rounded-t" style={{ height: '60%' }} />
              <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '75%' }} />
              <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '90%' }} />
              <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '85%' }} />
              <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '95%' }} />
              <div className="flex-1 bg-blue-700 rounded-t" style={{ height: '100%' }} />
              <div className="flex-1 bg-blue-800 rounded-t" style={{ height: '88%' }} />
            </div>
          </div>
        </div>

        {/* Worker Discipline */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Дисциплина исполнителей</h3>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex items-center justify-center mb-4">
            {/* Pie Chart representation */}
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Late arrivals - 15% */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#f97316"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.15} ${2 * Math.PI * 50}`}
                  strokeDashoffset="0"
                />
                {/* No-shows - 10% */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#ef4444"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.10} ${2 * Math.PI * 50}`}
                  strokeDashoffset={`${-2 * Math.PI * 50 * 0.15}`}
                />
                {/* Disputes - 5% */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#facc15"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.05} ${2 * Math.PI * 50}`}
                  strokeDashoffset={`${-2 * Math.PI * 50 * 0.25}`}
                />
                {/* Good - 70% */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#22c55e"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.70} ${2 * Math.PI * 50}`}
                  strokeDashoffset={`${-2 * Math.PI * 50 * 0.30}`}
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span className="text-gray-600">Опоздания</span>
              </div>
              <span className="text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-gray-600">Не выходы</span>
              </div>
              <span className="text-gray-900">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded" />
                <span className="text-gray-600">Спорные случаи</span>
              </div>
              <span className="text-gray-900">5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-gray-600">Без нареканий</span>
              </div>
              <span className="text-gray-900">70%</span>
            </div>
          </div>
        </div>

        {/* Communications */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Коммуникации</h3>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-2xl text-gray-900 mb-1">127</div>
              <p className="text-sm text-gray-500">Ответов за день</p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Среднее время реакции</span>
              </div>
              <div className="text-xl text-blue-600">12 мин</div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Новые обращения</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">34</span>
              </div>
            </div>
          </div>
          <button 
            className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => onNavigate?.('communications')}
          >
            Открыть коммуникации
          </button>
        </div>
      </div>
    </section>
  );
}