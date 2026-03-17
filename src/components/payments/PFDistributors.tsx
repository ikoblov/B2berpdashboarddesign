import { useState } from "react";
import { 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  FileText,
  CreditCard,
  Smartphone,
  Circle,
  AlertTriangle,
  X,
  Upload,
  Download
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type NpdStatus = 'active' | 'pending' | 'inactive';
type PaymentMethodType = 'card' | 'sbp';
type ReceiptStatus = 'waiting' | 'partial' | 'complete' | 'overdue';

interface PFDistributor {
  id: string;
  name: string;
  workerId: string;
  npdStatus: NpdStatus;
  dependentCount: number;
  paymentMethod: {
    type: PaymentMethodType;
    number: string;
    bank: string;
  };
  weeklyPayoutLoad: number;
  receiptStatus: ReceiptStatus;
  issues: string[];
  reliability: number;
  dependents?: {
    name: string;
    accrued: number;
    date: string;
  }[];
}

const mockDistributors: PFDistributor[] = [
  {
    id: '1',
    name: 'Козлов Андрей Викторович',
    workerId: 'W-08765',
    npdStatus: 'active',
    dependentCount: 3,
    paymentMethod: {
      type: 'sbp',
      number: '+7 916 234-56-78',
      bank: 'Сбербанк',
    },
    weeklyPayoutLoad: 142500,
    receiptStatus: 'complete',
    issues: [],
    reliability: 98,
    dependents: [
      { name: 'Иванов О.П.', accrued: 14000, date: '21–24 ноя' },
      { name: 'Петров С.А.', accrued: 12500, date: '22–24 ноя' },
      { name: 'Сидоров М.И.', accrued: 11000, date: '21–23 ноя' },
    ],
  },
  {
    id: '2',
    name: 'Смирнова Татьяна Петровна',
    workerId: 'W-08543',
    npdStatus: 'active',
    dependentCount: 5,
    paymentMethod: {
      type: 'card',
      number: '•••• 4521',
      bank: 'Тинькофф',
    },
    weeklyPayoutLoad: 186300,
    receiptStatus: 'overdue',
    issues: ['Критическое количество зависимых', 'Просрочены квитанции за 3 исполнителей'],
    reliability: 72,
    dependents: [
      { name: 'Морозов В.П.', accrued: 15200, date: '20–23 ноя' },
      { name: 'Федоров Д.О.', accrued: 13800, date: '21–24 ноя' },
      { name: 'Кузнецов А.С.', accrued: 12600, date: '22–24 ноя' },
      { name: 'Васильев И.Н.', accrued: 11900, date: '21–23 ноя' },
      { name: 'Новиков А.П.', accrued: 10500, date: '22–23 ноя' },
    ],
  },
  {
    id: '3',
    name: 'Петров Михаил Сергеевич',
    workerId: 'W-08234',
    npdStatus: 'active',
    dependentCount: 2,
    paymentMethod: {
      type: 'sbp',
      number: '+7 925 345-67-89',
      bank: 'ВТБ',
    },
    weeklyPayoutLoad: 89400,
    receiptStatus: 'complete',
    issues: [],
    reliability: 95,
    dependents: [
      { name: 'Григорьев П.С.', accrued: 17500, date: '18–22 ноя' },
      { name: 'Соколов Е.П.', accrued: 15600, date: '21–24 ноя' },
    ],
  },
  {
    id: '4',
    name: 'Васильева Ольга Ивановна',
    workerId: 'W-08123',
    npdStatus: 'pending',
    dependentCount: 4,
    paymentMethod: {
      type: 'card',
      number: '•••• 8832',
      bank: 'Альфа-Банк',
    },
    weeklyPayoutLoad: 156700,
    receiptStatus: 'partial',
    issues: ['НПД требует подтверждения', 'Приближается к лимиту зависимых'],
    reliability: 85,
    dependents: [
      { name: 'Лебедев А.В.', accrued: 14300, date: '21–24 ноя' },
      { name: 'Орлов М.С.', accrued: 13900, date: '22–24 ноя' },
      { name: 'Зайцев Д.И.', accrued: 12800, date: '21–23 ноя' },
      { name: 'Волков С.П.', accrued: 11200, date: '22–23 ноя' },
    ],
  },
];

function NpdStatusBadge({ status }: { status: NpdStatus }) {
  const config = {
    active: { color: 'bg-green-100 text-green-700 border-green-200', label: 'НПД активен' },
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Требует подтверждения' },
    inactive: { color: 'bg-red-100 text-red-700 border-red-200', label: 'НПД неактивен' },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs border", config.color)}>
      <Circle className="w-2 h-2 fill-current" />
      {config.label}
    </span>
  );
}

function DependentCountBadge({ count }: { count: number }) {
  const config = count <= 2 
    ? { color: 'bg-green-100 text-green-700 border-green-200', label: 'Норма' }
    : count <= 4
    ? { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Близко к лимиту' }
    : { color: 'bg-red-100 text-red-700 border-red-200', label: 'Критично' };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-900 font-medium">{count}</span>
      <span className={cn("inline-flex px-2 py-0.5 rounded-lg text-xs border", config.color)}>
        {config.label}
      </span>
    </div>
  );
}

function ReceiptStatusBadge({ status }: { status: ReceiptStatus }) {
  const config = {
    complete: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Все загружены' },
    partial: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, label: 'Частично' },
    waiting: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText, label: 'Ожидание' },
    overdue: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle, label: 'Просрочено' },
  }[status];

  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs border", config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

export function PFDistributors() {
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const selectedDist = mockDistributors.find(d => d.id === selectedDistributor);

  // Calculate totals
  const totalDistributors = mockDistributors.length;
  const activeCount = mockDistributors.filter(d => d.npdStatus === 'active').length;
  const problemCount = mockDistributors.filter(d => d.issues.length > 0).length;
  const totalWeeklyLoad = mockDistributors.reduce((sum, d) => sum + d.weeklyPayoutLoad, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Всего распределителей</p>
          <p className="text-2xl text-gray-900">{totalDistributors}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-3 shadow-sm">
          <p className="text-xs text-green-700 mb-1">Активных</p>
          <p className="text-2xl text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-3 shadow-sm">
          <p className="text-xs text-red-700 mb-1">С проблемами</p>
          <p className="text-2xl text-red-600">{problemCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Недельная нагрузка</p>
          <p className="text-xl text-gray-900">₽{(totalWeeklyLoad / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Distributors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm text-gray-900">PF Доверенные распределители (СМЗ PF)</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Проверенные самозанятые для распределения выплат · Требуют квитанции
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs text-gray-600">Распределитель</th>
                <th className="text-left py-3 px-4 text-xs text-gray-600">Статус НПД</th>
                <th className="text-left py-3 px-4 text-xs text-gray-600">Зависимых</th>
                <th className="text-left py-3 px-4 text-xs text-gray-600">Способ оплаты</th>
                <th className="text-right py-3 px-4 text-xs text-gray-600">Недельная нагрузка</th>
                <th className="text-left py-3 px-4 text-xs text-gray-600">Квитанции</th>
                <th className="text-center py-3 px-4 text-xs text-gray-600">Проблемы</th>
                <th className="text-center py-3 px-4 text-xs text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {mockDistributors.map((distributor) => (
                <tr 
                  key={distributor.id}
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    distributor.issues.length > 0 && "bg-red-50/30"
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0",
                        distributor.issues.length > 0 ? "bg-gradient-to-br from-red-400 to-red-600" : "bg-gradient-to-br from-green-400 to-green-600"
                      )}>
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-900">{distributor.name}</p>
                        <p className="text-xs text-gray-500">{distributor.workerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <NpdStatusBadge status={distributor.npdStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <DependentCountBadge count={distributor.dependentCount} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-xs">
                      {distributor.paymentMethod.type === 'sbp' ? (
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                      )}
                      <div>
                        <p className="text-gray-900">{distributor.paymentMethod.number}</p>
                        <p className="text-gray-500">{distributor.paymentMethod.bank}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    ₽{distributor.weeklyPayoutLoad.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <ReceiptStatusBadge status={distributor.receiptStatus} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {distributor.issues.length > 0 ? (
                      <div className="relative group inline-block">
                        <div className="flex items-center justify-center gap-1">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">{distributor.issues.length}</span>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-64">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
                            {distributor.issues.map((issue, idx) => (
                              <p key={idx} className="mb-1 last:mb-0">• {issue}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                      onClick={() => {
                        setSelectedDistributor(distributor.id);
                        setShowDetailModal(true);
                      }}
                    >
                      Подробнее
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-start justify-between">
              <div>
                <h3 className="text-lg text-gray-900 mb-1">{selectedDist.name}</h3>
                <p className="text-xs text-gray-600">{selectedDist.workerId}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Надежность</p>
                  <p className="text-lg text-gray-900">{selectedDist.reliability}%</p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  selectedDist.reliability >= 90 ? "bg-green-100" :
                  selectedDist.reliability >= 75 ? "bg-yellow-100" :
                  "bg-red-100"
                )}>
                  <TrendingUp className={cn(
                    "w-6 h-6",
                    selectedDist.reliability >= 90 ? "text-green-600" :
                    selectedDist.reliability >= 75 ? "text-yellow-600" :
                    "text-red-600"
                  )} />
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Статус НПД</p>
                  <NpdStatusBadge status={selectedDist.npdStatus} />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Зависимых исполнителей</p>
                  <DependentCountBadge count={selectedDist.dependentCount} />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Статус квитанций</p>
                  <ReceiptStatusBadge status={selectedDist.receiptStatus} />
                </div>
              </div>

              {/* Issues */}
              {selectedDist.issues.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-red-900 font-medium mb-2">Обнаружены проблемы:</p>
                      <ul className="space-y-1">
                        {selectedDist.issues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-red-700">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Dependents List */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs text-gray-900 font-medium">Зависимые исполнители ({selectedDist.dependents?.length || 0})</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {selectedDist.dependents?.map((dependent, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs text-gray-900">{dependent.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{dependent.date}</p>
                      </div>
                      <p className="text-sm text-gray-900">₽{dependent.accrued.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs text-gray-900 font-medium">Управление квитанциями</p>
                </div>
                <div className="p-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Загрузить квитанции</p>
                    <p className="text-xs text-gray-500">Поддерживаются: PDF, JPG, PNG</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Скачать шаблон
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 flex-1">
                      Просмотреть загруженные
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex-1">
                Назначить исполнителей
              </Button>
              <Button size="sm" variant="outline" className="text-xs flex-1">
                Просмотреть историю
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}