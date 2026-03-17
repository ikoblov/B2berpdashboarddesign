import { useState } from "react";
import {
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Upload,
  X,
  Calendar,
  Filter,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type RegisterStatus = "review" | "ready" | "uploaded" | "sent" | "processed";
type PayeeType = "self-employed" | "trusted-smz";
type NPDStatus = "active" | "pending-confirmation" | "inactive";
type RegisterType = "morning" | "day" | "evening" | "night";

interface Correction {
  id: string;
  type: "bonus" | "penalty" | "deduction";
  amount: number;
  description: string;
}

interface Shift {
  id: string;
  date: string;
  object: string;
  role: string;
  hours: number;
  amount: number;
}

interface Worker {
  id: string;
  name: string;
  bank: "tinkoff" | "sber" | "alfa" | "ozon" | "sbp" | "vtb";
  accountMask: string;
  shifts: Shift[];
  corrections: Correction[];
  toPay: number;
}

interface Payee {
  id: string;
  name: string;
  type: PayeeType;
  bank: "tinkoff" | "sber" | "alfa" | "ozon" | "sbp" | "vtb";
  accountMask: string;
  npdStatus: NPDStatus;
  toPay: number;
  corrections: Correction[];
  shifts: Shift[];
  workers?: Worker[];
}

interface Register {
  id: string;
  registryId: string;
  type: RegisterType;
  period: string;
  status: RegisterStatus;
  smzCount: number;
  directSmzCount: number;
  trustedSmzCount: number;
  recipientsCount: number;
  workersCount: number;
  createdAt: string;
  payees: Payee[];
}

// Bank icon component
function BankIcon({ bank }: { bank: string }) {
  const icons: Record<string, React.ReactNode> = {
    tinkoff: (
      <div className="w-4 h-4 rounded bg-yellow-400 flex items-center justify-center">
        <span className="text-[8px] font-bold text-black">Т</span>
      </div>
    ),
    sber: (
      <div className="w-4 h-4 rounded bg-green-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">С</span>
      </div>
    ),
    alfa: (
      <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">А</span>
      </div>
    ),
    ozon: (
      <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">O</span>
      </div>
    ),
    vtb: (
      <div className="w-4 h-4 rounded bg-blue-700 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">В</span>
      </div>
    ),
    sbp: (
      <div className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center">
        <CreditCard className="w-2.5 h-2.5 text-white" />
      </div>
    ),
  };

  return icons[bank] || icons.tinkoff;
}

// Type icon component
function TypeIcon({ type }: { type: RegisterType }) {
  const icons: Record<RegisterType, React.ReactNode> = {
    morning: <Sunrise className="w-3.5 h-3.5 text-orange-500" />,
    day: <Sun className="w-3.5 h-3.5 text-yellow-500" />,
    evening: <Sunset className="w-3.5 h-3.5 text-orange-600" />,
    night: <Moon className="w-3.5 h-3.5 text-blue-500" />,
  };
  return icons[type];
}

// Status config
function getStatusConfig(status: RegisterStatus) {
  const configs = {
    review: {
      label: "На проверке",
      className: "bg-yellow-50 border-yellow-300 text-yellow-700",
    },
    ready: {
      label: "Готов к отправке",
      className: "bg-green-50 border-green-300 text-green-700",
    },
    uploaded: {
      label: "Загружен в банк",
      className: "bg-blue-50 border-blue-300 text-blue-700",
    },
    sent: {
      label: "Отправлен",
      className: "bg-gray-100 border-gray-300 text-gray-700",
    },
    processed: {
      label: "Проведён",
      className: "bg-gray-200 border-gray-400 text-gray-800",
    },
  };
  return configs[status];
}

// NPD Status badge
function NPDStatusBadge({ status }: { status: NPDStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-50 border border-green-200 text-green-700">
        <CheckCircle2 className="w-2.5 h-2.5" />
        НПД
      </span>
    );
  }
  if (status === "pending-confirmation") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-yellow-50 border border-yellow-200 text-yellow-700">
        <AlertCircle className="w-2.5 h-2.5" />
        НПД
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-50 border border-red-200 text-red-700">
      <X className="w-2.5 h-2.5" />
      НПД
    </span>
  );
}

function getTypeLabel(type: RegisterType) {
  const labels: Record<RegisterType, string> = {
    morning: "Утренний",
    day: "Дневной",
    evening: "Вечерний",
    night: "Ночной",
  };
  return labels[type];
}

// Calculate totals for a payee (SMZ)
function calculatePayeeTotals(payee: Payee) {
  // For self-employed: sum of shifts + corrections
  if (payee.type === "self-employed") {
    const shiftsTotal = payee.shifts.reduce((sum, shift) => sum + shift.amount, 0);
    const correctionsTotal = payee.corrections.reduce((sum, corr) => sum + corr.amount, 0);
    const toPay = payee.toPay;
    const npd = Math.round((toPay * 6) / 94);
    const accrued = toPay - npd;
    
    return { accrued, npd, toPay };
  }
  
  // For trusted-smz: include own shifts + workers totals
  const ownShiftsTotal = payee.shifts.reduce((sum, shift) => sum + shift.amount, 0);
  const ownCorrections = payee.corrections.reduce((sum, corr) => sum + corr.amount, 0);
  
  let workersTotal = 0;
  if (payee.workers) {
    workersTotal = payee.workers.reduce((sum, worker) => sum + worker.toPay, 0);
  }
  
  const toPay = payee.toPay;
  const npd = Math.round((toPay * 6) / 94);
  const accrued = toPay - npd;
  
  return { accrued, npd, toPay };
}

// Calculate totals for entire registry
function calculateRegistryTotals(register: Register) {
  let totalAccrued = 0;
  let totalNPD = 0;
  let totalToPay = 0;
  
  register.payees.forEach(payee => {
    const { accrued, npd, toPay } = calculatePayeeTotals(payee);
    totalAccrued += accrued;
    totalNPD += npd;
    totalToPay += toPay;
  });
  
  return { totalAccrued, totalNPD, totalToPay };
}

export default function RegistersV2() {
  const [selectedRegisterId, setSelectedRegisterId] = useState("1");
  const [expandedPayees, setExpandedPayees] = useState<Record<string, boolean>>({});
  const [expandedWorkers, setExpandedWorkers] = useState<Record<string, boolean>>({});
  const [expandedValidations, setExpandedValidations] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<RegisterStatus | "all">("all");

  // Mock data
  const registries: Register[] = [
    {
      id: "1",
      registryId: "REG-123",
      type: "day",
      period: "15–19 ноября",
      status: "review",
      smzCount: 4,
      directSmzCount: 2,
      trustedSmzCount: 2,
      recipientsCount: 2,
      workersCount: 16,
      createdAt: "19 ноя 2025, 14:30",
      payees: [
        {
          id: "p1",
          name: "Иванов Олег Петрович",
          type: "self-employed",
          bank: "tinkoff",
          accountMask: "•••• 4421",
          npdStatus: "active",
          toPay: 18500,
          corrections: [
            { id: "c1", type: "bonus", amount: 500, description: "Премия за качество" },
          ],
          shifts: [
            {
              id: "s1",
              date: "15.11",
              object: "ЖК Солнечный",
              role: "Маляр",
              hours: 8,
              amount: 6000,
            },
            {
              id: "s2",
              date: "16.11",
              object: "ЖК Солнечный",
              role: "Маляр",
              hours: 8,
              amount: 6000,
            },
            {
              id: "s3",
              date: "17.11",
              object: "ЖК Солнечный",
              role: "Маляр",
              hours: 8,
              amount: 6000,
            },
          ],
        },
        {
          id: "p2",
          name: "Петров Михаил Сергеевич",
          type: "trusted-smz",
          bank: "sber",
          accountMask: "•••• 7892",
          npdStatus: "active",
          toPay: 25700,
          corrections: [],
          shifts: [
            {
              id: "s9",
              date: "15.11",
              object: "ЖК Новый",
              role: "Бригадир",
              hours: 8,
              amount: 8000,
            },
          ],
          workers: [
            {
              id: "w1",
              name: "Сидоров Алексей Константинович",
              bank: "alfa",
              accountMask: "•••• 5534",
              toPay: 12000,
              corrections: [],
              shifts: [
                {
                  id: "s4",
                  date: "15.11",
                  object: "ЖК Новый",
                  role: "Штукатур",
                  hours: 8,
                  amount: 6000,
                },
                {
                  id: "s5",
                  date: "16.11",
                  object: "ЖК Новый",
                  role: "Штукатур",
                  hours: 8,
                  amount: 6000,
                },
              ],
            },
            {
              id: "w2",
              name: "Козлов Виктор Иванович",
              bank: "tinkoff",
              accountMask: "•••• 8932",
              toPay: 9200,
              corrections: [
                { id: "c2", type: "penalty", amount: -300, description: "Опоздание" },
              ],
              shifts: [
                {
                  id: "s6",
                  date: "17.11",
                  object: "ЖК Новый",
                  role: "Разнорабочий",
                  hours: 8,
                  amount: 4800,
                },
                {
                  id: "s7",
                  date: "18.11",
                  object: "ЖК Новый",
                  role: "Разнорабочий",
                  hours: 8,
                  amount: 4700,
                },
              ],
            },
            {
              id: "w3",
              name: "Морозов Игорь Леонидович",
              bank: "sbp",
              accountMask: "+7 900 123-45-67",
              toPay: 4500,
              corrections: [],
              shifts: [
                {
                  id: "s8",
                  date: "19.11",
                  object: "ЖК Новый",
                  role: "Уборщик",
                  hours: 6,
                  amount: 2500,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      registryId: "REG-122",
      type: "evening",
      period: "10–14 ноября",
      status: "uploaded",
      smzCount: 3,
      directSmzCount: 2,
      trustedSmzCount: 1,
      recipientsCount: 3,
      workersCount: 9,
      createdAt: "15 ноя 2025, 16:20",
      payees: [],
    },
    {
      id: "3",
      registryId: "REG-121",
      type: "night",
      period: "5–9 ноября",
      status: "processed",
      smzCount: 2,
      directSmzCount: 1,
      trustedSmzCount: 1,
      recipientsCount: 2,
      workersCount: 7,
      createdAt: "10 ноя 2025, 10:15",
      payees: [],
    },
  ];

  const selectedRegistry = registries.find((r) => r.id === selectedRegisterId);

  const filteredRegistries = registries.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const formatAmount = (amount: number) => {
    return `₽${amount.toLocaleString("ru-RU")}`;
  };

  const togglePayeeExpand = (id: string) => {
    setExpandedPayees((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWorkerExpand = (id: string) => {
    setExpandedWorkers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRegistryQualityScore = (registry: Register) => {
    return 92; // Mock
  };

  const hasBlockingErrors = (registry: Register) => {
    return false; // Mock
  };

  const getCoveragePercentage = (registry: Register) => {
    return 100; // Mock - можно рассчитать как (recipientsCount / workersCount) * 100
  };

  if (!selectedRegistry) return null;

  const { totalAccrued, totalNPD, totalToPay } = calculateRegistryTotals(selectedRegistry);

  return (
    <div className="flex gap-6">
      {/* Registry List Sidebar */}
      <div className="w-[340px] flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-3">
              Реестры выплат
            </h2>

            {/* Filters */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] text-gray-700 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Текущая неделя</span>
              </button>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as RegisterStatus | "all")
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[11px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="review">На проверке</option>
                <option value="ready">Готов к отправке</option>
                <option value="uploaded">Загружен</option>
                <option value="sent">Отправлен</option>
                <option value="processed">Проведён</option>
              </select>
            </div>
          </div>

          {/* Registry List */}
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredRegistries.map((registry) => {
              const totals = calculateRegistryTotals(registry);
              
              return (
                <div
                  key={registry.id}
                  onClick={() => setSelectedRegisterId(registry.id)}
                  className={cn(
                    "p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedRegisterId === registry.id &&
                      "bg-blue-50 border-l-4 border-l-blue-600"
                  )}
                >
                  {/* Row 1: Header with ID, Type, Period */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon type={registry.type} />
                      <span className="text-[11px] font-semibold text-gray-900">
                        {registry.registryId}
                      </span>
                      <span className="text-[9px] text-gray-500">
                        • {registry.period}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={cn(
                          "inline-flex px-1.5 py-0.5 rounded text-[8px] font-medium border",
                          getStatusConfig(registry.status).className
                        )}
                      >
                        {getStatusConfig(registry.status).label}
                      </span>
                      <span className="text-[13px] font-bold text-gray-900">
                        {formatAmount(totals.totalToPay)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Metrics */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-600">
                    <span>{registry.recipientsCount} получателей</span>
                    <span className="text-gray-400">•</span>
                    <span>{registry.workersCount} исполнителей</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Summary Metrics - Only 4 cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                Исполнителей всего
              </div>
            </div>
            <div className="text-[15px] font-semibold text-gray-900">
              {selectedRegistry.workersCount}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                Получателей всего
              </div>
            </div>
            <div className="text-[15px] font-semibold text-gray-900">
              {selectedRegistry.recipientsCount}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                Охват реестра
              </div>
            </div>
            <div className="text-[15px] font-semibold text-gray-900">
              {getCoveragePercentage(selectedRegistry)}%
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                Итоговая сумма к выплате
              </div>
            </div>
            <div className="text-[15px] font-semibold text-blue-600">
              {formatAmount(totalToPay)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-5">
          {selectedRegistry.status === "review" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-8 px-3"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Вернуть в черновик
              </Button>
              <Button
                size="sm"
                className="text-[11px] h-8 px-3"
                disabled={hasBlockingErrors(selectedRegistry)}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Утвердить реестр
              </Button>
            </>
          )}
          {selectedRegistry.status === "ready" && (
            <Button size="sm" className="text-[11px] h-8 px-3">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Экспорт в банк
            </Button>
          )}
          {selectedRegistry.status === "uploaded" && (
            <Button size="sm" className="text-[11px] h-8 px-3">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Отметить как отправлен
            </Button>
          )}
        </div>

        {/* Payees Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-[12px] font-semibold text-gray-900">
              Получатели (банковская структура)
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {selectedRegistry.payees.map((payee) => {
              const isExpanded = expandedPayees[payee.id];
              const { accrued, npd, toPay } = calculatePayeeTotals(payee);

              return (
                <div key={payee.id}>
                  {/* Payee Row - Clickable */}
                  <div 
                    className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => togglePayeeExpand(payee.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                        {payee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-medium text-gray-900">
                            {payee.name}
                          </span>
                          <NPDStatusBadge status={payee.npdStatus} />
                          {payee.type === "self-employed" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                              Самозанятый
                            </span>
                          )}
                          {payee.type === "trusted-smz" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-50 border border-purple-200 text-purple-700 font-medium">
                              Доверенный СМЗ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <BankIcon bank={payee.bank} />
                          <span className="text-[10px] text-gray-600">
                            {payee.accountMask}
                          </span>
                          {payee.workers && payee.workers.length > 0 && (
                            <span className="text-[9px] text-gray-500">
                              • {payee.workers.length} исполнителей
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Financial Summary - Right Side */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-[9px] text-gray-500">Начислено</div>
                          <div className="text-[11px] font-medium text-gray-900">
                            {formatAmount(accrued)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-gray-500">НПД</div>
                          <div className="text-[11px] font-medium text-gray-900">
                            {formatAmount(npd)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-gray-500">К выплате</div>
                          <div className="text-[11px] font-semibold text-blue-600">
                            {formatAmount(toPay)}
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform flex-shrink-0",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-3 pl-11 pr-3 pb-3 bg-gray-50">
                        {/* Corrections */}
                        {payee.corrections.length > 0 && (
                          <div className="mb-3 pt-3">
                            <h4 className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                              Корректировки
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {payee.corrections.map((correction) => (
                                <span
                                  key={correction.id}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium",
                                    correction.type === "bonus" &&
                                      "bg-green-50 border border-green-200 text-green-700",
                                    correction.type === "penalty" &&
                                      "bg-red-50 border border-red-200 text-red-700",
                                    correction.type === "deduction" &&
                                      "bg-orange-50 border border-orange-200 text-orange-700"
                                  )}
                                >
                                  {correction.description}:{" "}
                                  {correction.amount > 0 ? "+" : ""}
                                  {correction.amount} ₽
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Direct SMZ: Own Shifts */}
                        {payee.type === "self-employed" &&
                          payee.shifts.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Смены
                              </h4>
                              <div className="space-y-1.5">
                                {payee.shifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="flex items-center justify-between text-[10px] bg-white rounded-lg p-2.5 border border-gray-200"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-900 font-medium">
                                        {shift.date}
                                      </span>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-700">
                                        {shift.object}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-gray-600">
                                        {shift.role} • {shift.hours}ч
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {formatAmount(shift.amount)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Trusted SMZ: Own Shifts */}
                        {payee.type === "trusted-smz" &&
                          payee.shifts.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Личные смены
                              </h4>
                              <div className="space-y-1.5">
                                {payee.shifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="flex items-center justify-between text-[10px] bg-purple-50 rounded-lg p-2.5 border border-purple-200"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-900 font-medium">
                                        {shift.date}
                                      </span>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-700">
                                        {shift.object}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-gray-600">
                                        {shift.role} • {shift.hours}ч
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {formatAmount(shift.amount)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Trusted SMZ: Workers */}
                        {payee.type === "trusted-smz" &&
                          payee.workers &&
                          payee.workers.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Исполнители ({payee.workers.length})
                              </h4>
                              <div className="space-y-1.5">
                                {payee.workers.map((worker) => {
                                  const isWorkerExpanded =
                                    expandedWorkers[worker.id];

                                  return (
                                    <div
                                      key={worker.id}
                                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                                    >
                                      <div 
                                        className="p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleWorkerExpand(worker.id);
                                        }}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[9px] font-semibold text-gray-700 flex-shrink-0">
                                            {worker.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .slice(0, 2)}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="text-[11px] font-medium text-gray-900 mb-0.5">
                                              {worker.name}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <BankIcon bank={worker.bank} />
                                              <span className="text-[9px] text-gray-600">
                                                {worker.accountMask}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="text-right flex-shrink-0">
                                            <div className="text-[9px] text-gray-500">
                                              К выплате
                                            </div>
                                            <div className="text-[11px] font-semibold text-gray-900">
                                              {formatAmount(worker.toPay)}
                                            </div>
                                          </div>

                                          <ChevronRight
                                            className={cn(
                                              "w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0",
                                              isWorkerExpanded && "rotate-90"
                                            )}
                                          />
                                        </div>
                                      </div>

                                      {/* Worker Expanded Details */}
                                      {isWorkerExpanded && (
                                        <div className="px-2.5 pb-2.5 bg-gray-50">
                                          {/* Worker Corrections */}
                                          {worker.corrections.length > 0 && (
                                            <div className="mb-2 pt-2">
                                              <h5 className="text-[9px] font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                                                Корректировки
                                              </h5>
                                              <div className="flex flex-wrap gap-1">
                                                {worker.corrections.map(
                                                  (correction) => (
                                                    <span
                                                      key={correction.id}
                                                      className={cn(
                                                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-medium",
                                                        correction.type ===
                                                          "bonus" &&
                                                          "bg-green-50 border border-green-200 text-green-700",
                                                        correction.type ===
                                                          "penalty" &&
                                                          "bg-red-50 border border-red-200 text-red-700"
                                                      )}
                                                    >
                                                      {correction.description}:{" "}
                                                      {correction.amount > 0
                                                        ? "+"
                                                        : ""}
                                                      {correction.amount} ₽
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Worker Shifts */}
                                          <div>
                                            <h5 className="text-[9px] font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                                              Смены
                                            </h5>
                                            <div className="space-y-1">
                                              {worker.shifts.map((shift) => (
                                                <div
                                                  key={shift.id}
                                                  className="flex items-center justify-between text-[9px] bg-white rounded p-2 border border-gray-200"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-900 font-medium">
                                                      {shift.date}
                                                    </span>
                                                    <span className="text-gray-500">
                                                      •
                                                    </span>
                                                    <span className="text-gray-700">
                                                      {shift.object}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">
                                                      {shift.role} • {shift.hours}ч
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                      {formatAmount(shift.amount)}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Block - Compact Accordions at Bottom */}
        {selectedRegistry.status === "review" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-gray-900">
                  Проверка реестра
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wide">
                    Надежность:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${getRegistryQualityScore(
                            selectedRegistry
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-green-600">
                      {getRegistryQualityScore(selectedRegistry)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {/* Requisites */}
                <div
                  className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() =>
                    setExpandedValidations((prev) => ({
                      ...prev,
                      requisites: !prev.requisites,
                    }))
                  }
                >
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[11px] font-medium text-gray-900">
                        Реквизиты выплат
                      </span>
                      <span className="text-[9px] text-orange-600 font-medium">
                        2 предупреждения
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform",
                        expandedValidations.requisites && "rotate-90"
                      )}
                    />
                  </div>
                  {expandedValidations.requisites && (
                    <div className="px-3 pb-3 pt-1 bg-gray-50 border-t border-gray-200 space-y-1.5 text-[10px]">
                      <div className="p-2 bg-white rounded text-gray-700 border border-gray-200">
                        Несколько исполнителей получают на одни реквизиты: ••••4421
                        (3 чел.)
                      </div>
                      <div className="p-2 bg-white rounded text-gray-700 border border-gray-200">
                        Исполнитель сменил реквизиты: Козлов В.И. (••••7120 →
                        ••••8932)
                      </div>
                    </div>
                  )}
                </div>

                {/* NPD Status */}
                <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-medium text-gray-900">
                      Статус НПД
                    </span>
                    <span className="text-[9px] text-green-600 font-medium">
                      16 из 16 активны
                    </span>
                  </div>
                </div>

                {/* SMZ Load */}
                <div
                  className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() =>
                    setExpandedValidations((prev) => ({
                      ...prev,
                      smzLoad: !prev.smzLoad,
                    }))
                  }
                >
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[11px] font-medium text-gray-900">
                        Нагрузка доверенных СМЗ
                      </span>
                      <span className="text-[9px] text-orange-600 font-medium">
                        1 повышенная
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform",
                        expandedValidations.smzLoad && "rotate-90"
                      )}
                    />
                  </div>
                  {expandedValidations.smzLoad && (
                    <div className="px-3 pb-3 pt-1 bg-gray-50 border-t border-gray-200 space-y-1.5 text-[10px]">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="flex-1 text-gray-700">
                          СМЗ Иванова Л.К.
                        </span>
                        <span className="text-gray-500 font-medium">
                          2 исполнителя
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="flex-1 text-gray-700">
                          СМЗ Петров М.С.
                        </span>
                        <span className="text-orange-600 font-semibold">
                          4 исполнителя
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Anomalies */}
                <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-medium text-gray-900">
                      Аномалии начислений
                    </span>
                    <span className="text-[9px] text-green-600 font-medium">
                      Не обнаружено
                    </span>
                  </div>
                </div>

                {/* Shift Logic */}
                <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-medium text-gray-900">
                      Логика смен
                    </span>
                    <span className="text-[9px] text-green-600 font-medium">
                      Корректно
                    </span>
                  </div>
                </div>

                {/* Corrections Check */}
                <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-medium text-gray-900">
                      Проверка корректировок
                    </span>
                    <span className="text-[9px] text-green-600 font-medium">
                      Все корректны
                    </span>
                  </div>
                </div>

                {/* Other Risks */}
                <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-medium text-gray-900">
                      Прочие риски
                    </span>
                    <span className="text-[9px] text-green-600 font-medium">
                      Не обнаружено
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {getRegistryQualityScore(selectedRegistry) < 90 ? (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-semibold text-orange-900 mb-0.5">
                        Обнаружены предупреждения
                      </div>
                      <div className="text-[9px] text-orange-700">
                        Рекомендуется проверить перед отправкой в банк
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-semibold text-green-900 mb-0.5">
                        Реестр готов к утверждению
                      </div>
                      <div className="text-[9px] text-green-700">
                        Все проверки пройдены успешно
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}