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
  Edit3,
  MoreVertical,
  X,
  Info,
  Calendar,
  Filter,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type RegisterStatus = "draft" | "review" | "ready" | "uploaded" | "sent" | "processed";
type PayeeType = "self-employed" | "trusted-smz";
type NPDStatus = "active" | "pending-confirmation" | "inactive";
type ShiftApprovalStatus = "approved" | "waiting" | "mismatch";

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
  count: number;
  approvalStatus: ShiftApprovalStatus;
  factHours?: number;
  clientHours?: number;
}

interface Worker {
  id: string;
  name: string;
  bank: "tinkoff" | "sber" | "alfa" | "ozon" | "sbp" | "vtb";
  accountMask: string;
  shifts: Shift[];
  corrections: Correction[];
  accrued: number;
  npd: number;
  toPay: number;
}

interface Payee {
  id: string;
  name: string;
  type: PayeeType;
  bank: "tinkoff" | "sber" | "alfa" | "ozon" | "sbp" | "vtb";
  accountMask: string;
  npdStatus: NPDStatus;
  paymentDescription: string;
  accrued: number;
  npd: number;
  toPay: number;
  corrections: Correction[];
  shifts: Shift[];
  workers?: Worker[];
}

interface Register {
  id: string;
  registryId: string;
  period: string;
  status: RegisterStatus;
  totalAmount: number;
  recipientsCount: number;
  directSmzCount: number;
  trustedSmzCount: number;
  createdAt: string;
  sentAt?: string; // Used to compute time category
  exportId?: string;
  accrued: number;
  npd: number;
  toPay: number;
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
      <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">О</span>
      </div>
    ),
    sbp: (
      <div className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">₽</span>
      </div>
    ),
    vtb: (
      <div className="w-4 h-4 rounded bg-blue-700 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">В</span>
      </div>
    ),
  };
  return icons[bank] || icons.tinkoff;
}

// Compute time category from sentAt time
function getTimeCategory(sentAt?: string): string | null {
  if (!sentAt) return null;
  
  const time = sentAt.split(", ")[1]; // Extract "14:30" from "24 ноя 2025, 14:30"
  if (!time) return null;
  
  const [hours] = time.split(":").map(Number);
  
  if (hours < 12) return "Дневной";
  if (hours >= 12 && hours < 16) return "Вечерний";
  if (hours >= 16 && hours < 24) return "Ночной";
  return "Утренний"; // 00:00-04:00
}

const mockRegisters: Register[] = [
  {
    id: "1",
    registryId: "REG-123",
    period: "15–23 ноября",
    status: "review",
    totalAmount: 517200,
    recipientsCount: 16,
    directSmzCount: 10,
    trustedSmzCount: 6,
    createdAt: "24 ноя 2025, 14:30",
    sentAt: "24 ноя 2025, 14:30",
    accrued: 43200,
    npd: 2100,
    toPay: 46300,
    payees: [
      {
        id: "p1",
        name: "Иванов Олег Петрович",
        type: "self-employed",
        bank: "tinkoff",
        accountMask: "•••• 5421",
        npdStatus: "active",
        paymentDescription:
          "Назначение платежа: Оплата по договору №123/25 от 15.03.2025",
        accrued: 12000,
        npd: 720,
        toPay: 12720,
        corrections: [
          {
            id: "c1",
            type: "bonus",
            amount: 1000,
            description: "Бонус за переработку",
          },
          {
            id: "c2",
            type: "penalty",
            amount: -200,
            description: "Штраф за опоздание",
          },
        ],
        shifts: [
          {
            id: "s1",
            date: "21.11",
            object: "Объект А",
            role: "Подсобник",
            hours: 8,
            amount: 3600,
            count: 2,
            approvalStatus: "approved",
          },
          {
            id: "s2",
            date: "22.11",
            object: "ЖК Новый",
            role: "Подсобник",
            hours: 10,
            amount: 4500,
            count: 1,
            approvalStatus: "approved",
          },
        ],
      },
      {
        id: "p2",
        name: "Сидорова Мария Александровна",
        type: "trusted-smz",
        bank: "sber",
        accountMask: "•••• 8932",
        npdStatus: "active",
        paymentDescription:
          "Назначение платежа: Оплата по договору №145/25 от 20.03.2025",
        accrued: 18500,
        npd: 900,
        toPay: 19400,
        corrections: [
          {
            id: "c3",
            type: "bonus",
            amount: 500,
            description: "Премия за качество",
          },
        ],
        shifts: [
          {
            id: "s3",
            date: "20.11",
            object: "ТЦ Галерея",
            role: "Разнорабочий",
            hours: 8,
            amount: 4000,
            count: 1,
            approvalStatus: "waiting",
            factHours: 10,
            clientHours: 8,
          },
        ],
        workers: [
          {
            id: "w1",
            name: "Петров Алексей Иванович",
            bank: "tinkoff",
            accountMask: "•••• 6721",
            accrued: 9000,
            npd: 540,
            toPay: 9540,
            corrections: [],
            shifts: [
              {
                id: "s4",
                date: "21.11",
                object: "Объект А",
                role: "Грузчик",
                hours: 8,
                amount: 4500,
                count: 2,
                approvalStatus: "approved",
              },
            ],
          },
          {
            id: "w2",
            name: "Смирнов Виктор Петрович",
            bank: "alfa",
            accountMask: "•••• 3421",
            accrued: 7000,
            npd: 420,
            toPay: 7420,
            corrections: [
              {
                id: "c4",
                type: "penalty",
                amount: -300,
                description: "Штраф за нарушение",
              },
            ],
            shifts: [
              {
                id: "s5",
                date: "22.11",
                object: "ЖК Новый",
                role: "Подсобник",
                hours: 8,
                amount: 3500,
                count: 1,
                approvalStatus: "approved",
              },
            ],
          },
        ],
      },
      {
        id: "p3",
        name: "Кузнецов Андрей Викторович",
        type: "trusted-smz",
        bank: "sbp",
        accountMask: "СБП +7 999 123-45-67",
        npdStatus: "active",
        paymentDescription:
          "Назначение платежа: Оплата по договору №178/25 от 10.04.2025",
        accrued: 9200,
        npd: 460,
        toPay: 9660,
        corrections: [
          {
            id: "c5",
            type: "deduction",
            amount: -500,
            description: "Удержание за спецовку",
          },
        ],
        shifts: [],
        workers: [
          {
            id: "w3",
            name: "Николаев Иван Сергеевич",
            bank: "vtb",
            accountMask: "•••• 9821",
            accrued: 9000,
            npd: 540,
            toPay: 9540,
            corrections: [],
            shifts: [
              {
                id: "s6",
                date: "19.11",
                object: "Склад №5",
                role: "Кладовщик",
                hours: 10,
                amount: 5000,
                count: 1,
                approvalStatus: "mismatch",
                factHours: 10,
                clientHours: 8,
              },
              {
                id: "s7",
                date: "20.11",
                object: "Склад №5",
                role: "Кладовщик",
                hours: 8,
                amount: 4000,
                count: 1,
                approvalStatus: "approved",
              },
            ],
          },
        ],
      },
      {
        id: "p4",
        name: "Морозова Елена Сергеевна",
        type: "self-employed",
        bank: "alfa",
        accountMask: "•••• 7821",
        npdStatus: "active",
        paymentDescription:
          "Назначение платежа: Оплата по договору №092/25 от 01.02.2025",
        accrued: 7500,
        npd: 375,
        toPay: 7875,
        corrections: [],
        shifts: [
          {
            id: "s8",
            date: "18.11",
            object: "Офис Центр",
            role: "Уборщик",
            hours: 6,
            amount: 2500,
            count: 3,
            approvalStatus: "approved",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    registryId: "REG-122",
    period: "10–14 ноября",
    status: "uploaded",
    totalAmount: 328500,
    recipientsCount: 9,
    directSmzCount: 7,
    trustedSmzCount: 2,
    createdAt: "15 ноя 2025, 16:20",
    sentAt: "15 ноя 2025, 17:05",
    exportId: "EXP-20251115-001",
    accrued: 28500,
    npd: 1400,
    toPay: 29900,
    payees: [],
  },
  {
    id: "3",
    registryId: "REG-121",
    period: "5–9 ноября",
    status: "sent",
    totalAmount: 452000,
    recipientsCount: 14,
    directSmzCount: 10,
    trustedSmzCount: 4,
    createdAt: "10 ноя 2025, 09:15",
    sentAt: "11 ноя 2025, 14:20",
    exportId: "EXP-20251110-002",
    accrued: 38000,
    npd: 1900,
    toPay: 39900,
    payees: [],
  },
  {
    id: "4",
    registryId: "REG-120",
    period: "1–4 ноября",
    status: "processed",
    totalAmount: 385600,
    recipientsCount: 11,
    directSmzCount: 8,
    trustedSmzCount: 3,
    createdAt: "5 ноя 2025, 08:00",
    sentAt: "7 ноя 2025, 15:30",
    exportId: "EXP-20251105-001",
    accrued: 32000,
    npd: 1600,
    toPay: 33600,
    payees: [],
  },
];

export function Registers() {
  const [selectedRegisterId, setSelectedRegisterId] = useState("1");
  const [expandedPayees, setExpandedPayees] = useState<Record<string, boolean>>({});
  const [expandedWorkers, setExpandedWorkers] = useState<Record<string, boolean>>({});
  const [expandedValidations, setExpandedValidations] = useState<Record<string, boolean>>({});
  const [dateFilter, setDateFilter] = useState("Текущая неделя");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const selectedRegistry = mockRegisters.find((r) => r.id === selectedRegisterId);

  // Split registers into active and archive
  const activeRegisters = mockRegisters.filter((r) => r.status !== "processed");
  const archiveRegisters = mockRegisters.filter((r) => r.status === "processed");

  const togglePayeeExpand = (payeeId: string) => {
    setExpandedPayees((prev) => ({ ...prev, [payeeId]: !prev[payeeId] }));
  };

  const toggleWorkerExpand = (workerId: string) => {
    setExpandedWorkers((prev) => ({ ...prev, [workerId]: !prev[workerId] }));
  };

  const getStatusConfig = (status: RegisterStatus) => {
    switch (status) {
      case "draft":
        return { label: "Черновик", className: "bg-gray-100 text-gray-600 border-gray-200" };
      case "review":
        return { label: "На проверке", className: "bg-yellow-100 text-yellow-700 border-yellow-200" };
      case "ready":
        return { label: "Готов к отправке", className: "bg-green-100 text-green-700 border-green-200" };
      case "uploaded":
        return { label: "Загружен в банк", className: "bg-purple-100 text-purple-700 border-purple-200" };
      case "sent":
        return { label: "Отправлен", className: "bg-blue-100 text-blue-700 border-blue-200" };
      case "processed":
        return { label: "Проведён", className: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const getTimeCategoryConfig = (category: string | null) => {
    if (!category) return null;
    
    switch (category) {
      case "Дневной":
        return { label: "Дневной", className: "bg-blue-100 text-blue-700" };
      case "Вечерний":
        return { label: "Вечерний", className: "bg-purple-100 text-purple-700" };
      case "Ночной":
        return { label: "Ночной", className: "bg-indigo-100 text-indigo-700" };
      case "Утренний":
        return { label: "Утренний", className: "bg-teal-100 text-teal-700" };
    }
  };

  const getPayeeTypeLabel = (type: PayeeType) => {
    switch (type) {
      case "self-employed":
        return "Самозанятый";
      case "trusted-smz":
        return "Доверенный СМЗ";
    }
  };

  const getNPDStatusConfig = (status: NPDStatus) => {
    switch (status) {
      case "active":
        return { label: "НПД активен", className: "bg-green-100 text-green-700" };
      case "pending-confirmation":
        return {
          label: "Требует подтверждения",
          className: "bg-yellow-100 text-yellow-700",
        };
      case "inactive":
        return { label: "НПД неактивен", className: "bg-red-100 text-red-700" };
    }
  };

  const formatAmount = (amount: number) => {
    return `₽${amount.toLocaleString("ru-RU")}`;
  };

  const getTotalCorrections = (corrections: Correction[]) => {
    return corrections.reduce((sum, c) => sum + c.amount, 0);
  };

  const isEditable = (status: RegisterStatus) => {
    return status === "draft" || status === "review";
  };

  const getRegistryQualityScore = (registry: Register) => {
    // Mock calculation - in real app would check actual validations
    let score = 100;
    
    // Deduct points for warnings (mock logic)
    const hasRequisitesWarning = true; // Would check actual data
    const hasSmzLoadWarning = true;
    
    if (hasRequisitesWarning) score -= 5;
    if (hasSmzLoadWarning) score -= 3;
    
    // Example: registry "2" has lower score
    if (registry.id === "2") {
      score = 68; // Medium quality
    }
    
    return score;
  };

  const hasBlockingErrors = (registry: Register) => {
    // Check for red/blocking errors
    // In real app would validate against actual data
    // Example: registry "3" would have blocking errors
    return registry.id === "3"; // Demo: no blocking errors for current registries
  };

  const renderRegisterCard = (registry: Register) => {
    const statusConfig = getStatusConfig(registry.status);
    const timeCategory = getTimeCategory(registry.sentAt);
    const timeCategoryConfig = getTimeCategoryConfig(timeCategory);
    const isSelected = selectedRegisterId === registry.id;

    return (
      <button
        key={registry.id}
        onClick={() => setSelectedRegisterId(registry.id)}
        className={cn(
          "w-full text-left p-3 rounded-lg border transition-all",
          isSelected
            ? "bg-blue-50 border-blue-300 shadow-sm"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
        )}
      >
        {/* Title Row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gray-900">
              {registry.registryId}
            </span>
            {timeCategoryConfig && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium",
                  timeCategoryConfig.className
                )}
              >
                {timeCategoryConfig.label}
              </span>
            )}
          </div>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border",
              statusConfig.className
            )}
          >
            {(registry.status === "sent" || registry.status === "processed") && (
              <CheckCircle2 className="w-3 h-3" />
            )}
            {registry.status === "processed" && (
              <span className="text-[9px]">1С</span>
            )}
            {statusConfig.label}
          </span>
        </div>

        {/* Period */}
        <div className="text-[11px] text-gray-600 mb-2">{registry.period}</div>

        {/* Key Summary */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
            <Users className="w-3 h-3" />
            {registry.recipientsCount}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
            <DollarSign className="w-3 h-3" />
            {formatAmount(registry.toPay)}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
            НПД: {formatAmount(registry.npd)}
          </span>
        </div>

        {/* Timestamps */}
        <div className="text-[10px] text-gray-500">
          Создан: {registry.createdAt}
        </div>
      </button>
    );
  };

  return (
    <div className="flex gap-4">
      {/* Left Column - Registry List */}
      <div className="w-[380px] flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filters Row */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {/* Date Range Filter */}
              <div className="flex-1 min-w-[120px]">
                <label className="block text-[10px] text-gray-600 mb-1">Период</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option>Сегодня</option>
                    <option>Вчера</option>
                    <option>Текущая неделя</option>
                    <option>Текущий месяц</option>
                    <option>Произвольный период</option>
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1 min-w-[120px]">
                <label className="block text-[10px] text-gray-600 mb-1">Статус</label>
                <div className="relative">
                  <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <select
                    className="w-full pl-7 pr-2 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option>Все статусы</option>
                    <option>Черновик</option>
                    <option>На проверке</option>
                    <option>Готов к отправке</option>
                    <option>Загружен в банк</option>
                    <option>Отправлен</option>
                    <option>Проведён</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Registers */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-[13px] font-medium text-gray-900">Активные реестры</h3>
          </div>

          <div className="p-3 space-y-2">
            {activeRegisters.map((registry) => renderRegisterCard(registry))}
          </div>

          {/* Archive */}
          {archiveRegisters.length > 0 && (
            <>
              <div className="px-4 py-3 border-t border-b border-gray-200 bg-gray-50">
                <h3 className="text-[13px] font-medium text-gray-900">Архив</h3>
              </div>

              <div className="p-3 space-y-2">
                {archiveRegisters.map((registry) => renderRegisterCard(registry))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column - Registry Details */}
      <div className="flex-1 space-y-4">
        {selectedRegistry && (
          <>
            {/* Action Buttons & Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-center">
                {/* Status Chips */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 border",
                      getStatusConfig(selectedRegistry.status).className
                    )}
                  >
                    {(selectedRegistry.status === "sent" ||
                      selectedRegistry.status === "processed") && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {getStatusConfig(selectedRegistry.status).label}
                  </span>
                  
                  {/* Key Summary */}
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-gray-100 text-gray-600">
                    <Users className="w-3.5 h-3.5" />
                    {selectedRegistry.recipientsCount} получателей
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-gray-100 text-gray-600">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatAmount(selectedRegistry.toPay)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-gray-100 text-gray-600">
                    НПД: {formatAmount(selectedRegistry.npd)}
                  </span>
                  
                  {selectedRegistry.exportId && (
                    <span className="px-3 py-1 rounded text-[11px] bg-gray-100 text-gray-600">
                      ID выгрузки {selectedRegistry.exportId}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {selectedRegistry.status === "draft" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-[13px] h-8">
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Редактировать
                      </Button>
                      <Button size="sm" className="text-[13px] h-8">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Отправить на проверку
                      </Button>
                    </>
                  )}
                  {selectedRegistry.status === "review" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-[13px] h-8">
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        Вернуть в черновик
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-[13px] h-8"
                        disabled={hasBlockingErrors(selectedRegistry)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Утвердить реестр
                      </Button>
                    </>
                  )}
                  {selectedRegistry.status === "ready" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-[13px] h-8">
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Редактировать
                      </Button>
                      <Button size="sm" className="text-[13px] h-8">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Экспорт в банк
                      </Button>
                    </>
                  )}
                  {selectedRegistry.status === "uploaded" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-[13px] h-8">
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Открыть файл выгрузки
                      </Button>
                      <Button size="sm" className="text-[13px] h-8">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Отметить как отправлен
                      </Button>
                    </>
                  )}
                  {selectedRegistry.status === "sent" && (
                    <Button size="sm" className="text-[13px] h-8">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Отметить как проведён в 1С
                    </Button>
                  )}
                  {selectedRegistry.status === "processed" && (
                    <Button variant="ghost" size="sm" className="text-[13px] h-8">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Открыть в 1С
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Payees Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-[13px] font-medium text-gray-900">
                  Получатели (банковская структура)
                </h3>
              </div>

              {/* Payees List */}
              <div className="divide-y divide-gray-200">
                {selectedRegistry.payees.map((payee) => {
                  const isExpanded = expandedPayees[payee.id];
                  const totalCorrections = getTotalCorrections(payee.corrections);
                  const editable = isEditable(selectedRegistry.status);

                  return (
                    <div key={payee.id}>
                      {/* Payee Row - Clickable */}
                      <div 
                        onClick={() => togglePayeeExpand(payee.id)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar & Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[13px] font-semibold text-blue-700 flex-shrink-0">
                                {payee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>

                              {/* Name & Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-[13px] font-medium text-gray-900">
                                    {payee.name}
                                  </div>
                                  {/* NPD Status - Moved here */}
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap",
                                      getNPDStatusConfig(payee.npdStatus).className
                                    )}
                                  >
                                    {getNPDStatusConfig(payee.npdStatus).label}
                                  </span>
                                </div>

                                {/* Bank Details */}
                                <div className="flex items-center gap-2 mb-1">
                                  <BankIcon bank={payee.bank} />
                                  <span className="text-[11px] text-gray-600">
                                    {payee.accountMask}
                                  </span>
                                </div>

                                {/* Payee Type */}
                                <div className="mb-2">
                                  <span
                                    className={cn(
                                      "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                                      payee.type === "self-employed" &&
                                        "bg-blue-50 text-blue-700",
                                      payee.type === "trusted-smz" &&
                                        "bg-purple-50 text-purple-700"
                                    )}
                                  >
                                    {getPayeeTypeLabel(payee.type)}
                                  </span>
                                </div>

                                {/* Payment Description */}
                                <div className="flex items-center gap-2 group">
                                  <p className="text-[11px] text-gray-600 flex-1">
                                    {payee.paymentDescription}
                                  </p>
                                  {editable && (
                                    <button 
                                      onClick={(e) => e.stopPropagation()}
                                      className="opacity-0 group-hover:opacity-100 text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      Редактировать
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Amount Columns */}
                          <div className="flex items-center gap-6">
                            {/* Corrections */}
                            <div className="text-right">
                              <div className="text-[10px] text-gray-500 mb-1">Корректировки</div>
                              <div
                                className={cn(
                                  "text-[13px] font-semibold",
                                  totalCorrections > 0
                                    ? "text-green-600"
                                    : totalCorrections < 0
                                    ? "text-red-600"
                                    : "text-gray-400"
                                )}
                              >
                                {totalCorrections === 0
                                  ? "—"
                                  : totalCorrections > 0
                                  ? `+${totalCorrections} ₽`
                                  : `${totalCorrections} ₽`}
                              </div>
                            </div>

                            {/* Accrued */}
                            <div className="text-right">
                              <div className="text-[10px] text-gray-500 mb-1">Начислено</div>
                              <div className="text-[13px] font-semibold text-gray-900">
                                {payee.accrued.toLocaleString("ru-RU")} ₽
                              </div>
                            </div>

                            {/* To Pay */}
                            <div className="text-right">
                              <div className="text-[10px] text-gray-500 mb-1">К выплате</div>
                              <div className="text-[13px] font-semibold text-blue-600">
                                {payee.toPay.toLocaleString("ru-RU")} ₽
                              </div>
                            </div>

                            {/* More Menu */}
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 bg-gray-50">
                          {/* Self-employed shifts */}
                          {payee.type === "self-employed" && payee.shifts.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-[12px] font-medium text-gray-900">
                                  Детали смен ({payee.shifts.length})
                                </h4>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {payee.shifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className={cn(
                                      "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border",
                                      shift.approvalStatus === "approved" &&
                                        "bg-green-50 border-green-200 text-green-800",
                                      shift.approvalStatus === "waiting" &&
                                        "bg-yellow-50 border-yellow-200 text-yellow-800",
                                      shift.approvalStatus === "mismatch" &&
                                        "bg-red-50 border-red-200 text-red-800"
                                    )}
                                  >
                                    <span>
                                      {shift.date} · {shift.object} · {shift.role} · {shift.hours}ч ·{" "}
                                      {shift.amount.toLocaleString("ru-RU")} ₽
                                      {shift.count > 1 && ` × ${shift.count}`}
                                    </span>
                                    {editable && (
                                      <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700">
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Trusted SMZ shifts */}
                          {payee.type === "trusted-smz" && payee.shifts.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-[12px] font-medium text-gray-900">
                                  Смены доверенного ({payee.shifts.length})
                                </h4>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {payee.shifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className={cn(
                                      "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border",
                                      shift.approvalStatus === "approved" &&
                                        "bg-green-50 border-green-200 text-green-800",
                                      shift.approvalStatus === "waiting" &&
                                        "bg-yellow-50 border-yellow-200 text-yellow-800",
                                      shift.approvalStatus === "mismatch" &&
                                        "bg-red-50 border-red-200 text-red-800"
                                    )}
                                  >
                                    <span>
                                      {shift.date} · {shift.object} · {shift.role} · {shift.hours}ч ·{" "}
                                      {shift.amount.toLocaleString("ru-RU")} ₽
                                    </span>
                                    {editable && (
                                      <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700">
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Workers (for trusted SMZ) */}
                          {payee.type === "trusted-smz" && payee.workers && payee.workers.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-[12px] font-medium text-gray-900">
                                  Исполнители ({payee.workers.length})
                                </h4>
                              </div>

                              <div className="space-y-2">
                                {payee.workers.map((worker) => {
                                  const isWorkerExpanded = expandedWorkers[worker.id];
                                  const workerCorrections = getTotalCorrections(worker.corrections);

                                  return (
                                    <div
                                      key={worker.id}
                                      className="bg-white rounded-lg border border-gray-200 p-3"
                                    >
                                      <div 
                                        onClick={() => toggleWorkerExpand(worker.id)}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -m-3 p-3 rounded-lg transition-colors"
                                      >
                                        {/* Worker Avatar */}
                                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-700 flex-shrink-0">
                                          {worker.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                        </div>

                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[12px] font-medium text-gray-900">
                                              {worker.name}
                                            </span>
                                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-gray-100 text-gray-600">
                                              Исполнитель
                                            </span>
                                          </div>
                                          {/* Worker Bank Info */}
                                          <div className="flex items-center gap-1.5">
                                            <BankIcon bank={worker.bank} />
                                            <span className="text-[10px] text-gray-600">
                                              {worker.accountMask}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                          <div className="text-right">
                                            <div className="text-[9px] text-gray-500">Начислено</div>
                                            <div className="text-[11px] font-semibold text-gray-900">
                                              {worker.accrued.toLocaleString("ru-RU")} ₽
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-[9px] text-gray-500">К выплате</div>
                                            <div className="text-[11px] font-semibold text-blue-600">
                                              {worker.toPay.toLocaleString("ru-RU")} ₽
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Worker expanded details */}
                                      {isWorkerExpanded && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          {/* Worker shifts */}
                                          <div className="mb-3">
                                            <div className="text-[11px] font-medium text-gray-700 mb-2">
                                              Смены ({worker.shifts.length})
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {worker.shifts.map((shift) => (
                                                <div
                                                  key={shift.id}
                                                  className={cn(
                                                    "group relative flex items-center gap-2 px-2.5 py-1 rounded text-[10px] border",
                                                    shift.approvalStatus === "approved" &&
                                                      "bg-green-50 border-green-200 text-green-800",
                                                    shift.approvalStatus === "waiting" &&
                                                      "bg-yellow-50 border-yellow-200 text-yellow-800",
                                                    shift.approvalStatus === "mismatch" &&
                                                      "bg-red-50 border-red-200 text-red-800"
                                                  )}
                                                >
                                                  <span>
                                                    {shift.date} · {shift.object} · {shift.role} ·{" "}
                                                    {shift.hours}ч ·{" "}
                                                    {shift.amount.toLocaleString("ru-RU")} ₽
                                                  </span>
                                                  {editable && (
                                                    <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700">
                                                      <X className="w-2.5 h-2.5" />
                                                    </button>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Worker corrections */}
                                          {worker.corrections.length > 0 && (
                                            <div>
                                              <div className="text-[11px] font-medium text-gray-700 mb-2">
                                                Корректировки
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {worker.corrections.map((correction) => (
                                                  <div
                                                    key={correction.id}
                                                    className={cn(
                                                      "group relative flex items-center gap-2 px-2.5 py-1 rounded text-[10px] border",
                                                      correction.type === "bonus" &&
                                                        "bg-green-50 border-green-200 text-green-800",
                                                      correction.type === "penalty" &&
                                                        "bg-red-50 border-red-200 text-red-800",
                                                      correction.type === "deduction" &&
                                                        "bg-orange-50 border-orange-200 text-orange-800"
                                                    )}
                                                  >
                                                    <span>
                                                      {correction.description}{" "}
                                                      {correction.amount > 0 ? "+" : ""}
                                                      {correction.amount} ₽
                                                    </span>
                                                    {editable && (
                                                      <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700">
                                                        <X className="w-2.5 h-2.5" />
                                                      </button>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Payee Corrections */}
                          {payee.corrections.length > 0 && (
                            <div>
                              <h4 className="text-[12px] font-medium text-gray-900 mb-2">
                                Корректировки
                              </h4>
                              <div className="flex flex-wrap gap-2 items-center">
                                {payee.corrections.map((correction) => (
                                  <div
                                    key={correction.id}
                                    className={cn(
                                      "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] border",
                                      correction.type === "bonus" &&
                                        "bg-green-50 border-green-200 text-green-800",
                                      correction.type === "penalty" &&
                                        "bg-red-50 border-red-200 text-red-800",
                                      correction.type === "deduction" &&
                                        "bg-orange-50 border-orange-200 text-orange-800"
                                    )}
                                  >
                                    <span>
                                      {correction.description}{" "}
                                      {correction.amount > 0 ? "+" : ""}
                                      {correction.amount} ₽
                                    </span>
                                    {editable && (
                                      <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700">
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {editable && (
                                  <button className="px-3 py-1.5 rounded-lg text-[11px] text-blue-600 hover:bg-blue-50 border border-blue-200 border-dashed">
                                    + Добавить корректировку
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Block - Moved to bottom, only visible when status = "review" */}
            {selectedRegistry.status === "review" && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-4">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-medium text-gray-900">
                      Проверка реестра
                    </h3>
                    {/* Quality Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">Оценка надежности:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              getRegistryQualityScore(selectedRegistry) >= 90 
                                ? "bg-green-500"
                                : getRegistryQualityScore(selectedRegistry) >= 70
                                ? "bg-orange-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${getRegistryQualityScore(selectedRegistry)}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-[11px] font-semibold",
                          getRegistryQualityScore(selectedRegistry) >= 90 
                            ? "text-green-600"
                            : getRegistryQualityScore(selectedRegistry) >= 70
                            ? "text-orange-600"
                            : "text-red-600"
                        )}>
                          {getRegistryQualityScore(selectedRegistry)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {/* 1. Реквизиты выплат */}
                    <div 
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => setExpandedValidations(prev => ({ ...prev, requisites: !prev.requisites }))}
                    >
                      <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                        <div className="flex items-center gap-2.5 flex-1">
                          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-[12px] font-medium text-gray-900">Реквизиты выплат</span>
                          <span className="text-[11px] text-orange-600">2 предупреждения</span>
                        </div>
                        {expandedValidations.requisites ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      {expandedValidations.requisites && (
                        <div className="px-3 pb-3 pt-1 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-2 text-[11px]">
                            <div className="flex items-start gap-2 p-2 bg-white rounded">
                              <span className="text-gray-700 flex-1">Несколько исполнителей получают на одни реквизиты: ••••4421</span>
                              <span className="text-gray-500">3 чел.</span>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded">
                              <span className="text-gray-700 flex-1">Исполнитель сменил реквизиты: Козлов В.И.</span>
                              <span className="text-gray-500">••••7120 → ••••8932</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Статус НПД */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-[12px] font-medium text-gray-900">Статус НПД</span>
                        <span className="text-[11px] text-green-600">16 из 16 активны</span>
                      </div>
                    </div>

                    {/* 3. Нагрузка доверенных СМЗ */}
                    <div 
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => setExpandedValidations(prev => ({ ...prev, smzLoad: !prev.smzLoad }))}
                    >
                      <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                        <div className="flex items-center gap-2.5 flex-1">
                          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-[12px] font-medium text-gray-900">Нагрузка доверенных СМЗ</span>
                          <span className="text-[11px] text-orange-600">1 повышенная</span>
                        </div>
                        {expandedValidations.smzLoad ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      {expandedValidations.smzLoad && (
                        <div className="px-3 pb-3 pt-1 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-2 text-[11px]">
                            <div className="flex items-center gap-2 p-2 bg-white rounded">
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                              <span className="flex-1 text-gray-700">СМЗ Иванова Л.К.</span>
                              <span className="text-gray-500">2 получателя</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                              <span className="flex-1 text-gray-700">СМЗ Петров М.С.</span>
                              <span className="text-orange-600 font-medium">4 получателя</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Аномалии начислений */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-[12px] font-medium text-gray-900">Аномалии начислений</span>
                        <span className="text-[11px] text-green-600">Не обнаружено</span>
                      </div>
                    </div>

                    {/* 5. Логика смен */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-[12px] font-medium text-gray-900">Логика смен</span>
                        <span className="text-[11px] text-green-600">Корректно</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {hasBlockingErrors(selectedRegistry) ? (
                      <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-[11px] font-medium text-red-900 mb-0.5">Обнаружены критические ошибки</div>
                          <div className="text-[10px] text-red-700">Реестр не может быть утверждён до устранения красных предупреждений</div>
                        </div>
                      </div>
                    ) : getRegistryQualityScore(selectedRegistry) < 90 ? (
                      <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-[11px] font-medium text-orange-900 mb-0.5">Обнаружены предупреждения</div>
                          <div className="text-[10px] text-orange-700">Рекомендуется проверить перед отправкой в банк</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-[11px] font-medium text-green-900 mb-0.5">Реестр готов к утверждению</div>
                          <div className="text-[10px] text-green-700">Все проверки пройдены успешно</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
