import { useState } from "react";
import {
  Plus,
  Filter,
  Download,
  Search,
  MapPin,
  ExternalLink,
  MoreVertical,
  Building2,
  Users,
  Calendar,
  Activity,
  Archive,
  Copy,
  FileText,
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
import { CreateObjectModal } from "./CreateObjectModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

interface ObjectItem {
  id: string;
  name: string;
  address: string;
  responsible: {
    name: string;
  };
  activeRequests: number;
  totalRequests: number;
  shiftsToday: number;
  completionProgress: number;
  status: 'active' | 'archived';
  lastUpdate: Date;
}

const mockObjects: ObjectItem[] = [
  {
    id: 'ОБ-123',
    name: 'ЖК Северный',
    address: 'г. Москва, ул. Полярная, д. 31',
    responsible: { name: 'Иванов Петр Сергеевич' },
    activeRequests: 3,
    totalRequests: 5,
    shiftsToday: 12,
    completionProgress: 85,
    status: 'active',
    lastUpdate: new Date('2025-11-23T14:25:00'),
  },
  {
    id: 'ОБ-087',
    name: 'ТЦ Гранд Плаза',
    address: 'г. Москва, Ленинградский пр-т, д. 76',
    responsible: { name: 'Сидоров Алексей Михайлович' },
    activeRequests: 2,
    totalRequests: 4,
    shiftsToday: 8,
    completionProgress: 62,
    status: 'active',
    lastUpdate: new Date('2025-11-23T11:30:00'),
  },
  {
    id: 'ОБ-045',
    name: 'БЦ Skyline',
    address: 'г. Москва, Пресненская наб., д. 12',
    responsible: { name: 'Петров Константин Алексеевич' },
    activeRequests: 4,
    totalRequests: 6,
    shiftsToday: 15,
    completionProgress: 70,
    status: 'active',
    lastUpdate: new Date('2025-11-23T10:15:00'),
  },
  {
    id: 'ОБ-112',
    name: 'ЖК Новый Горизонт',
    address: 'г. Москва, Варшавское ш., д. 148',
    responsible: { name: 'Козлов Дмитрий Иванович' },
    activeRequests: 1,
    totalRequests: 2,
    shiftsToday: 5,
    completionProgress: 45,
    status: 'active',
    lastUpdate: new Date('2025-11-23T09:45:00'),
  },
  {
    id: 'ОБ-098',
    name: 'Складской комплекс "Логистика+"',
    address: 'г. Москва, МКАД 47-й км, вл. 3',
    responsible: { name: 'Иванов Петр Сергеевич' },
    activeRequests: 5,
    totalRequests: 8,
    shiftsToday: 22,
    completionProgress: 92,
    status: 'active',
    lastUpdate: new Date('2025-11-23T16:20:00'),
  },
  {
    id: 'ОБ-156',
    name: 'ЖК Восточный',
    address: 'г. Москва, ул. Большая Черкизовская, д. 5',
    responsible: { name: 'Сидоров Алексей Михайлович' },
    activeRequests: 0,
    totalRequests: 0,
    shiftsToday: 0,
    completionProgress: 100,
    status: 'archived',
    lastUpdate: new Date('2025-11-18T18:30:00'),
  },
  {
    id: 'ОБ-134',
    name: 'Офисное здание "Кристалл"',
    address: 'г. Москва, Кутузовский пр-т, д. 36',
    responsible: { name: 'Петров Константин Алексеевич' },
    activeRequests: 2,
    totalRequests: 3,
    shiftsToday: 6,
    completionProgress: 55,
    status: 'active',
    lastUpdate: new Date('2025-11-23T08:30:00'),
  },
  {
    id: 'ОБ-178',
    name: 'Жилой комплекс "Парковый"',
    address: 'г. Москва, ул. Академика Янгеля, д. 2',
    responsible: { name: 'Козлов Дмитрий Иванович' },
    activeRequests: 3,
    totalRequests: 5,
    shiftsToday: 18,
    completionProgress: 78,
    status: 'active',
    lastUpdate: new Date('2025-11-23T13:50:00'),
  },
];

interface ObjectsProps {
  onNavigate?: (view: string) => void;
  onOpenObjectDetail?: (objectId: string) => void;
}

export function Objects({ onNavigate, onOpenObjectDetail }: ObjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const filteredObjects = mockObjects.filter(obj => {
    if (filterStatus === 'active') return obj.status === 'active';
    if (filterStatus === 'archived') return obj.status === 'archived';
    return true;
  });

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Объекты</h1>
              <p className="text-sm text-gray-600">
                Управление строительными объектами и площадками
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>

              <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Создать объект
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, адресу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border-gray-200"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Активность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все объекты</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="archived">Архивные</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-managers">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Users className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-managers">Все ответственные</SelectItem>
                  <SelectItem value="ivanov">Иванов П.С.</SelectItem>
                  <SelectItem value="sidorov">Сидоров А.М.</SelectItem>
                  <SelectItem value="petrov">Петров К.А.</SelectItem>
                  <SelectItem value="kozlov">Козлов Д.И.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Activity className="w-4 h-4" />
              Активные сегодня ({filteredObjects.filter(o => o.shiftsToday > 0).length})
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
                <TableHead className="w-[200px]">Название объекта</TableHead>
                <TableHead className="w-[250px]">Адрес</TableHead>
                <TableHead className="w-[200px]">Ответственный</TableHead>
                <TableHead className="w-[120px] text-center">Заявок</TableHead>
                <TableHead className="w-[100px] text-center">Смен сегодня</TableHead>
                <TableHead className="w-[180px]">Прогресс</TableHead>
                <TableHead className="w-[120px]">Активность</TableHead>
                <TableHead className="w-[140px]">Обновлено</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObjects.map((object) => {
                const progressColor = getProgressColor(object.completionProgress);

                return (
                  <TableRow
                    key={object.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onOpenObjectDetail?.(object.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{object.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{object.id}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{object.address}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {object.responsible.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {object.responsible.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{object.activeRequests}</span>
                        <span className="text-xs text-gray-500">/ {object.totalRequests}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{object.shiftsToday}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Комплектация</span>
                          <span className="text-gray-900">
                            {Math.round(object.completionProgress)}%
                          </span>
                        </div>
                        <Progress
                          value={object.completionProgress}
                          className="h-2"
                          indicatorClassName={progressColor}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          object.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        )}
                      >
                        {object.status === 'active' ? 'Активный' : 'Архивный'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {object.lastUpdate.toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
            <div className="text-sm text-gray-600 mb-1">Всего объектов</div>
            <div className="text-2xl text-gray-900">{mockObjects.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных</div>
            <div className="text-2xl text-green-600">
              {mockObjects.filter((o) => o.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Смен сегодня</div>
            <div className="text-2xl text-blue-600">
              {mockObjects.reduce((sum, o) => sum + o.shiftsToday, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных заявок</div>
            <div className="text-2xl text-gray-900">
              {mockObjects.reduce((sum, o) => sum + o.activeRequests, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Create Object Modal */}
      <CreateObjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}