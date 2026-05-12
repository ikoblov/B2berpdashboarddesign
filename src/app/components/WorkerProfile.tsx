import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  ClipboardList,
  MessageSquare,
  History,
  User,
  Phone,
  MapPin,
  Star,
  Shield,
  FileText,
  Award,
  Clock,
  DollarSign,
  Calendar,
  MessageCircle,
  Activity,
  Upload,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  TrendingUp,
  Download,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Progress } from "./ui/progress";

interface WorkerProfileProps {
  workerId: string;
  onBack?: () => void;
}

const mockWorkerData = {
  id: 'РАБ-145',
  name: 'Иванов Сергей Петрович',
  photo: null,
  phone: '+7 (999) 123-45-67',
  birthDate: new Date('1985-06-15'),
  address: 'Москва, Северный административный округ',
  district: 'Северный р-н',
  rating: 4.8,
  selfEmployed: true,
  status: 'active' as const,
  verificationStatus: 'verified' as const,
  primaryWorkType: 'Разнорабочие',
  additionalSkills: ['Грузчик', 'Подсобник'],
  source: 'Telegram канал',
  dateAdded: new Date('2024-03-15'),
  hrComment: 'Надёжный исполнитель, всегда приходит вовремя. Рекомендован для сложных объектов.',
  inn: '123456789012',
  distanceToObjects: 5.2,
};

const mockDocuments = [
  {
    id: 'doc-1',
    type: 'Паспорт',
    status: 'verified' as const,
    expiryDate: null,
    uploadDate: new Date('2024-03-15'),
  },
  {
    id: 'doc-2',
    type: 'Патент',
    status: 'verified' as const,
    expiryDate: new Date('2025-12-31'),
    uploadDate: new Date('2024-03-15'),
  },
  {
    id: 'doc-3',
    type: 'СНиЛС',
    status: 'verified' as const,
    expiryDate: null,
    uploadDate: new Date('2024-03-15'),
  },
  {
    id: 'doc-4',
    type: 'Миграционная карта',
    status: 'needs_update' as const,
    expiryDate: new Date('2025-01-15'),
    uploadDate: new Date('2024-03-15'),
  },
  {
    id: 'doc-5',
    type: 'Регистрация',
    status: 'verified' as const,
    expiryDate: new Date('2025-06-30'),
    uploadDate: new Date('2024-04-10'),
  },
  {
    id: 'doc-6',
    type: 'Медкнижка',
    status: 'expired' as const,
    expiryDate: new Date('2024-11-01'),
    uploadDate: new Date('2024-03-20'),
  },
];

const mockPermits = [
  { id: 'p-1', name: 'Разнорабочие', verified: true },
  { id: 'p-2', name: 'Грузчик', verified: true },
  { id: 'p-3', name: 'Подсобник', verified: true },
  { id: 'p-4', name: 'Высотные работы', verified: false },
  { id: 'p-5', name: 'Строительная безопасность', verified: true },
];

const mockShiftHistory = [
  {
    id: 'СМ-001',
    date: new Date('2025-11-23'),
    object: { name: 'ЖК Северный', id: 'ОБ-123' },
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    status: 'completed' as const,
    incomingRate: 2500,
    outgoingRate: 1800,
    totalPayout: 16200,
    remarks: '',
  },
  {
    id: 'СМ-087',
    date: new Date('2025-11-22'),
    object: { name: 'ЖК Северный', id: 'ОБ-123' },
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    status: 'completed' as const,
    incomingRate: 2500,
    outgoingRate: 1800,
    totalPayout: 16200,
    remarks: '',
  },
  {
    id: 'СМ-056',
    date: new Date('2025-11-20'),
    object: { name: 'БЦ Skyline', id: 'ОБ-045' },
    client: { name: 'РемСтройСервис', id: 'КЛ-019' },
    status: 'completed' as const,
    incomingRate: 2500,
    outgoingRate: 1800,
    totalPayout: 16200,
    remarks: '',
  },
  {
    id: 'СМ-032',
    date: new Date('2025-11-19'),
    object: { name: 'ТЦ Гранд Плаза', id: 'ОБ-087' },
    client: { name: 'МегаСтрой ООО', id: 'КЛ-038' },
    status: 'completed' as const,
    incomingRate: 2800,
    outgoingRate: 2000,
    totalPayout: 18000,
    remarks: 'Опоздание 15 мин',
  },
];

const mockPayments = [
  {
    id: 'pay-1',
    date: new Date('2025-11-20'),
    amount: 64800,
    commission: 3888,
    total: 60912,
    status: 'paid' as const,
  },
  {
    id: 'pay-2',
    date: new Date('2025-11-13'),
    amount: 48600,
    commission: 2916,
    total: 45684,
    status: 'paid' as const,
  },
  {
    id: 'pay-3',
    date: new Date('2025-11-06'),
    amount: 32400,
    commission: 1944,
    total: 30456,
    status: 'pending' as const,
  },
];

const mockUpcomingShifts = [
  {
    id: 'СМ-156',
    date: new Date('2025-11-24'),
    object: 'ЖК Северный',
    time: '08:00 - 18:00',
    confirmed: true,
  },
  {
    id: 'СМ-157',
    date: new Date('2025-11-25'),
    object: 'БЦ Skyline',
    time: '09:00 - 17:00',
    confirmed: false,
  },
];

const mockLogs = [
  {
    id: 'log-1',
    type: 'created',
    timestamp: new Date('2024-03-15T10:30:00'),
    user: 'Анна Смирнова',
    description: 'Исполнитель добавлен в систему',
  },
  {
    id: 'log-2',
    type: 'document_uploaded',
    timestamp: new Date('2024-03-15T11:00:00'),
    user: 'Система',
    description: 'Загружены документы: Паспорт, Патент, СНиЛС',
  },
  {
    id: 'log-3',
    type: 'shift_completed',
    timestamp: new Date('2025-11-23T17:00:00'),
    user: 'Система',
    description: 'Завершена смена СМ-001 на объекте ЖК Северный',
  },
  {
    id: 'log-4',
    type: 'payment',
    timestamp: new Date('2025-11-20T12:00:00'),
    user: 'Система выплат',
    description: 'Выплата 60 912 ₽ выполнена успешно',
  },
];

const documentStatusConfig = {
  verified: {
    label: 'Проверено',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  needs_update: {
    label: 'Требует обновления',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
  },
  expired: {
    label: 'Просрочено',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
  },
};

const shiftStatusConfig = {
  completed: { label: 'Завершена', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  cancelled: { label: 'Отменена', color: 'bg-red-100 text-red-700 border-red-200' },
};

const paymentStatusConfig = {
  paid: { label: 'Выплачено', color: 'bg-green-50 text-green-700 border-green-200' },
  pending: { label: 'Ожидает', color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

export function WorkerProfile({ workerId, onBack }: WorkerProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Основное', icon: User },
    { id: 'documents', label: 'Документы', icon: FileText },
    { id: 'permits', label: 'Допуски и Навыки', icon: Award },
    { id: 'shifts', label: 'История выходов', icon: Clock },
    { id: 'finance', label: 'Финансы', icon: DollarSign },
    { id: 'schedule', label: 'График', icon: Calendar },
    { id: 'communications', label: 'Коммуникации', icon: MessageCircle },
    { id: 'tasks', label: 'Задачи', icon: ClipboardList },
    { id: 'logs', label: 'Логи', icon: Activity },
  ];

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
            Назад к списку исполнителей
          </button>

          {/* Worker Summary */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                  {mockWorkerData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-gray-900">{mockWorkerData.name}</h1>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {mockWorkerData.selfEmployed ? 'Самозанятый' : 'Не активен'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">{mockWorkerData.rating}</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    {mockPermits.filter((p) => p.verified).length} допусков
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="font-mono">{mockWorkerData.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{mockWorkerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{mockWorkerData.district}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <History className="w-4 h-4" />
                История изменений
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Коммуникации
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Создать задачу
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Tabs */}
      <div className="flex">
        {/* Tab Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.20))]">
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-8">
          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl">
              <h2 className="text-gray-900 mb-6">Основная информация</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Личные данные</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">ФИО</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockWorkerData.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Дата рождения</Label>
                      <div className="text-sm text-gray-900 mt-1">
                        {mockWorkerData.birthDate.toLocaleDateString('ru-RU')} (
                        {new Date().getFullYear() - mockWorkerData.birthDate.getFullYear()} лет)
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Телефон</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockWorkerData.phone}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Адрес / Район проживания</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockWorkerData.address}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Расстояние до объектов</Label>
                      <div className="text-sm text-gray-900 mt-1">
                        ~{mockWorkerData.distanceToObjects} км (средн.)
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Рейтинг</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-900">{mockWorkerData.rating}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Статус самозанятости</Label>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 mt-1"
                      >
                        {mockWorkerData.selfEmployed ? 'Самозанятый' : 'Физ. лицо'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Внутренний допуск</Label>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 mt-1"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Проверен
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Operational Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm text-gray-900 mb-4">Операционная информация</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-500">Основной тип работ</Label>
                        <div className="text-sm text-gray-900 mt-1">
                          {mockWorkerData.primaryWorkType}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Дополнительные навыки</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {mockWorkerData.additionalSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Источник привлечения</Label>
                        <div className="text-sm text-gray-900 mt-1">{mockWorkerData.source}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Дата добавления</Label>
                        <div className="text-sm text-gray-900 mt-1">
                          {mockWorkerData.dateAdded.toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm text-gray-900 mb-4">Внутренние комментарии HR</h3>
                    <Textarea
                      defaultValue={mockWorkerData.hrComment}
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Documents */}
          {activeTab === 'documents' && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Документы</h2>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Загрузить документ
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {mockDocuments.map((doc) => {
                  const StatusIcon = documentStatusConfig[doc.status].icon;
                  return (
                    <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-sm text-gray-900">{doc.type}</h3>
                            <Badge
                              variant="outline"
                              className={cn('text-xs mt-1', documentStatusConfig[doc.status].color)}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {documentStatusConfig[doc.status].label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Загружен:</span>
                          <span className="text-gray-900">
                            {doc.uploadDate.toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        {doc.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Действителен до:</span>
                            <span className="text-gray-900">
                              {doc.expiryDate.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Скачать
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab: Permits */}
          {activeTab === 'permits' && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Допуски и навыки</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить допуск
                </Button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 space-y-3">
                  {mockPermits.map((permit) => (
                    <div
                      key={permit.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            permit.verified
                              ? 'bg-green-100'
                              : 'bg-gray-100'
                          )}
                        >
                          {permit.verified ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Award className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{permit.name}</div>
                          <div className="text-xs text-gray-500">
                            {permit.verified ? 'Подтверждено' : 'Не подтверждено'}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Shift History */}
          {activeTab === 'shifts' && (
            <div className="max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">История выходов</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Месяц
                  </Button>
                  <Button variant="outline" size="sm">
                    Квартал
                  </Button>
                  <Button variant="outline" size="sm">
                    Год
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Дата</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Вход. ставка</TableHead>
                      <TableHead>Исх. ставка</TableHead>
                      <TableHead>Итог</TableHead>
                      <TableHead>Замечания</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShiftHistory.map((shift) => (
                      <TableRow key={shift.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {shift.date.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{shift.object.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{shift.object.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{shift.client.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{shift.client.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('text-xs', shiftStatusConfig[shift.status].color)}
                          >
                            {shiftStatusConfig[shift.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{shift.incomingRate} ₽</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{shift.outgoingRate} ₽</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">
                            {shift.totalPayout.toLocaleString('ru-RU')} ₽
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{shift.remarks || '—'}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Всего выходов</div>
                  <div className="text-2xl text-gray-900">{mockShiftHistory.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Завершено</div>
                  <div className="text-2xl text-green-600">
                    {mockShiftHistory.filter((s) => s.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Всего выплачено</div>
                  <div className="text-2xl text-gray-900">
                    {mockShiftHistory
                      .reduce((sum, s) => sum + s.totalPayout, 0)
                      .toLocaleString('ru-RU')}{' '}
                    ₽
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Средняя смена</div>
                  <div className="text-2xl text-gray-900">
                    {Math.round(
                      mockShiftHistory.reduce((sum, s) => sum + s.totalPayout, 0) /
                        mockShiftHistory.length
                    ).toLocaleString('ru-RU')}{' '}
                    ₽
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Finance */}
          {activeTab === 'finance' && (
            <div className="max-w-6xl">
              <h2 className="text-gray-900 mb-6">Финансы</h2>
              <div className="space-y-6">
                {/* Salary Project */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Salary Project</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label className="text-xs text-gray-500">Статус подклчения</Label>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 mt-1"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Подключен к Т-Банк
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Дата согласия ФНС</Label>
                      <div className="text-sm text-gray-900 mt-1">15 марта 2024</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">ИНН самозанятого</Label>
                      <div className="text-sm text-gray-900 font-mono mt-1">
                        {mockWorkerData.inn}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payments */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm text-gray-900">Выплаты</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Дата</TableHead>
                        <TableHead>Начисление</TableHead>
                        <TableHead>Комиссия 6%</TableHead>
                        <TableHead>К выплате</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {payment.date.toLocaleDateString('ru-RU')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {payment.amount.toLocaleString('ru-RU')} ₽
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700">
                              {payment.commission.toLocaleString('ru-RU')} ₽
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {payment.total.toLocaleString('ru-RU')} ₽
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', paymentStatusConfig[payment.status].color)}
                            >
                              {paymentStatusConfig[payment.status].label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Всего начислено</div>
                    <div className="text-2xl text-gray-900">
                      {mockPayments
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString('ru-RU')}{' '}
                      ₽
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Комиссия</div>
                    <div className="text-2xl text-gray-900">
                      {mockPayments
                        .reduce((sum, p) => sum + p.commission, 0)
                        .toLocaleString('ru-RU')}{' '}
                      ₽
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">К выплате</div>
                    <div className="text-2xl text-green-600">
                      {mockPayments
                        .reduce((sum, p) => sum + p.total, 0)
                        .toLocaleString('ru-RU')}{' '}
                      ₽
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Schedule */}
          {activeTab === 'schedule' && (
            <div className="max-w-4xl">
              <h2 className="text-gray-900 mb-6">График и доступность</h2>
              <div className="space-y-6">
                {/* Availability Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Текущий статус</h3>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 text-sm py-2 px-4"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Свободен
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Готов к новым сменам • Геозона: ~5 км
                    </div>
                  </div>
                </div>

                {/* Upcoming Shifts */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Предстоящие смены</h3>
                  <div className="space-y-3">
                    {mockUpcomingShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {shift.date.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                              })}
                            </div>
                            <div className="text-xs text-gray-600">
                              {shift.object} • {shift.time}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            shift.confirmed
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          )}
                        >
                          {shift.confirmed ? 'Подтверждено' : 'Ожидает подтверждения'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Communications */}
          {activeTab === 'communications' && (
            <div className="max-w-4xl">
              <h2 className="text-gray-900 mb-6">Коммуникации</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Коммуникации с исполнителем</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Здесь будут отображаться все обращения, связанные с этим исполнителем
                  </p>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Открыть диалог
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Tasks */}
          {activeTab === 'tasks' && (
            <div className="max-w-4xl">
              <h2 className="text-gray-900 mb-6">Задачи</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Задачи исполнителя</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Создавайте и отслеживайте задачи, связанные с этим исполнителем
                  </p>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать задачу
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Logs */}
          {activeTab === 'logs' && (
            <div className="max-w-4xl">
              <h2 className="text-gray-900 mb-6">История изменений</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                  {mockLogs.map((log, index) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-gray-600" />
                        </div>
                        {index < mockLogs.length - 1 && (
                          <div className="w-px h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm text-gray-900">{log.description}</p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {log.timestamp.toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}