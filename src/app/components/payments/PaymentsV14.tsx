import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  X,
  Users,
  User,
  Plus,
  Info,
  RefreshCw,
  MoreVertical,
  AlertTriangle,
  XCircle,
  DollarSign,
  Send,
  FileText,
  Trash2,
  Edit3,
  History,
  MoveRight
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type SelfEmployedStatus = 'active' | 'pending-confirmation' | 'connecting' | 'refused' | 'disabled';
type ApprovalStatus = 'approved' | 'waiting' | 'mismatch';

interface Deduction {
  id: string;
  type: 'bonus' | 'penalty' | 'deduction';
  amount: number;
  comment: string;
}

interface Shift {
  id: string;
  date: string;
  project: string;
  client: string;
  object: string;
  role: string;
  rate: number;
  ourHours: number;
  clientHours?: number;
  approvalStatus: ApprovalStatus;
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
  approvalStatus: ApprovalStatus;
  hoursMismatch?: number;
  paymentMethod?: 'self-employed' | 'trusted-smz' | 'personal-card';
  trustedSmzName?: string;
  cardInfo?: {
    bank: string;
    number: string;
    owner: string;
  };
  shifts: Shift[];
}

interface TrustedSMZ {
  id: string;
  name: string;
  workerId: string;
  dependentCount: number;
  maxLoad: number;
  weeklyAmount: number;
  reliability: number;
  sameProject?: boolean;
}

interface PaymentRegistry {
  id: string;
  type: 'morning' | 'evening';
  workerIds: string[];
  totalAmount: number;
  npd: number;
  sent: boolean;
  createdAt: string;
}

const mockTrustedSMZ: TrustedSMZ[] = [
  {
    id: '1',
    name: 'Козлов Андрей Викторович',
    workerId: 'W-08765',
    dependentCount: 2,
    maxLoad: 5,
    weeklyAmount: 142500,
    reliability: 95,
    sameProject: true,
  },
  {
    id: '2',
    name: 'Петров Михаил Сергеевич',
    workerId: 'W-08234',
    dependentCount: 3,
    maxLoad: 5,
    weeklyAmount: 189400,
    reliability: 89,
  },
  {
    id: '3',
    name: 'Васильева Ольга Ивановна',
    workerId: 'W-08123',
    dependentCount: 1,
    maxLoad: 5,
    weeklyAmount: 95700,
    reliability: 72,
  },
];

const mockAwaitingAccrual: Worker[] = [
  {
    id: 'aw1',
    name: 'Григорьев Павел Сергеевич',
    workerId: 'W-10456',
    shiftPeriod: '25–26 ноя',
    shiftCount: 2,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'active',
    approvalStatus: 'waiting',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    shifts: [
      { id: 's1', date: '25.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's2', date: '26.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: 'aw2',
    name: 'Федоров Дмитрий Олегович',
    workerId: 'W-10457',
    shiftPeriod: '26 ноя',
    shiftCount: 1,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    shifts: [
      { id: 's3', date: '26.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: 'aw3',
    name: 'Лебедев Александр Викторович',
    workerId: 'W-10458',
    shiftPeriod: '25–26 ноя',
    shiftCount: 2,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'connecting',
    approvalStatus: 'mismatch',
    hoursMismatch: -2,
    shifts: [
      { id: 's4', date: '25.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3200, ourHours: 8, clientHours: 6, approvalStatus: 'mismatch' },
      { id: 's5', date: '26.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3200, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
];

const mockAwaitingPayment: Worker[] = [
  {
    id: '1',
    name: 'Иванов Олег Петрович',
    workerId: 'W-10234',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 14000,
    deductions: [
      { id: 'd1', type: 'deduction', amount: 500, comment: 'Спецовка' },
      { id: 'd2', type: 'deduction', amount: 400, comment: 'Косяки' },
    ],
    toPay: 13100,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов Андрей Викторович',
    shifts: [
      { id: 's6', date: '21.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's7', date: '22.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's8', date: '23.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's9', date: '24.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
  {
    id: '2',
    name: 'Петрова Мария Александровна',
    workerId: 'W-10189',
    shiftPeriod: '22–24 ноя',
    shiftCount: 3,
    accrued: 12600,
    deductions: [],
    toPay: 12600,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    shifts: [
      { id: 's10', date: '22.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's11', date: '23.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's12', date: '24.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
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
      { id: 'd3', type: 'bonus', amount: 1000, comment: 'За качество' },
    ],
    toPay: 8200,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    shifts: [
      { id: 's13', date: '22.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3600, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's14', date: '23.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3600, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
  {
    id: '4',
    name: 'Кузнецова Анна Сергеевна',
    workerId: 'W-10099',
    shiftPeriod: '23–24 ноя',
    shiftCount: 2,
    accrued: 7600,
    deductions: [],
    toPay: 7600,
    selfEmployedStatus: 'pending-confirmation',
    approvalStatus: 'waiting',
    shifts: [
      { id: 's15', date: '23.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Подсобник', rate: 3800, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's16', date: '24.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Подсобник', rate: 3800, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: '5',
    name: 'Волков Дмитрий Игоревич',
    workerId: 'W-09875',
    shiftPeriod: '21–23 ноя',
    shiftCount: 3,
    accrued: 11400,
    deductions: [
      { id: 'd4', type: 'deduction', amount: 300, comment: 'Инструмент' },
    ],
    toPay: 11100,
    selfEmployedStatus: 'active',
    approvalStatus: 'mismatch',
    hoursMismatch: 3,
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Петров М.С.',
    shifts: [
      { id: 's17', date: '21.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
      { id: 's18', date: '22.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
      { id: 's19', date: '23.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
    ],
  },
];

function SelfEmployedStatusIcon({ status }: { status: SelfEmployedStatus }) {
  const config = {
    'active': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', tooltip: 'Активен' },
    'pending-confirmation': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', tooltip: 'Требует подтверждения' },
    'connecting': { icon: RefreshCw, color: 'text-gray-600', bg: 'bg-gray-100', tooltip: 'Подключение' },
    'refused': { icon: X, color: 'text-red-600', bg: 'bg-red-100', tooltip: 'Отказался' },
    'disabled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', tooltip: 'Отключен' },
  }[status];
  
  const Icon = config.icon;
  
  return (
    <div className="relative group">
      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", config.bg)}>
        <Icon className={cn("w-3 h-3", config.color)} />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 whitespace-nowrap">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 shadow-lg">
          {config.tooltip}
        </div>
      </div>
    </div>
  );
}

function ApprovalStatusIcon({ status, mismatch }: { status: ApprovalStatus; mismatch?: number }) {
  const config = {
    'approved': { 
      color: 'text-green-600', 
      icon: CheckCircle2,
      tooltip: 'Все согласовано'
    },
    'waiting': { 
      color: 'text-yellow-600', 
      icon: AlertCircle,
      tooltip: 'Ожидает согласования заказчиком'
    },
    'mismatch': { 
      color: 'text-red-600', 
      icon: AlertTriangle,
      tooltip: `Несоответствие часов: ${mismatch ? (mismatch > 0 ? `+${mismatch}` : mismatch) : '0'} ч`
    },
  }[status];
  
  const Icon = config.icon;
  
  return (
    <div className="relative group">
      <Icon className={cn("w-4 h-4", config.color)} />
      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 whitespace-nowrap">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          {config.tooltip}
        </div>
      </div>
    </div>
  );
}

function ContextMenu({ 
  onClose, 
  onEditShifts,
  onAddDeduction,
  onExclude,
  onMoveToRegistry,
  onViewHistory
}: { 
  onClose: () => void;
  onEditShifts: () => void;
  onAddDeduction: () => void;
  onExclude: () => void;
  onMoveToRegistry: () => void;
  onViewHistory: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
      <button
        onClick={() => { onEditShifts(); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Edit3 className="w-4 h-4 text-gray-500" />
        Изменить смены
      </button>
      <button
        onClick={() => { onAddDeduction(); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4 text-gray-500" />
        Добавить бонус/удержание
      </button>
      <button
        onClick={() => { onMoveToRegistry(); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <MoveRight className="w-4 h-4 text-gray-500" />
        Переместить в другой реестр
      </button>
      <button
        onClick={() => { onViewHistory(); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <History className="w-4 h-4 text-gray-500" />
        Открыть историю операций
      </button>
      <div className="h-px bg-gray-200 my-1" />
      <button
        onClick={() => { onExclude(); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Исключить из выплат
      </button>
    </div>
  );
}

function DeductionPopover({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (type: 'bonus' | 'penalty' | 'deduction', amount: number, comment: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<'bonus' | 'penalty' | 'deduction'>('bonus');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (amount && comment) {
      onAdd(selectedType, parseFloat(amount), comment);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Добавить удержание/бонус</h3>
          
          <div>
            <p className="text-xs text-gray-700 font-medium mb-2">Тип операции</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedType('bonus')}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                  selectedType === 'bonus'
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                )}
              >
                Премия
              </button>
              <button
                onClick={() => setSelectedType('penalty')}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                  selectedType === 'penalty'
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                )}
              >
                Штраф
              </button>
              <button
                onClick={() => setSelectedType('deduction')}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                  selectedType === 'deduction'
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                )}
              >
                Удержание
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-700 font-medium mb-1.5">Сумма (₽)</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <p className="text-xs text-gray-700 font-medium mb-1.5">Комментарий</p>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Укажите причину"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8">
              Добавить
            </Button>
            <Button onClick={onClose} size="sm" variant="outline" className="flex-1 h-8">
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionModal({ 
  worker,
  onClose, 
  onSelect 
}: { 
  worker: Worker;
  onClose: () => void;
  onSelect: (method: string, smzId?: string) => void;
}) {
  const canUseSelfEmployed = worker.selfEmployedStatus === 'active';
  const recommended = mockTrustedSMZ.filter(d => d.reliability >= 85);
  const others = mockTrustedSMZ.filter(d => d.reliability < 85);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-gray-900 font-medium">Распределить выплату</h3>
              <p className="text-sm text-gray-600 mt-1">{worker.name} · {worker.workerId}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <span className="font-medium">Смены:</span> {worker.shiftPeriod} · {worker.shiftCount} смен
            </p>
            {worker.accrued > 0 && (
              <p className="text-xs text-blue-700 mt-1">
                К выплате: ₽{worker.toPay.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-900 font-medium mb-3">Личный способ</p>
            <button
              onClick={() => canUseSelfEmployed && onSelect('self-employed')}
              disabled={!canUseSelfEmployed}
              className={cn(
                "w-full p-4 border-2 rounded-xl text-left transition-all",
                canUseSelfEmployed 
                  ? "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50" 
                  : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  canUseSelfEmployed ? "bg-green-100" : "bg-gray-200"
                )}>
                  <User className={cn("w-5 h-5", canUseSelfEmployed ? "text-green-600" : "text-gray-400")} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    Самозанятый
                    {!canUseSelfEmployed && <span className="text-red-600 ml-2">(недоступен)</span>}
                  </p>
                  <p className="text-xs text-gray-600">Прямая выплата через ЗП-проект Т-Банка</p>
                  {!canUseSelfEmployed && (
                    <p className="text-xs text-red-600 mt-1">Статус самозанятости неактивен</p>
                  )}
                </div>
              </div>
            </button>
          </div>

          {recommended.length > 0 && (
            <div>
              <p className="text-sm text-gray-900 font-medium mb-3">Рекомендуемые доверенные СМЗ</p>
              <div className="space-y-2">
                {recommended.map((smz) => (
                  <button
                    key={smz.id}
                    onClick={() => onSelect('trusted-smz', smz.id)}
                    className="w-full p-4 rounded-xl transition-all text-left bg-green-50 border-2 border-green-200 hover:border-green-400"
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
                                Тот же объект
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{smz.workerId}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm text-green-700 font-medium">{smz.reliability}%</p>
                        <p className="text-xs text-gray-500">рейтинг</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 pl-13">
                      <span>Зависимых: {smz.dependentCount}/{smz.maxLoad}</span>
                      <span>ПФ за неделю: ₽{(smz.weeklyAmount / 1000).toFixed(0)}k</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <p className="text-sm text-gray-900 font-medium mb-3">Все доверенные СМЗ</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {others.map((smz) => (
                  <button
                    key={smz.id}
                    onClick={() => onSelect('trusted-smz', smz.id)}
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
                      <span>{smz.dependentCount}/{smz.maxLoad}</span>
                      <span>₽{(smz.weeklyAmount / 1000).toFixed(0)}k/нед</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onSelect('add-new')}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Plus className="w-4 h-4" />
              <span>Добавить нового доверенного СМЗ</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkerRow({ 
  worker, 
  index,
  isAccrualBlock,
  isSelected,
  onSelect,
  onDistribute
}: { 
  worker: Worker; 
  index: number;
  isAccrualBlock: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDistribute: (workerId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAvatarEnlarged, setShowAvatarEnlarged] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDeductionPopover, setShowDeductionPopover] = useState(false);
  
  const deductionsTotal = worker.deductions.reduce((sum, d) => {
    if (d.type === 'bonus') return sum + d.amount;
    return sum - d.amount;
  }, 0);

  const canSelect = worker.paymentMethod && worker.approvalStatus !== 'mismatch';

  const handleAddDeduction = (type: 'bonus' | 'penalty' | 'deduction', amount: number, comment: string) => {
    console.log('Add deduction:', { workerId: worker.id, type, amount, comment });
  };

  const getPaymentMethodBadge = () => {
    if (!worker.paymentMethod) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-orange-50 text-orange-700 border border-orange-200">
          Не распределен
        </span>
      );
    }

    if (worker.paymentMethod === 'self-employed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 border border-green-200">
          Самозанятый
        </span>
      );
    }

    if (worker.paymentMethod === 'trusted-smz') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-purple-50 text-purple-700 border border-purple-200">
          СМЗ: {worker.trustedSmzName}
        </span>
      );
    }

    if (worker.paymentMethod === 'personal-card') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-gray-50 text-gray-700 border border-gray-200">
          Личн. реквизиты
        </span>
      );
    }

    return null;
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div 
        className="px-4 py-3 transition-colors cursor-pointer bg-white hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-[32px_minmax(280px,1fr)_100px_70px_110px_110px_110px_50px_32px] gap-3 items-center">
          {/* Index */}
          <div className="text-xs text-gray-500 font-medium">{index + 1}.</div>

          {/* Worker Info + Status + Payment Method */}
          <div className="flex items-center gap-3 min-w-0">
            <SelfEmployedStatusIcon status={worker.selfEmployedStatus} />

            {/* Avatar */}
            <div 
              className="relative"
              onMouseEnter={() => setShowAvatarEnlarged(true)}
              onMouseLeave={() => setShowAvatarEnlarged(false)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              
              {/* Enlarged Avatar - 3:4 portrait format */}
              {showAvatarEnlarged && (
                <div className="absolute left-full ml-4 top-0 z-50 w-48 h-64 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-2xl flex items-center justify-center text-white text-4xl font-medium border-2 border-white pointer-events-none">
                  {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1 flex items-center gap-3">
              <div className="min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('#', '_blank');
                  }}
                  className="text-sm text-gray-900 font-medium truncate hover:underline text-left block w-full"
                >
                  {worker.name}
                </button>
                <p className="text-xs text-gray-500">{worker.workerId}</p>
              </div>

              {/* Payment Method Badge */}
              {getPaymentMethodBadge()}
            </div>
          </div>

          {/* Period */}
          <div className="text-xs text-gray-600">{worker.shiftPeriod}</div>

          {/* Shift Count */}
          <div className="flex justify-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-900 text-xs font-medium">
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
                  {deductionsTotal > 0 ? '+' : ''}{deductionsTotal} ₽
                </p>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 w-48">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
                    {worker.deductions.map((d) => (
                      <p key={d.id} className={cn(
                        "mb-1 last:mb-0",
                        d.type === 'bonus' ? "text-green-400" : "text-red-400"
                      )}>
                        {d.comment} {d.type === 'bonus' ? '+' : '−'}{d.amount} ₽
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
            <p className={cn(
              "text-sm font-medium",
              isAccrualBlock ? "text-gray-400" : "text-gray-900"
            )}>
              {isAccrualBlock ? '0' : worker.accrued.toLocaleString()} ₽
            </p>
          </div>

          {/* To Pay */}
          <div className="text-right">
            <p className="text-xs text-green-700 mb-0.5">К выплате</p>
            <p className={cn(
              "text-sm font-medium",
              isAccrualBlock ? "text-gray-400" : "text-green-700"
            )}>
              {isAccrualBlock ? '0' : worker.toPay.toLocaleString()} ₽
            </p>
          </div>

          {/* Status Icon */}
          <div className="flex items-center justify-center">
            <ApprovalStatusIcon status={worker.approvalStatus} mismatch={worker.hoursMismatch} />
          </div>

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
            {canSelect ? (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(worker.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            ) : (
              <div className="relative group">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-56">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                    Сначала распределите выплату на доверенного СМЗ
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Context Menu */}
          <div onClick={(e) => e.stopPropagation()} className="relative flex justify-center">
            <button 
              onClick={() => setShowContextMenu(!showContextMenu)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showContextMenu && (
              <ContextMenu
                onClose={() => setShowContextMenu(false)}
                onEditShifts={() => console.log('Edit shifts')}
                onAddDeduction={() => setShowDeductionPopover(true)}
                onExclude={() => console.log('Exclude')}
                onMoveToRegistry={() => console.log('Move to registry')}
                onViewHistory={() => console.log('View history')}
              />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-4">
          <div className="mb-3">
            <p className="text-xs text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Детали смен:
            </p>
            <div className="flex flex-wrap gap-2">
              {worker.shifts.map((shift) => (
                <div 
                  key={shift.id} 
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs",
                    shift.approvalStatus === 'approved' && "bg-green-50 border-green-200 text-green-900",
                    shift.approvalStatus === 'waiting' && "bg-yellow-50 border-yellow-200 text-yellow-900",
                    shift.approvalStatus === 'mismatch' && "bg-red-50 border-red-200 text-red-900"
                  )}
                >
                  <span className="font-medium">{shift.date}</span>
                  <span className="text-gray-500">·</span>
                  <span>{shift.object}</span>
                  <span className="text-gray-500">·</span>
                  <span>{shift.role}</span>
                  <span className="text-gray-500">·</span>
                  <span>
                    {shift.ourHours}ч{shift.clientHours !== undefined && `/${shift.clientHours}ч`}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="font-medium">
                    {isAccrualBlock ? '0' : shift.rate.toLocaleString()} ₽
                  </span>
                  <button 
                    className="ml-1 hover:bg-white rounded transition-colors p-0.5"
                    onClick={() => console.log('Remove shift', shift.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {!worker.paymentMethod && (
            <button
              onClick={() => onDistribute(worker.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-orange-50 border border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Нужно распределить
            </button>
          )}
        </div>
      )}

      {showDeductionPopover && (
        <DeductionPopover
          onClose={() => setShowDeductionPopover(false)}
          onAdd={handleAddDeduction}
        />
      )}
    </div>
  );
}

function ActiveRegistryPanel({ 
  registry,
  onSend,
  onOpen,
  onCancel
}: { 
  registry: PaymentRegistry;
  onSend: () => void;
  onOpen: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm text-blue-900 font-medium">
              Активный {registry.type === 'morning' ? 'дневной' : 'вечерний'} реестр (не отправлен)
            </h3>
          </div>
          <div className="flex items-center gap-6 text-xs text-blue-800">
            <span>Исполнителей: <span className="font-medium">{registry.workerIds.length}</span></span>
            <span>К выплате: <span className="font-medium">₽{registry.totalAmount.toLocaleString()}</span></span>
            <span>НПД: <span className="font-medium">₽{registry.npd.toLocaleString()}</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onSend} className="bg-green-600 hover:bg-green-700 text-white h-8">
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Отправить в банк
          </Button>
          <Button size="sm" onClick={onOpen} variant="outline" className="h-8">
            Открыть
          </Button>
          <Button size="sm" onClick={onCancel} variant="outline" className="text-red-600 hover:bg-red-50 h-8">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PaymentsV14() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showDistributionModal, setShowDistributionModal] = useState<string | null>(null);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [activeRegistry, setActiveRegistry] = useState<PaymentRegistry | null>(null);

  const filterWorkers = (workers: Worker[]) => {
    return workers.filter(worker => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'ready') return worker.paymentMethod && worker.approvalStatus === 'approved';
      if (selectedFilter === 'needs-distribution') return !worker.paymentMethod;
      if (selectedFilter === 'errors') return worker.approvalStatus === 'mismatch';
      if (selectedFilter === 'self-employed') return worker.paymentMethod === 'self-employed';
      if (selectedFilter === 'trusted-smz') return worker.paymentMethod === 'trusted-smz';
      return true;
    });
  };

  const filteredAwaitingPayment = filterWorkers(mockAwaitingPayment);
  const filteredAwaitingAccrual = filterWorkers(mockAwaitingAccrual);

  const totalWorkers = mockAwaitingPayment.length;
  const totalAccrued = mockAwaitingPayment.reduce((sum, w) => sum + w.accrued, 0);
  const totalPayout = mockAwaitingPayment.reduce((sum, w) => sum + w.toPay, 0);
  const readyCount = mockAwaitingPayment.filter(w => w.paymentMethod && w.approvalStatus === 'approved').length;
  const errorsCount = mockAwaitingPayment.filter(w => w.approvalStatus === 'mismatch').length;

  const handleSelectAll = () => {
    const selectableWorkers = filteredAwaitingPayment
      .filter(w => w.paymentMethod && w.approvalStatus !== 'mismatch')
      .map(w => w.id);
    
    if (selectedWorkers.length === selectableWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(selectableWorkers);
    }
  };

  const handleToggleWorker = (id: string) => {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleCreateRegistry = (type: 'morning' | 'evening') => {
    if (selectedWorkers.length === 0) return;
    
    const selectedWorkersData = mockAwaitingPayment.filter(w => selectedWorkers.includes(w.id));
    const totalAmount = selectedWorkersData.reduce((sum, w) => sum + w.toPay, 0);
    const npd = totalAmount * 0.06;

    const newRegistry: PaymentRegistry = {
      id: `REG-${Date.now()}`,
      type,
      workerIds: selectedWorkers,
      totalAmount,
      npd,
      sent: false,
      createdAt: new Date().toISOString()
    };

    setActiveRegistry(newRegistry);
    setSelectedWorkers([]);
  };

  return (
    <div className="space-y-4">
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
          <p className="text-xs text-gray-600 mb-1.5">НПД (6%)</p>
          <p className="text-xl text-gray-900 font-medium">₽{((totalAccrued * 0.06) / 1000).toFixed(1)}k</p>
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

      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleCreateRegistry('morning')}
              disabled={selectedWorkers.length === 0}
              className="h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              Создать дневной реестр
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleCreateRegistry('evening')}
              disabled={selectedWorkers.length === 0}
              className="h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              Создать вечерний реестр
            </Button>
          </div>
        </div>
      </div>

      {activeRegistry && !activeRegistry.sent && (
        <ActiveRegistryPanel
          registry={activeRegistry}
          onSend={() => {
            setActiveRegistry({ ...activeRegistry, sent: true });
            console.log('Send registry to bank');
          }}
          onOpen={() => console.log('Open registry')}
          onCancel={() => setActiveRegistry(null)}
        />
      )}

      {/* Awaiting Payment Block */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-900 font-medium">Ожидают выплат</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Смены закрыты, суммы рассчитаны, осталось распределить и создать реестр
              </p>
            </div>
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedWorkers.length > 0 && selectedWorkers.length === filteredAwaitingPayment.filter(w => w.paymentMethod && w.approvalStatus !== 'mismatch').length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Выбрать всех
            </label>
          </div>
        </div>
        <div>
          {filteredAwaitingPayment.map((worker, index) => (
            <WorkerRow 
              key={worker.id} 
              worker={worker} 
              index={index}
              isAccrualBlock={false}
              isSelected={selectedWorkers.includes(worker.id)}
              onSelect={handleToggleWorker}
              onDistribute={setShowDistributionModal}
            />
          ))}
        </div>
      </div>

      {/* Awaiting Accrual Block */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-gray-900 font-medium">Ожидают начисления</h3>
            <div className="relative group">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 hidden group-hover:block z-50 w-72">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                  Смены закрыты бригадиром/куратором. Бухгалтер рассчитает сумму после проверки согласования с заказчиком.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {filteredAwaitingAccrual.map((worker, index) => (
            <WorkerRow 
              key={worker.id} 
              worker={worker} 
              index={index}
              isAccrualBlock={true}
              isSelected={false}
              onSelect={() => {}}
              onDistribute={setShowDistributionModal}
            />
          ))}
        </div>
      </div>

      {showDistributionModal && (
        <DistributionModal
          worker={[...mockAwaitingAccrual, ...mockAwaitingPayment].find(w => w.id === showDistributionModal)!}
          onClose={() => setShowDistributionModal(null)}
          onSelect={(method, smzId) => {
            console.log(`Selected ${method}`, smzId);
            setShowDistributionModal(null);
          }}
        />
      )}
    </div>
  );
}