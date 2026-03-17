import { useState } from "react";
import {
  Plus,
  Filter,
  Calendar,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  AlertCircle,
  Clock,
  User,
  Link2,
  MessageSquare,
  Paperclip,
  X,
  ChevronDown,
  ExternalLink,
  Flag,
  CheckCircle2,
  Circle,
  Pause,
  XCircle,
  Users,
  FileText,
  ClockIcon,
  DollarSign,
  UserCircle,
  MessageCircle,
  AlertTriangle,
  Building2,
  Send,
  Tag,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'new' | 'in-progress' | 'waiting' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'shift' | 'request' | 'client' | 'payment' | 'worker' | 'communication' | 'incident';
  assignee?: {
    name: string;
    avatar?: string;
  };
  deadline?: Date;
  linkedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  lastAction?: string;
  sla?: {
    status: 'ok' | 'warning' | 'overdue';
  };
  createdAt: Date;
  tags?: string[];
  activities?: Array<{
    id: string;
    type: 'comment' | 'status-change' | 'assignment' | 'file';
    user: string;
    content: string;
    timestamp: Date;
  }>;
}

const mockTasks: Task[] = [
  {
    id: 'ЗАД-847',
    title: 'Согласовать график смен на декабрь',
    description: 'Необходимо согласовать и утвердить график смен для объекта ЖК Северный на декабрь 2025',
    status: 'new',
    priority: 'high',
    type: 'shift',
    assignee: { name: 'Анна Смирнова' },
    deadline: new Date('2025-11-22T18:00:00'),
    linkedEntity: { type: 'Объект', id: 'ОБ-123', name: 'ЖК Северный' },
    lastAction: 'Создана 2 часа назад',
    sla: { status: 'ok' },
    createdAt: new Date('2025-11-20T14:00:00'),
    tags: ['график', 'срочно'],
    activities: [
      { id: '1', type: 'comment', user: 'Анна Смирнова', content: 'Начинаю работу над графиком', timestamp: new Date('2025-11-20T14:30:00') },
    ],
  },
  {
    id: 'ЗАД-846',
    title: 'Подписать акт выполненных работ с МегаСтрой',
    description: 'Акт готов, требуется подпись руководителя и печать',
    status: 'in-progress',
    priority: 'critical',
    type: 'client',
    assignee: { name: 'Михаил Петров' },
    deadline: new Date('2025-11-20T17:00:00'),
    linkedEntity: { type: 'Клиент', id: 'КЛ-042', name: 'МегаСтрой ООО' },
    lastAction: 'Документ отправлен на согласование',
    sla: { status: 'warning' },
    createdAt: new Date('2025-11-19T10:00:00'),
    tags: ['документы', 'клиент'],
    activities: [
      { id: '1', type: 'comment', user: 'Михаил Петров', content: 'Документ подготовлен и отправлен', timestamp: new Date('2025-11-20T11:00:00') },
      { id: '2', type: 'status-change', user: 'Михаил Петров', content: 'Статус изменён на "В работе"', timestamp: new Date('2025-11-20T11:05:00') },
    ],
  },
  {
    id: 'ЗАД-845',
    title: 'Разобраться с задержкой выплат исполнителям',
    description: 'Несколько исполнителей жалуются на задержку выплат за прошлую неделю',
    status: 'waiting',
    priority: 'critical',
    type: 'payment',
    assignee: { name: 'Елена Волкова' },
    deadline: new Date('2025-11-20T16:00:00'),
    linkedEntity: { type: 'Реестр', id: 'РЕЕ-0847', name: 'Реестр выплат 11-17 ноября' },
    lastAction: 'Ожидает ответа от банка',
    sla: { status: 'overdue' },
    createdAt: new Date('2025-11-20T09:00:00'),
    tags: ['зарплата', 'срочно', 'инцидент'],
    activities: [
      { id: '1', type: 'comment', user: 'Елена Волкова', content: 'Связалась с банком, выясняю причину задержки', timestamp: new Date('2025-11-20T10:00:00') },
    ],
  },
  {
    id: 'ЗАД-844',
    title: 'Проверить информацию о прорабе смены #8834',
    description: 'Прораб не вышел на связь в начале смены, требуется проверка',
    status: 'in-progress',
    priority: 'high',
    type: 'incident',
    assignee: { name: 'Дмитрий Соколов' },
    deadline: new Date('2025-11-20T12:00:00'),
    linkedEntity: { type: 'Смена', id: 'СМ-8834', name: 'Смена #8834 - ТЦ Гранд Плаза' },
    lastAction: 'Связался с объектом',
    sla: { status: 'ok' },
    createdAt: new Date('2025-11-20T08:30:00'),
    tags: ['инцидент', 'смена'],
    activities: [
      { id: '1', type: 'comment', user: 'Дмитрий Соколов', content: 'Прораб был на объекте, проблема с телефоном', timestamp: new Date('2025-11-20T09:15:00') },
    ],
  },
  {
    id: 'ЗАД-843',
    title: 'Ответить на запрос клиента РемСтройСервис',
    description: 'Клиент запросил КП на 15 исполнителей',
    status: 'review',
    priority: 'medium',
    type: 'communication',
    assignee: { name: 'Анна Смирнова' },
    deadline: new Date('2025-11-21T12:00:00'),
    linkedEntity: { type: 'Обращение', id: 'COM-1840', name: 'Запрос от РемСтройСервис' },
    lastAction: 'КП отправлено на проверку',
    sla: { status: 'ok' },
    createdAt: new Date('2025-11-19T11:00:00'),
    tags: ['клиент', 'КП'],
    activities: [
      { id: '1', type: 'comment', user: 'Анна Смирнова', content: 'КП подготовлено, отправляю на проверку', timestamp: new Date('2025-11-20T10:00:00') },
    ],
  },
  {
    id: 'ЗАД-842',
    title: 'Найти замену для исполнителя Сидорова А.М.',
    description: 'Исполнитель заболел, нужна срочная замена на завтра',
    status: 'new',
    priority: 'high',
    type: 'worker',
    assignee: { name: 'Дмитрий Соколов' },
    deadline: new Date('2025-11-20T20:00:00'),
    linkedEntity: { type: 'Исполнитель', id: 'РАБ-456', name: 'Сидоров А.М.' },
    lastAction: 'Создана 1 час назад',
    sla: { status: 'ok' },
    createdAt: new Date('2025-11-20T13:20:00'),
    tags: ['исполнители', 'срочно'],
    activities: [],
  },
  {
    id: 'ЗАД-841',
    title: 'Обработать заявку #4521',
    description: 'Новая заявка на 12 исполнителей для ЖК Северный',
    status: 'completed',
    priority: 'medium',
    type: 'request',
    assignee: { name: 'Михаил Петров' },
    deadline: new Date('2025-11-20T15:00:00'),
    linkedEntity: { type: 'Заявка', id: 'ЗАЯ-4521', name: 'Заявка #4521' },
    lastAction: 'Заявка обработана  одобрена',
    sla: { status: 'ok' },
    createdAt: new Date('2025-11-19T14:00:00'),
    tags: ['заявка'],
    activities: [
      { id: '1', type: 'comment', user: 'Михаил Петров', content: 'Все позиции доступны, заявка одобрена', timestamp: new Date('2025-11-20T11:00:00') },
      { id: '2', type: 'status-change', user: 'Михаил Петров', content: 'Статус изменён на "Выполнена"', timestamp: new Date('2025-11-20T11:30:00') },
    ],
  },
];

const statusConfig = {
  'new': { label: 'Новая', icon: Circle, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'in-progress': { label: 'В работе', icon: Clock, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'waiting': { label: 'Ожидает', icon: Pause, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'review': { label: 'На проверке', icon: AlertCircle, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'completed': { label: 'Выполнена', icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
  'cancelled': { label: 'Отменена', icon: XCircle, color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const priorityConfig = {
  'low': { label: 'Низкий', color: 'text-gray-600' },
  'medium': { label: 'Средний', color: 'text-blue-600' },
  'high': { label: 'Высокий', color: 'text-orange-600' },
  'critical': { label: 'Критичный', color: 'text-red-600' },
};

const typeConfig = {
  'shift': { label: 'По сменам', icon: ClockIcon, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  'request': { label: 'По заявке', icon: FileText, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'client': { label: 'По клиенту', icon: Users, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'payment': { label: 'По выплатам', icon: DollarSign, color: 'bg-green-100 text-green-700 border-green-200' },
  'worker': { label: 'По исполнителю', icon: UserCircle, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'communication': { label: 'По коммуникации', icon: MessageCircle, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'incident': { label: 'Инцидент', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' },
};

const slaColors = {
  ok: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
};

interface TasksProps {
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
}

export function Tasks({ onNavigate }: TasksProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [quickView, setQuickView] = useState<'all' | 'mine' | 'team'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const groupedTasks = {
    new: mockTasks.filter(t => t.status === 'new'),
    'in-progress': mockTasks.filter(t => t.status === 'in-progress'),
    waiting: mockTasks.filter(t => t.status === 'waiting'),
    review: mockTasks.filter(t => t.status === 'review'),
    completed: mockTasks.filter(t => t.status === 'completed'),
    cancelled: mockTasks.filter(t => t.status === 'cancelled'),
  };

  const isOverdue = (task: Task) => {
    return task.deadline && task.deadline < new Date() && task.status !== 'completed' && task.status !== 'cancelled';
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Задачи</h1>
              <p className="text-sm text-gray-600">Управление задачами и операционными процессами</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select defaultValue="week">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Фильтры
              </Button>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать задачу
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать задачу</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Название задачи</Label>
                      <Input id="title" placeholder="Введите название..." className="mt-2" />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea id="description" placeholder="Опишите задачу..." className="mt-2" rows={4} />
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Приоритет</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="priority" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="critical">Критичный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Тип задачи</Label>
                      <Select defaultValue="request">
                        <SelectTrigger id="type" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shift">По сменам</SelectItem>
                          <SelectItem value="request">По заявке</SelectItem>
                          <SelectItem value="client">По клиенту</SelectItem>
                          <SelectItem value="payment">По выплатам</SelectItem>
                          <SelectItem value="worker">По исполнителю</SelectItem>
                          <SelectItem value="communication">По коммуникации</SelectItem>
                          <SelectItem value="incident">Инцидент</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="assignee">Исполнитель</Label>
                      <Select defaultValue="unassigned">
                        <SelectTrigger id="assignee" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Не назначено</SelectItem>
                          <SelectItem value="anna">Анна Смирнова</SelectItem>
                          <SelectItem value="mikhail">Михаил Петров</SelectItem>
                          <SelectItem value="dmitry">Дмитрий Соколов</SelectItem>
                          <SelectItem value="elena">Елена Волкова</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="deadline">Срок выполнения</Label>
                      <Input id="deadline" type="datetime-local" className="mt-2" />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="entity">Привязка к сущности</Label>
                      <Input id="entity" placeholder="Выберите или введите ID..." className="mt-2" />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="tags">Теги</Label>
                      <Input id="tags" placeholder="Добавьте теги через запятую..." className="mt-2" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Отменить</Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Создать задачу</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Views & Search */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button 
                variant={quickView === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickView('all')}
              >
                Все
              </Button>
              <Button 
                variant={quickView === 'mine' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickView('mine')}
              >
                Мои
              </Button>
              <Button 
                variant={quickView === 'team' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickView('team')}
              >
                Команды
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Поиск задач..." className="pl-9 bg-gray-50 border-gray-200" />
              </div>

              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="gap-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Канбан
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Список
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn("transition-all", selectedTask && "mr-[700px]")}>
        {viewMode === 'kanban' ? (
          /* Kanban Board */
          <div className="p-8 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {Object.entries(groupedTasks).map(([status, tasks]) => {
                const StatusIcon = statusConfig[status as keyof typeof statusConfig].icon;
                
                return (
                  <div key={status} className="w-80 flex-shrink-0">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm text-gray-900">
                          {statusConfig[status as keyof typeof statusConfig].label}
                        </h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                      {tasks.map((task) => {
                        const TypeIcon = typeConfig[task.type].icon;
                        const overdue = isOverdue(task);
                        
                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={cn(
                              "bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md group",
                              overdue && "border-red-300 bg-red-50",
                              selectedTask?.id === task.id && "ring-2 ring-blue-500"
                            )}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500 font-mono">{task.id}</span>
                                  <Flag className={cn("w-3 h-3", priorityConfig[task.priority].color)} />
                                </div>
                                <h4 className="text-sm text-gray-900 leading-snug">
                                  {task.title}
                                </h4>
                              </div>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border", typeConfig[task.type].color)}>
                                <TypeIcon className="w-3 h-3" />
                                {typeConfig[task.type].label}
                              </div>
                            </div>

                            {task.linkedEntity && (
                              <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-600">
                                <Link2 className="w-3 h-3" />
                                <span>{task.linkedEntity.type}: {task.linkedEntity.id}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              {task.assignee ? (
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="w-3 h-3 text-gray-400" />
                                </div>
                              )}

                              {task.deadline && (
                                <div className={cn(
                                  "flex items-center gap-1 text-xs",
                                  overdue ? "text-red-600" : "text-gray-500"
                                )}>
                                  <Clock className="w-3 h-3" />
                                  {task.deadline.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="p-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="min-w-[250px]">Название</TableHead>
                    <TableHead className="w-[100px]">Приоритет</TableHead>
                    <TableHead className="w-[180px]">Тип задачи</TableHead>
                    <TableHead className="w-[200px]">Привязанная сущность</TableHead>
                    <TableHead className="w-[150px]">Исполнитель</TableHead>
                    <TableHead className="w-[140px]">Статус</TableHead>
                    <TableHead className="w-[120px]">Deadline</TableHead>
                    <TableHead className="w-[80px]">SLA</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTasks.map((task) => {
                    const StatusIcon = statusConfig[task.status].icon;
                    const TypeIcon = typeConfig[task.type].icon;
                    const overdue = isOverdue(task);
                    
                    return (
                      <TableRow
                        key={task.id}
                        className={cn(
                          "cursor-pointer",
                          selectedTask?.id === task.id && "bg-blue-50",
                          overdue && "bg-red-50"
                        )}
                        onClick={() => setSelectedTask(task)}
                      >
                        <TableCell>
                          <span className="font-mono text-sm">{task.id}</span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <Flag className={cn("w-4 h-4 mt-0.5", priorityConfig[task.priority].color)} />
                            <span className="text-sm text-gray-900">{task.title}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className={cn("text-sm", priorityConfig[task.priority].color)}>
                            {priorityConfig[task.priority].label}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border", typeConfig[task.type].color)}>
                            <TypeIcon className="w-3.5 h-3.5" />
                            {typeConfig[task.type].label}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {task.linkedEntity ? (
                            <div className="text-sm text-gray-700">
                              <div className="text-xs text-gray-500">{task.linkedEntity.type}</div>
                              <div>{task.linkedEntity.id}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-700">{task.assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Не назначено</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border", statusConfig[task.status].color)}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig[task.status].label}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {task.deadline ? (
                            <div className={cn("text-sm", overdue && "text-red-600")}>
                              {task.deadline.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {task.sla && (
                            <div className={cn("px-2 py-1 rounded text-xs text-center", slaColors[task.sla.status])}>
                              {task.sla.status === 'ok' && '✓'}
                              {task.sla.status === 'warning' && '!'}
                              {task.sla.status === 'overdue' && '✗'}
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Panel - Task Details */}
      {selectedTask && (
        <div className="fixed right-0 top-16 bottom-0 w-[700px] bg-white border-l border-gray-200 shadow-xl flex flex-col z-20 overflow-y-auto">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 font-mono">{selectedTask.id}</span>
                  <Flag className={cn("w-4 h-4", priorityConfig[selectedTask.priority].color)} />
                </div>
                <h2 className="text-xl text-gray-900">{selectedTask.title}</h2>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedTask(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Приоритет</div>
                <div className={cn("text-sm", priorityConfig[selectedTask.priority].color)}>
                  {priorityConfig[selectedTask.priority].label}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Статус</div>
                <Select defaultValue={selectedTask.status}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in-progress">В работе</SelectItem>
                    <SelectItem value="waiting">Ожидает</SelectItem>
                    <SelectItem value="review">На проверке</SelectItem>
                    <SelectItem value="completed">Выполнена</SelectItem>
                    <SelectItem value="cancelled">Отменена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Исполнитель</div>
                {selectedTask.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {selectedTask.assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Не назначено</span>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Тип задачи</div>
                <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border", typeConfig[selectedTask.type].color)}>
                  {(() => {
                    const Icon = typeConfig[selectedTask.type].icon;
                    return <Icon className="w-3 h-3" />;
                  })()}
                  {typeConfig[selectedTask.type].label}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Deadline</div>
                <div className="text-sm text-gray-900">
                  {selectedTask.deadline?.toLocaleString('ru-RU', { 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) || '—'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Теги</div>
                <div className="flex gap-1">
                  {selectedTask.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedTask.description && (
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm text-gray-700 mb-2">Описание</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description}</p>
            </div>
          )}

          {/* Linked Entity */}
          {selectedTask.linkedEntity && (
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm text-gray-700 mb-3">Привязанная сущность</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">{selectedTask.linkedEntity.type}</div>
                  <div className="text-sm text-gray-900">{selectedTask.linkedEntity.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{selectedTask.linkedEntity.id}</div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Открыть
                </Button>
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="flex-1 p-6">
            <h4 className="text-sm text-gray-700 mb-4">Активность</h4>
            
            {selectedTask.activities && selectedTask.activities.length > 0 ? (
              <div className="space-y-4 mb-6">
                {selectedTask.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-900">{activity.user}</span>
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700">
                        {activity.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mb-6">Пока нет активности</div>
            )}

            {/* Comment Input */}
            <div>
              <Textarea
                placeholder="Добавить комментарий..."
                className="mb-3"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="w-4 h-4" />
                    Прикрепить
                  </Button>
                </div>
                <Button size="sm" className="gap-2">
                  <Send className="w-4 h-4" />
                  Отправить
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-sm text-gray-700 mb-3">Быстрые действия</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Открыть сущность
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ClockIcon className="w-4 h-4" />
                Связать со сменой
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Создать выплату
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Создать обращение
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}