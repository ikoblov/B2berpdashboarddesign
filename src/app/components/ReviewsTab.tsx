import { useState } from 'react';
import { Star, Building2, Briefcase, UserCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Opinion {
  id: string;
  sourceType: 'object' | 'client' | 'curator' | 'office';
  rating: number;
  title: string;
  date: string;
  source: string;
  fullText: string;
  context: {
    object?: string;
    workType?: string;
    period?: string;
  };
  tags: string[];
  isNegative: boolean;
}

export function ReviewsTab() {
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Mock data
  const opinions: Opinion[] = [
    {
      id: '1',
      sourceType: 'curator',
      rating: 5,
      title: 'Отличная работа на объекте',
      date: '12.12.2024',
      source: 'Петров Д.А.',
      fullText: 'Исполнитель показал высокий уровень профессионализма. Всегда приходит вовремя, качественно выполняет поставленные задачи. Хорошо работает в команде. Рекомендую для сложных объектов.',
      context: {
        object: 'ЖК "Оазис" (корпус 3)',
        workType: 'Погрузочно-разгрузочные работы',
        period: '02.12–12.12.2024'
      },
      tags: ['пунктуальность', 'качество', 'команда'],
      isNegative: false
    },
    {
      id: '2',
      sourceType: 'client',
      rating: 5,
      title: 'Превосходный исполнитель',
      date: '08.12.2024',
      source: 'ООО "Строймастер"',
      fullText: 'Очень доволен работой. Исполнитель ответственный, внимательный к деталям. Работает быстро и качественно.',
      context: {
        object: 'БЦ "Столица"',
        workType: 'Строительные работы',
        period: '05.12–08.12.2024'
      },
      tags: ['ответственность', 'качество'],
      isNegative: false
    },
    {
      id: '3',
      sourceType: 'curator',
      rating: 4,
      title: 'Работает стабильно, но медленно',
      date: '28.11.2024',
      source: 'Смирнова О.В.',
      fullText: 'Исполнитель добросовестный, но темп работы ниже среднего. На новых объектах требуется дополнительный контроль качества. В целом результатом довольна.',
      context: {
        object: 'ТЦ "Горизонт"',
        workType: 'Разнорабочий',
        period: '25.11–28.11.2024'
      },
      tags: ['медленный_темп', 'требует_контроля'],
      isNegative: false
    },
    {
      id: '4',
      sourceType: 'client',
      rating: 3,
      title: 'Замечания по качеству уборки',
      date: '22.11.2024',
      source: 'АО "ГлавСтрой"',
      fullText: 'Есть серьёзные замечания по качеству выполненных работ. Уборка территории проведена не полностью, остались замусоренные участки. Требуется повторная работа.',
      context: {
        object: 'ЖК "Оазис" (корпус 2)',
        workType: 'Уборка территории',
        period: '20.11–22.11.2024'
      },
      tags: ['низкое_качество', 'замечания'],
      isNegative: true
    },
    {
      id: '5',
      sourceType: 'office',
      rating: 4,
      title: 'Хорошая коммуникация',
      date: '15.11.2024',
      source: 'Отдел кадров',
      fullText: 'Исполнитель всегда на связи, оперативно отвечает на сообщения. Документы предоставляет вовремя.',
      context: {},
      tags: ['коммуникация', 'документы'],
      isNegative: false
    }
  ];

  const getSourceIcon = (type: Opinion['sourceType']) => {
    const icons = {
      object: Building2,
      client: Briefcase,
      curator: UserCircle,
      office: UserCircle
    };
    return icons[type];
  };

  const getSourceLabel = (type: Opinion['sourceType']) => {
    const labels = {
      object: 'Объект',
      client: 'Клиент',
      curator: 'Куратор',
      office: 'Офис'
    };
    return labels[type];
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 4.0) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  // Группировка мнений по источникам
  const sourceStats = [
    { type: 'Объекты', count: 8, rating: 4.7 },
    { type: 'Клиенты', count: 5, rating: 4.8 },
    { type: 'Кураторы', count: 3, rating: 4.3 },
    { type: 'Офис', count: 2, rating: 3.9 }
  ];

  return (
    <div>
      {/* 1. Верхняя сводка */}
      <div className="flex items-center gap-8 mb-4 pb-4 border-b border-gray-200 text-sm">
        <div className="flex items-baseline gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-gray-600">Общий рейтинг:</span>
          <span className="text-gray-900 font-medium">4.6</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600">Мнений всего:</span>
          <span className="text-gray-900 font-medium">18</span>
        </div>
        <div className="flex items-baseline gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-gray-600">Негативных:</span>
          <span className="text-red-700 font-medium">2</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600">Последнее мнение:</span>
          <span className="text-gray-900 font-medium">12.12.2024</span>
        </div>
      </div>

      {/* 2. Блок "Общее мнение" */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Общее мнение</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Надёжный исполнитель. Стабильно выходит на смены.
          Хорошо работает в команде.
          Требует контроля качества на новых объектах.
        </p>
        <div className="text-xs text-gray-500">
          Сформировано на основе 18 мнений
        </div>
      </div>

      {/* 3. Источники мнений */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        {sourceStats.map((source, idx) => (
          <div
            key={idx}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs',
              getScoreColor(source.rating)
            )}
          >
            <span className="font-medium">{source.type} ({source.count})</span>
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-current" />
              {source.rating}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Фильтры */}
      <div className="mb-4 flex items-center gap-3">
        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>Все роли</option>
          <option>Объекты</option>
          <option>Клиенты</option>
          <option>Кураторы</option>
          <option>Офис</option>
        </select>
        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>Все оценки</option>
          <option>5 звёзд</option>
          <option>4 звезды</option>
          <option>3 звезды и ниже</option>
        </select>
        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>6 месяцев</option>
          <option>3 месяца</option>
          <option>1 месяц</option>
          <option>Все время</option>
        </select>
      </div>

      {/* 5. Список мнений */}
      <div className="space-y-2">
        {opinions.map((opinion) => {
          const SourceIcon = getSourceIcon(opinion.sourceType);
          const isExpanded = expandedReviewId === opinion.id;
          
          return (
            <div key={opinion.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Строка мнения */}
              <div
                onClick={() => setExpandedReviewId(isExpanded ? null : opinion.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                  isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50',
                  opinion.isNegative && !isExpanded && 'bg-red-50/30'
                )}
              >
                <SourceIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{opinion.rating}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900">{opinion.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                  <span>{getSourceLabel(opinion.sourceType)}</span>
                  <span>•</span>
                  <span>{opinion.source}</span>
                  <span>•</span>
                  <span>{opinion.date}</span>
                </div>
              </div>

              {/* 6. Раскрытие мнения */}
              {isExpanded && (
                <div className={cn(
                  'px-4 py-3 border-t border-gray-200',
                  opinion.isNegative ? 'bg-red-50/50' : 'bg-gray-50'
                )}>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {opinion.fullText}
                  </p>

                  {/* Контекст */}
                  {Object.keys(opinion.context).length > 0 && (
                    <div className="mb-3 pb-3 border-b border-gray-200 space-y-1 text-xs">
                      {opinion.context.object && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-500 w-20">Объект:</span>
                          <span className="text-gray-900">{opinion.context.object}</span>
                        </div>
                      )}
                      {opinion.context.workType && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-500 w-20">Тип работ:</span>
                          <span className="text-gray-900">{opinion.context.workType}</span>
                        </div>
                      )}
                      {opinion.context.period && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-500 w-20">Период:</span>
                          <span className="text-gray-900">{opinion.context.period}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Теги */}
                  {opinion.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {opinion.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}