import { useState } from "react";
import {
  Plus,
  Filter,
  Download,
  Search,
  Calendar,
  ExternalLink,
  Copy,
  Archive,
  MoreVertical,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Pause,
  XCircle,
  FileX,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Progress } from "./ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CreateRequestModal } from "./CreateRequestModal";

interface Request {
  id: string;
  client: {
    name: string;
    id: string;
  };
  object: {
    name: string;
    id: string;
  };
  workType: string;
  executionDate: Date;
  requestedStaff: number;
  assignedStaff: number;
  status: 'draft' | 'selection' | 'partial' | 'complete' | 'withdrawn' | 'closed';
  manager: {
    name: string;
    avatar?: string;
  };
  lastAction: string;
  lastUpdate: Date;
}

const mockRequests: Request[] = [
  {
    id: 'ЗАЯ-4523',
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    object: { name: 'ЖК Северный', id: 'ОБ-123' },
    workType: 'Разнорабочие',
    executionDate: new Date('2025-11-25T08:00:00'),
    requestedStaff: 15,
    assignedStaff: 15,
    status: 'complete',
    manager: { name: 'Анна Смирнова' },
    lastAction: 'Все сотрудники назначены',
    lastUpdate: new Date('2025-11-20T14:25:00'),
  },
  {
    id: 'ЗАЯ-4522',
    client: { name: 'МегаСтрой ООО', id: 'КЛ-038' },
    object: { name: 'ТЦ Гранд Плаза', id: 'ОБ-087' },
    workType: 'Отделочники',
    executionDate: new Date('2025-11-24T09:00:00'),
    requestedStaff: 8,
    assignedStaff: 5,
    status: 'partial',
    manager: { name: 'Михаил Петров' },
    lastAction: 'Добавлено 2 сотрудника',
    lastUpdate: new Date('2025-11-20T11:30:00'),
  },
  {
    id: 'ЗАЯ-4521',
    client: { name: 'РемСтройСервис', id: 'КЛ-019' },
    object: { name: 'БЦ Skyline', id: 'ОБ-045' },
    workType: 'Электрики',
    executionDate: new Date('2025-11-26T08:00:00'),
    requestedStaff: 12,
    assignedStaff: 8,
    status: 'partial',
    manager: { name: 'Дмитрий Соколов' },
    lastAction: 'На подборе 4 сотрудника',
    lastUpdate: new Date('2025-11-20T10:15:00'),
  },
  {
    id: 'ЗАЯ-4520',
    client: { name: 'СтройИнвест', id: 'КЛ-056' },
    object: { name: 'ЖК Новый Горизонт', id: 'ОБ-112' },
    workType: 'Сантехники',
    executionDate: new Date('2025-11-27T09:00:00'),
    requestedStaff: 6,
    assignedStaff: 0,
    status: 'selection',
    manager: { name: 'Елена Волкова' },
    lastAction: 'Начат подбор персонала',
    lastUpdate: new Date('2025-11-20T09:45:00'),
  },
  {
    id: 'ЗАЯ-4519',
    client: { name: 'ГлавСтрой', id: 'КЛ-023' },
    object: { name: 'Складской комплекс "Логистика+"', id: 'ОБ-098' },
    workType: 'Грузчики',
    executionDate: new Date('2025-11-23T07:00:00'),
    requestedStaff: 20,
    assignedStaff: 0,
    status: 'draft',
    manager: { name: 'Анна Смирнова' },
    lastAction: 'Черновик создан',
    lastUpdate: new Date('2025-11-19T16:20:00'),
  },
  {
    id: 'ЗАЯ-4518',
    client: { name: 'ПромСтройСити', id: 'КЛ-072' },
    object: { name: 'Офисное здание "Кристалл"', id: 'ОБ-134' },
    workType: 'Разнорабочие',
    executionDate: new Date('2025-11-22T08:00:00'),
    requestedStaff: 10,
    assignedStaff: 0,
    status: 'withdrawn',
    manager: { name: 'Михаил Петров' },
    lastAction: 'Заявка отозвана клиентом',
    lastUpdate: new Date('2025-11-19T14:10:00'),
  },
  {
    id: 'ЗАЯ-4517',
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    object: { name: 'ЖК Восточный', id: 'ОБ-156' },
    workType: 'Маляры',
    executionDate: new Date('2025-11-18T08:00:00'),
    requestedStaff: 5,
    assignedStaff: 5,
    status: 'closed',
    manager: { name: 'Дмитрий Соколов' },
    lastAction: 'Работы выполнены, заявка закрыта',
    lastUpdate: new Date('2025-11-18T18:30:00'),
  },
  {
    id: 'ЗАЯ-4516',
    client: { name: 'МегаСтрой ООО', id: 'КЛ-038' },
    object: { name: 'ТЦ Гранд Плаза', id: 'ОБ-087' },
    workType: 'Плотники',
    executionDate: new Date('2025-11-28T09:00:00'),
    requestedStaff: 7,
    assignedStaff: 2,
    status: 'selection',
    manager: { name: 'Елена Волкова' },
    lastAction: 'Подбор в процессе',
    lastUpdate: new Date('2025-11-20T08:30:00'),
  },
  {
    id: 'ЗАЯ-4515',
    client: { name: 'РемСтройСервис', id: 'КЛ-019' },
    object: { name: 'Жилой комплекс "Парковый"', id: 'ОБ-178' },
    workType: 'Бетонщики',
    executionDate: new Date('2025-11-29T07:00:00'),
    requestedStaff: 18,
    assignedStaff: 12,
    status: 'partial',
    manager: { name: 'Анна Смирнова' },
    lastAction: 'Требуется еще 6 сотрудников',
    lastUpdate: new Date('2025-11-20T13:50:00'),
  },
];

const statusConfig = {
  draft: {
    label: 'Черновик',
    icon: Circle,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  selection: {
    label: 'На подборе',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  partial: {
    label: 'Частично',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  complete: {
    label: 'Укомплектована',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  withdrawn: {
    label: 'Отозвана',
    icon: FileX,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  closed: {
    label: 'Закрыта',
    icon: XCircle,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

interface RequestsProps {
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
  onOpenRequestDetail?: (requestId: string) => void;
}

export function Requests({ onNavigate, onOpenRequestDetail }: RequestsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const calculateProgress = (request: Request) => {
    return (request.assignedStaff / request.requestedStaff) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Заявки</h1>
              <p className="text-sm text-gray-600">
                Управление заявками на подбор персонала от клиентов
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>

              <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Создать заявку
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по ID, клиенту, объекту..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border-gray-200"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="selection">На подборе</SelectItem>
                  <SelectItem value="partial">Частично</SelectItem>
                  <SelectItem value="complete">Укомплектована</SelectItem>
                  <SelectItem value="withdrawn">Отозвана</SelectItem>
                  <SelectItem value="closed">Закрыта</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-clients">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-clients">Все клиенты</SelectItem>
                  <SelectItem value="stroygrup">СтройГрупп ООО</SelectItem>
                  <SelectItem value="megastroy">МегаСтрой ООО</SelectItem>
                  <SelectItem value="remstroy">РемСтройСервис</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-dates">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dates">Все даты</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="tomorrow">Завтра</SelectItem>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={quickFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('all')}
              >
                Все заявки
              </Button>
              <Button
                variant={quickFilter === 'mine' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('mine')}
              >
                Мои заявки
              </Button>
              <Button
                variant={quickFilter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('urgent')}
              >
                Срочные
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">ID заявки</TableHead>
                <TableHead className="w-[180px]">Клиент</TableHead>
                <TableHead className="w-[180px]">Объект</TableHead>
                <TableHead className="w-[140px]">Тип работ</TableHead>
                <TableHead className="w-[140px]">Дата исполнения</TableHead>
                <TableHead className="w-[100px] text-center">
                  Сотрудников
                </TableHead>
                <TableHead className="w-[150px]">Статус</TableHead>
                <TableHead className="w-[160px]">Ответственный</TableHead>
                <TableHead className="w-[180px]">Прогресс</TableHead>
                <TableHead className="w-[200px]">
                  Последнее действие
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                const progress = calculateProgress(request);
                const progressColor = getProgressColor(progress);

                return (
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onOpenRequestDetail?.(request.id)}
                  >
                    <TableCell>
                      <span className="font-mono text-sm text-gray-900">
                        {request.id}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">
                          {request.client.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {request.client.id}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">
                          {request.object.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {request.object.id}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {request.workType}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {request.executionDate.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {request.assignedStaff}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {request.requestedStaff}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border',
                          statusConfig[request.status].color
                        )}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[request.status].label}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {request.manager.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {request.manager.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            Комплектация
                          </span>
                          <span className="text-gray-900">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2"
                          indicatorClassName={progressColor}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-700">
                          {request.lastAction}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.lastUpdate.toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Открыть
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Дублировать
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-orange-600">
                              <Archive className="w-4 h-4 mr-2" />
                              Архивировать
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Всего заявок</div>
            <div className="text-2xl text-gray-900">{mockRequests.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">На подборе</div>
            <div className="text-2xl text-blue-600">
              {
                mockRequests.filter(
                  (r) => r.status === 'selection' || r.status === 'partial'
                ).length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Укомплектовано</div>
            <div className="text-2xl text-green-600">
              {mockRequests.filter((r) => r.status === 'complete').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">
              Запрошено сотрудников
            </div>
            <div className="text-2xl text-gray-900">
              {mockRequests.reduce((sum, r) => sum + r.requestedStaff, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      <CreateRequestModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}