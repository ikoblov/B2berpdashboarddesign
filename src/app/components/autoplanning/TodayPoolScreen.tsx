import { useState } from 'react';
import { Star, MapPin, User, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PoolEntry {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  rating: number;
  location: string;
  district: string;
  source: 'ready_today' | 'surplus' | 'urgent_response';
  sourceDetails: string;
  availableUntil: string;
  timeRemaining: string;
}

export function TodayPoolScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data
  const poolEntries: PoolEntry[] = [
    {
      id: '1',
      firstName: 'Иван',
      lastName: 'Иванов',
      photo: null,
      rating: 4.8,
      location: 'Казань, центр',
      district: 'Вахитовский',
      source: 'surplus',
      sourceDetails: 'Лишний с ЖК Восток (15 мин назад)',
      availableUntil: '12:30',
      timeRemaining: '2ч 45мин'
    },
    {
      id: '2',
      firstName: 'Сергей',
      lastName: 'Петров',
      photo: null,
      rating: 4.6,
      location: 'Казань, Сов. р-н',
      district: 'Советский',
      source: 'ready_today',
      sourceDetails: 'Готов сегодня (с 08:00)',
      availableUntil: 'конца дня',
      timeRemaining: 'весь день'
    },
    {
      id: '3',
      firstName: 'Алексей',
      lastName: 'Сидоров',
      photo: null,
      rating: 4.4,
      location: 'Казань, Приволжский',
      district: 'Приволжский',
      source: 'urgent_response',
      sourceDetails: 'Ответил на срочную (30 мин назад)',
      availableUntil: '16:00',
      timeRemaining: '6ч 10мин'
    }
  ];

  const getSourceBadge = (source: PoolEntry['source']) => {
    const config = {
      ready_today: { emoji: '🟢', label: 'Готов сегодня', color: 'bg-green-100 text-green-700 border-green-200' },
      surplus: { emoji: '🟡', label: 'Лишний', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      urgent_response: { emoji: '🔵', label: 'Прямо сейчас', color: 'bg-blue-100 text-blue-700 border-blue-200' }
    };
    return config[source];
  };

  const filteredEntries = poolEntries.filter(entry => {
    if (selectedFilter === 'all') return true;
    return entry.source === selectedFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Today-Pool: резерв на сегодня</h1>
          <p className="text-sm text-gray-600 mt-1">В пуле: {poolEntries.length} человек</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg font-medium">
            Авто-обновление ✓
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Фильтр по источнику:</span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Все
          </button>
          <button
            onClick={() => setSelectedFilter('ready_today')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              selectedFilter === 'ready_today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Готов сегодня
          </button>
          <button
            onClick={() => setSelectedFilter('surplus')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              selectedFilter === 'surplus'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Лишние
          </button>
          <button
            onClick={() => setSelectedFilter('urgent_response')}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              selectedFilter === 'urgent_response'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Прямо сейчас
          </button>
        </div>
      </div>

      {/* Pool entries list */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => {
          const sourceBadge = getSourceBadge(entry.source);

          return (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {entry.lastName} {entry.firstName}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-3.5 h-3.5',
                            i < Math.round(entry.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{entry.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {entry.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <div className={cn('px-2 py-1 rounded border text-xs font-medium', sourceBadge.color)}>
                      {sourceBadge.emoji} Источник: {entry.sourceDetails}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Доступен до: <span className="font-medium text-gray-900">{entry.availableUntil}</span>
                    </span>
                    <span>
                      (осталось <span className="font-medium text-gray-900">{entry.timeRemaining}</span>)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                      Предложить заявку
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredEntries.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-2">
            <User className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-600">Нет исполнителей в выбранной категории</p>
        </div>
      )}
    </div>
  );
}
