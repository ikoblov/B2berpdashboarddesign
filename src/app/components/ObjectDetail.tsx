import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Building2,
  User,
  Plus,
  ExternalLink,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  ClipboardList,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Map,
  Star,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ObjectDetailProps {
  objectId: string;
  onBack?: () => void;
}

const mockObjectData = {
  id: 'ОБ-123',
  name: 'ЖК Северный',
  client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
  address: 'г. Москва, ул. Полярная, д. 31',
  coordinates: { lat: 55.751244, lng: 37.618423 },
  manager: { name: 'Иванов Петр Сергеевич' },
  status: 'active' as const,
  type: 'Жилой комплекс',
  comment: 'Крупный жилой комплекс в северном районе Москвы. Требуется строгий контроль доступа.',
  curator: { name: 'Смирнова Анна Викторовна' },
};

const mockRequests = [
  {
    id: 'ЗАЯ-4523',
    date: new Date('2025-11-25T08:00:00'),
    status: 'complete' as const,
    requestedStaff: 15,
    assignedStaff: 15,
    progress: 100,
  },
  {
    id: 'ЗАЯ-4522',
    date: new Date('2025-11-24T09:00:00'),
    status: 'partial' as const,
    requestedStaff: 8,
    assignedStaff: 5,
    progress: 62,
  },
  {
    id: 'ЗАЯ-4521',
    date: new Date('2025-11-26T08:00:00'),
    status: 'selection' as const,
    requestedStaff: 12,
    assignedStaff: 8,
    progress: 67,
  },
];

const mockShifts = [
  {
    id: 'СМ-001',
    date: new Date('2025-11-23T08:00:00'),
    worker: { name: 'Иванов Сергей Петрович' },
    status: 'completed' as const,
    incomingRate: 2500,
    outgoingRate: 1800,
    comment: 'Смена завершена успешно',
  },
  {
    id: 'СМ-002',
    date: new Date('2025-11-23T08:00:00'),
    worker: { name: 'Петров Алексей Михайлович' },
    status: 'on-site' as const,
    incomingRate: 2500,
    outgoingRate: 1800,
    comment: '',
  },
  {
    id: 'СМ-003',
    date: new Date('2025-11-24T08:00:00'),
    worker: { name: 'Сидоров Дмитрий Иванович' },
    status: 'assigned' as const,
    incomingRate: 2800,
    outgoingRate: 2000,
    comment: '',
  },
];

const mockWorkers = [
  {
    id: 'РАБ-001',
    name: 'Иванов Сергей Петрович',
    shiftsCount: 24,
    rating: 4.8,
    remarks: 0,
    lastAppearance: new Date('2025-11-23T17:00:00'),
    skills: ['Высотные работы', 'Строительная безопасность'],
  },
  {
    id: 'РАБ-002',
    name: 'Петров Алексей Михайлович',
    shiftsCount: 18,
    rating: 4.5,
    remarks: 1,
    lastAppearance: new Date('2025-11-23T14:30:00'),
    skills: ['Электробезопасность', 'Допуск СРО'],
  },
  {
    id: 'РАБ-003',
    name: 'Сидоров Дмитрий Иванович',
    shiftsCount: 32,
    rating: 4.9,
    remarks: 0,
    lastAppearance: new Date('2025-11-22T18:00:00'),
    skills: ['Сантехника', 'Газовое оборудование'],
  },
];

const mockLogs = [
  {
    id: 'log-1',
    type: 'object_created',
    timestamp: new Date('2025-10-01T10:00:00'),
    user: 'Анна Смирнова',
    description: 'Объект создан в системе',
  },
  {
    id: 'log-2',
    type: 'request_created',
    timestamp: new Date('2025-11-20T14:25:00'),
    user: 'Анна Смирнова',
    description: 'Создана заявка ЗАЯ-4523 на 15 сотрудников',
  },
  {
    id: 'log-3',
    type: 'worker_assigned',
    timestamp: new Date('2025-11-21T11:30:00'),
    user: 'Иванов П.С.',
    description: 'Назначено 8 сотрудников на смену',
  },
  {
    id: 'log-4',
    type: 'shift_completed',
    timestamp: new Date('2025-11-23T18:00:00'),
    user: 'Система',
    description: 'Завершена смена СМ-001, все исполнители отметились',
  },
];

const statusConfig = {
  draft: { label: 'Черновик', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  selection: { label: 'На подборе', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  partial: { label: 'Частично', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  complete: { label: 'Укомплектована', color: 'bg-green-100 text-green-700 border-green-200' },
};

const shiftStatusConfig = {
  assigned: { label: 'Назначен', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  confirmed: { label: 'Подтверждён', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  late: { label: 'Опоздал', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'on-site': { label: 'На объекте', color: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Завершена', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export function ObjectDetail({ objectId, onBack }: ObjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
            Назад к списку объектов
          </button>

          {/* Object Summary */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-gray-900">{mockObjectData.name}</h1>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Активный
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>{mockObjectData.client.name}</span>
                    <span className="text-gray-400 font-mono">({mockObjectData.client.id})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{mockObjectData.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{mockObjectData.manager.name}</span>
                  </div>
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
                <Plus className="w-4 h-4" />
                Создать заявку
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Основное</TabsTrigger>
            <TabsTrigger value="requests">Заявки</TabsTrigger>
            <TabsTrigger value="shifts">Смены</TabsTrigger>
            <TabsTrigger value="workers">Персонал</TabsTrigger>
            <TabsTrigger value="communications">Коммуникации</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="logs">Логи</TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h3 className="text-sm text-gray-900">Информация об объекте</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Название</div>
                    <div className="text-sm text-gray-900">{mockObjectData.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Клиент</div>
                    <div className="text-sm text-gray-900">{mockObjectData.client.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Адрес</div>
                    <div className="text-sm text-gray-900 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {mockObjectData.address}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Тип объекта</div>
                    <div className="text-sm text-gray-900">{mockObjectData.type}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Внутренний комментарий</div>
                    <div className="text-sm text-gray-700">{mockObjectData.comment}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm text-gray-900 mb-4">Геолокация</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Карта объекта</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {mockObjectData.coordinates.lat}, {mockObjectData.coordinates.lng}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                  <h3 className="text-sm text-gray-900">Ответственные</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Менеджер</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            АС
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">
                          {mockObjectData.curator.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Мастер</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            ИП
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">
                          {mockObjectData.manager.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Requests */}
          <TabsContent value="requests">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm text-gray-900">Заявки на объекте</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать заявку
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>ID заявки</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сотрудников</TableHead>
                    <TableHead>Прогресс</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className="font-mono text-sm text-gray-900">{request.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {request.date.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusConfig[request.status].color)}
                        >
                          {statusConfig[request.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {request.assignedStaff} / {request.requestedStaff}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Комплектация</span>
                            <span className="text-gray-900">{request.progress}%</span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
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
          </TabsContent>

          {/* Tab 3: Shifts */}
          <TabsContent value="shifts">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-900">Смены на объекте</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Сегодня</Button>
                    <Button variant="outline" size="sm">Завтра</Button>
                    <Button variant="outline" size="sm">Неделя</Button>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Дата</TableHead>
                    <TableHead>Исполнитель</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Входящая ставка</TableHead>
                    <TableHead>Исходящая ставка</TableHead>
                    <TableHead>Комментарий</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockShifts.map((shift) => (
                    <TableRow key={shift.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {shift.date.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {shift.worker.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">{shift.worker.name}</span>
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
                        <span className="text-sm text-gray-700">{shift.incomingRate} ₽/час</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">{shift.outgoingRate} ₽/час</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{shift.comment || '—'}</span>
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
          </TabsContent>

          {/* Tab 4: Workers */}
          <TabsContent value="workers">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm text-gray-900">Персонал объекта</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Исполнители, которые выполняли смены на этом объекте
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>ФИО</TableHead>
                    <TableHead>Количество выходов</TableHead>
                    <TableHead>Средняя оценка</TableHead>
                    <TableHead>Замечания</TableHead>
                    <TableHead>Последнее появление</TableHead>
                    <TableHead>Допуски</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWorkers.map((worker) => (
                    <TableRow key={worker.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {worker.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm text-gray-900">{worker.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{worker.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{worker.shiftsCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-gray-900">{worker.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            worker.remarks === 0
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          )}
                        >
                          {worker.remarks}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">
                          {worker.lastAppearance.toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                            >
                              {skill}
                            </Badge>
                          ))}
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
          </TabsContent>

          {/* Tab 5: Communications */}
          <TabsContent value="communications">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm text-gray-900 mb-2">Коммуникации по объекту</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Здесь будут отображаться все обращения, связанные с этим объектом
                </p>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Открыть в коммуникациях
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 6: Tasks */}
          <TabsContent value="tasks">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm text-gray-900 mb-2">Задачи по объекту</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Создавайте и отслеживайте задачи, связанные с этим объектом
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать задачу
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 7: Logs */}
          <TabsContent value="logs">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-6">История изменений</h3>
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}