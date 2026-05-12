import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Send
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  overallScore: number;
  baseRating: number;
  npdStatus: boolean;
  distance: number;
  distanceType: 'walking' | 'transit' | 'car';
  scoreBreakdown: {
    baseRating: number;
    showUpLast10: number;
    showUpAllTime: number;
    qualityZNorm: number;
    multipliers: {
      distance: { value: number; label: string };
      master: { value: number; label: string };
      object: { value: number; label: string };
      workType: { value: number; label: string };
      fatigue: { value: number; label: string };
      npdPriority: { value: number; label: string };
    };
  };
  opinions: Array<{
    author: string;
    text: string;
    date: string;
  }>;
  channel: 'telegram' | 'maks' | 'ivr' | 'sms';
  offerStatus: 'not_sent' | 'sent' | 'accepted' | 'declined' | 'timeout';
  statusTimestamp?: string;
  canBeForeman: boolean;
  isForeman: boolean;
}

export function RequestCandidates() {
  const navigate = useNavigate();
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const request = {
    id: '1234',
    number: '#1234',
    objectName: 'ЖК Восток',
    date: '15.05',
    time: '08:00',
    requiredCount: 15,
    filledCount: 12,
    healthScore: 68,
    zone: 'yellow' as const,
    hoursUntilStart: 16.37,
    preset: 'Стандарт'
  };

  const candidates: Candidate[] = [
    {
      id: '1',
      firstName: 'Иван',
      lastName: 'Иванов',
      photo: null,
      overallScore: 0.92,
      baseRating: 0.82,
      npdStatus: true,
      distance: 15,
      distanceType: 'walking',
      scoreBreakdown: {
        baseRating: 0.82,
        showUpLast10: 0.90,
        showUpAllTime: 0.85,
        qualityZNorm: 0.70,
        multipliers: {
          distance: { value: 1.5, label: 'пешком' },
          master: { value: 1.3, label: 'Петров, 12 смен' },
          object: { value: 1.2, label: 'ЖК Восток, 8 раз' },
          workType: { value: 1.2, label: 'уборка, опыт' },
          fatigue: { value: 0.9, label: 'работал вчера' },
          npdPriority: { value: 1.1, label: '' }
        }
      },
      opinions: [
        { author: 'куратор', text: 'Ответственный, всегда вовремя', date: '10.04' },
        { author: 'мастер', text: 'Хорошо работает с Петровым', date: '10.04' }
      ],
      channel: 'telegram',
      offerStatus: 'sent',
      statusTimestamp: '5 мин назад',
      canBeForeman: true,
      isForeman: true
    },
    {
      id: '2',
      firstName: 'Сергей',
      lastName: 'Петров',
      photo: null,
      overallScore: 0.88,
      baseRating: 0.80,
      npdStatus: true,
      distance: 45,
      distanceType: 'transit',
      scoreBreakdown: {
        baseRating: 0.80,
        showUpLast10: 0.88,
        showUpAllTime: 0.82,
        qualityZNorm: 0.72,
        multipliers: {
          distance: { value: 1.2, label: 'автобус' },
          master: { value: 1.1, label: 'Петров, 3 смены' },
          object: { value: 1.0, label: 'нет опыта' },
          workType: { value: 1.1, label: 'уборка, базовый' },
          fatigue: { value: 1.0, label: 'отдыхал' },
          npdPriority: { value: 1.1, label: '' }
        }
      },
      opinions: [],
      channel: 'telegram',
      offerStatus: 'accepted',
      statusTimestamp: '20 мин назад',
      canBeForeman: false,
      isForeman: false
    },
    {
      id: '3',
      firstName: 'Алексей',
      lastName: 'Сидоров',
      photo: null,
      overallScore: 0.75,
      baseRating: 0.78,
      npdStatus: false,
      distance: 25,
      distanceType: 'car',
      scoreBreakdown: {
        baseRating: 0.78,
        showUpLast10: 0.80,
        showUpAllTime: 0.75,
        qualityZNorm: 0.68,
        multipliers: {
          distance: { value: 1.1, label: 'машина' },
          master: { value: 1.0, label: 'нет опыта' },
          object: { value: 1.0, label: 'нет опыта' },
          workType: { value: 1.2, label: 'уборка, опыт' },
          fatigue: { value: 1.0, label: 'отдыхал' },
          npdPriority: { value: 0.9, label: 'не НПД' }
        }
      },
      opinions: [],
      channel: 'maks',
      offerStatus: 'declined',
      statusTimestamp: '10 мин назад',
      canBeForeman: false,
      isForeman: false
    }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCandidates);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCandidates(newExpanded);
  };

  const getStatusBadge = (status: Candidate['offerStatus']) => {
    const config = {
      not_sent: { icon: '⚪', label: 'Не отправлено', color: 'text-gray-600 bg-gray-100' },
      sent: { icon: '🟡', label: 'Отправлено, ждём', color: 'text-yellow-700 bg-yellow-100' },
      accepted: { icon: '✅', label: 'Принял', color: 'text-green-700 bg-green-100' },
      declined: { icon: '🔴', label: 'Отказ', color: 'text-red-700 bg-red-100' },
      timeout: { icon: '⏱', label: 'Timeout', color: 'text-orange-700 bg-orange-100' }
    };
    return config[status];
  };

  const getDistanceIcon = (type: 'walking' | 'transit' | 'car') => {
    switch (type) {
      case 'walking': return '🚶';
      case 'transit': return '🚌';
      case 'car': return '🚗';
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/auto-planning')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900">
            {request.number} • {request.objectName} • {request.date} {request.time}
          </h1>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          Редактировать
        </button>
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              request.zone === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''
            )}>
              🟡 Оранжевая (Health {request.healthScore})
            </span>
          </div>
          <div className="text-gray-600">
            Нужно: <span className="font-medium text-gray-900">{request.requiredCount}</span>
          </div>
          <div className="text-gray-600">
            Подобрано: <span className="font-medium text-gray-900">{request.filledCount}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            До начала: <span className="font-medium text-gray-900">{Math.floor(request.hoursUntilStart)}ч {Math.round((request.hoursUntilStart % 1) * 60)}мин</span>
          </div>
          <div className="text-gray-600">
            Пресет: <span className="font-medium text-gray-900">{request.preset}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-6 px-4">
            <button className="px-1 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600">
              📋 Кандидаты
            </button>
            <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              📊 Прогноз
            </button>
            <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              💬 Коммуникации
            </button>
            <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              📝 История
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Все</option>
              <option>Приняли</option>
              <option>Отказались</option>
              <option>Ждут ответа</option>
            </select>
            <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Сортировка: Скор ▼</option>
              <option>По рейтингу</option>
              <option>По дистанции</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Показано {candidates.length} из 47 (overbooking ×1.5)
          </div>
        </div>

        {/* Candidates list */}
        <div className="p-4 space-y-3">
          {candidates.map((candidate) => {
            const isExpanded = expandedCandidates.has(candidate.id);
            const status = getStatusBadge(candidate.offerStatus);

            return (
              <div
                key={candidate.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
              >
                {/* Card header */}
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {candidate.lastName} {candidate.firstName}
                        </span>
                        {candidate.isForeman && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded font-medium">
                            FOREMAN
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3.5 h-3.5',
                                i < Math.round(candidate.baseRating * 5)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Скор: <span className="font-medium text-gray-900">{candidate.overallScore}</span></span>
                        <span className={cn(
                          'flex items-center gap-1',
                          candidate.npdStatus ? 'text-green-600' : 'text-red-600'
                        )}>
                          {candidate.npdStatus ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {candidate.npdStatus ? 'НПД активен' : 'Не НПД'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {getDistanceIcon(candidate.distanceType)} {candidate.distance} мин
                        </span>
                      </div>

                      {/* Channel and status */}
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-gray-600">
                          Канал связи: <span className="font-medium text-gray-900 capitalize">{candidate.channel}</span>
                          {candidate.channel === 'telegram' && ' ✅'}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded text-xs font-medium', status.color)}>
                          {status.icon} {status.label}
                          {candidate.statusTimestamp && ` (${candidate.statusTimestamp})`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleExpanded(candidate.id)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? 'Свернуть' : 'Подробнее'}
                      </button>
                      {candidate.canBeForeman && !candidate.isForeman && (
                        <button className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded hover:bg-blue-100 transition-colors">
                          Сделать Foreman
                        </button>
                      )}
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                        Убрать
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Score breakdown */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900 mb-3">Разбивка скора</div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <div className="text-gray-700 mb-1">Базовый рейтинг: {candidate.scoreBreakdown.baseRating}</div>
                            <div className="ml-4 space-y-0.5 text-xs text-gray-600">
                              <div>├─ Явка 10 последних: {candidate.scoreBreakdown.showUpLast10}</div>
                              <div>├─ Явка за всё время: {candidate.scoreBreakdown.showUpAllTime}</div>
                              <div>└─ Качество (z-norm): {candidate.scoreBreakdown.qualityZNorm}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-700 mb-1">Контекстные множители:</div>
                            <div className="ml-4 space-y-0.5 text-xs text-gray-600">
                              <div>├─ Дистанция: ×{candidate.scoreBreakdown.multipliers.distance.value} ({candidate.scoreBreakdown.multipliers.distance.label})</div>
                              <div>├─ Мастер: ×{candidate.scoreBreakdown.multipliers.master.value} ({candidate.scoreBreakdown.multipliers.master.label})</div>
                              <div>├─ Объект: ×{candidate.scoreBreakdown.multipliers.object.value} ({candidate.scoreBreakdown.multipliers.object.label})</div>
                              <div>├─ Тип задач: ×{candidate.scoreBreakdown.multipliers.workType.value} ({candidate.scoreBreakdown.multipliers.workType.label})</div>
                              <div>├─ Усталость: ×{candidate.scoreBreakdown.multipliers.fatigue.value} ({candidate.scoreBreakdown.multipliers.fatigue.label})</div>
                              <div>└─ НПД-приоритет: ×{candidate.scoreBreakdown.multipliers.npdPriority.value}</div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <div className="text-gray-700 font-medium">
                              Итого: {candidate.scoreBreakdown.baseRating} × {candidate.scoreBreakdown.multipliers.distance.value} × ... = {candidate.overallScore}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Opinions */}
                      {candidate.opinions.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">ℹ️ Мнения ({candidate.opinions.length})</div>
                          <div className="space-y-2">
                            {candidate.opinions.map((opinion, idx) => (
                              <div key={idx} className="text-sm text-gray-700">
                                • "{opinion.text}" — {opinion.author}, {opinion.date}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add manually */}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">+ Добавить вручную</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по базе..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>12 исполнителей ждут ответа</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
              Сохранить
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Запустить обзвон
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
