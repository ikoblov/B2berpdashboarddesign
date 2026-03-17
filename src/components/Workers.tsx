import { useState } from "react";
import {
  Plus,
  Filter,
  Download,
  Search,
  ExternalLink,
  MoreVertical,
  Star,
  Shield,
  MapPin,
  Phone,
  Clock,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Copy,
  Archive,
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

interface Worker {
  id: string;
  name: string;
  phone: string;
  district: string;
  rating: number;
  selfEmployed: boolean;
  status: 'active' | 'inactive' | 'needs_review';
  primaryWorkType: string;
  totalShifts: number;
  lastShift: Date | null;
  avgPayout: number;
  permits: number;
}

const mockWorkers: Worker[] = [
  {
    id: 'РАБ-145',
    name: 'Иванов Сергей Петрович',
    phone: '+7 (999) 123-45-67',
    district: 'Северный р-н',
    rating: 4.8,
    selfEmployed: true,
    status: 'active',
    primaryWorkType: 'Разнорабочие',
    totalShifts: 24,
    lastShift: new Date('2025-11-23'),
    avgPayout: 16200,
    permits: 5,
  },
  {
    id: 'РАБ-182',
    name: 'Петров Алексей Михайлович',
    phone: '+7 (999) 234-56-78',
    district: 'Центральный р-н',
    rating: 4.5,
    selfEmployed: true,
    status: 'active',
    primaryWorkType: 'Электрики',
    totalShifts: 18,
    lastShift: new Date('2025-11-23'),
    avgPayout: 19200,
    permits: 4,
  },
  {
    id: 'РАБ-203',
    name: 'Сидоров Дмитрий Иванович',
    phone: '+7 (999) 345-67-89',
    district: 'Западный р-н',
    rating: 4.9,
    selfEmployed: true,
    status: 'active',
    primaryWorkType: 'Сантехники',
    totalShifts: 32,
    lastShift: new Date('2025-11-22'),
    avgPayout: 17800,
    permits: 6,
  },
  {
    id: 'РАБ-156',
    name: 'Козлов Игорь Владимирович',
    phone: '+7 (999) 456-78-90',
    district: 'Южный р-н',
    rating: 4.3,
    selfEmployed: false,
    status: 'active',
    primaryWorkType: 'Грузчики',
    totalShifts: 15,
    lastShift: new Date('2025-11-21'),
    avgPayout: 14400,
    permits: 3,
  },
  {
    id: 'РАБ-189',
    name: 'Морозов Андрей Сергеевич',
    phone: '+7 (999) 567-89-01',
    district: 'Восточный р-н',
    rating: 4.6,
    selfEmployed: true,
    status: 'active',
    primaryWorkType: 'Разнорабочие',
    totalShifts: 21,
    lastShift: new Date('2025-11-23'),
    avgPayout: 15600,
    permits: 4,
  },
  {
    id: 'РАБ-172',
    name: 'Волков Николай Петрович',
    phone: '+7 (999) 678-90-12',
    district: 'Северный р-н',
    rating: 4.4,
    selfEmployed: true,
    status: 'inactive',
    primaryWorkType: 'Маляры',
    totalShifts: 12,
    lastShift: new Date('2025-10-15'),
    avgPayout: 16800,
    permits: 3,
  },
  {
    id: 'РАБ-198',
    name: 'Соколов Владимир Иванович',
    phone: '+7 (999) 789-01-23',
    district: 'Центральный р-н',
    rating: 4.2,
    selfEmployed: false,
    status: 'needs_review',
    primaryWorkType: 'Отделочники',
    totalShifts: 9,
    lastShift: new Date('2025-11-18'),
    avgPayout: 18000,
    permits: 2,
  },
  {
    id: 'РАБ-211',
    name: 'Лебедев Артем Олегович',
    phone: '+7 (999) 890-12-34',
    district: 'Западный р-н',
    rating: 4.7,
    selfEmployed: true,
    status: 'active',
    primaryWorkType: 'Бетонщики',
    totalShifts: 28,
    lastShift: new Date('2025-11-23'),
    avgPayout: 17850,
    permits: 5,
  },
];

const statusConfig = {
  active: {
    label: 'Активен',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  inactive: {
    label: 'Не активен',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  needs_review: {
    label: 'Требует проверки',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

interface WorkersProps {
  onNavigate?: (view: string) => void;
  onOpenWorkerProfile?: (workerId: string) => void;
}

export function Workers({ onNavigate, onOpenWorkerProfile }: WorkersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');

  const filteredWorkers = mockWorkers.filter((worker) => {
    if (filterStatus !== 'all' && worker.status !== filterStatus) return false;
    if (filterWorkType !== 'all' && worker.primaryWorkType !== filterWorkType) return false;
    return true;
  });

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Сотрудники</h1>
              <p className="text-sm text-gray-600">
                Управление базой исполнителей
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>

              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Добавить сотрудника
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по имени, телефону, району..."
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
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Не активен</SelectItem>
                  <SelectItem value="needs_review">Требует проверки</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterWorkType} onValueChange={setFilterWorkType}>
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Тип работ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="Разнорабочие">Разнорабочие</SelectItem>
                  <SelectItem value="Электрики">Электрики</SelectItem>
                  <SelectItem value="Сантехники">Сантехники</SelectItem>
                  <SelectItem value="Грузчики">Грузчики</SelectItem>
                  <SelectItem value="Маляры">Маляры</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-districts">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-districts">Все районы</SelectItem>
                  <SelectItem value="north">Северный р-н</SelectItem>
                  <SelectItem value="south">Южный р-н</SelectItem>
                  <SelectItem value="east">Восточный р-н</SelectItem>
                  <SelectItem value="west">Западный р-н</SelectItem>
                  <SelectItem value="center">Центральный р-н</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Доступные сегодня ({filteredWorkers.filter(w => w.status === 'active').length})
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">ФИО</TableHead>
                <TableHead className="w-[150px]">Телефон</TableHead>
                <TableHead className="w-[140px]">Район</TableHead>
                <TableHead className="w-[100px]">Рейтинг</TableHead>
                <TableHead className="w-[140px]">Тип работ</TableHead>
                <TableHead className="w-[120px]">Статус</TableHead>
                <TableHead className="w-[100px] text-center">Допусков</TableHead>
                <TableHead className="w-[100px] text-center">Смен</TableHead>
                <TableHead className="w-[120px]">Последняя</TableHead>
                <TableHead className="w-[120px]">Средний чек</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => {
                return (
                  <TableRow
                    key={worker.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onOpenWorkerProfile?.(worker.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
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
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{worker.phone}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{worker.district}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-900">{worker.rating}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-700">{worker.primaryWorkType}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusConfig[worker.status].color)}
                        >
                          {statusConfig[worker.status].label}
                        </Badge>
                        {worker.selfEmployed && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Самозанятый
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{worker.permits}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{worker.totalShifts}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {worker.lastShift
                          ? worker.lastShift.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {worker.avgPayout.toLocaleString('ru-RU')} ₽
                        </span>
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
                              Открыть профиль
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Копировать контакт
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-orange-600">
                              <Archive className="w-4 h-4 mr-2" />
                              Деактивировать
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
            <div className="text-sm text-gray-600 mb-1">Всего исполнителей</div>
            <div className="text-2xl text-gray-900">{mockWorkers.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных</div>
            <div className="text-2xl text-green-600">
              {mockWorkers.filter((w) => w.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Самозанятых</div>
            <div className="text-2xl text-blue-600">
              {mockWorkers.filter((w) => w.selfEmployed).length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Средний рейтинг</div>
            <div className="text-2xl text-gray-900">
              {(
                mockWorkers.reduce((sum, w) => sum + w.rating, 0) / mockWorkers.length
              ).toFixed(1)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Всего смен</div>
            <div className="text-2xl text-gray-900">
              {mockWorkers.reduce((sum, w) => sum + w.totalShifts, 0)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}