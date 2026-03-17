import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface RatingFactor {
  id: string;
  name: string;
  weight: number;
  score: number;
  contribution: number;
  details: {
    metrics: Array<{
      label: string;
      value: string;
      isNegative?: boolean;
    }>;
    explanation: string;
  };
}

export function RatingTab() {
  const [expandedFactorId, setExpandedFactorId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Mock data
  const currentRating = 4.6;
  const shiftsCount = 128;
  const period = '6 месяцев';

  const factors: RatingFactor[] = [
    {
      id: '1',
      name: 'Пунктуальность',
      weight: 25,
      score: 4.8,
      contribution: 1.20,
      details: {
        metrics: [
          { label: 'Всего смен', value: '128' },
          { label: 'Опозданий', value: '3', isNegative: true },
          { label: 'Средняя задержка', value: '8 минут', isNegative: true },
          { label: 'Последнее опоздание', value: '05.11.2024' }
        ],
        explanation: 'Исполнитель стабильно приходит вовремя. Минимальное количество опозданий за период.'
      }
    },
    {
      id: '2',
      name: 'Выходы на смены / невыходы',
      weight: 30,
      score: 4.3,
      contribution: 1.29,
      details: {
        metrics: [
          { label: 'Запланировано смен', value: '135' },
          { label: 'Завершено успешно', value: '128' },
          { label: 'Невыходов без предупреждения', value: '2', isNegative: true },
          { label: 'Отменено с предупреждением', value: '5' },
          { label: 'Последний невыход', value: '09.12.2024' }
        ],
        explanation: 'Высокая стабильность выходов. Негативное влияние оказали 2 невыхода без предупреждения.'
      }
    },
    {
      id: '3',
      name: 'Качество работы',
      weight: 25,
      score: 4.7,
      contribution: 1.18,
      details: {
        metrics: [
          { label: 'Оценок от кураторов', value: '18' },
          { label: 'Средняя оценка', value: '4.7' },
          { label: 'Жалоб на качество', value: '1', isNegative: true },
          { label: 'Положительных отзывов', value: '15' }
        ],
        explanation: 'Кураторы и клиенты высоко оценивают качество выполненных работ. Одна жалоба на уборку территории.'
      }
    },
    {
      id: '4',
      name: 'Коммуникация',
      weight: 10,
      score: 4.5,
      contribution: 0.45,
      details: {
        metrics: [
          { label: 'Время ответа (среднее)', value: '12 минут' },
          { label: 'Пропущенных звонков', value: '4' },
          { label: 'Неотвеченных сообщений', value: '2', isNegative: true }
        ],
        explanation: 'Оперативно отвечает на сообщения и звонки. Коммуникация в пределах нормы.'
      }
    },
    {
      id: '5',
      name: 'Дисциплина / нарушения',
      weight: 10,
      score: 4.2,
      contribution: 0.42,
      details: {
        metrics: [
          { label: 'Всего нарушений', value: '2', isNegative: true },
          { label: 'Опоздания', value: '3', isNegative: true },
          { label: 'Невыходы без предупреждения', value: '2', isNegative: true },
          { label: 'Жалобы на поведение', value: '0' }
        ],
        explanation: 'Незначительные дисциплинарные нарушения. Общее поведение в пределах нормы.'
      }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.7) return 'text-green-700';
    if (score >= 4.0) return 'text-gray-900';
    return 'text-red-700';
  };

  const getAutoSelectCategory = (rating: number) => {
    if (rating >= 4.7) return { label: 'Приоритетный', color: 'bg-green-50 text-green-700 border-green-200' };
    if (rating >= 4.0) return { label: 'Стандартный', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    return { label: 'Только по подтверждению', color: 'bg-red-50 text-red-700 border-red-200' };
  };

  const autoSelectCategory = getAutoSelectCategory(currentRating);

  return (
    <div>
      {/* 1. Верхняя строка */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-baseline gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-600">Текущий рейтинг:</span>
            <span className="text-gray-900 font-medium text-lg">{currentRating}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-600">Учитывается смен:</span>
            <span className="text-gray-900 font-medium">{shiftsCount}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-600">Период:</span>
            <span className="text-gray-900 font-medium">{period}</span>
          </div>
        </div>

        {/* Tooltip */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-10 shadow-lg">
              Рейтинг пересчитывается автоматически после каждой смены
              <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Таблица факторов */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600">Фактор</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-600">Вес</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-600">Оценка</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-600">Вклад</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((factor) => {
              const isExpanded = expandedFactorId === factor.id;
              
              return (
                <>
                  <tr
                    key={factor.id}
                    onClick={() => setExpandedFactorId(isExpanded ? null : factor.id)}
                    className={cn(
                      'border-b border-gray-100 cursor-pointer transition-colors',
                      isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-gray-900">{factor.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{factor.weight}%</td>
                    <td className={cn('px-4 py-2.5 text-right font-medium', getScoreColor(factor.score))}>
                      {factor.score.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-900">
                      {factor.contribution.toFixed(2)}
                    </td>
                  </tr>

                  {/* 3. Раскрытие фактора */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        {/* Метрики */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mb-3 text-xs">
                          {factor.details.metrics.map((metric, idx) => (
                            <div key={idx} className="flex items-baseline justify-between">
                              <span className="text-gray-600">{metric.label}:</span>
                              <span className={cn(
                                'font-medium',
                                metric.isNegative ? 'text-red-700' : 'text-gray-900'
                              )}>
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Объяснение */}
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {factor.details.explanation}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Блок влияния на автоподбор */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Влияние на автоподбор</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>≥ 4.7 — приоритетный</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>4.0–4.69 — стандартный</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>&lt; 4.0 — только по подтверждению</span>
              </div>
            </div>
          </div>

          <div className={cn(
            'px-4 py-2 rounded-lg border text-sm font-medium',
            autoSelectCategory.color
          )}>
            {autoSelectCategory.label}
          </div>
        </div>
      </div>
    </div>
  );
}
