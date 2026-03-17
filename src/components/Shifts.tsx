import { useState } from "react";
import {
  Plus,
  Filter,
  Download,
  Search,
  Calendar,
  ExternalLink,
  MoreVertical,
  Building2,
  Users,
  Clock,
  DollarSign,
  User,
  Briefcase,
  Copy,
  Archive,
  XCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CreateShiftModal } from "./CreateShiftModal";

interface Shift {
  id: string;
  date: Date;
  worker: {
    name: string;
    id: string;
  };
  client: {
    name: string;
    id: string;
  };
  object: {
    name: string;
    id: string;
  };
  workType: string;
  status: 'new' | 'assigned' | 'confirmed' | 'arrived' | 'working' | 'left' | 'completed' | 'cancelled';
  incomingRate: number;
  outgoingRate: number;
  actualArrival: Date | null;
  actualDeparture: Date | null;
  totalPayout: number;
  lastAction: string;
  lastUpdate: Date;
}

const mockShifts: Shift[] = [
  {
    id: 'СМ-001',
    date: new Date('2025-11-23T08:00:00'),
    worker: { name: 'Иванов Сергей Петрович', id: 'РАБ-145' },
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    object: { name: 'ЖК Северный', id: 'ОБ-123' },
    workType: 'Разнорабочие',
    status: 'completed',
    incomingRate: 2500,
    outgoingRate: 1800,
    actualArrival: new Date('2025-11-23T08:15:00'),
    actualDeparture: new Date('2025-11-23T17:00:00'),
    totalPayout: 16200,
    lastAction: 'Смена завершена',
    lastUpdate: new Date('2025-11-23T17:00:00'),
  },
  {
    id: 'СМ-002',
    date: new Date('2025-11-23T08:00:00'),
    worker: { name: 'Петров Алексей Михайлович', id: 'РАБ-182' },
    client: { name: 'МегаСтрой ООО', id: 'КЛ-038' },
    object: { name: 'ТЦ Гранд Плаза', id: 'ОБ-087' },
    workType: 'Электрики',
    status: 'working',
    incomingRate: 3200,
    outgoingRate: 2400,
    actualArrival: new Date('2025-11-23T08:00:00'),
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Работает на объекте',
    lastUpdate: new Date('2025-11-23T08:00:00'),
  },
  {
    id: 'СМ-003',
    date: new Date('2025-11-24T08:00:00'),
    worker: { name: 'Сидоров Дмитрий Иванович', id: 'РАБ-203' },
    client: { name: 'РемСтройСервис', id: 'КЛ-019' },
    object: { name: 'БЦ Skyline', id: 'ОБ-045' },
    workType: 'Сантехники',
    status: 'confirmed',
    incomingRate: 2800,
    outgoingRate: 2000,
    actualArrival: null,
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Подтверждено в Telegram',
    lastUpdate: new Date('2025-11-23T16:30:00'),
  },
  {
    id: 'СМ-004',
    date: new Date('2025-11-24T07:00:00'),
    worker: { name: 'Козлов Игорь Владимирович', id: 'РАБ-156' },
    client: { name: 'СтройИнвест', id: 'КЛ-056' },
    object: { name: 'ЖК Новый Горизонт', id: 'ОБ-112' },
    workType: 'Грузчики',
    status: 'assigned',
    incomingRate: 2200,
    outgoingRate: 1600,
    actualArrival: null,
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Назначен на смену',
    lastUpdate: new Date('2025-11-23T14:20:00'),
  },
  {
    id: 'СМ-005',
    date: new Date('2025-11-23T09:00:00'),
    worker: { name: 'Морозов Андрей Сергеевич', id: 'РАБ-189' },
    client: { name: 'ГлавСтрой', id: 'КЛ-023' },
    object: { name: 'Складской комплекс "Логистика+"', id: 'ОБ-098' },
    workType: 'Разнорабочие',
    status: 'arrived',
    incomingRate: 2500,
    outgoingRate: 1800,
    actualArrival: new Date('2025-11-23T09:10:00'),
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Прибыл на объект',
    lastUpdate: new Date('2025-11-23T09:10:00'),
  },
  {
    id: 'СМ-006',
    date: new Date('2025-11-25T08:00:00'),
    worker: { name: 'Волков Николай Петрович', id: 'РАБ-172' },
    client: { name: 'СтройГрупп ООО', id: 'КЛ-042' },
    object: { name: 'ЖК Восточный', id: 'ОБ-156' },
    workType: 'Маляры',
    status: 'new',
    incomingRate: 2600,
    outgoingRate: 1900,
    actualArrival: null,
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Смена создана',
    lastUpdate: new Date('2025-11-23T10:15:00'),
  },
  {
    id: 'СМ-007',
    date: new Date('2025-11-22T08:00:00'),
    worker: { name: 'Соколов Владимир Иванович', id: 'РАБ-198' },
    client: { name: 'ПромСтройСити', id: 'КЛ-072' },
    object: { name: 'Офисное здание "Кристалл"', id: 'ОБ-134' },
    workType: 'Отделочники',
    status: 'cancelled',
    incomingRate: 2700,
    outgoingRate: 2000,
    actualArrival: null,
    actualDeparture: null,
    totalPayout: 0,
    lastAction: 'Отменена исполнителем',
    lastUpdate: new Date('2025-11-22T07:30:00'),
  },
  {
    id: 'СМ-008',
    date: new Date('2025-11-23T08:00:00'),
    worker: { name: 'Лебедев Артем Олегович', id: 'РАБ-211' },
    client: { name: 'РемСтройСервис', id: 'КЛ-019' },
    object: { name: 'Жилой комплекс "Парковый"', id: 'ОБ-178' },
    workType: 'Бетонщики',
    status: 'left',
    incomingRate: 2900,
    outgoingRate: 2100,
    actualArrival: new Date('2025-11-23T08:00:00'),
    actualDeparture: new Date('2025-11-23T16:30:00'),
    totalPayout: 17850,
    lastAction: 'Покинул объект',
    lastUpdate: new Date('2025-11-23T16:30:00'),
  },
];

const statusConfig = {
  new: {
    label: 'Новый',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  assigned: {
    label: 'Назначен',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  confirmed: {
    label: 'Подтверждён',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  arrived: {
    label: 'Прибыл',
    color: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  working: {
    label: 'Работает',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  left: {
    label: 'Ушёл',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  completed: {
    label: 'Завершена',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  cancelled: {
    label: 'Отменена',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
};

interface ShiftsProps {
  onNavigate?: (view: string) => void;
  onOpenShiftDetail?: (shiftId: string) => void;
}

export function Shifts({ onNavigate, onOpenShiftDetail }: ShiftsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredShifts = mockShifts.filter(shift => {
    if (filterStatus !== 'all' && shift.status !== filterStatus) return false;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const shiftDate = new Date(shift.date);
    const shiftDay = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate());
    
    if (dateFilter === 'today' && shiftDay.getTime() !== today.getTime()) return false;
    if (dateFilter === 'tomorrow' && shiftDay.getTime() !== tomorrow.getTime()) return false;
    if (dateFilter === 'week' && (shiftDay < today || shiftDay > weekEnd)) return false;
    
    return true;
  });

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Смены</h1>
              <p className="text-sm text-gray-600">
                Управление сменами, статусами и учет рабочего времени
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>

              <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Создать смену
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по исполнителю, объекту, типу работ..."
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
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="assigned">Назначен</SelectItem>
                  <SelectItem value="confirmed">Подтверждён</SelectItem>
                  <SelectItem value="arrived">Прибыл</SelectItem>
                  <SelectItem value="working">Работает</SelectItem>
                  <SelectItem value="left">Ушёл</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                  <SelectItem value="cancelled">Отменена</SelectItem>
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

              <Select defaultValue="all-work-types">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-work-types">Все типы работ</SelectItem>
                  <SelectItem value="laborers">Разнорабочие</SelectItem>
                  <SelectItem value="electricians">Электрики</SelectItem>
                  <SelectItem value="plumbers">Сантехники</SelectItem>
                  <SelectItem value="painters">Маляры</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={dateFilter === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
              >
                Сегодня
              </Button>
              <Button
                variant={dateFilter === 'tomorrow' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter(dateFilter === 'tomorrow' ? 'all' : 'tomorrow')}
              >
                Завтра
              </Button>
              <Button
                variant={dateFilter === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateFilter(dateFilter === 'week' ? 'all' : 'week')}
              >
                Неделя
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Дата</TableHead>
                <TableHead className="w-[200px]">Исполнитель</TableHead>
                <TableHead className="w-[160px]">Клиент</TableHead>
                <TableHead className="w-[180px]">Объект</TableHead>
                <TableHead className="w-[140px]">Тип работ</TableHead>
                <TableHead className="w-[130px]">Статус</TableHead>
                <TableHead className="w-[100px]">Вход. ставка</TableHead>
                <TableHead className="w-[100px]">Исх. ставка</TableHead>
                <TableHead className="w-[100px]">Прибытие</TableHead>
                <TableHead className="w-[100px]">Уход</TableHead>
                <TableHead className="w-[100px]">Итог</TableHead>
                <TableHead className="w-[180px]">Последнее действие</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift) => {
                return (
                  <TableRow
                    key={shift.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onOpenShiftDetail?.(shift.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {shift.date.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {shift.date.toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {shift.worker.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-gray-900">{shift.worker.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{shift.worker.id}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">{shift.client.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{shift.client.id}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">{shift.object.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{shift.object.id}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-700">{shift.workType}</span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', statusConfig[shift.status].color)}
                      >
                        {statusConfig[shift.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        {shift.incomingRate}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        {shift.outgoingRate}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {shift.actualArrival
                          ? shift.actualArrival.toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {shift.actualDeparture
                          ? shift.actualDeparture.toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {shift.totalPayout > 0 ? `${shift.totalPayout.toLocaleString('ru-RU')} ₽` : '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-700">{shift.lastAction}</div>
                        <div className="text-xs text-gray-500">
                          {shift.lastUpdate.toLocaleString('ru-RU', {
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
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Отменить
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
        <div className="mt-6 grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Всего смен</div>
            <div className="text-2xl text-gray-900">{mockShifts.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">В работе</div>
            <div className="text-2xl text-green-600">
              {mockShifts.filter((s) => s.status === 'working' || s.status === 'arrived').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Завершено</div>
            <div className="text-2xl text-gray-600">
              {mockShifts.filter((s) => s.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Ожидают</div>
            <div className="text-2xl text-blue-600">
              {mockShifts.filter((s) => s.status === 'assigned' || s.status === 'confirmed').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Общие выплаты</div>
            <div className="text-2xl text-gray-900">
              {mockShifts
                .reduce((sum, s) => sum + s.totalPayout, 0)
                .toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      </div>

      {/* Create Shift Modal */}
      <CreateShiftModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}