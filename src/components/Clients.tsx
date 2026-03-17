import { useState } from "react";
import {
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  ExternalLink,
  MoreVertical,
  Building2,
  User,
  FileText,
  Clock,
  Star,
  Copy,
  Archive,
  MessageSquare,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

interface Client {
  id: string;
  name: string;
  legalEntities: number;
  activeObjects: number;
  activeRequests: number;
  jobOrders: number;
  manager: {
    name: string;
    avatar?: string;
  };
  status: 'active' | 'on_hold' | 'restricted';
  lastInteraction: Date;
  interactionType: string;
  category: string;
  rating: number;
}

const mockClients: Client[] = [
  {
    id: 'КЛ-042',
    name: 'СтройГрупп ООО',
    legalEntities: 2,
    activeObjects: 3,
    activeRequests: 5,
    jobOrders: 8,
    manager: {
      name: 'Анна Смирнова',
    },
    status: 'active',
    lastInteraction: new Date('2025-11-23T14:30:00'),
    interactionType: 'Запрос на персонал',
    category: 'Крупный застройщик',
    rating: 4.8,
  },
  {
    id: 'КЛ-019',
    name: 'РемСтройСервис',
    legalEntities: 1,
    activeObjects: 2,
    activeRequests: 3,
    jobOrders: 5,
    manager: {
      name: 'Дмитрий Козлов',
    },
    status: 'active',
    lastInteraction: new Date('2025-11-22T16:45:00'),
    interactionType: 'Звонок',
    category: 'Подрядчик',
    rating: 4.5,
  },
  {
    id: 'КЛ-038',
    name: 'МегаСтрой ООО',
    legalEntities: 3,
    activeObjects: 5,
    activeRequests: 8,
    jobOrders: 12,
    manager: {
      name: 'Анна Смирнова',
    },
    status: 'active',
    lastInteraction: new Date('2025-11-23T10:15:00'),
    interactionType: 'Email',
    category: 'Крупный застройщик',
    rating: 4.9,
  },
  {
    id: 'КЛ-015',
    name: 'Альянс Девелопмент',
    legalEntities: 2,
    activeObjects: 1,
    activeRequests: 2,
    jobOrders: 4,
    manager: {
      name: 'Елена Петрова',
    },
    status: 'on_hold',
    lastInteraction: new Date('2025-11-18T09:00:00'),
    interactionType: 'Встреча',
    category: 'Средний застройщик',
    rating: 4.2,
  },
  {
    id: 'КЛ-067',
    name: 'СтройИнвест Капитал',
    legalEntities: 1,
    activeObjects: 2,
    activeRequests: 4,
    jobOrders: 6,
    manager: {
      name: 'Дмитрий Козлов',
    },
    status: 'active',
    lastInteraction: new Date('2025-11-21T11:30:00'),
    interactionType: 'Telegram',
    category: 'Подрядчик',
    rating: 4.6,
  },
  {
    id: 'КЛ-023',
    name: 'ГлавСтрой',
    legalEntities: 1,
    activeObjects: 0,
    activeRequests: 0,
    jobOrders: 2,
    manager: {
      name: 'Анна Смирнова',
    },
    status: 'restricted',
    lastInteraction: new Date('2025-10-15T14:00:00'),
    interactionType: 'Претензия',
    category: 'Подрядчик',
    rating: 2.8,
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

interface ClientsProps {
  onNavigate?: (view: string) => void;
  onOpenClientProfile?: (clientId: string) => void;
}

export function Clients({ onNavigate, onOpenClientProfile }: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterManager, setFilterManager] = useState('all');

  const filteredClients = mockClients.filter((client) => {
    if (filterStatus !== 'all' && client.status !== filterStatus) return false;
    if (filterManager !== 'all' && client.manager.name !== filterManager) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(query) ||
        client.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const uniqueManagers = Array.from(new Set(mockClients.map((c) => c.manager.name)));

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Клиенты</h1>
              <p className="text-sm text-gray-600">
                Управление клиентской базой и корпоративными отношениями
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Импорт
              </Button>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт
              </Button>

              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Создать клиента
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, ИНН, объектам..."
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
                  <SelectItem value="on_hold">На паузе</SelectItem>
                  <SelectItem value="restricted">Ограничен</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterManager} onValueChange={setFilterManager}>
                <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Менеджер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все менеджеры</SelectItem>
                  {uniqueManagers.map((manager) => (
                    <SelectItem key={manager} value={manager}>
                      {manager}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="all-categories">
                <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">Все категории</SelectItem>
                  <SelectItem value="developer">Крупный застройщик</SelectItem>
                  <SelectItem value="medium">Средний застройщик</SelectItem>
                  <SelectItem value="contractor">Подрядчик</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Найдено клиентов: <span className="text-gray-900">{filteredClients.length}</span>
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
                <TableHead className="w-[250px]">Название клиента</TableHead>
                <TableHead className="w-[100px] text-center">Юр. лиц</TableHead>
                <TableHead className="w-[120px] text-center">Объекты</TableHead>
                <TableHead className="w-[120px] text-center">Заявки</TableHead>
                <TableHead className="w-[120px] text-center">Заказ-наряды</TableHead>
                <TableHead className="w-[180px]">Менеджер</TableHead>
                <TableHead className="w-[140px]">Статус</TableHead>
                <TableHead className="w-[200px]">Последнее взаимодействие</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                return (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onOpenClientProfile?.(client.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{client.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 font-mono">{client.id}</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs text-gray-600">{client.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {client.legalEntities}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'bg-blue-50 text-blue-700 border-blue-200',
                          client.activeObjects === 0 && 'bg-gray-50 text-gray-500 border-gray-200'
                        )}
                      >
                        {client.activeObjects}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'bg-green-50 text-green-700 border-green-200',
                          client.activeRequests === 0 &&
                            'bg-gray-50 text-gray-500 border-gray-200'
                        )}
                      >
                        {client.activeRequests}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {client.jobOrders}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-xs">
                            {client.manager.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">{client.manager.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', statusConfig[client.status].color)}
                      >
                        {statusConfig[client.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="text-xs text-gray-600">{client.interactionType}</div>
                        <div className="text-xs text-gray-500">
                          {client.lastInteraction.toLocaleDateString('ru-RU', {
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
                              onClick={(e) => e.stopPropagation()}
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
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Открыть коммуникации
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Копировать данные
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
        <div className="mt-6 grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Всего клиентов</div>
            <div className="text-2xl text-gray-900">{mockClients.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных</div>
            <div className="text-2xl text-green-600">
              {mockClients.filter((c) => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Юр. лиц</div>
            <div className="text-2xl text-blue-600">
              {mockClients.reduce((sum, c) => sum + c.legalEntities, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных объектов</div>
            <div className="text-2xl text-purple-600">
              {mockClients.reduce((sum, c) => sum + c.activeObjects, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Активных заявок</div>
            <div className="text-2xl text-gray-900">
              {mockClients.reduce((sum, c) => sum + c.activeRequests, 0)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}