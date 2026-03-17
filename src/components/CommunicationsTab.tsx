import { useState } from 'react';
import { Phone, MessageSquare, Settings, PhoneIncoming, PhoneOutgoing, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface Communication {
  id: string;
  type: 'call_outgoing' | 'call_incoming' | 'message' | 'system';
  channel: 'telegram' | 'phone' | 'system';
  title: string;
  date: string;
  time: string;
  initiator: 'office' | 'curator' | 'system' | 'worker';
  fullText?: string;
  duration?: string;
  status?: 'delivered' | 'read' | 'no_answer' | 'busy';
  relatedTo?: {
    type: 'shift' | 'request' | 'registry';
    id: string;
    name: string;
  };
  isSystem: boolean;
}

export function CommunicationsTab() {
  const [expandedCommId, setExpandedCommId] = useState<string | null>(null);

  // Mock data
  const communications: Communication[] = [
    {
      id: '1',
      type: 'message',
      channel: 'telegram',
      title: 'Подтвердил выход на смену',
      date: '13.12.2024',
      time: '18:05',
      initiator: 'worker',
      fullText: 'Завтра выйду на смену в 8:00. Всё понял, буду вовремя.',
      status: 'read',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1234',
        name: 'ЖК "Оазис" — 14.12.2024'
      },
      isSystem: false
    },
    {
      id: '2',
      type: 'call_outgoing',
      channel: 'phone',
      title: 'Исходящий звонок — не дозвонились',
      date: '12.12.2024',
      time: '10:43',
      initiator: 'office',
      fullText: 'Попытка уточнить готовность к выходу на объект завтра. Исполнитель не ответил.',
      duration: null,
      status: 'no_answer',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1233',
        name: 'БЦ "Столица" — 13.12.2024'
      },
      isSystem: false
    },
    {
      id: '3',
      type: 'system',
      channel: 'system',
      title: 'Отправлено напоминание о выходе',
      date: '12.12.2024',
      time: '06:30',
      initiator: 'system',
      fullText: 'Автоматическое напоминание: "Сегодня у вас смена на объекте ЖК \'Оазис\' в 09:00. Не забудьте взять СИЗ."',
      status: 'delivered',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1232',
        name: 'ЖК "Оазис" — 12.12.2024'
      },
      isSystem: true
    },
    {
      id: '4',
      type: 'message',
      channel: 'telegram',
      title: 'Запросил изменение времени смены',
      date: '11.12.2024',
      time: '20:15',
      initiator: 'worker',
      fullText: 'Здравствуйте, можно ли перенести начало смены на 10:00? Есть личные обстоятельства.',
      status: 'read',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1231',
        name: 'ТЦ "Горизонт" — 12.12.2024'
      },
      isSystem: false
    },
    {
      id: '5',
      type: 'call_incoming',
      channel: 'phone',
      title: 'Входящий звонок — уточнение деталей',
      date: '11.12.2024',
      time: '15:30',
      initiator: 'worker',
      fullText: 'Исполнитель уточнял адрес объекта и требования к одежде. Даны разъяснения.',
      duration: '2 мин 45 сек',
      status: 'delivered',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1230',
        name: 'БЦ "Столица" — 12.12.2024'
      },
      isSystem: false
    },
    {
      id: '6',
      type: 'system',
      channel: 'system',
      title: 'Изменён статус НПД на "активен"',
      date: '10.12.2024',
      time: '14:20',
      initiator: 'system',
      fullText: 'Система автоматически обновила статус НПД после получения подтверждения из ФНС.',
      status: 'delivered',
      relatedTo: undefined,
      isSystem: true
    },
    {
      id: '7',
      type: 'message',
      channel: 'telegram',
      title: 'Сообщил о болезни',
      date: '09.12.2024',
      time: '07:15',
      initiator: 'worker',
      fullText: 'Не смогу выйти сегодня, простудился. Справку предоставлю.',
      status: 'read',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1229',
        name: 'ЖК "Оазис" — 09.12.2024'
      },
      isSystem: false
    },
    {
      id: '8',
      type: 'call_outgoing',
      channel: 'phone',
      title: 'Исходящий звонок — подтверждение смены',
      date: '08.12.2024',
      time: '16:45',
      initiator: 'curator',
      fullText: 'Куратор подтвердил участие исполнителя в смене завтра. Исполнитель согласен.',
      duration: '1 мин 20 сек',
      status: 'delivered',
      relatedTo: {
        type: 'shift',
        id: 'SH-2024-1228',
        name: 'ТЦ "Горизонт" — 09.12.2024'
      },
      isSystem: false
    },
    {
      id: '9',
      type: 'system',
      channel: 'system',
      title: 'Создана заявка на обновление допуска',
      date: '07.12.2024',
      time: '11:00',
      initiator: 'system',
      fullText: 'Автоматически создана задача: "Обновить допуск на работу на высоте". Срок: до 28.12.2024.',
      status: 'delivered',
      relatedTo: {
        type: 'request',
        id: 'REQ-2024-567',
        name: 'Обновление допуска'
      },
      isSystem: true
    },
    {
      id: '10',
      type: 'message',
      channel: 'telegram',
      title: 'Запрос на выплату',
      date: '05.12.2024',
      time: '19:30',
      initiator: 'worker',
      fullText: 'Здравствуйте, когда ожидается выплата за прошлую неделю?',
      status: 'read',
      relatedTo: {
        type: 'registry',
        id: 'REG-2024-048',
        name: 'Реестр #2024-048'
      },
      isSystem: false
    }
  ];

  const getTypeIcon = (type: Communication['type']) => {
    const icons = {
      call_outgoing: PhoneOutgoing,
      call_incoming: PhoneIncoming,
      message: MessageSquare,
      system: Settings
    };
    return icons[type];
  };

  const getInitiatorLabel = (initiator: Communication['initiator']) => {
    const labels = {
      office: 'Офис',
      curator: 'Куратор',
      system: 'Система',
      worker: 'Исполнитель'
    };
    return labels[initiator];
  };

  const getStatusLabel = (status?: Communication['status']) => {
    if (!status) return null;
    const labels = {
      delivered: 'Доставлено',
      read: 'Прочитано',
      no_answer: 'Не отвечено',
      busy: 'Занято'
    };
    return labels[status];
  };

  const getChannelLabel = (channel: Communication['channel']) => {
    const labels = {
      telegram: 'Telegram',
      phone: 'Телефон',
      system: 'Система'
    };
    return labels[channel];
  };

  // Статистика
  const totalContacts = communications.length;
  const totalMessages = communications.filter(c => c.type === 'message').length;
  const totalCalls = communications.filter(c => c.type === 'call_outgoing' || c.type === 'call_incoming').length;
  const lastContact = communications[0];

  return (
    <div>
      {/* 1. Верхняя сводка */}
      <div className="flex items-center gap-8 mb-4 pb-4 border-b border-gray-200 text-sm">
        <div className="flex items-baseline gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Контактов всего:</span>
          <span className="text-gray-900 font-medium">{totalContacts}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Сообщений:</span>
          <span className="text-gray-900 font-medium">{totalMessages}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Звонков:</span>
          <span className="text-gray-900 font-medium">{totalCalls}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600">Последний контакт:</span>
          <span className="text-gray-900 font-medium">{lastContact.date}</span>
        </div>
      </div>

      {/* 2. Фильтры */}
      <div className="mb-4 flex items-center gap-3">
        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>Все типы</option>
          <option>Звонок</option>
          <option>Сообщение</option>
          <option>Системное</option>
        </select>
        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>Все каналы</option>
          <option>Telegram</option>
          <option>Телефон</option>
          <option>Система</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            placeholder="От"
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            placeholder="До"
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 3. Лента коммуникаций */}
      <div className="space-y-1.5">
        {communications.map((comm) => {
          const TypeIcon = getTypeIcon(comm.type);
          const isExpanded = expandedCommId === comm.id;
          
          return (
            <div 
              key={comm.id} 
              className={cn(
                'border border-gray-200 rounded-lg overflow-hidden',
                comm.isSystem && !isExpanded && 'bg-gray-50'
              )}
            >
              {/* Строка коммуникации */}
              <div
                onClick={() => setExpandedCommId(isExpanded ? null : comm.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                  isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50',
                  comm.isSystem && !isExpanded && 'bg-gray-50'
                )}
              >
                <TypeIcon className={cn(
                  'w-4 h-4 flex-shrink-0',
                  comm.type === 'call_outgoing' && 'text-blue-600',
                  comm.type === 'call_incoming' && 'text-green-600',
                  comm.type === 'message' && 'text-purple-600',
                  comm.type === 'system' && 'text-gray-500'
                )} />
                
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900">{comm.title}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                  <span>{getInitiatorLabel(comm.initiator)}</span>
                  <span>•</span>
                  <span>{comm.date} {comm.time}</span>
                </div>
              </div>

              {/* 4. Раскрытие записи */}
              {isExpanded && (
                <div className={cn(
                  'px-4 py-3 border-t border-gray-200',
                  comm.isSystem ? 'bg-gray-50/80' : 'bg-gray-50'
                )}>
                  {/* Полный текст */}
                  {comm.fullText && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {comm.fullText}
                    </p>
                  )}

                  {/* Детали */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 w-28">Канал:</span>
                      <span className="text-gray-900">{getChannelLabel(comm.channel)}</span>
                    </div>

                    {comm.duration && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-500 w-28">Длительность:</span>
                        <span className="text-gray-900">{comm.duration}</span>
                      </div>
                    )}

                    {comm.status && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-500 w-28">Статус:</span>
                        <span className={cn(
                          'text-gray-900',
                          comm.status === 'read' && 'text-green-700',
                          comm.status === 'no_answer' && 'text-red-700'
                        )}>
                          {getStatusLabel(comm.status)}
                        </span>
                      </div>
                    )}

                    {/* Связь с сущностью */}
                    {comm.relatedTo && (
                      <div className="flex items-baseline gap-2 pt-2 border-t border-gray-200">
                        <span className="text-gray-500 w-28">Связано с:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {comm.relatedTo.type === 'shift' && 'Смена'}
                            {comm.relatedTo.type === 'request' && 'Заявка'}
                            {comm.relatedTo.type === 'registry' && 'Реестр'}
                          </span>
                          <span className="text-gray-900">{comm.relatedTo.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Информационное сообщение */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Отправка сообщений осуществляется из объектов, смен или Telegram-бота
        </p>
      </div>
    </div>
  );
}