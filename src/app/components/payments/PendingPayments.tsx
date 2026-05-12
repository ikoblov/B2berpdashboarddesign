import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  X,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
  Info,
  RefreshCw,
  MoreVertical,
  CreditCard,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { AwaitingAccrualBlock } from "./AwaitingAccrualBlock";

type SelfEmployedStatus = 'active' | 'pending-confirmation' | 'connecting' | 'refused' | 'disabled';
type RowStatus = 'ready' | 'needs-distribution' | 'error' | 'awaiting-accrual';

interface Deduction {
  id: string;
  type: 'bonus' | 'deduction';
  amount: number;
  comment: string;
}

interface Shift {
  date: string;
  project: string;
  client: string;
  object: string;
  amount: number;
}

interface Worker {
  id: string;
  name: string;
  workerId: string;
  shiftPeriod: string;
  shiftCount: number;
  accrued: number;
  deductions: Deduction[];
  toPay: number;
  selfEmployedStatus: SelfEmployedStatus;
  paymentMethod?: 'self-employed' | 'trusted-smz' | 'personal-trusted-smz';
  trustedSmzName?: string;
  trustedPersonCard?: {
    bank: string;
    cardNumber: string;
  };
  rowStatus: RowStatus;
  problems?: string[];
  shifts: Shift[];
}

const calculateDeductionsTotal = (deductions: Deduction[]): number => {
  return deductions.reduce((sum, d) => {
    return sum + (d.type === 'bonus' ? d.amount : -d.amount);
  }, 0);
};

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Иванов Олег Петрович',
    workerId: 'W-10234',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 14000,
    deductions: [
      { id: 'd1', type: 'deduction', amount: 500, comment: 'Спецовка' },
    ],
    toPay: 14000 - 500,
    selfEmployedStatus: 'active',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов Андрей Викторович',
    rowStatus: 'ready',
    shifts: [
      { date: '21.11.2025', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', amount: 3500 },
      { date: '22.11.2025', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', amount: 3500 },
      { date: '23.11.2025', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', amount: 3500 },
      { date: '24.11.2025', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', amount: 3500 },
    ],
  },
  {
    id: '2',
    name: 'Петрова Мария Александровна',
    workerId: 'W-10189',
    shiftPeriod: '22–24 ноя',
    shiftCount: 3,
    accrued: 10500,
    deductions: [],
    toPay: 10500,
    selfEmployedStatus: 'active',
    rowStatus: 'needs-distribution',
    shifts: [
      { date: '22.11.2025', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', amount: 3500 },
      { date: '23.11.2025', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', amount: 3500 },
      { date: '24.11.2025', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', amount: 3500 },
    ],
  },
  {
    id: '3',
    name: 'Сидоров Петр Николаевич',
    workerId: 'W-10156',
    shiftPeriod: '22–23 ноя',
    shiftCount: 2,
    accrued: 7200,
    deductions: [
      { id: 'd2', type: 'bonus', amount: 1000, comment: 'За качество' },
    ],
    toPay: 7200 + 1000,
    selfEmployedStatus: 'active',
    paymentMethod: 'self-employed',
    rowStatus: 'ready',
    shifts: [
      { date: '22.11.2025', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', amount: 3600 },
      { date: '23.11.2025', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', amount: 3600 },
    ],
  },
  {
    id: '4',
    name: 'Кузнецова Анна Сергеевна',
    workerId: 'W-10099',
    shiftPeriod: '24 ноя',
    shiftCount: 1,
    accrued: 3600,
    deductions: [],
    toPay: 3600,
    selfEmployedStatus: 'disabled',
    rowStatus: 'error',
    problems: ['СМЗ отключён', 'Нет реквизитов'],
    shifts: [
      { date: '24.11.2025', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', amount: 3600 },
    ],
  },
  {
    id: '5',
    name: 'Волков Дмитрий Игоревич',
    workerId: 'W-09875',
    shiftPeriod: '18–22 ноя',
    shiftCount: 5,
    accrued: 18500,
    deductions: [
      { id: 'd3', type: 'deduction', amount: 300, comment: 'Инструмент' },
      { id: 'd4', type: 'deduction', amount: 200, comment: 'Спецовка' },
    ],
    toPay: 18500 - 300 - 200,
    selfEmployedStatus: 'pending-confirmation',
    paymentMethod: 'personal-trusted-smz',
    trustedSmzName: 'Волков Алексей Иванович',
    trustedPersonCard: {
      bank: 'Сбербанк',
      cardNumber: '••••1234',
    },
    rowStatus: 'ready',
    shifts: [
      { date: '18.11.2025', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', amount: 3700 },
      { date: '19.11.2025', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', amount: 3700 },
      { date: '20.11.2025', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', amount: 3700 },
      { date: '21.11.2025', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', amount: 3700 },
      { date: '22.11.2025', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', amount: 3700 },
    ],
  },
  {
    id: '6',
    name: 'Морозов Сергей Владимирович',
    workerId: 'W-09654',
    shiftPeriod: '20–23 ноя',
    shiftCount: 4,
    accrued: 15200,
    deductions: [],
    toPay: 15200,
    selfEmployedStatus: 'active',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Петров Михаил Сергеевич',
    rowStatus: 'ready',
    shifts: [
      { date: '20.11.2025', project: 'ЖК Горизонт', client: 'ПромСтрой', object: 'Объект Е', amount: 3800 },
      { date: '21.11.2025', project: 'ЖК Горизонт', client: 'ПромСтрой', object: 'Объект Е', amount: 3800 },
      { date: '22.11.2025', project: 'ЖК Горизонт', client: 'ПромСтрой', object: 'Объект Е', amount: 3800 },
      { date: '23.11.2025', project: 'ЖК Горизонт', client: 'ПромСтрой', object: 'Объект Е', amount: 3800 },
    ],
  },
  {
    id: '7',
    name: 'Соколова Елена Петровна',
    workerId: 'W-09543',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 15600,
    deductions: [],
    toPay: 15600,
    selfEmployedStatus: 'connecting',
    rowStatus: 'needs-distribution',
    shifts: [
      { date: '21.11.2025', project: 'ЖК Парус', client: 'ГлавСтрой', object: 'Объект Ж', amount: 3900 },
      { date: '22.11.2025', project: 'ЖК Парус', client: 'ГлавСтрой', object: 'Объект Ж', amount: 3900 },
      { date: '23.11.2025', project: 'ЖК Парус', client: 'ГлавСтрой', object: 'Объект Ж', amount: 3900 },
      { date: '24.11.2025', project: 'ЖК Парус', client: 'ГлавСтрой', object: 'Объект Ж', amount: 3900 },
    ],
  },
  {
    id: '8',
    name: 'Новиков Алексей Петрович',
    workerId: 'W-10245',
    shiftPeriod: '22–24 ноя',
    shiftCount: 3,
    accrued: 11200,
    deductions: [
      { id: 'd5', type: 'bonus', amount: 500, comment: 'Перевыполнение' },
    ],
    toPay: 11200 + 500,
    selfEmployedStatus: 'active',
    rowStatus: 'needs-distribution',
    shifts: [
      { date: '22.11.2025', project: 'ЖК Панорама', client: 'МегаСтрой', object: 'Объект З', amount: 3733 },
      { date: '23.11.2025', project: 'ЖК Панорама', client: 'МегаСтрой', object: 'Объект З', amount: 3733 },
      { date: '24.11.2025', project: 'ЖК Панорама', client: 'МегаСтрой', object: 'Объект З', amount: 3734 },
    ],
  },
];

const mockAwaitingWorkers = [
  { id: 'a1', name: 'Григорьев Павел Сергеевич', workerId: 'W-10456', project: 'ЖК Академик', object: 'Объект А', hours: '8ч', date: '26 ноя' },
  { id: 'a2', name: 'Федоров Дмитрий Олегович', workerId: 'W-10457', project: 'ЖК Звёздный', object: 'Объект Б', hours: '8ч', date: '26 ноя' },
  { id: 'a3', name: 'Лебедев Александр Викторович', workerId: 'W-10458', project: 'ЖК Трио', object: 'Объект В', hours: '10ч', date: '27 ноя' },
];

const mockTrustedSMZ = [
  {
    id: '1',
    name: 'Козлов Андрей Викторович',
    workerId: 'W-08765',
    dependentCount: 3,
    maxLoad: 5,
    weeklyLoad: 142500,
    reliability: 98,
    recommended: true,
    sameProject: true,
  },
  {
    id: '2',
    name: 'Петров Михаил Сергеевич',
    workerId: 'W-08234',
    dependentCount: 2,
    maxLoad: 5,
    weeklyLoad: 89400,
    reliability: 95,
    recommended: true,
  },
  {
    id: '3',
    name: 'Васильева Ольга Ивановна',
    workerId: 'W-08123',
    dependentCount: 4,
    maxLoad: 5,
    weeklyLoad: 156700,
    reliability: 85,
  },
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

function PaymentMethodModal({ 
  worker,
  onClose, 
  onSelect 
}: { 
  worker: Worker;
  onClose: () => void;
  onSelect: (method: string) => void;
}) {
  const recommended = mockTrustedSMZ.filter(d => d.recommended);
  const others = mockTrustedSMZ.filter(d => !d.recommended);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-gray-900 font-medium">Выбрать способ выплаты</h3>
              <p className="text-sm text-gray-600 mt-1">{worker.name} · {worker.workerId}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Project Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <span className="font-medium">Проект:</span> {worker.shifts[0]?.project}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Смены: {worker.shiftPeriod} · {worker.shiftCount} смен
            </p>
          </div>

          {/* Section 1: Personal Methods */}
          <div>
            <p className="text-sm text-gray-900 font-medium mb-3">Личные способы</p>
            <div className="space-y-2">
              {worker.selfEmployedStatus === 'active' && (
                <button
                  onClick={() => onSelect('self-employed')}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">Самозанятый</p>
                      <p className="text-xs text-gray-600">Прямая выплата через ЗП-проект Т-Банка</p>
                    </div>
                  </div>
                </button>
              )}
              
              <button
                onClick={() => onSelect('card-requisites')}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium mb-1">Реквизиты доверенного лица (не СМЗ)</p>
                    <p className="text-xs text-gray-600 mb-2">Карта родственника или коллеги</p>
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      ПФ выплачивает доверенному СМЗ. На карту не выплачиваем.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Recommended SMZ */}
          {recommended.length > 0 && (
            <div>
              <p className="text-sm text-gray-900 font-medium mb-3">Рекомендуемые доверенные СМЗ</p>
              <div className="space-y-2">
                {recommended.map((smz) => (
                  <button
                    key={smz.id}
                    onClick={() => onSelect(`trusted-smz-${smz.id}`)}
                    className="w-full p-4 rounded-xl transition-all text-left"
                    style={{ backgroundColor: '#ECFDF5', border: '2px solid #D1FAE5' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-gray-900 font-medium truncate">{smz.name}</p>
                            {smz.sameProject && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Тот же проект
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{smz.workerId}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm text-green-700 font-medium">{smz.reliability}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 pl-13">
                      <span>Зависимых: {smz.dependentCount}/{smz.maxLoad}</span>
                      <span>Нагрузка: ₽{(smz.weeklyLoad / 1000).toFixed(0)}k</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: All SMZ */}
          {others.length > 0 && (
            <div>
              <p className="text-sm text-gray-900 font-medium mb-3">Все доверенные СМЗ</p>
              <div className="space-y-2">
                {others.map((smz) => (
                  <button
                    key={smz.id}
                    onClick={() => onSelect(`trusted-smz-${smz.id}`)}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900 truncate">{smz.name}</p>
                          <p className="text-xs text-gray-600">{smz.workerId}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 shrink-0 ml-3">{smz.reliability}%</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2 pl-13">
                      <span>Зависимых: {smz.dependentCount}/{smz.maxLoad}</span>
                      <span>₽{(smz.weeklyLoad / 1000).toFixed(0)}k</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add New */}
          <button
            onClick={() => onSelect('add-new')}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Plus className="w-4 h-4" />
              <span>Добавить доверенного СМЗ</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export function PendingPayments() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedWorkers, setExpandedWorkers] = useState<Set<string>>(new Set());
  const [showMethodModal, setShowMethodModal] = useState<string | null>(null);
  const [showDeductionModal, setShowDeductionModal] = useState<string | null>(null);

  const filteredWorkers = mockWorkers.filter(worker => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ready') return worker.rowStatus === 'ready';
    if (selectedFilter === 'needs-distribution') return worker.rowStatus === 'needs-distribution';
    if (selectedFilter === 'errors') return worker.rowStatus === 'error';
    if (selectedFilter === 'self-employed') return worker.paymentMethod === 'self-employed';
    if (selectedFilter === 'trusted-smz') return worker.paymentMethod === 'trusted-smz' || worker.paymentMethod === 'personal-trusted-smz';
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

  const getRowBackground = (status: RowStatus) => {
    switch (status) {
      case 'ready':
        return 'bg-green-50/50';
      case 'needs-distribution':
        return 'bg-yellow-50/50';
      case 'error':
        return 'bg-red-50/50';
      case 'awaiting-accrual':
        return 'bg-blue-50/50';
    }
  };

  // Calculate totals
  const totalWorkers = mockWorkers.length;
  const totalAccrued = mockWorkers.reduce((sum, w) => sum + w.accrued, 0);
  const totalDeductions = mockWorkers.reduce((sum, w) => sum + calculateDeductionsTotal(w.deductions), 0);
  const totalPayout = mockWorkers.reduce((sum, w) => sum + w.toPay, 0);
  const readyCount = mockWorkers.filter(w => w.rowStatus === 'ready').length;
  const errorsCount = mockWorkers.filter(w => w.rowStatus === 'error').length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1.5">Исполнителей</p>
          <p className="text-2xl text-gray-900 font-medium">{totalWorkers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1.5">Начислено</p>
          <p className="text-xl text-gray-900 font-medium">₽{(totalAccrued / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1.5">НПД</p>
          <p className="text-xl text-gray-900 font-medium">₽{((totalAccrued * 6) / 94 / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-xs text-green-700 mb-1.5">К выплате</p>
          <p className="text-xl text-green-700 font-medium">₽{(totalPayout / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-xs text-green-700 mb-1.5">Готовы к оплате</p>
          <p className="text-2xl text-green-600 font-medium">{readyCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-xs text-red-700 mb-1.5">Ошибки</p>
          <p className="text-2xl text-red-600 font-medium">{errorsCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs font-medium">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Добавить исполнителя
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          {['all', 'ready', 'needs-distribution', 'self-employed', 'trusted-smz', 'errors'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                selectedFilter === filter
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              )}
            >
              {filter === 'all' && 'Все'}
              {filter === 'ready' && 'Готовы к оплате'}
              {filter === 'needs-distribution' && 'Требуют распределения'}
              {filter === 'self-employed' && 'Самозанятые'}
              {filter === 'trusted-smz' && 'Доверенные СМЗ'}
              {filter === 'errors' && 'Ошибки'}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm text-gray-900 font-medium">Исполнители, ожидающие выплат</h3>
          <p className="text-xs text-gray-600 mt-0.5">{filteredWorkers.length} в очереди</p>
        </div>
        
        <div>
          {filteredWorkers.map((worker, index) => {
            const isExpanded = expandedWorkers.has(worker.id);
            const deductionsTotal = calculateDeductionsTotal(worker.deductions);
            
            return (
              <div key={worker.id} className="border-b border-gray-100 last:border-b-0">
                {/* Main Row */}
                <div className={cn(
                  "grid grid-cols-[40px_40px_1fr_70px_120px_120px_120px_50px] gap-3 items-center px-4 py-3.5 hover:bg-gray-50/50 transition-colors",
                  getRowBackground(worker.rowStatus)
                )}>
                  {/* Index */}
                  <div className="text-sm text-gray-500 font-medium">
                    {index + 1}.
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <SelfEmployedStatusIcon status={worker.selfEmployedStatus} />
                  </div>

                  {/* Worker Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 font-medium truncate">{worker.name}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{worker.shiftPeriod}</span>
                      </div>
                      <p className="text-xs text-gray-500">{worker.workerId}</p>
                    </div>
                  </div>

                  {/* Shifts */}
                  <div className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-900 text-xs font-medium">
                      {worker.shiftCount}
                    </span>
                  </div>

                  {/* Deductions */}
                  <div className="text-right">
                    {deductionsTotal !== 0 ? (
                      <div className="relative group">
                        <p className="text-xs text-gray-500 mb-0.5">Удержания</p>
                        <p className={cn(
                          "text-sm font-medium cursor-pointer",
                          deductionsTotal > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {deductionsTotal > 0 ? '+' : ''}{deductionsTotal.toLocaleString()} ₽
                        </p>
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 w-48">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
                            {worker.deductions.map((d) => (
                              <p key={d.id} className={cn(
                                "mb-1 last:mb-0",
                                d.type === 'bonus' ? "text-green-400" : "text-red-400"
                              )}>
                                {d.type === 'bonus' ? '+' : '−'}{d.amount} ₽ ({d.comment})
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Удержания</p>
                        <p className="text-sm text-gray-400">—</p>
                      </div>
                    )}
                  </div>

                  {/* Accrued */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Начислено</p>
                    <p className="text-sm text-gray-900 font-medium">₽{worker.accrued.toLocaleString()}</p>
                  </div>

                  {/* To Pay */}
                  <div className="text-right">
                    <p className="text-xs text-green-700 mb-0.5">К выплате</p>
                    <p className="text-sm text-green-700 font-medium">₽{worker.toPay.toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-1">
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => toggleExpand(worker.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
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
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Shifts */}
                      <div>
                        <div className="flex items-start gap-2 mb-3">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-700 font-medium mb-2">За какие смены платим:</p>
                            <div className="space-y-1.5">
                              {worker.shifts.map((shift, idx) => (
                                <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="flex justify-between mb-1">
                                    <p className="text-xs text-gray-900 font-medium">{shift.date}</p>
                                    <span className="text-sm text-gray-900 font-medium">₽{shift.amount.toLocaleString()}</span>
                                  </div>
                                  <p className="text-xs text-gray-600">{shift.project} · {shift.client}</p>
                                  <p className="text-xs text-gray-500">{shift.object}</p>
                                </div>
                              ))}
                            </div>
                            {worker.trustedPersonCard && (
                              <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-xs text-purple-800">
                                  Реквизиты доверенного лица: {worker.trustedPersonCard.bank} {worker.trustedPersonCard.cardNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Изменить смены
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 hover:bg-red-50">
                            Исключить из выплат
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-blue-600 hover:bg-blue-50" onClick={() => setShowDeductionModal(worker.id)}>
                            Добавить удержание/бонус
                          </Button>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <p className="text-xs text-gray-700 font-medium mb-3">Способ выплаты:</p>
                        {!worker.paymentMethod ? (
                          <button
                            onClick={() => setShowMethodModal(worker.id)}
                            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                            style={{ backgroundColor: '#FFF7E6', border: '2px solid #FFE4B5', color: '#B45309' }}
                          >
                            Нужно распределить
                          </button>
                        ) : worker.paymentMethod === 'self-employed' ? (
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
                        ) : worker.paymentMethod === 'personal-trusted-smz' ? (
                          <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3E8FF', border: '2px solid #E9D5FF' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-purple-900 font-medium">Личный доверенный СМЗ</p>
                                <p className="text-xs text-purple-700">{worker.trustedSmzName}</p>
                              </div>
                            </div>
                          </div>
                        ) : worker.paymentMethod === 'trusted-smz' ? (
                          <div className="p-4 rounded-xl" style={{ backgroundColor: '#ECFDF5', border: '2px solid #D1FAE5' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-green-900 font-medium">Доверенный СМЗ</p>
                                <p className="text-xs text-green-700">{worker.trustedSmzName}</p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Awaiting Accrual */}
      <AwaitingAccrualBlock onDistribute={(workerId) => {
        console.log(`Distribute for worker ${workerId}`);
        setShowMethodModal(workerId);
      }} />

      {/* Modals */}
      {showMethodModal && mockWorkers.find(w => w.id === showMethodModal) && (
        <PaymentMethodModal
          worker={mockWorkers.find(w => w.id === showMethodModal)!}
          onClose={() => setShowMethodModal(null)}
          onSelect={(method) => {
            console.log(`Selected ${method}`);
            setShowMethodModal(null);
          }}
        />
      )}
    </div>
  );
}