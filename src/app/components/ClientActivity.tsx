import { TrendingUp, Building2 } from "lucide-react";

const clients = [
  { name: "ООО \"СтройМастер\"", projects: 12, workers: 89, trend: "+15%", active: true },
  { name: "ГК \"УрбанДев\"", projects: 8, workers: 54, trend: "+8%", active: true },
  { name: "МегаСтрой Корп", projects: 15, workers: 112, trend: "+22%", active: true },
  { name: "СитиСтрой", projects: 5, workers: 32, trend: "-5%", active: false },
  { name: "ПраймБилдерс", projects: 7, workers: 45, trend: "+12%", active: true },
];

export function ClientActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 mb-1">Активность клиентов</h3>
          <p className="text-sm text-gray-500">Топ клиентов по количеству сотрудников</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">Все клиенты</button>
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-900">{client.name}</div>
                <div className="text-xs text-gray-500">
                  {client.projects} проектов · {client.workers} сотрудников
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 text-xs ${
                client.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {client.trend.startsWith('+') && <TrendingUp className="w-3 h-3" />}
                {client.trend}
              </div>
              {client.active && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}