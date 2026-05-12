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
  MoveRight,
  CreditCard
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { mockAwaitingPayment, mockAwaitingAccrual, Worker } from "./mockWorkersData";

type SelfEmployedStatus = 'active' | 'pending-confirmation' | 'connecting' | 'refused' | 'disabled';
type ApprovalStatus = 'approved' | 'waiting' | 'mismatch';
type CardStatus = 'no-card' | 'own-card' | 'trusted-card';

// Custom Checkbox Component with modern styling
function CustomCheckbox({ 
  checked, 
  onChange, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={cn(
        "w-[14px] h-[14px] rounded border transition-all duration-200",
        "border-[#D9D9D9] bg-transparent",
        !disabled && "hover:bg-[#E8F3FF] hover:border-[#3B82F6]/30",
        checked && !disabled && "bg-[#3B82F6]/25 border-[#3B82F6]",
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer",
        "flex items-center justify-center"
      )}>
        {checked && (
          <svg 
            className="w-2.5 h-2.5 text-[#3B82F6]" 
            fill="none" 
            strokeWidth="2.5" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </label>
  );
}

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
      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", config.bg)}>
        <Icon className={cn("w-2.5 h-2.5", config.color)} />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 whitespace-nowrap">
        <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2 py-0.5 shadow-lg">
          {config.tooltip}
        </div>
      </div>
    </div>
  );
}

function BankIcon({ bank }: { bank?: string }) {
  if (!bank) return null;
  
  const bankLower = bank.toLowerCase();
  
  if (bankLower.includes('т-банк') || bankLower.includes('тинькофф')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#FFDD2D] flex items-center justify-center text-black text-[8px] font-bold shrink-0">
        T
      </div>
    );
  }
  
  if (bankLower.includes('сбер')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#21A038] flex items-center justify-center shrink-0">
        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
    );
  }
  
  if (bankLower.includes('альфа')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#EF3124] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
        А
      </div>
    );
  }
  
  if (bankLower.includes('озон')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#005BFF] flex items-center justify-center text-white text-[6px] font-bold shrink-0">
        OZ
      </div>
    );
  }
  
  if (bankLower.includes('втб')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#002882] flex items-center justify-center text-white text-[7px] font-bold shrink-0">
        ВТБ
      </div>
    );
  }
  
  if (bankLower.includes('райффайзен')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#FFED00] flex items-center justify-center text-black text-[8px] font-bold shrink-0">
        R
      </div>
    );
  }
  
  if (bankLower.includes('открытие')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#00A0E3] flex items-center justify-center text-white text-[7px] font-bold shrink-0">
        ОТ
      </div>
    );
  }
  
  if (bankLower.includes('газпром')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#0033A0] flex items-center justify-center text-white text-[7px] font-bold shrink-0">
        ГП
      </div>
    );
  }
  
  if (bankLower.includes('мкб')) {
    return (
      <div className="w-4 h-4 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-[7px] font-bold shrink-0">
        МКБ
      </div>
    );
  }
  
  // Default bank icon
  return (
    <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
      <CreditCard className="w-2.5 h-2.5 text-white" />
    </div>
  );
}

function SBPIcon() {
  return (
    <div className="w-4 h-4 rounded bg-[#8B5CF6] flex items-center justify-center shrink-0">
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
      </svg>
    </div>
  );
}

function PaymentDetailsDisplay({ worker }: { worker: Worker }) {
  if (worker.cardStatus === 'no-card') {
    return (
      <div className="flex items-center gap-1.5 relative group">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="text-[10px] text-red-600">Нет реквизитов</span>
        <div className="absolute left-0 top-full mt-1.5 hidden group-hover:block z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2 py-1 shadow-lg">
            Нет реквизитов карты — необходимо заполнить
          </div>
        </div>
      </div>
    );
  }
  
  if (worker.cardStatus === 'own-card' && worker.cardInfo) {
    const displayText = `${worker.cardInfo.bank} •••• ${worker.cardInfo.lastDigits}`;
    return (
      <div className="flex items-center gap-1.5 relative group">
        <BankIcon bank={worker.cardInfo.bank} />
        <span className="text-[10px] text-gray-700">{displayText}</span>
        <div className="absolute left-0 top-full mt-1.5 hidden group-hover:block z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2 py-1 shadow-lg">
            Реквизиты собственной карты
          </div>
        </div>
      </div>
    );
  }
  
  if (worker.cardStatus === 'trusted-card' && worker.cardInfo) {
    const displayText = worker.cardInfo.sbpPhone && worker.cardInfo.owner 
      ? `СБП ${worker.cardInfo.sbpPhone} · ${worker.cardInfo.owner}`
      : 'СБП';
    return (
      <div className="flex items-center gap-1.5 relative group">
        <SBPIcon />
        <span className="text-[10px] text-gray-700">{displayText}</span>
        <div className="absolute left-0 top-full mt-1.5 hidden group-hover:block z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2 py-1 shadow-lg">
            Реквизиты доверенного лица
          </div>
        </div>
      </div>
    );
  }
  
  return null;
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
        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Edit3 className="w-3.5 h-3.5 text-gray-500" />
        Изменить смены
      </button>
      <button
        onClick={() => { onAddDeduction(); onClose(); }}
        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Plus className="w-3.5 h-3.5 text-gray-500" />
        Добавить бонус/удержание
      </button>
      <button
        onClick={() => { onMoveToRegistry(); onClose(); }}
        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <MoveRight className="w-3.5 h-3.5 text-gray-500" />
        Переместить в другой реестр
      </button>
      <button
        onClick={() => { onViewHistory(); onClose(); }}
        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <History className="w-3.5 h-3.5 text-gray-500" />
        История изменений
      </button>
      <div className="h-px bg-gray-200 my-1" />
      <button
        onClick={() => { onExclude(); onClose(); }}
        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 className="w-3.5 h-3.5" />
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

  // Row background based on status
  const getRowBackground = () => {
    if (worker.approvalStatus === 'mismatch') {
      return 'bg-red-50/30';
    }
    if (!worker.paymentMethod) {
      return 'bg-orange-50/30';
    }
    if (worker.paymentMethod && worker.approvalStatus === 'approved') {
      return 'bg-green-50/20';
    }
    return 'bg-white';
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div 
        className={cn(
          "px-3 py-2 transition-colors cursor-pointer hover:brightness-95",
          getRowBackground()
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-[28px_minmax(200px,1fr)_140px_130px_95px_100px_100px_36px] gap-3 items-center">
          {/* Index */}
          <div className="text-[11px] text-gray-500 font-medium">{index + 1}.</div>

          {/* Worker Info (Name + ID only, no badges) */}
          <div className="flex items-start gap-2.5 min-w-0">
            <SelfEmployedStatusIcon status={worker.selfEmployedStatus} />

            {/* Avatar */}
            <div 
              className="relative mt-0.5"
              onMouseEnter={() => setShowAvatarEnlarged(true)}
              onMouseLeave={() => setShowAvatarEnlarged(false)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-[11px] font-medium shrink-0">
                {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              
              {/* Enlarged Avatar - Portrait format 3:4 */}
              {showAvatarEnlarged && (
                <div className="absolute left-full ml-4 top-0 z-50 w-48 h-64 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-2xl flex items-center justify-center text-white text-4xl font-medium border-2 border-white pointer-events-none">
                  {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
            
            {/* Name + Payment Details */}
            <div className="min-w-0 flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('#', '_blank');
                }}
                className="text-xs text-gray-900 font-medium truncate hover:underline text-left block w-full mb-1"
              >
                {worker.name}
              </button>
              <PaymentDetailsDisplay worker={worker} />
            </div>
          </div>

          {/* Payment Method Badge (separate column) */}
          <div className="flex items-center">
            {getPaymentMethodBadge()}
          </div>

          {/* Period + Shift Count + Context Menu */}
          <div className="flex items-center gap-1.5">
            <div className="relative group">
              <div className="text-[11px] text-gray-700 cursor-help">
                {worker.shiftPeriod} <span className="text-gray-500">({worker.shiftCount})</span>
              </div>
              <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-72">
                <div className="bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-lg">
                  <div className="font-medium mb-2">Детали смен:</div>
                  <div className="space-y-1.5">
                    {worker.shifts.map((shift) => (
                      <div key={shift.id} className="flex justify-between items-start gap-3 text-[10px]">
                        <div className="flex-1">
                          <span className="font-medium">{shift.date}</span>
                          <span className="text-gray-400 mx-1">·</span>
                          <span>{shift.object}</span>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div>
                            {shift.ourHours}ч{shift.clientHours !== undefined && `/${shift.clientHours}ч`}
                          </div>
                          <div className="text-gray-300">
                            {isAccrualBlock ? '0' : shift.rate.toLocaleString()} ₽
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Context Menu */}
            <div onClick={(e) => e.stopPropagation()} className="relative flex items-center">
              <button 
                onClick={() => setShowContextMenu(!showContextMenu)}
                className="p-0.5 hover:bg-gray-200/60 rounded transition-colors"
              >
                <MoreVertical className="w-3 h-3 text-gray-500" />
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

          {/* Deductions */}
          <div className="text-right">
            {deductionsTotal !== 0 ? (
              <div className="relative group">
                <p className="text-[10px] text-gray-500 mb-0.5">Корректировки</p>
                <p className={cn(
                  "text-xs font-medium cursor-pointer",
                  deductionsTotal > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {deductionsTotal > 0 ? '+' : ''}{deductionsTotal} ₽
                </p>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 w-48">
                  <div className="bg-gray-900 text-white text-[11px] rounded-lg p-2 shadow-lg">
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
              <div className="relative group">
                <p className="text-[10px] text-gray-500 mb-0.5 cursor-help">Корректировки</p>
                <p className="text-xs text-gray-400">—</p>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2 py-1 shadow-lg">
                    Штрафы, бонусы и удержания
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accrued */}
          <div className="text-right">
            <p className="text-[10px] text-gray-500 mb-0.5">Начислено</p>
            <p className={cn(
              "text-xs font-medium",
              isAccrualBlock ? "text-gray-400" : "text-gray-900"
            )}>
              {isAccrualBlock ? '0' : worker.accrued.toLocaleString()} ₽
            </p>
          </div>

          {/* To Pay */}
          <div className="text-right">
            <p className="text-[10px] text-green-700 mb-0.5">К выплате</p>
            <p className={cn(
              "text-xs font-medium",
              isAccrualBlock ? "text-gray-400" : "text-green-700"
            )}>
              {isAccrualBlock ? '0' : worker.toPay.toLocaleString()} ₽
            </p>
          </div>

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
            {canSelect ? (
              <CustomCheckbox
                checked={isSelected}
                onChange={() => onSelect(worker.id)}
              />
            ) : (
              <div className="relative group">
                <CustomCheckbox
                  checked={false}
                  onChange={() => {}}
                  disabled
                />
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-56">
                  <div className="bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-lg">
                    Сначала распределите выплату на доверенного СМЗ
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={cn(
          "border-t border-gray-100 px-3 py-2.5",
          getRowBackground()
        )}>
          <div className="mb-2">
            <p className="text-[11px] text-gray-700 font-medium mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Детали смен:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {worker.shifts.map((shift) => (
                <div 
                  key={shift.id} 
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px]",
                    shift.approvalStatus === 'approved' && "bg-green-50 border-green-200 text-green-900",
                    shift.approvalStatus === 'waiting' && "bg-yellow-50 border-yellow-200 text-yellow-900",
                    shift.approvalStatus === 'mismatch' && "bg-red-50 border-red-200 text-red-900"
                  )}
                >
                  <span className="font-medium">{shift.date}</span>
                  <span className="text-gray-400">·</span>
                  <span>{shift.object}</span>
                  {shift.role && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span>{shift.role}</span>
                    </>
                  )}
                  <span className="text-gray-400">·</span>
                  <span>
                    {shift.ourHours}ч{shift.clientHours !== undefined && `/${shift.clientHours}ч`}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="font-medium">
                    {isAccrualBlock ? '0' : shift.rate.toLocaleString()} ₽
                  </span>
                  <button 
                    className="ml-0.5 hover:bg-white/50 rounded transition-colors p-0.5"
                    onClick={() => console.log('Remove shift', shift.id)}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Корректировки */}
          {worker.deductions.length > 0 && (
            <div className="mt-2">
              <p className="text-[11px] text-gray-700 font-medium mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                Корректировки:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {worker.deductions.map((deduction) => (
                  <div 
                    key={deduction.id} 
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px]",
                      deduction.type === 'bonus' && "bg-green-50 border-green-200 text-green-900",
                      (deduction.type === 'penalty' || deduction.type === 'deduction') && "bg-red-50 border-red-200 text-red-900"
                    )}
                  >
                    <span className="font-medium">
                      {deduction.type === 'bonus' ? '+' : '−'}{deduction.amount.toLocaleString()} ₽
                    </span>
                    <span className="text-gray-400">·</span>
                    <span>{deduction.comment}</span>
                    <button 
                      className="ml-0.5 hover:bg-white/50 rounded transition-colors p-0.5"
                      onClick={() => console.log('Remove deduction', deduction.id)}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
            Отправить в реестр
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

export function PaymentsV15() {
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

  const selectableAwaitingPaymentCount = filteredAwaitingPayment.filter(w => w.paymentMethod && w.approvalStatus !== 'mismatch').length;
  const isAllSelected = selectedWorkers.length > 0 && selectedWorkers.length === selectableAwaitingPaymentCount;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2.5">
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-[11px] text-gray-600 mb-1">Исполнителей</p>
          <p className="text-xl text-gray-900 font-medium">{totalWorkers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-[11px] text-gray-600 mb-1">Начислено</p>
          <p className="text-lg text-gray-900 font-medium">₽{(totalAccrued / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-[11px] text-gray-600 mb-1">НПД (6%)</p>
          <p className="text-lg text-gray-900 font-medium">₽{((totalAccrued * 0.06) / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-3 shadow-sm">
          <p className="text-[11px] text-green-700 mb-1">К выплате</p>
          <p className="text-lg text-green-700 font-medium">₽{(totalPayout / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-3 shadow-sm">
          <p className="text-[11px] text-green-700 mb-1">Готовы к оплате</p>
          <p className="text-xl text-green-600 font-medium">{readyCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-3 shadow-sm">
          <p className="text-[11px] text-red-700 mb-1">Ошибки</p>
          <p className="text-xl text-red-600 font-medium">{errorsCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-7 text-xs font-medium">
              <Plus className="w-3 h-3 mr-1.5" />
              Добавить исполнителя
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            {['all', 'ready', 'needs-distribution', 'self-employed', 'trusted-smz', 'errors'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border",
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
              className="h-7 text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3 mr-1.5" />
              Отправить в реестр
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
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs text-gray-900 font-medium">Ожидают выплат</h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Смены закрыты, суммы рассчитаны, осталось распределить и создать реестр
              </p>
            </div>
            <CustomCheckbox
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
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
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs text-gray-900 font-medium">Ожидают начисления</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 hidden group-hover:block z-50 w-72">
                <div className="bg-gray-900 text-white text-[11px] rounded-lg p-2.5 shadow-lg">
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