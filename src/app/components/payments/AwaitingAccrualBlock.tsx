import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  X,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type SelfEmployedStatus = 'active' | 'pending-confirmation' | 'connecting' | 'refused' | 'disabled';

interface AwaitingWorker {
  id: string;
  name: string;
  workerId: string;
  selfEmployedStatus: SelfEmployedStatus;
  shifts: Array<{
    timeRange: string;
    project: string;
    object: string;
  }>;
  shiftsCount: number;
  requisites?: {
    type: 'card' | 'sbp' | 'trusted-person';
    bank?: string;
    cardNumber?: string;
    phone?: string;
    personName?: string;
  };
  paymentMethod?: {
    type: 'self-employed' | 'trusted-smz' | 'personal-requisites';
    smzName?: string;
  };
  deductions: number;
}

const mockAwaitingWorkers: AwaitingWorker[] = [
  {
    id: 'a1',
    name: 'Григорьев Павел Сергеевич',
    workerId: 'W-10456',
    selfEmployedStatus: 'active',
    shifts: [
      { timeRange: '21:45–08:00', project: 'ЖК Академик', object: 'Объект А' }
    ],
    shiftsCount: 1,
    requisites: {
      type: 'card',
      bank: 'Сбербанк',
      cardNumber: '••••4930'
    },
    paymentMethod: {
      type: 'trusted-smz',
      smzName: 'Козлов А.В.'
    },
    deductions: 0
  },
  {
    id: 'a2',
    name: 'Федоров Дмитрий Олегович',
    workerId: 'W-10457',
    selfEmployedStatus: 'pending-confirmation',
    shifts: [
      { timeRange: '08:00–18:00', project: 'ЖК Звёздный', object: 'Объект Б' }
    ],
    shiftsCount: 1,
    requisites: {
      type: 'trusted-person',
      personName: 'Иванова Н.Н.',
      phone: '+7999•••••45'
    },
    deductions: 0
  },
  {
    id: 'a3',
    name: 'Лебедев Александр Викторович',
    workerId: 'W-10458',
    selfEmployedStatus: 'active',
    shifts: [
      { timeRange: '08:00–20:00', project: 'ЖК Трио', object: 'Объект В' },
      { timeRange: '20:00–04:00', project: 'ЖК Наследие', object: 'Объект Г' }
    ],
    shiftsCount: 2,
    paymentMethod: {
      type: 'self-employed'
    },
    deductions: 0
  },
  {
    id: 'a4',
    name: 'Морозова Екатерина Петровна',
    workerId: 'W-10459',
    selfEmployedStatus: 'connecting',
    shifts: [
      { timeRange: '08:00–17:00', project: 'ЖК Мечта', object: 'Объект Д' }
    ],
    shiftsCount: 1,
    deductions: 0
  },
  {
    id: 'a5',
    name: 'Соколов Игорь Владимирович',
    workerId: 'W-10460',
    selfEmployedStatus: 'active',
    shifts: [
      { timeRange: '07:00–19:00', project: 'ЖК Горизонт', object: 'Объект Е' }
    ],
    shiftsCount: 1,
    requisites: {
      type: 'card',
      bank: 'Т-Банк',
      cardNumber: '••••7821'
    },
    paymentMethod: {
      type: 'personal-requisites'
    },
    deductions: 500
  }
];

function SelfEmployedStatusIcon({ status }: { status: SelfEmployedStatus }) {
  const config = {
    'active': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', tooltip: 'Активен' },
    'pending-confirmation': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', tooltip: 'Требует подтверждения' },
    'connecting': { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', tooltip: 'В процессе подключения' },
    'refused': { icon: X, color: 'text-red-600', bg: 'bg-red-100', tooltip: 'Отказался' },
    'disabled': { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', tooltip: 'Отключён' },
  }[status];
  
  const Icon = config.icon;
  
  return (
    <div className="relative group">
      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", config.bg)}>
        <Icon className={cn("w-3.5 h-3.5", config.color)} />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 whitespace-nowrap">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 shadow-lg">
          {config.tooltip}
        </div>
      </div>
    </div>
  );
}

export function AwaitingAccrualBlock({ 
  onDistribute 
}: { 
  onDistribute: (workerId: string) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedWorkers, setExpandedWorkers] = useState<Set<string>>(new Set());

  const filteredWorkers = mockAwaitingWorkers.filter(worker => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ready') return worker.paymentMethod && worker.requisites;
    if (selectedFilter === 'needs-requisites') return !worker.requisites;
    if (selectedFilter === 'needs-distribution') return !worker.paymentMethod;
    return true;
  });

  const toggleExpand = (workerId: string) => {
    const newExpanded = new Set(expandedWorkers);
    if (newExpanded.has(workerId)) {
      newExpanded.delete(workerId);
    } else {
      newExpanded.add(workerId);
    }
    setExpandedWorkers(newExpanded);
  };

  const formatShiftsInfo = (worker: AwaitingWorker) => {
    if (worker.shiftsCount === 1) {
      const shift = worker.shifts[0];
      return `${shift.timeRange}, ${shift.project} — 1 смена сегодня`;
    } else {
      const projects = [...new Set(worker.shifts.map(s => s.project))].join(' / ');
      return `${worker.shiftsCount} смены сегодня, ${projects}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: '#E0F2FE' }}>
        <h3 className="text-sm text-gray-900 font-medium">Ожидают начисления (вечерний реестр)</h3>
        <p className="text-xs text-gray-600 mt-1">
          Эти исполнители сегодня вышли на смены, но бухгалтер ещё не закрыл часы. 
          Вы можете заранее выбрать распределителя или обновить реквизиты.
        </p>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selectedFilter === 'all'
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            Все
          </button>
          <button
            onClick={() => setSelectedFilter('ready')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selectedFilter === 'ready'
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            Только готовые
          </button>
          <button
            onClick={() => setSelectedFilter('needs-requisites')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selectedFilter === 'needs-requisites'
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            Требуют реквизитов
          </button>
          <button
            onClick={() => setSelectedFilter('needs-distribution')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              selectedFilter === 'needs-distribution'
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            Требуют распределения
          </button>
        </div>
      </div>

      {/* Workers List */}
      <div>
        {filteredWorkers.map((worker, index) => {
          const isExpanded = expandedWorkers.has(worker.id);
          
          return (
            <div key={worker.id} className="border-b border-gray-100 last:border-b-0">
              {/* Main Row */}
              <div 
                className="grid grid-cols-[40px_40px_1fr_auto_120px_120px_120px_50px] gap-3 items-center px-4 py-3.5 hover:bg-blue-50/30 transition-colors"
                style={{ backgroundColor: '#EBF5FF' }}
              >
                {/* Index */}
                <div className="text-sm text-gray-500 font-medium">
                  {index + 1}.
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <SelfEmployedStatusIcon status={worker.selfEmployedStatus} />
                </div>

                {/* Worker Info */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 font-medium">{worker.name}</p>
                      <p className="text-xs text-gray-500">{worker.workerId}</p>
                    </div>
                  </div>
                  <div className="pl-12">
                    <p className="text-xs text-gray-600 mb-1">{formatShiftsInfo(worker)}</p>
                    {worker.requisites && (
                      <p className="text-xs text-gray-500">
                        {worker.requisites.type === 'card' && `${worker.requisites.bank} ${worker.requisites.cardNumber}`}
                        {worker.requisites.type === 'sbp' && `СБП ${worker.requisites.phone}`}
                        {worker.requisites.type === 'trusted-person' && 
                          `Реквизиты доверенного лица: СБП ${worker.requisites.phone}, ${worker.requisites.personName}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-end">
                  {!worker.paymentMethod ? (
                    <button
                      onClick={() => onDistribute(worker.id)}
                      className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{ backgroundColor: '#FFF7E6', border: '2px solid #FFE4B5', color: '#B45309' }}
                    >
                      Распределить
                    </button>
                  ) : worker.paymentMethod.type === 'self-employed' ? (
                    <div className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#DBEAFE', border: '2px solid #BFDBFE', color: '#1E40AF' }}>
                      Самозанятый
                    </div>
                  ) : worker.paymentMethod.type === 'trusted-smz' ? (
                    <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#ECFDF5', border: '2px solid #D1FAE5' }}>
                      <p className="font-medium text-green-900">Доверенный СМЗ</p>
                      <p className="text-green-700">{worker.paymentMethod.smzName}</p>
                    </div>
                  ) : (
                    <div className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F3F4F6', border: '2px solid #E5E7EB', color: '#374151' }}>
                      Личные реквизиты
                    </div>
                  )}
                </div>

                {/* Deductions */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Удержания</p>
                  <p className="text-sm text-gray-400">{worker.deductions > 0 ? `−${worker.deductions} ₽` : '0 ₽'}</p>
                </div>

                {/* Accrued */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Начислено</p>
                  <p className="text-sm text-gray-400">0 ₽</p>
                </div>

                {/* To Pay */}
                <div className="text-right">
                  <p className="text-xs text-blue-700 mb-0.5">К выплате</p>
                  <p className="text-sm text-blue-700 font-medium">0 ₽</p>
                  <p className="text-xs text-blue-600 mt-0.5">Ожидает закрытия</p>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-1">
                  <button className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => toggleExpand(worker.id)}
                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Section */}
              {isExpanded && (
                <div className="bg-blue-50/30 border-t border-blue-100 px-4 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Shifts Details */}
                    <div>
                      <div className="flex items-start gap-2 mb-3">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-700 font-medium mb-2">Смены сегодня:</p>
                          <div className="space-y-1.5">
                            {worker.shifts.map((shift, idx) => (
                              <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                                <div className="flex justify-between mb-1">
                                  <p className="text-xs text-gray-900 font-medium">{shift.timeRange}</p>
                                  <span className="text-xs text-blue-600 font-medium">Не закрыта</span>
                                </div>
                                <p className="text-xs text-gray-600">{shift.project}</p>
                                <p className="text-xs text-gray-500">{shift.object}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="text-xs h-7 text-blue-600 hover:bg-blue-50">
                          Изменить реквизиты
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 text-blue-600 hover:bg-blue-50">
                          Добавить удержание/бонус
                        </Button>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <p className="text-xs text-gray-700 font-medium mb-3">Способ выплаты:</p>
                      {!worker.paymentMethod ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <p className="text-xs text-yellow-800 mb-2">Способ выплаты не выбран</p>
                          <button
                            onClick={() => onDistribute(worker.id)}
                            className="w-full px-4 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{ backgroundColor: '#FFF7E6', border: '2px solid #FFE4B5', color: '#B45309' }}
                          >
                            Распределить
                          </button>
                        </div>
                      ) : worker.paymentMethod.type === 'self-employed' ? (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#DBEAFE', border: '2px solid #BFDBFE' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-blue-900 font-medium">Самозанятый</p>
                              <p className="text-xs text-blue-700">Прямая выплата через ЗП-проект</p>
                            </div>
                          </div>
                        </div>
                      ) : worker.paymentMethod.type === 'trusted-smz' ? (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#ECFDF5', border: '2px solid #D1FAE5' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-green-900 font-medium">Доверенный СМЗ</p>
                              <p className="text-xs text-green-700">{worker.paymentMethod.smzName}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 font-medium">Личные реквизиты</p>
                              <p className="text-xs text-gray-600">Через доверенное лицо</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {worker.requisites && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Реквизиты:</p>
                          <p className="text-xs text-gray-900">
                            {worker.requisites.type === 'card' && `${worker.requisites.bank} ${worker.requisites.cardNumber}`}
                            {worker.requisites.type === 'sbp' && `СБП ${worker.requisites.phone}`}
                            {worker.requisites.type === 'trusted-person' && 
                              `${worker.requisites.personName}, СБП ${worker.requisites.phone}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
