import { useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MessageSquare,
  Bell,
  Users,
  Filter,
  Plus,
  UserPlus,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Pause,
  HelpCircle,
  ExternalLink,
  X,
  Calendar,
  User,
  FileText,
  Activity,
  Send,
  Paperclip,
  MoreVertical,
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

interface CommunicationRecord {
  id: string;
  channel: 'pbx' | 'telegram' | 'whatsapp' | 'vk' | 'email' | 'website' | 'internal' | 'system';
  type: 'call' | 'message' | 'comment' | 'complaint' | 'payment' | 'request' | 'worker' | 'client';
  sender: {
    name: string;
    contact?: string;
  };
  messagePreview: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  status: 'new' | 'in-progress' | 'pending' | 'resolved' | 'needs-clarification';
  lastAction: string;
  sla?: {
    status: 'ok' | 'warning' | 'overdue';
    time?: string;
  };
  timestamp: Date;
  history: Array<{
    id: string;
    type: 'message' | 'action' | 'assignment' | 'status-change';
    content: string;
    user?: string;
    timestamp: Date;
  }>;
}

const mockCommunications: CommunicationRecord[] = [
  {
    id: 'COM-1847',
    channel: 'telegram',
    type: 'payment',
    sender: { name: 'Петр Иванов', contact: '+7 (916) 234-56-78' },
    messagePreview: 'Когда будет выплата за прошлую неделю? Уже 3 дня прошло.',
    assignee: { name: 'Елена Волкова' },
    status: 'in-progress',
    lastAction: 'Назначено на бухгалтера',
    sla: { status: 'ok', time: '2ч 15м' },
    timestamp: new Date('2025-11-20T14:25:00'),
    history: [
      { id: '1', type: 'message', content: 'Когда будет выплата за прошлую неделю? Уже 3 дня прошло.', user: 'Петр Иванов', timestamp: new Date('2025-11-20T14:25:00') },
      { id: '2', type: 'assignment', content: 'Обращение назначено на Елена Волкова', timestamp: new Date('2025-11-20T14:30:00') },
      { id: '3', type: 'action', content: 'Проверяю статус реестра выплат', user: 'Елена Волкова', timestamp: new Date('2025-11-20T14:35:00') },
    ],
  },
  {
    id: 'COM-1846',
    channel: 'pbx',
    type: 'call',
    sender: { name: 'СтройГрупп ООО', contact: '+7 (495) 123-45-67' },
    messagePreview: 'Входящий звонок (длительность 4:32) — запрос на изменение графика смен',
    assignee: { name: 'Анна Смирнова' },
    status: 'resolved',
    lastAction: 'График согласован и отправлен',
    sla: { status: 'ok' },
    timestamp: new Date('2025-11-20T13:45:00'),
    history: [
      { id: '1', type: 'message', content: 'Входящий звонок от клиента СтройГрупп ООО. Длительность: 4:32', timestamp: new Date('2025-11-20T13:45:00') },
      { id: '2', type: 'action', content: 'Зафиксирован запрос на изменение графика смен на объекте ЖК Северный', user: 'Анна Смирнова', timestamp: new Date('2025-11-20T13:50:00') },
      { id: '3', type: 'status-change', content: 'Статус изменён на "Решено"', timestamp: new Date('2025-11-20T14:10:00') },
    ],
  },
  {
    id: 'COM-1845',
    channel: 'whatsapp',
    type: 'worker',
    sender: { name: 'Сидоров А.М.', contact: '+7 (903) 876-54-32' },
    messagePreview: 'Не могу выйти на смену завтра, заболел. Есть больничный.',
    status: 'new',
    lastAction: 'Получено новое обращение',
    sla: { status: 'warning', time: '45м' },
    timestamp: new Date('2025-11-20T13:20:00'),
    history: [
      { id: '1', type: 'message', content: 'Не могу выйти на смену завтра, заболел. Есть больничный.', user: 'Сидоров А.М.', timestamp: new Date('2025-11-20T13:20:00') },
    ],
  },
  {
    id: 'COM-1844',
    channel: 'website',
    type: 'request',
    sender: { name: 'Михаил Кузнецов', contact: 'kuznetsov@mail.ru' },
    messagePreview: 'Форма с сайта: требуется 15 разнорабочих на объект в Подмосковье на 2 месяца',
    assignee: { name: 'Дмитрий Соколов' },
    status: 'in-progress',
    lastAction: 'Создана заявка ЗАЯ-4522',
    sla: { status: 'ok', time: '1ч 30м' },
    timestamp: new Date('2025-11-20T12:45:00'),
    history: [
      { id: '1', type: 'message', content: 'Заявка с сайта: требуется 15 разнорабочих на объект в Подмосковье на 2 месяца', timestamp: new Date('2025-11-20T12:45:00') },
      { id: '2', type: 'assignment', content: 'Обращение назначено на Дмитрий Соколов', timestamp: new Date('2025-11-20T12:50:00') },
      { id: '3', type: 'action', content: 'Создана заявка ЗАЯ-4522 на основе обращения', user: 'Дмитрий Соколов', timestamp: new Date('2025-11-20T13:10:00') },
    ],
  },
  {
    id: 'COM-1843',
    channel: 'system',
    type: 'complaint',
    sender: { name: 'Система мониторинга', contact: 'Автоматическое' },
    messagePreview: 'Прораб смены #8834 не вышел на связь в течение 30 минут после начала',
    assignee: { name: 'Михаил Петров' },
    status: 'needs-clarification',
    lastAction: 'Запрошена информация у прораба',
    sla: { status: 'overdue', time: '-15м' },
    timestamp: new Date('2025-11-20T08:30:00'),
    history: [
      { id: '1', type: 'message', content: 'Автоматическое уведомление: прораб смены #8834 не вышел на связь в течение 30 минут после начала', timestamp: new Date('2025-11-20T08:30:00') },
      { id: '2', type: 'assignment', content: 'Инцидент назначен на Михаил Петров', timestamp: new Date('2025-11-20T08:35:00') },
      { id: '3', type: 'action', content: 'Связался с прорабом по телефону, ждём уточнения причины', user: 'Михаил Петров', timestamp: new Date('2025-11-20T09:00:00') },
    ],
  },
  {
    id: 'COM-1842',
    channel: 'internal',
    type: 'comment',
    sender: { name: 'Ольга Коновалова', contact: 'Внутренний' },
    messagePreview: 'Нужно срочно обсудить акт выполненных работ с клиентом МегаСтрой',
    assignee: { name: 'Анна Смирнова' },
    status: 'resolved',
    lastAction: 'Документ согласован',
    timestamp: new Date('2025-11-19T16:20:00'),
    history: [
      { id: '1', type: 'message', content: 'Нужно срочно обсудить акт выполненных работ с клиентом МегаСтрой', user: 'Ольга Коновалова', timestamp: new Date('2025-11-19T16:20:00') },
      { id: '2', type: 'action', content: 'Связалась с клиентом, документ согласован', user: 'Анн Смирнова', timestamp: new Date('2025-11-19T17:15:00') },
      { id: '3', type: 'status-change', content: 'Статус изменён на "Решено"', timestamp: new Date('2025-11-19T17:15:00') },
    ],
  },
  {
    id: 'COM-1841',
    channel: 'vk',
    type: 'message',
    sender: { name: 'Анастасия Петрова', contact: 'vk.com/id123456' },
    messagePreview: 'Добрый день! Подскажите, как устроиться к вам на работу?',
    status: 'pending',
    lastAction: 'Отправлена ссылка на анкету',
    sla: { status: 'ok' },
    timestamp: new Date('2025-11-19T14:30:00'),
    history: [
      { id: '1', type: 'message', content: 'Добрый день! Подскажите, как устроиться к вам на работу?', user: 'Анастасия Петрова', timestamp: new Date('2025-11-19T14:30:00') },
      { id: '2', type: 'action', content: 'Отправлена ссылка на форму анкеты соискателя', user: 'Система', timestamp: new Date('2025-11-19T14:35:00') },
    ],
  },
  {
    id: 'COM-1840',
    channel: 'email',
    type: 'client',
    sender: { name: 'РемСтройСервис', contact: 'info@remstroy.ru' },
    messagePreview: 'Отправили КП на услуги по предоставлению персонала. Ждём обратной связи.',
    assignee: { name: 'Дмитрий Соколов' },
    status: 'pending',
    lastAction: 'КП отправлено клиенту',
    sla: { status: 'ok', time: '24ч' },
    timestamp: new Date('2025-11-19T11:00:00'),
    history: [
      { id: '1', type: 'message', content: 'Запрос на коммерческое предложение для предоставления персонала на объект', user: 'РемСтройСервис', timestamp: new Date('2025-11-19T10:15:00') },
      { id: '2', type: 'assignment', content: 'Обращение назначено на Дмитрий Соколов', timestamp: new Date('2025-11-19T10:20:00') },
      { id: '3', type: 'action', content: 'КП подготовлено и отправлено на почту клиента', user: 'Дмитрий Соколов', timestamp: new Date('2025-11-19T11:00:00') },
    ],
  },
];

const channelIcons = {
  pbx: Phone,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  vk: MessageSquare,
  email: Mail,
  website: Globe,
  internal: MessageSquare,
  system: Bell,
};

const channelColors = {
  pbx: 'bg-blue-100 text-blue-600',
  telegram: 'bg-cyan-100 text-cyan-600',
  whatsapp: 'bg-green-100 text-green-600',
  vk: 'bg-indigo-100 text-indigo-600',
  email: 'bg-purple-100 text-purple-600',
  website: 'bg-orange-100 text-orange-600',
  internal: 'bg-gray-100 text-gray-600',
  system: 'bg-yellow-100 text-yellow-600',
};

const channelLabels = {
  pbx: 'PBX',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  vk: 'VK',
  email: 'Email',
  website: 'Сайт',
  internal: 'Внутр.',
  system: 'Система',
};

const typeLabels = {
  call: 'Звонок',
  message: 'Сообщение',
  comment: 'Комментарий',
  complaint: 'Жалоба',
  payment: 'Оплата',
  request: 'Заявка',
  worker: 'Исполнитель',
  client: 'Клиент',
};

const statusConfig = {
  'new': { label: 'Новое', icon: CircleDot, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'in-progress': { label: 'В работе', icon: Activity, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'pending': { label: 'Отложено', icon: Pause, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  'resolved': { label: 'Решено', icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
  'needs-clarification': { label: 'Уточнение', icon: HelpCircle, color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

const slaColors = {
  ok: 'text-green-600',
  warning: 'text-orange-600',
  overdue: 'text-red-600',
};

interface CommunicationsProps {
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
}

export function Communications({ onNavigate }: CommunicationsProps) {
  const [selectedRecord, setSelectedRecord] = useState<CommunicationRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Коммуникации</h1>
              <p className="text-sm text-gray-600">Все обращения и взаимодействия с клиентами и исполнителями</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select defaultValue="today">
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="yesterday">Вчера</SelectItem>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все каналы</SelectItem>
                  <SelectItem value="pbx">Звонки (PBX)</SelectItem>
                  <SelectItem value="messengers">Мессенджеры</SelectItem>
                  <SelectItem value="social">Соц. сети</SelectItem>
                  <SelectItem value="website">Сайт</SelectItem>
                  <SelectItem value="internal">Внутренние</SelectItem>
                </SelectContent>
              </Select>

              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Новое обращение
              </Button>

              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Назначить исполнителя
              </Button>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Глобальный поиск по тексту сообщений, контактам, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant={quickFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickFilter('all')}
              >
                Все
              </Button>
              <Button 
                variant={quickFilter === 'mine' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickFilter('mine')}
              >
                Мои обращения
              </Button>
              <Button 
                variant={quickFilter === 'unassigned' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickFilter('unassigned')}
              >
                Неназначенные
              </Button>
              <Button 
                variant={quickFilter === 'needs-response' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickFilter('needs-response')}
              >
                Требуют ответа
              </Button>
              <Button 
                variant={quickFilter === 'overdue' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setQuickFilter('overdue')}
              >
                Просрочено
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm transition-all", selectedRecord && "mr-[600px]")}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Источник</TableHead>
                <TableHead className="w-[120px]">Тип</TableHead>
                <TableHead className="w-[200px]">Отправитель</TableHead>
                <TableHead className="min-w-[300px]">Содержание</TableHead>
                <TableHead className="w-[160px]">Ответственный</TableHead>
                <TableHead className="w-[140px]">Статус</TableHead>
                <TableHead className="w-[200px]">Последнее действие</TableHead>
                <TableHead className="w-[100px]">SLA</TableHead>
                <TableHead className="w-[120px]">Время</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommunications.map((record) => {
                const ChannelIcon = channelIcons[record.channel];
                const StatusIcon = statusConfig[record.status].icon;
                
                return (
                  <TableRow
                    key={record.id}
                    className={cn(
                      "cursor-pointer",
                      selectedRecord?.id === record.id && "bg-blue-50"
                    )}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded flex items-center justify-center", channelColors[record.channel])}>
                          <ChannelIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-gray-600">{channelLabels[record.channel]}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm text-gray-700">{typeLabels[record.type]}</span>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">{record.sender.name}</div>
                        {record.sender.contact && (
                          <div className="text-xs text-gray-500">{record.sender.contact}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-sm text-gray-700 line-clamp-2">{record.messagePreview}</p>
                    </TableCell>
                    
                    <TableCell>
                      {record.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {record.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">{record.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Не назначено</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border", statusConfig[record.status].color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[record.status].label}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-xs text-gray-600">{record.lastAction}</span>
                    </TableCell>
                    
                    <TableCell>
                      {record.sla ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className={cn("w-4 h-4", slaColors[record.sla.status])} />
                          <span className={cn("text-xs", slaColors[record.sla.status])}>
                            {record.sla.time || '—'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {record.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
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

      {/* Right Side Panel - Details */}
      {selectedRecord && (
        <div className="fixed right-0 top-16 bottom-0 w-[600px] bg-white border-l border-gray-200 shadow-xl flex flex-col z-20">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900">{selectedRecord.id}</h3>
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border", statusConfig[selectedRecord.status].color)}>
                    {statusConfig[selectedRecord.status].label}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedRecord.sender.name}</span>
                  <span>•</span>
                  <span>{typeLabels[selectedRecord.type]}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-500 mb-1">Канал</div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded flex items-center justify-center", channelColors[selectedRecord.channel])}>
                    {(() => {
                      const Icon = channelIcons[selectedRecord.channel];
                      return <Icon className="w-3.5 h-3.5" />;
                    })()}
                  </div>
                  <span className="text-sm text-gray-900">{channelLabels[selectedRecord.channel]}</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Контакт</div>
                <div className="text-sm text-gray-900">{selectedRecord.sender.contact || '—'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Ответственный</div>
                <div className="text-sm text-gray-900">{selectedRecord.assignee?.name || 'Не назначено'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Создано</div>
                <div className="text-sm text-gray-900">
                  {selectedRecord.timestamp.toLocaleString('ru-RU', { 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="flex-1 overflow-y-auto p-6">
            <h4 className="text-sm text-gray-700 mb-4">История обращения</h4>
            
            <div className="space-y-4">
              {selectedRecord.history.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      item.type === 'message' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'action' ? 'bg-green-100 text-green-600' :
                      item.type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {item.type === 'message' && <MessageCircle className="w-4 h-4" />}
                      {item.type === 'action' && <CheckCircle2 className="w-4 h-4" />}
                      {item.type === 'assignment' && <User className="w-4 h-4" />}
                      {item.type === 'status-change' && <Activity className="w-4 h-4" />}
                    </div>
                    {item.id !== selectedRecord.history[selectedRecord.history.length - 1].id && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      {item.user && (
                        <span className="text-sm text-gray-900">{item.user}</span>
                      )}
                      <span className="text-xs text-gray-500">
                        {item.timestamp.toLocaleString('ru-RU', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">Добавить действие / комментарий</label>
              <Textarea
                placeholder="Опишите выполненное действие или добавьте комментарий..."
                className="mb-3"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Paperclip className="w-4 h-4" />
                  Прикрепить файл
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Select defaultValue="in-progress">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Изменить статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новое</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="pending">Отложено</SelectItem>
                  <SelectItem value="resolved">Решено</SelectItem>
                  <SelectItem value="needs-clarification">Требует уточнения</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline">Отменить</Button>
                <Button className="gap-2">
                  <Send className="w-4 h-4" />
                  Сохранить действие
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}