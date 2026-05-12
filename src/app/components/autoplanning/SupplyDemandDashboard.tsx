import { TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SupplyDemandDashboard() {
  // Mock data
  const activeWorkers = {
    total: 847,
    readyToday: 23,
    readyThisWeek: 187,
    workingNow: 312,
    unavailable: 325
  };

  const weeklyForecast = [
    { day: 'Сегодня Вт', demand: 340, supply: 312, percent: 92, zone: 'green' as const },
    { day: 'Завтра Ср', demand: 187, supply: 98, percent: 52, zone: 'yellow' as const },
    { day: 'Чт', demand: 120, supply: 34, percent: 28, zone: 'red' as const },
    { day: 'Пт', demand: 80, supply: 4, percent: 5, zone: 'red' as const },
    { day: 'Сб', demand: 60, supply: 0, percent: 0, zone: 'red' as const },
    { day: 'Вс', demand: 40, supply: 0, percent: 0, zone: 'red' as const },
    { day: 'Пн', demand: 150, supply: 22, percent: 15, zone: 'red' as const }
  ];

  const recommendations = [
    {
      title: 'На завтра дефицит 89 чел',
      action: 'Рассылка активным за 7 дней (256 чел)',
      buttonLabel: 'Запустить рассылку'
    },
    {
      title: 'На пт-вс дефицит критический',
      action: 'Масс. рассылка (выходные) для всей базы',
      buttonLabel: 'Запустить рассылку'
    },
    {
      title: '145 исполнителей без смен > 14 дней',
      action: 'Риск оттока',
      buttonLabel: 'Отправить напоминание'
    }
  ];

  const criticalObjects = [
    'ЖК Восток (3 дня подряд 🔴)',
    'Склад Ашан (4 дня подряд 🔴)'
  ];

  const getZoneEmoji = (zone: 'green' | 'yellow' | 'red') => {
    switch (zone) {
      case 'green': return '🟢';
      case 'yellow': return '🟡';
      case 'red': return '🔴';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Прогноз спроса и предложения</h1>
      </div>

      {/* Active workers summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Активные исполнители: {activeWorkers.total}</h3>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-gray-600">
            ├─ Готовы сегодня: <span className="font-medium text-gray-900">{activeWorkers.readyToday}</span>
          </div>
          <div className="text-gray-600">
            ├─ Готовы на неделе: <span className="font-medium text-gray-900">{activeWorkers.readyThisWeek}</span>
          </div>
          <div className="text-gray-600">
            ├─ Работают сейчас: <span className="font-medium text-gray-900">{activeWorkers.workingNow}</span>
          </div>
          <div className="text-gray-600">
            └─ Недоступны: <span className="font-medium text-gray-900">{activeWorkers.unavailable}</span>
          </div>
        </div>
      </div>

      {/* Weekly forecast */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Закрытие заявок по дням</h3>
        </div>

        <div className="space-y-2">
          {weeklyForecast.map((day, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">{day.day}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={cn(
                        'h-6 rounded-full transition-all',
                        day.zone === 'green' ? 'bg-green-500' : day.zone === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${day.percent}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 text-right">
                    {day.percent}%
                  </div>
                  <div className="w-8 text-center">
                    {getZoneEmoji(day.zone)}
                  </div>
                  <div className="w-24 text-sm text-gray-600 text-right">
                    {day.demand}/{day.supply}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-medium text-gray-900">Рекомендации системы</h3>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-gray-900 mb-1">• {rec.title}</div>
              <div className="text-sm text-gray-600 ml-4 mb-2">→ {rec.action}</div>
              <button className="ml-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                {rec.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Critical objects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Объекты в красной зоне {'>'} 2 дней</h3>
        <div className="space-y-2">
          {criticalObjects.map((obj, idx) => (
            <div key={idx} className="text-sm text-red-700">
              • {obj}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
