import { useState } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';

interface RequestCard {
  id: string;
  number: string;
  objectName: string;
  time: string;
  requiredCount: number;
  healthScore: number;
  filled: number;
  npdPercent: number;
  showUpPercent: number;
}

export function HealthDashboard() {
  const navigate = useNavigate();
  const [selectedDate] = useState('15.05');

  // Mock data
  const zoneSummary = {
    green: 8,
    yellow: 3,
    red: 2
  };

  const redRequests: RequestCard[] = [
    {
      id: '1234',
      number: '#1234',
      objectName: 'ЖК Восток',
      time: '08:00',
      requiredCount: 15,
      healthScore: 42,
      filled: 4,
      npdPercent: 25,
      showUpPercent: 55
    },
    {
      id: '1267',
      number: '#1267',
      objectName: 'Склад Пятёрочка',
      time: '14:00',
      requiredCount: 8,
      healthScore: 48,
      filled: 3,
      npdPercent: 40,
      showUpPercent: 60
    }
  ];

  const yellowRequests: RequestCard[] = [
    {
      id: '1235',
      number: '#1235',
      objectName: 'Парковка Лента',
      time: '10:00',
      requiredCount: 8,
      healthScore: 68,
      filled: 6,
      npdPercent: 60,
      showUpPercent: 78
    },
    {
      id: '1240',
      number: '#1240',
      objectName: 'БЦ Столица',
      time: '09:00',
      requiredCount: 12,
      healthScore: 72,
      filled: 9,
      npdPercent: 65,
      showUpPercent: 80
    }
  ];

  const greenRequests: RequestCard[] = [
    {
      id: '1236',
      number: '#1236',
      objectName: 'ТЦ Горизонт',
      time: '08:00',
      requiredCount: 10,
      healthScore: 92,
      filled: 10,
      npdPercent: 80,
      showUpPercent: 95
    },
    {
      id: '1241',
      number: '#1241',
      objectName: 'Парковка Метро',
      time: '14:00',
      requiredCount: 6,
      healthScore: 88,
      filled: 6,
      npdPercent: 75,
      showUpPercent: 92
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Дашборд зон</h1>
        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Фильтры ▼</option>
            <option>Только срочные</option>
            <option>Без foreman</option>
            <option>Низкий НПД</option>
          </select>
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
            Обновить
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="text-sm text-gray-600">
        📅 Сегодня, {selectedDate}
      </div>

      {/* Zone summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-2">🟢</div>
          <div className="text-sm text-gray-600 mb-1">Зелёная</div>
          <div className="text-2xl font-semibold text-gray-900">{zoneSummary.green}</div>
          <div className="text-sm text-gray-600">заявок</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-2">🟡</div>
          <div className="text-sm text-gray-600 mb-1">Оранжевая</div>
          <div className="text-2xl font-semibold text-gray-900">{zoneSummary.yellow}</div>
          <div className="text-sm text-gray-600">заявок</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-2">🔴</div>
          <div className="text-sm text-gray-600 mb-1">Красная</div>
          <div className="text-2xl font-semibold text-gray-900">{zoneSummary.red}</div>
          <div className="text-sm text-gray-600">заявок</div>
        </div>
      </div>

      {/* Red zone requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">🔴 Красные (требуют внимания)</h3>
        </div>
        <div className="p-4 space-y-3">
          {redRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-red-50/50 rounded-lg border border-red-200 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => navigate(`/auto-planning/requests/${request.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">
                  {request.number} • {request.objectName} • {request.time} • {request.requiredCount} чел
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                    Подбор
                  </button>
                  <button className="px-3 py-1 border border-red-300 text-red-700 text-xs rounded hover:bg-red-50 transition-colors">
                    Эскалация
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Health: <span className="font-medium text-red-700">{request.healthScore}</span></span>
                <span>Закр: <span className="font-medium">{request.filled}/{request.requiredCount}</span></span>
                <span>НПД: <span className="font-medium">{request.npdPercent}%</span></span>
                <span>Явка: <span className="font-medium">{request.showUpPercent}%</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yellow zone requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">🟡 Оранжевые</h3>
        </div>
        <div className="p-4 space-y-2">
          {yellowRequests.map((request) => (
            <div
              key={request.id}
              className="p-3 bg-yellow-50/50 rounded border border-yellow-200 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => navigate(`/auto-planning/requests/${request.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-900">
                  {request.number} • {request.objectName} • {request.time} • {request.requiredCount} чел
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>H: {request.healthScore}</span>
                  <span>Закр: {request.filled}/{request.requiredCount}</span>
                  <span>НПД: {request.npdPercent}%</span>
                  <span>Явка: {request.showUpPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green zone requests (collapsible) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">🟢 Зелёные (всё хорошо)</h3>
        </div>
        <div className="p-4">
          <div className="space-y-1.5">
            {greenRequests.map((request) => (
              <div
                key={request.id}
                className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors text-sm text-gray-700"
                onClick={() => navigate(`/auto-planning/requests/${request.id}`)}
              >
                {request.number} • {request.objectName} • {request.time} • {request.requiredCount} чел (H: {request.healthScore})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
