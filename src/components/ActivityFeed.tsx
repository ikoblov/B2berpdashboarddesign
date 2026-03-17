import { useState } from "react";
import { Button } from "./ui/button";
import { Users, FileText, MessageSquare, Calendar, Clock, UserCircle, DollarSign, CheckSquare, Lock, CheckCircle2, AlertTriangle, XCircle, Zap, Hand, RefreshCw, ArrowUpCircle, Filter, X, MessageCircle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { cn } from "./ui/utils";

interface ActivityEvent {
  id: string;
  type: 'client' | 'job-order' | 'request' | 'shift-template' | 'shift' | 'worker' | 'payroll' | 'task' | 'communication' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
  };
  status: 'success' | 'warning' | 'error';
  auto: boolean;
  tags: string[];
  entity?: string;
}

const mockEvents: ActivityEvent[] = [
  {
    id: '1',
    type: 'request',
    title: 'Создана заявка',
    description: 'Заявка #4521 на объект "ЖК Северный" на 12 исполнителей',
    timestamp: new Date('2025-11-17T14:35:00'),
    user: { name: 'Анна Смирнова' },
    status: 'success',
    auto: false,
    tags: ['Заявки', 'ЖК Северный'],
    entity: 'ЗАЯ-4521'
  },
  {
    id: '2',
    type: 'worker',
    title: 'Назначен исполнитель',
    description: 'Иванов П.С. назначен на смену #8834 (17.11.2025, 08:00-20:00)',
    timestamp: new Date('2025-11-17T14:12:00'),
    user: { name: 'Михаил Петров' },
    status: 'success',
    auto: false,
    tags: ['Сотрудники', 'Смены'],
    entity: 'СМ-8834'
  },
  {
    id: '3',
    type: 'shift',
    title: 'Обновлён статус смены',
    description: 'Смена #8831 переведена в статус "Завершена". Объект: ТЦ Гранд Плаза',
    timestamp: new Date('2025-11-17T13:45:00'),
    user: { name: 'Система' },
    status: 'success',
    auto: true,
    tags: ['Смены', 'Автоматически'],
    entity: 'СМ-8831'
  },
  {
    id: '4',
    type: 'job-order',
    title: 'Изменён заказ-наряд',
    description: 'Заказ-наряд ЗН-1124 обновлён: изменена дата завершения на 25.11.2025',
    timestamp: new Date('2025-11-17T12:20:00'),
    user: { name: 'Ольга Коновалова' },
    status: 'warning',
    auto: false,
    tags: ['Заказ-наряды', 'СтройГрупп'],
    entity: 'ЗН-1124'
  },
  {
    id: '5',
    type: 'payroll',
    title: 'Выгружен реестр выплат',
    description: 'Реестр зарплат за период 01.11-15.11.2025 на сумму ₽2,340,500',
    timestamp: new Date('2025-11-17T11:05:00'),
    user: { name: 'Елена Волкова' },
    status: 'success',
    auto: false,
    tags: ['Выплаты', 'Экспорт'],
    entity: 'РЕЕ-0847'
  },
  {
    id: '6',
    type: 'task',
    title: 'Создана задача',
    description: 'Задача: Подписать акт выполненных работ с клиентом "СтройИнвест"',
    timestamp: new Date('2025-11-17T10:30:00'),
    user: { name: 'Дмитрий Соколов' },
    status: 'success',
    auto: false,
    tags: ['Задачи', 'Документы'],
    entity: 'ЗАД-342'
  },
  {
    id: '7',
    type: 'communication',
    title: 'Новое сообщение в чате',
    description: 'Сообщение от прораба объекта "Бизнес-центр Альфа" в чате проекта',
    timestamp: new Date('2025-11-17T09:55:00'),
    user: { name: 'Сергей Морозов' },
    status: 'success',
    auto: false,
    tags: ['Коммуникации', 'БЦ Альфа'],
    entity: 'ЧАТ-89'
  },
  {
    id: '8',
    type: 'payroll',
    title: 'Сформирован счёт',
    description: 'Счёт на оплату №СЧ-2284 для клиента "МегаСтрой" на сумму ₽450,000',
    timestamp: new Date('2025-11-17T09:15:00'),
    user: { name: 'Система' },
    status: 'success',
    auto: true,
    tags: ['Финансы', 'Счета'],
    entity: 'СЧ-2284'
  },
  {
    id: '9',
    type: 'system',
    title: 'Изменены права доступа',
    description: 'Пользователю "А.Смирнова" предоставлена роль "Менеджер проектов"',
    timestamp: new Date('2025-11-16T17:40:00'),
    user: { name: 'Администратор' },
    status: 'warning',
    auto: false,
    tags: ['Система', 'Права'],
    entity: 'USR-045'
  },
  {
    id: '10',
    type: 'shift',
    title: 'Смена не началась вовремя',
    description: 'Смена #8825 не была начата в назначенное время (08:00). Объект: ЖК Парковый',
    timestamp: new Date('2025-11-16T08:15:00'),
    user: { name: 'Система' },
    status: 'error',
    auto: true,
    tags: ['Смены', 'Ошибка'],
    entity: 'СМ-8825'
  },
  {
    id: '11',
    type: 'task',
    title: 'Задача выполнена',
    description: 'Задача ЗАД-338: Согласование графика смен на декабрь — завершена',
    timestamp: new Date('2025-11-16T16:20:00'),
    user: { name: 'Анна Смирнова' },
    status: 'success',
    auto: false,
    tags: ['Задачи'],
    entity: 'ЗАД-338'
  },
  {
    id: '12',
    type: 'client',
    title: 'Добавлен новый клиент',
    description: 'Клиент "РемСтройСервис" добавлен в базу. Контакт: Иванов И.И.',
    timestamp: new Date('2025-11-16T14:50:00'),
    user: { name: 'Михаил Петров' },
    status: 'success',
    auto: false,
    tags: ['Клиенты'],
    entity: 'КЛ-156'
  }
];

const eventTypeIcons = {
  'client': Users,
  'job-order': FileText,
  'request': MessageSquare,
  'shift-template': Calendar,
  'shift': Clock,
  'worker': UserCircle,
  'payroll': DollarSign,
  'task': CheckSquare,
  'communication': MessageCircle,
  'system': Lock,
};

const eventTypeColors = {
  'client': 'bg-blue-100 text-blue-600',
  'job-order': 'bg-purple-100 text-purple-600',
  'request': 'bg-orange-100 text-orange-600',
  'shift-template': 'bg-green-100 text-green-600',
  'shift': 'bg-cyan-100 text-cyan-600',
  'worker': 'bg-indigo-100 text-indigo-600',
  'payroll': 'bg-emerald-100 text-emerald-600',
  'task': 'bg-pink-100 text-pink-600',
  'communication': 'bg-violet-100 text-violet-600',
  'system': 'bg-gray-100 text-gray-600',
};

const statusIcons = {
  'success': CheckCircle2,
  'warning': AlertTriangle,
  'error': XCircle,
};

const statusColors = {
  'success': 'text-green-600',
  'warning': 'text-orange-600',
  'error': 'text-red-600',
};

interface ActivityFeedProps {
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications') => void;
}

export function ActivityFeed({ onNavigate }: ActivityFeedProps) {
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [filters, setFilters] = useState({
    eventTypes: {
      client: true,
      'job-order': true,
      request: true,
      'shift-template': true,
      shift: true,
      worker: true,
      payroll: true,
      task: true,
      communication: true,
      system: true,
    },
    statuses: {
      success: true,
      warning: true,
      error: true,
      auto: true,
      manual: true,
    },
  });

  // Group events by date
  const groupedEvents = mockEvents.reduce((acc, event) => {
    const dateKey = event.timestamp.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ActivityEvent[]>);

  const toggleEventType = (type: string) => {
    setFilters({
      ...filters,
      eventTypes: {
        ...filters.eventTypes,
        [type]: !filters.eventTypes[type as keyof typeof filters.eventTypes],
      },
    });
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-gray-900">Лента</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {mockEvents.length} событий
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Select defaultValue="today">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="yesterday">Вчера</SelectItem>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                  <SelectItem value="custom">Выбрать период</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Обновить
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              >
                <Filter className="w-4 h-4" />
                Фильтры
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Timeline */}
        <div className={cn("flex-1 p-8 transition-all", filterPanelOpen ? "mr-96" : "mr-0")}>
          <div className="max-w-4xl mx-auto">
            {Object.entries(groupedEvents).map(([date, events]) => (
              <div key={date} className="mb-12">
                {/* Date Header */}
                <div className="sticky top-[73px] bg-gray-50 py-3 mb-6 z-5">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-300 flex-1" />
                    <div className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">
                      {date}
                    </div>
                    <div className="h-px bg-gray-300 flex-1" />
                  </div>
                </div>

                {/* Events */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-4">
                    {events.map((event, index) => {
                      const Icon = eventTypeIcons[event.type];
                      const StatusIcon = statusIcons[event.status];
                      
                      return (
                        <div key={event.id} className="relative pl-14">
                          {/* Timeline Dot */}
                          <div className={cn(
                            "absolute left-0 w-11 h-11 rounded-full flex items-center justify-center border-4 border-gray-50",
                            eventTypeColors[event.type]
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Event Card */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                  </h4>
                                  <StatusIcon className={cn("w-4 h-4", statusColors[event.status])} />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                                    {event.user.name.charAt(0)}
                                  </div>
                                  <span className="text-xs text-gray-600">{event.user.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {event.timestamp.toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>

                              {/* Tags */}
                              <div className="flex items-center gap-2">
                                {event.auto && (
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Авто
                                  </span>
                                )}
                                {event.entity && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                                    {event.entity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" className="gap-2">
                <ArrowUpCircle className="w-4 h-4" />
                Загрузить ещё
              </Button>
            </div>
          </div>
        </div>

        {/* Right Filter Panel */}
        <div
          className={cn(
            "fixed right-0 top-32 bottom-0 w-96 bg-white border-l border-gray-200 transition-transform duration-300 overflow-y-auto shadow-lg",
            filterPanelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <h3 className="text-gray-900">Фильтры</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilterPanelOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Event Types */}
            <div className="mb-8">
              <div className="text-sm text-gray-700 mb-4">Тип события</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-client"
                    checked={filters.eventTypes.client}
                    onCheckedChange={() => toggleEventType('client')}
                  />
                  <Label htmlFor="filter-client" className="text-sm cursor-pointer">
                    Клиенты
                  </Label>
                </div>

                <div className="ml-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="filter-job-order"
                      checked={filters.eventTypes['job-order']}
                      onCheckedChange={() => toggleEventType('job-order')}
                    />
                    <Label htmlFor="filter-job-order" className="text-sm cursor-pointer text-gray-600">
                      Заказ-наряды
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-request"
                    checked={filters.eventTypes.request}
                    onCheckedChange={() => toggleEventType('request')}
                  />
                  <Label htmlFor="filter-request" className="text-sm cursor-pointer">
                    Заявки
                  </Label>
                </div>

                <div className="ml-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="filter-shift-template"
                      checked={filters.eventTypes['shift-template']}
                      onCheckedChange={() => toggleEventType('shift-template')}
                    />
                    <Label htmlFor="filter-shift-template" className="text-sm cursor-pointer text-gray-600">
                      Шаблоны смен
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-shift"
                    checked={filters.eventTypes.shift}
                    onCheckedChange={() => toggleEventType('shift')}
                  />
                  <Label htmlFor="filter-shift" className="text-sm cursor-pointer">
                    Смены
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-worker"
                    checked={filters.eventTypes.worker}
                    onCheckedChange={() => toggleEventType('worker')}
                  />
                  <Label htmlFor="filter-worker" className="text-sm cursor-pointer">
                    Сотрудники
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-payroll"
                    checked={filters.eventTypes.payroll}
                    onCheckedChange={() => toggleEventType('payroll')}
                  />
                  <Label htmlFor="filter-payroll" className="text-sm cursor-pointer">
                    Выплаты
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-task"
                    checked={filters.eventTypes.task}
                    onCheckedChange={() => toggleEventType('task')}
                  />
                  <Label htmlFor="filter-task" className="text-sm cursor-pointer">
                    Задачи
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-communication"
                    checked={filters.eventTypes.communication}
                    onCheckedChange={() => toggleEventType('communication')}
                  />
                  <Label htmlFor="filter-communication" className="text-sm cursor-pointer">
                    Коммуникации
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="filter-system"
                    checked={filters.eventTypes.system}
                    onCheckedChange={() => toggleEventType('system')}
                  />
                  <Label htmlFor="filter-system" className="text-sm cursor-pointer">
                    Системные события
                  </Label>
                </div>
              </div>
            </div>

            {/* Status Filters */}
            <div className="mb-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-4">Статус</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="status-success" defaultChecked />
                  <Label htmlFor="status-success" className="text-sm cursor-pointer flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Успешно
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="status-warning" defaultChecked />
                  <Label htmlFor="status-warning" className="text-sm cursor-pointer flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Предупреждение
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="status-error" defaultChecked />
                  <Label htmlFor="status-error" className="text-sm cursor-pointer flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Ошибка
                  </Label>
                </div>
              </div>
            </div>

            {/* Auto/Manual */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-4">Источник</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="source-auto" defaultChecked />
                  <Label htmlFor="source-auto" className="text-sm cursor-pointer flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    Автоматически
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="source-manual" defaultChecked />
                  <Label htmlFor="source-manual" className="text-sm cursor-pointer flex items-center gap-2">
                    <Hand className="w-4 h-4 text-purple-600" />
                    Вручную
                  </Label>
                </div>
              </div>
            </div>

            {/* User Filter */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <div className="text-sm text-gray-700 mb-4">Пользователь</div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все пользователи</SelectItem>
                  <SelectItem value="managers">Только менеджеры</SelectItem>
                  <SelectItem value="system">Системные процессы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}