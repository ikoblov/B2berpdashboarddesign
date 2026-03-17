import { DollarSign, TrendingUp, TrendingDown, Users, Building2, AlertCircle, CheckCircle } from "lucide-react";

interface CompanyWideMetricsProps {
  period: 'day' | 'week' | 'month';
  onNavigate?: (view: string) => void;
}

const topClients = [
  { name: 'ООО "СтройГрупп"', volume: 2850000, trend: 'up' },
  { name: 'ЗАО "МегаСтрой"', volume: 1920000, trend: 'up' },
  { name: 'ИП Петров А.И.', volume: 1540000, trend: 'neutral' },
];

const problemClients = [
  { name: 'ООО "БыстроСтрой"', issues: ['Задержки оплаты', 'Частые переносы'] },
  { name: 'ЗАО "КапСтрой"', issues: ['Несостыковки в графике'] },
];

export function CompanyWideMetrics({ period, onNavigate }: CompanyWideMetricsProps) {
  return (
    <section className="mb-8">
      <h2 className="text-gray-900 mb-6">Компания</h2>

      {/* Revenue and Margin - Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Выручка</h3>
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div className="mb-4">
            <div className="text-4xl text-gray-900 mb-1">₽12.5М</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+18.5% vs прошлый период</span>
            </div>
          </div>
          {/* Mini graph */}
          <div className="flex items-end justify-between h-20 gap-1">
            <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '50%' }} />
            <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '65%' }} />
            <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '58%' }} />
            <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '75%' }} />
            <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '82%' }} />
            <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '90%' }} />
            <div className="flex-1 bg-blue-700 rounded-t" style={{ height: '100%' }} />
          </div>
        </div>

        {/* Margin */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Маржа</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="mb-4">
            <div className="text-4xl text-gray-900 mb-1">32.8%</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+2.3% vs прошлый период</span>
            </div>
          </div>
          {/* Mini graph */}
          <div className="flex items-end justify-between h-20 gap-1">
            <div className="flex-1 bg-green-300 rounded-t" style={{ height: '70%' }} />
            <div className="flex-1 bg-green-400 rounded-t" style={{ height: '75%' }} />
            <div className="flex-1 bg-green-400 rounded-t" style={{ height: '72%' }} />
            <div className="flex-1 bg-green-500 rounded-t" style={{ height: '80%' }} />
            <div className="flex-1 bg-green-500 rounded-t" style={{ height: '85%' }} />
            <div className="flex-1 bg-green-600 rounded-t" style={{ height: '92%' }} />
            <div className="flex-1 bg-green-700 rounded-t" style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      {/* Financial Efficiency */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Финансовая эффективность</h3>
          <DollarSign className="w-5 h-5 text-blue-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Входящие ставки</p>
            <div className="text-2xl text-gray-900 mb-2">₽18.2М</div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Исходящие ставки</p>
            <div className="text-2xl text-gray-900 mb-2">₽12.3М</div>
            <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: '67%' }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Валовая прибыль</p>
            <div className="text-2xl text-green-600 mb-2">₽5.9М</div>
            <div className="h-3 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '32%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Clients and Objects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top/Problem Clients */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Клиенты</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          
          {/* Top Clients */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">ТОП клиенты по объёму</p>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">₽{(client.volume / 1000000).toFixed(1)}М</p>
                    </div>
                  </div>
                  {client.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* Problem Clients */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Проблемные клиенты</p>
            <div className="space-y-2">
              {problemClients.map((client, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{client.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {client.issues.map((issue, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white text-orange-700 rounded text-xs">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Objects Efficiency */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Объекты: эффективность</h3>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          
          {/* Scatter plot representation */}
          <div className="relative h-64 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="absolute bottom-4 left-4 right-4 top-4">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border-r border-b border-gray-100" />
                ))}
              </div>
              
              {/* Data points */}
              <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ left: '70%', bottom: '75%' }} />
              <div className="absolute w-3 h-3 bg-green-500 rounded-full" style={{ left: '65%', bottom: '70%' }} />
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full" style={{ left: '50%', bottom: '60%' }} />
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full" style={{ left: '55%', bottom: '65%' }} />
              <div className="absolute w-3 h-3 bg-orange-500 rounded-full" style={{ left: '35%', bottom: '40%' }} />
              <div className="absolute w-3 h-3 bg-orange-500 rounded-full" style={{ left: '40%', bottom: '45%' }} />
              <div className="absolute w-3 h-3 bg-red-500 rounded-full" style={{ left: '20%', bottom: '25%' }} />
              <div className="absolute w-3 h-3 bg-red-500 rounded-full" style={{ left: '25%', bottom: '30%' }} />
            </div>
            
            {/* Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500">
              Стабильность →
            </div>
            <div className="absolute top-0 bottom-0 left-0 flex items-center">
              <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
                ← Маржа
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600">Отличные</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-gray-600">Хорошие</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-gray-600">Средние</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-600">Проблемные</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
