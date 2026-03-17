import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Plus,
  MessageSquare,
  ClipboardList,
  History,
  Building2,
  FileText,
  Star,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
  Shield,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  Upload,
  Users,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ClientProfileProps {
  clientId: string;
  onBack?: () => void;
}

const mockClientData = {
  id: 'КЛ-042',
  name: 'СтройГрупп ООО',
  status: 'active' as const,
  manager: 'Анна Смирнова',
  category: 'Крупный застройщик',
  rating: 4.8,
  type: 'Застройщик',
  description: 'Крупная строительная компания, специализирующаяся на жилищном строительстве в Москве и МО. Работаем с 2018 года.',
  industry: 'Жилищное строительство',
  contractNumber: 'ДОГ-2024-042',
  paymentTerms: 'Еженедельная оплата, отсрочка 7 дней',
  restrictions: '',
  internalNotes: 'Надёжный клиент, всегда оплачивает вовремя. Предпочитают работать с проверенными специалистами.',
  contacts: [
    {
      name: 'Иванов Пётр Сергеевич',
      position: 'Директор по строительству',
      phone: '+7 (495) 123-45-67',
      email: 'ivanov@stroigrupp.ru',
    },
    {
      name: 'Смирнова Елена Викторовна',
      position: 'Менеджер проектов',
      phone: '+7 (495) 123-45-68',
      email: 'smirnova@stroigrupp.ru',
    },
  ],
};

const mockLegalEntities = [
  {
    id: 'ЮЛ-001',
    name: 'ООО "СтройГрупп"',
    inn: '7701234567',
    kpp: '770101001',
    ogrn: '1027700123456',
    bank: 'ПАО "Сбербанк"',
    account: '40702810100000012345',
    status: 'active' as const,
    address: 'Москва, ул. Строителей, д. 10',
  },
  {
    id: 'ЮЛ-002',
    name: 'ООО "СтройГрупп Инвест"',
    inn: '7701234568',
    kpp: '770101001',
    ogrn: '1027700123457',
    bank: 'ПАО "Сбербанк"',
    account: '40702810100000012346',
    status: 'active' as const,
    address: 'Москва, ул. Строителей, д. 10',
  },
];

const mockObjects = [
  {
    id: 'ОБ-123',
    name: 'ЖК Северный',
    address: 'Москва, Северный р-н, ул. Новая, д. 15',
    foreman: 'Петров А.М.',
    activeRequests: 3,
    shiftsToday: 12,
    status: 'active' as const,
  },
  {
    id: 'ОБ-125',
    name: 'ЖК Солнечный',
    address: 'Москва, Западный р-н, ул. Солнечная, д. 22',
    foreman: 'Сидоров И.П.',
    activeRequests: 2,
    shiftsToday: 8,
    status: 'active' as const,
  },
  {
    id: 'ОБ-128',
    name: 'БЦ Премиум',
    address: 'Москва, Центральный р-н, пр-т Мира, д. 45',
    foreman: 'Козлов В.А.',
    activeRequests: 1,
    shiftsToday: 5,
    status: 'active' as const,
  },
];

const mockJobOrders = [
  {
    id: 'ЗН-001',
    workType: 'Разнорабочие',
    unit: 'час',
    unitCost: 2500,
    unitsPerDay: 9,
    incomingRate: 2500,
    legalEntity: 'ООО "СтройГрупп"',
    validFrom: new Date('2024-11-01'),
    validTo: new Date('2025-12-31'),
  },
  {
    id: 'ЗН-002',
    workType: 'Грузчики',
    unit: 'час',
    unitCost: 2200,
    unitsPerDay: 9,
    incomingRate: 2200,
    legalEntity: 'ООО "СтройГрупп"',
    validFrom: new Date('2024-11-01'),
    validTo: new Date('2025-12-31'),
  },
  {
    id: 'ЗН-003',
    workType: 'Подсобники',
    unit: 'час',
    unitCost: 2000,
    unitsPerDay: 9,
    incomingRate: 2000,
    legalEntity: 'ООО "СтройГрупп Инвест"',
    validFrom: new Date('2024-11-01'),
    validTo: new Date('2025-12-31'),
  },
];

const mockRequests = [
  {
    id: 'ЗАЯ-145',
    type: 'Разнорабочие',
    object: 'ЖК Северный',
    workers: 10,
    date: new Date('2025-11-24'),
    status: 'approved' as const,
  },
  {
    id: 'ЗАЯ-146',
    type: 'Грузчики',
    object: 'ЖК Солнечный',
    workers: 5,
    date: new Date('2025-11-25'),
    status: 'pending' as const,
  },
  {
    id: 'ЗАЯ-147',
    type: 'Подсобники',
    object: 'БЦ Премиум',
    workers: 3,
    date: new Date('2025-11-24'),
    status: 'in_progress' as const,
  },
];

const mockShifts = [
  {
    id: 'СМ-001',
    date: new Date('2025-11-23'),
    worker: 'Иванов С.П.',
    object: 'ЖК Северный',
    workType: 'Разнорабочие',
    status: 'completed' as const,
    payout: 16200,
  },
  {
    id: 'СМ-002',
    date: new Date('2025-11-23'),
    worker: 'Петров А.М.',
    object: 'ЖК Северный',
    workType: 'Грузчики',
    status: 'completed' as const,
    payout: 14400,
  },
  {
    id: 'СМ-003',
    date: new Date('2025-11-23'),
    worker: 'Сидоров Д.И.',
    object: 'ЖК Солнечный',
    workType: 'Подсобники',
    status: 'in_progress' as const,
    payout: 0,
  },
];

const mockLogs = [
  {
    id: 'log-1',
    type: 'created',
    timestamp: new Date('2024-06-15T10:00:00'),
    user: 'Анна Смирнова',
    description: 'Клиент создан в системе',
  },
  {
    id: 'log-2',
    type: 'legal_entity_added',
    timestamp: new Date('2024-06-15T11:00:00'),
    user: 'Анна Смирнова',
    description: 'Добавлено юр. лицо: ООО "СтройГрупп"',
  },
  {
    id: 'log-3',
    type: 'object_created',
    timestamp: new Date('2024-06-20T14:30:00'),
    user: 'Анна Смирнова',
    description: 'Создан объект: ЖК Северный',
  },
  {
    id: 'log-4',
    type: 'request_created',
    timestamp: new Date('2025-11-23T09:00:00'),
    user: 'Система',
    description: 'Создана заявка ЗАЯ-145 на объект ЖК Северный',
  },
];

const statusConfig = {
  active: {
    label: 'Активен',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  on_hold: {
    label: 'На паузе',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  restricted: {
    label: 'Ограничен',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
};

const requestStatusConfig = {
  pending: { label: 'На согласовании', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: 'Согласовано', color: 'bg-green-50 text-green-700 border-green-200' },
  in_progress: { label: 'В работе', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Выполнено', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const shiftStatusConfig = {
  completed: { label: 'Завершена', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  in_progress: { label: 'В процессе', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  cancelled: { label: 'Отменена', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Основное', icon: Building2 },
    { id: 'legal', label: 'Юридические лица', icon: Shield },
    { id: 'objects', label: 'Объекты', icon: MapPin },
    { id: 'job-orders', label: 'Заказ-наряды', icon: FileText },
    { id: 'requests', label: 'Заявки', icon: ClipboardList },
    { id: 'shifts', label: 'Смены', icon: Clock },
    { id: 'finance', label: 'Финансы', icon: DollarSign },
    { id: 'communications', label: 'Коммуникации', icon: MessageSquare },
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
            Назад к списку клиентов
          </button>

          {/* Client Summary */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-gray-900">{mockClientData.name}</h1>
                  <Badge
                    variant="outline"
                    className={cn(statusConfig[mockClientData.status].color)}
                  >
                    {statusConfig[mockClientData.status].label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">{mockClientData.rating}</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {mockClientData.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span className="font-mono">{mockClientData.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{mockClientData.manager}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>{mockClientData.contractNumber}</span>
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
                <ClipboardList className="w-4 h-4" />
                Создать задачу
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Коммуникации
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Создать заявку
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Создать объект
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
                {/* Company Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Информация о компании</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Название</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockClientData.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Тип клиента</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockClientData.type}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Отрасль</Label>
                      <div className="text-sm text-gray-900 mt-1">{mockClientData.industry}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Описание</Label>
                      <div className="text-sm text-gray-900 mt-1">
                        {mockClientData.description}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Договорной номер</Label>
                      <div className="text-sm text-gray-900 mt-1 font-mono">
                        {mockClientData.contractNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operational Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm text-gray-900 mb-4">Операционная информация</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-500">Менеджер</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-xs">
                              {mockClientData.manager
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">{mockClientData.manager}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Условия оплаты</Label>
                        <div className="text-sm text-gray-900 mt-1">
                          {mockClientData.paymentTerms}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Категория</Label>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 mt-1"
                        >
                          {mockClientData.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm text-gray-900 mb-4">Внутренние комментарии</h3>
                    <Textarea
                      defaultValue={mockClientData.internalNotes}
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Persons */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm text-gray-900 mb-4">Контактные лица</h3>
                <div className="space-y-3">
                  {mockClientData.contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-500">{contact.position}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
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

          {/* Tab: Legal Entities */}
          {activeTab === 'legal' && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Юридические лица</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить юр. лицо
                </Button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Название</TableHead>
                      <TableHead>ИНН</TableHead>
                      <TableHead>КПП</TableHead>
                      <TableHead>ОГРН</TableHead>
                      <TableHead>Банк</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLegalEntities.map((entity) => (
                      <TableRow key={entity.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{entity.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{entity.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900 font-mono">{entity.inn}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700 font-mono">{entity.kpp}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700 font-mono">{entity.ogrn}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">{entity.bank}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Активно
                          </Badge>
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
            </div>
          )}

          {/* Tab: Objects */}
          {activeTab === 'objects' && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Объекты клиента</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать объект
                </Button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Название объекта</TableHead>
                      <TableHead>Адрес</TableHead>
                      <TableHead>Ответственный</TableHead>
                      <TableHead className="text-center">Заявки</TableHead>
                      <TableHead className="text-center">Смены сегодня</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockObjects.map((object) => (
                      <TableRow key={object.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{object.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{object.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">{object.address}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">{object.foreman}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {object.activeRequests}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {object.shiftsToday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Активен
                          </Badge>
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
            </div>
          )}

          {/* Tab: Job Orders */}
          {activeTab === 'job-orders' && (
            <div className="max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Заказ-наряды</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать заказ-наряд
                </Button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Вид работ</TableHead>
                      <TableHead>Ед. изм.</TableHead>
                      <TableHead className="text-right">Стоимость ед.</TableHead>
                      <TableHead className="text-right">Кол-во/день</TableHead>
                      <TableHead className="text-right">Вход. ставка</TableHead>
                      <TableHead>Юр. лицо</TableHead>
                      <TableHead>Период действия</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockJobOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{order.workType}</div>
                            <div className="text-xs text-gray-500 font-mono">{order.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{order.unit}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-900 font-mono">
                            {order.unitCost} ₽
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-700">{order.unitsPerDay}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-900 font-mono">
                            {order.incomingRate} ₽
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">{order.legalEntity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {order.validFrom.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            —{' '}
                            {order.validTo.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
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
            </div>
          )}

          {/* Tab: Requests */}
          {activeTab === 'requests' && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Заявки клиента</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать заявку
                </Button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>ID</TableHead>
                      <TableHead>Тип работ</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead className="text-center">Исполнителей</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell>
                          <span className="text-sm text-gray-900 font-mono">{request.id}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{request.type}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{request.object}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {request.workers}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {request.date.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(requestStatusConfig[request.status].color)}
                          >
                            {requestStatusConfig[request.status].label}
                          </Badge>
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
            </div>
          )}

          {/* Tab: Shifts */}
          {activeTab === 'shifts' && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Смены клиента</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Сегодня
                  </Button>
                  <Button variant="outline" size="sm">
                    Неделя
                  </Button>
                  <Button variant="outline" size="sm">
                    Месяц
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Дата</TableHead>
                      <TableHead>Исполнитель</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead>Тип работ</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Выплата</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShifts.map((shift) => (
                      <TableRow key={shift.id} className="hover:bg-gray-50">
                        <TableCell>
                          <span className="text-sm text-gray-900">
                            {shift.date.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{shift.worker}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{shift.object}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">{shift.workType}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(shiftStatusConfig[shift.status].color)}
                          >
                            {shiftStatusConfig[shift.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-900 font-mono">
                            {shift.payout > 0 ? `${shift.payout.toLocaleString('ru-RU')} ₽` : '—'}
                          </span>
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
            </div>
          )}

          {/* Tab: Finance */}
          {activeTab === 'finance' && (
            <div className="max-w-6xl">
              <h2 className="text-gray-900 mb-6">Финансы клиента</h2>
              <div className="space-y-6">
                {/* Revenue Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Выручка за месяц</div>
                    <div className="text-2xl text-gray-900">1 245 000 ₽</div>
                    <div className="text-xs text-green-600 mt-1">+15% к прошлому месяцу</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Маржа</div>
                    <div className="text-2xl text-green-600">385 000 ₽</div>
                    <div className="text-xs text-gray-600 mt-1">31% от выручки</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Дебиторка</div>
                    <div className="text-2xl text-orange-600">0 ₽</div>
                    <div className="text-xs text-gray-600 mt-1">Все оплачено</div>
                  </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Динамика выручки</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">График выручки по месяцам</p>
                    </div>
                  </div>
                </div>

                {/* Margin by Objects */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Доходность по объектам</h3>
                  <div className="space-y-3">
                    {mockObjects.map((object) => (
                      <div
                        key={object.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 mb-1">{object.name}</div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>Выручка: 420 000 ₽</span>
                            <span>Расходы: 285 000 ₽</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600">135 000 ₽</div>
                          <div className="text-xs text-gray-500">Маржа 32%</div>
                        </div>
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
              <h2 className="text-gray-900 mb-6">Коммуникации с клиентом</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Коммуникации</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Здесь будут отображаться все обращения, связанные с этим клиентом
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
              <h2 className="text-gray-900 mb-6">Задачи клиента</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Задачи</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Создавайте и отслеживайте задачи, связанные с этим клиентом
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