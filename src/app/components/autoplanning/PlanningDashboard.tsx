import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plus, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { CreateRequestModal } from './CreateRequestModal';

interface DailyRequest {
  id: string;
  requestNumber: string;
  objectName: string;
  date: string;
  time: string;
  requiredCount: number;
  filledCount: number;
  healthScore: number;
  zone: 'green' | 'yellow' | 'red';
  npdPercent: number;
  showUpPrediction: number;
  urgencyType: 'preliminary' | 'standard' | 'urgent' | 'now';
  hasForeman: boolean;
  warnings: string[];
}

export function PlanningDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'today' | 'tomorrow' | 'later'>('today');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data
  const todayBalance = {
    today: { percent: 92, zone: 'green' as const },
    tomorrow: { percent: 52, zone: 'yellow' as const },
    dayAfterTomorrow: { percent: 28, zone: 'red' as const }
  };

  const slaDeadline = {
    filled: 312,
    total: 340,
    hoursLeft: 2,
    minutesLeft: 14
  };

  const criticalRequests: DailyRequest[] = [
    {
      id: '1234',
      requestNumber: '#1234',
      objectName: 'ЖК Восток',
      date: '15.05',
      time: '08:00',
      requiredCount: 15,
      filledCount: 4,
      healthScore: 42,
      zone: 'red',
      npdPercent: 25,
      showUpPrediction: 55,
      urgencyType: 'urgent',
      hasForeman: true,
      warnings: ['Срочная (3ч 12мин)', 'НПД 25%']
    },
    {
      id: '1235',
      requestNumber: '#1235',
      objectName: 'Парковка Лента',
      date: '15.05',
      time: '10:00',
      requiredCount: 8,
      filledCount: 6,
      healthScore: 68,
      zone: 'yellow',
      npdPercent: 60,
      showUpPrediction: 78,
      urgencyType: 'standard',
      hasForeman: false,
      warnings: ['Нет foreman']
    }
  ];

  const todayRequests: DailyRequest[] = [
    {
      id: '1236',
      requestNumber: '#1236',
      objectName: 'БЦ Столица',
      date: '15.05',
      time: '09:00',
      requiredCount: 12,
      filledCount: 12,
      healthScore: 88,
      zone: 'green',
      npdPercent: 75,
      showUpPrediction: 92,
      urgencyType: 'standard',
      hasForeman: true,
      warnings: []
    },
    {
      id: '1237',
      requestNumber: '#1237',
      objectName: 'ТЦ Горизонт',
      date: '15.05',
      time: '14:00',
      requiredCount: 6,
      filledCount: 5,
      healthScore: 72,
      zone: 'yellow',
      npdPercent: 65,
      showUpPrediction: 80,
      urgencyType: 'standard',
      hasForeman: true,
      warnings: []
    }
  ];

  const getZoneColor = (zone: 'green' | 'yellow' | 'red') => {
    switch (zone) {
      case 'green': return 'bg-green-50 border-green-200 text-green-700';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'red': return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getZoneBadge = (zone: 'green' | 'yellow' | 'red', score: number) => {
    const label = zone === 'green' ? 'Зелёная' : zone === 'yellow' ? 'Оранжевая' : 'Красная';
    const emoji = zone === 'green' ? '🟢' : zone === 'yellow' ? '🟡' : '🔴';
    
    return (
      <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium', getZoneColor(zone))}>
        <span>{emoji}</span>
        <span>{label} ({score}/100)</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Планирование</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Создать заявку
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Balance card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Баланс спроса</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Сегодня</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{todayBalance.today.percent}%</span>
                <span className={cn('text-lg', todayBalance.today.zone === 'green' ? 'text-green-600' : '')}>🟢</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Завтра</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{todayBalance.tomorrow.percent}%</span>
                <span className="text-lg">🟡</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Послезавтра</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{todayBalance.dayAfterTomorrow.percent}%</span>
                <span className="text-lg">🔴</span>
              </div>
            </div>
          </div>

          <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Подробнее →
          </button>
        </div>

        {/* SLA card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">SLA 17:00</h3>
          </div>
          
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900">Собрано {slaDeadline.filled}/{slaDeadline.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(slaDeadline.filled / slaDeadline.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            До дедлайна
            <div className="text-xl font-medium text-gray-900 mt-1">
              {slaDeadline.hoursLeft}ч {slaDeadline.minutesLeft}мин
            </div>
          </div>

          <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            28 требуют внимания →
          </button>
        </div>
      </div>

      {/* Critical requests section */}
      {criticalRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-medium text-gray-900">
                Требуют внимания ({criticalRequests.length})
              </h3>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Все →
            </button>
          </div>

          <div className="p-4 space-y-3">
            {criticalRequests.map((request) => (
              <div 
                key={request.id}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer',
                  request.zone === 'red' ? 'bg-red-50/50 border-red-200' : 'bg-yellow-50/50 border-yellow-200'
                )}
                onClick={() => navigate(`/auto-planning/requests/${request.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {request.requestNumber} • {request.objectName}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {request.date} {request.time} • {request.requiredCount} чел
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {getZoneBadge(request.zone, request.healthScore)}
                      <span className="text-gray-600">
                        {request.filledCount}/{request.requiredCount} закрыто
                      </span>
                      {request.warnings.map((warning, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {warning}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                    Открыть подбор →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests by date tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-6 px-4">
            <button
              onClick={() => setSelectedTab('today')}
              className={cn(
                'px-1 py-3 text-sm font-medium border-b-2 transition-colors',
                selectedTab === 'today'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              📅 Сегодня (12)
            </button>
            <button
              onClick={() => setSelectedTab('tomorrow')}
              className={cn(
                'px-1 py-3 text-sm font-medium border-b-2 transition-colors',
                selectedTab === 'tomorrow'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              📅 Завтра (23)
            </button>
            <button
              onClick={() => setSelectedTab('later')}
              className={cn(
                'px-1 py-3 text-sm font-medium border-b-2 transition-colors',
                selectedTab === 'later'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              📅 Далее (45)
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {todayRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => navigate(`/auto-planning/requests/${request.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium text-gray-900">
                        {request.requestNumber} • {request.objectName}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {request.date} {request.time} • {request.requiredCount} чел
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getZoneBadge(request.zone, request.healthScore)}
                      <span className="text-sm text-gray-600">
                        📊 Закрытие: {request.filledCount}/{request.requiredCount} ({Math.round((request.filledCount / request.requiredCount) * 100)}%)
                      </span>
                      <span className="text-sm text-gray-600">
                        👥 НПД: {request.npdPercent}%
                      </span>
                      <span className="text-sm text-gray-600">
                        🎯 Прогноз явки: {request.showUpPrediction}%
                      </span>
                      {request.hasForeman && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Foreman назначен
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      <CreateRequestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Creating request:', data);
          setIsCreateModalOpen(false);
          // TODO: Handle request creation and navigate to candidates screen
        }}
      />
    </div>
  );
}