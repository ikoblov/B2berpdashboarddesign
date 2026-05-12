import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  XCircle,
  Bell,
  ClipboardList,
  MessageSquare,
  User,
  Phone,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  Briefcase,
  Activity,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  LogOut,
  Shield,
  TrendingUp,
  FileText,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";


interface ShiftDetailProps {
  shiftId: string;
  onBack?: () => void;
}

const mockShiftData = {
  id: 'СМ-001',
  date: new Date('2025-11-23T08:00:00'),
  status: 'completed' as const,
  worker: {
    id: 'РАБ-145',
    name: 'Иванов Сергей Петрович',
    phone: '+7 (999) 123-45-67',
    district: 'Северный р-н, Москва',
    rating: 4.8,
    selfEmployed: true,
    photo: null,
  },
  client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
  object: { name: 'ЖК Северный', id: 'ОБ-123' },
  workType: 'Разнорабочие',
  incomingRate: 2500,
  outgoingRate: 1800,
  commission: 0,
  totalPayout: 16200,
  plannedTime: { start: '08:00', end: '18:00' },
  actualTime: {
    arrival: new Date('2025-11-23T08:15:00'),
    departure: new Date('2025-11-23T17:00:00'),
  },
  totalHours: 8.75,
  late: 15,
  comment: 'Требуется доступ на территорию через КПП №2',
  systemNote: 'Исполнитель подтвердил смену в Telegram 22.11 в 18:30',
};

const mockTimeline = [
  {
    id: 'event-1',
    type: 'created',
    timestamp: new Date('2025-11-20T14:25:00'),
    user: 'Анна Смирнова',
    description: 'Смена создана',
    icon: Calendar,
    color: 'text-gray-600',
  },
  {
    id: 'event-2',
    type: 'assigned',
    timestamp: new Date('2025-11-20T14:30:00'),
    user: 'Система',
    description: 'Исполнитель назначен на смену',
    icon: UserCheck,
    color: 'text-blue-600',
  },
  {
    id: 'event-3',
    type: 'confirmed',
    timestamp: new Date('2025-11-22T18:30:00'),
    user: 'Иванов С.П.',
    description: 'Подтверждено в Telegram',
    icon: CheckCircle2,
    color: 'text-purple-600',
  },
  {
    id: 'event-4',
    type: 'arrived',
    timestamp: new Date('2025-11-23T08:15:00'),
    user: 'Система',
    description: 'Прибыл на объект (опоздание 15 мин)',
    icon: MapPin,
    color: 'text-orange-600',
  },
  {
    id: 'event-5',
    type: 'started',
    timestamp: new Date('2025-11-23T08:15:00'),
    user: 'Мастер объекта',
    description: 'Работа началась',
    icon: Activity,
    color: 'text-green-600',
  },
  {
    id: 'event-6',
    type: 'left',
    timestamp: new Date('2025-11-23T17:00:00'),
    user: 'Система',
    description: 'Покинул объект',
    icon: LogOut,
    color: 'text-orange-600',
  },
  {
    id: 'event-7',
    type: 'completed',
    timestamp: new Date('2025-11-23T17:00:00'),
    user: 'Система',
    description: 'Смена завершена',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
];

const statusConfig = {
  new: { label: 'Новый', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  assigned: { label: 'Назначен', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  confirmed: { label: 'Подтверждён', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  arrived: { label: 'Прибыл', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  working: { label: 'Работает', color: 'bg-green-100 text-green-700 border-green-200' },
  left: { label: 'Ушёл', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  completed: { label: 'Завершена', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  cancelled: { label: 'Отменена', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function ShiftDetail({ shiftId, onBack }: ShiftDetailProps) {
  const [comment, setComment] = useState(mockShiftData.comment);
  const [outgoingRate, setOutgoingRate] = useState(mockShiftData.outgoingRate.toString());

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку смен
          </button>

          {/* Shift Summary */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-gray-900">Смена {mockShiftData.id}</h1>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusConfig[mockShiftData.status].color)}
                >
                  {statusConfig[mockShiftData.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {mockShiftData.date.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{mockShiftData.client.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{mockShiftData.object.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{mockShiftData.workType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Коммуникации
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Создать задачу
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                Уведомление
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                <XCircle className="w-4 h-4" />
                Отменить смену
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="col-span-2 space-y-6">
            {/* Worker Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Исполнитель</h3>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Заменить исполнителя
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {mockShiftData.worker.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">ФИО</div>
                    <div className="text-sm text-gray-900">{mockShiftData.worker.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {mockShiftData.worker.id}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Телефон</div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {mockShiftData.worker.phone}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Район проживания</div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {mockShiftData.worker.district}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Рейтинг</div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {mockShiftData.worker.rating}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Статус</div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {mockShiftData.worker.selfEmployed ? 'Самозанятый' : 'Физ. лицо'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Finances Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm text-gray-900">Финансы смены</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs text-gray-500">Входящая ставка (₽/час)</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {mockShiftData.incomingRate} ₽/час
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Из заказ-наряда</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="outgoing-rate" className="text-xs text-gray-500">
                    Исходящая ставка (₽/час)
                  </Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="outgoing-rate"
                      type="number"
                      value={outgoingRate}
                      onChange={(e) => setOutgoingRate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Комиссия / Удержания</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-900">
                      {mockShiftData.commission} ₽
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Итоговая выплата</Label>
                  <div className="mt-2 px-4 py-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-900">
                      {mockShiftData.totalPayout.toLocaleString('ru-RU')} ₽
                    </span>
                    <p className="text-xs text-green-600 mt-1">
                      {mockShiftData.totalHours} часов × {mockShiftData.outgoingRate} ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actual Time Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm text-gray-900">Фактическое время</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs text-gray-500">Запланированное время</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-900">
                      {mockShiftData.plannedTime.start} — {mockShiftData.plannedTime.end}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Из шаблона смены</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Итого часов</Label>
                  <div className="mt-2 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-900">
                      {mockShiftData.totalHours} часов
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Фактическое прибытие</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-900">
                      {mockShiftData.actualTime.arrival.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {mockShiftData.late > 0 && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        Опоздание {mockShiftData.late} мин
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Фактический уход</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-900">
                      {mockShiftData.actualTime.departure.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm text-gray-900">Комментарии</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="comment" className="text-xs text-gray-500">
                    Комментарий к смене
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="mt-2 resize-none"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Системная заметка</Label>
                  <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{mockShiftData.systemNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline & Related */}
          <div className="space-y-6">
            {/* Timeline Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm text-gray-900">Хронология смены</h3>
              </div>

              <div className="space-y-4">
                {mockTimeline.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon className={cn('w-4 h-4', event.color)} />
                        </div>
                        {index < mockTimeline.length - 1 && (
                          <div className="w-px h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm text-gray-900 mb-0.5">
                          {event.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.timestamp.toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-xs text-gray-500">{event.user}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Communications Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Коммуникации</h3>
                </div>
                <Badge variant="outline" className="text-xs">2</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-900 mb-1">
                        Уточнение по доступу
                      </div>
                      <div className="text-xs text-gray-500">22 ноя, 15:30</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2">
                  Открыть все коммуникации
                </Button>
              </div>
            </div>

            {/* Tasks Block */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Задачи</h3>
                </div>
                <Badge variant="outline" className="text-xs">1</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-900 mb-1">
                        Получить пропуск на КПП
                      </div>
                      <div className="text-xs text-gray-500">Завершено</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Создать задачу
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}