import { Users, TrendingUp, AlertCircle, AlertTriangle, RefreshCw, FileText, MoreVertical } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

type NPDStatus = "active" | "pending-confirmation" | "inactive";
type ReceiptsStatus = "all" | "errors" | "partial" | "none";

interface TrustedDistributor {
  id: string;
  name: string;
  internalId: string;
  npdStatus: NPDStatus;
  dependents: number;
  paymentMethod: {
    bank: "tinkoff" | "sber" | "alfa" | "vtb";
    type: "phone" | "card";
    value: string;
  };
  weeklyLoad: number;
  receipts: ReceiptsStatus;
  risks: {
    overload?: boolean;
    receiptsError?: boolean;
    detailsChanged?: boolean;
    npdConfirmation?: boolean;
  };
}

// Bank icon component
function BankIcon({ bank }: { bank: string }) {
  const icons: Record<string, React.ReactNode> = {
    tinkoff: (
      <div className="w-5 h-5 rounded bg-yellow-400 flex items-center justify-center">
        <span className="text-[9px] font-bold text-black">Т</span>
      </div>
    ),
    sber: (
      <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center">
        <span className="text-[9px] font-bold text-white">С</span>
      </div>
    ),
    alfa: (
      <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
        <span className="text-[9px] font-bold text-white">А</span>
      </div>
    ),
    vtb: (
      <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
        <span className="text-[9px] font-bold text-white">В</span>
      </div>
    ),
  };

  return icons[bank] || icons.tinkoff;
}

// NPD Status Badge
function NPDStatusBadge({ status }: { status: NPDStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 border border-green-200 text-green-700">
        НПД активен
      </span>
    );
  }
  if (status === "pending-confirmation") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-50 border border-yellow-200 text-yellow-700">
        Требует подтверждения
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 border border-red-200 text-red-700">
      НПД неактивен
    </span>
  );
}

// Receipts Status Badge
function ReceiptsStatusBadge({ status }: { status: ReceiptsStatus }) {
  const configs = {
    all: {
      label: "Все загружены",
      className: "bg-green-50 border-green-200 text-green-700",
    },
    errors: {
      label: "Есть ошибки",
      className: "bg-red-50 border-red-200 text-red-700",
    },
    partial: {
      label: "Частично",
      className: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    none: {
      label: "Нет квитанций",
      className: "bg-gray-100 border-gray-300 text-gray-600",
    },
  };

  const config = configs[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

// Dependents count badge with color coding
function DependentsCountBadge({ count }: { count: number }) {
  let bgColor = "bg-green-100 text-green-800 border-green-300";
  
  if (count >= 6) {
    bgColor = "bg-red-100 text-red-800 border-red-300";
  } else if (count >= 3) {
    bgColor = "bg-orange-100 text-orange-800 border-orange-300";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold border",
        bgColor
      )}
    >
      {count}
    </span>
  );
}

// Get weekly load color
function getWeeklyLoadColor(amount: number) {
  if (amount >= 200000) {
    return "text-red-600";
  } else if (amount >= 100001) {
    return "text-orange-600";
  }
  return "text-green-600";
}

// Risk icons component
function RiskIcons({ risks }: { risks: TrustedDistributor['risks'] }) {
  return (
    <div className="flex items-center gap-1.5 ml-2">
      {risks.overload && (
        <AlertCircle className="w-3.5 h-3.5 text-yellow-600" title="Превышение нагрузки" />
      )}
      {risks.receiptsError && (
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" title="Ошибки квитанций" />
      )}
      {risks.detailsChanged && (
        <RefreshCw className="w-3.5 h-3.5 text-blue-600" title="Изменения реквизитов" />
      )}
      {risks.npdConfirmation && (
        <FileText className="w-3.5 h-3.5 text-yellow-600" title="Требуется подтверждение НПД" />
      )}
    </div>
  );
}

// Check if row has any risks
function hasRisks(distributor: TrustedDistributor) {
  return distributor.risks.overload || 
         distributor.risks.receiptsError || 
         distributor.risks.detailsChanged || 
         distributor.risks.npdConfirmation;
}

// Get row background color based on risks
function getRowBackground(distributor: TrustedDistributor) {
  if (distributor.risks.receiptsError) {
    return "bg-red-50/50";
  }
  if (hasRisks(distributor)) {
    return "bg-yellow-50/40";
  }
  return "";
}

export default function TrustedSMZ() {
  const formatAmount = (amount: number) => {
    return `₽${amount.toLocaleString("ru-RU")}`;
  };

  // Mock data
  const distributors: TrustedDistributor[] = [
    {
      id: "1",
      name: "Козлов Андрей Викторович",
      internalId: "W-08765",
      npdStatus: "active",
      dependents: 2,
      paymentMethod: {
        bank: "sber",
        type: "phone",
        value: "+7 916 234-56-78",
      },
      weeklyLoad: 142500,
      receipts: "all",
      risks: {},
    },
    {
      id: "2",
      name: "Смирнова Татьяна Петровна",
      internalId: "W-08543",
      npdStatus: "active",
      dependents: 5,
      paymentMethod: {
        bank: "tinkoff",
        type: "card",
        value: "Карта •••• 4521",
      },
      weeklyLoad: 186300,
      receipts: "errors",
      risks: {
        overload: true,
        receiptsError: true,
      },
    },
    {
      id: "3",
      name: "Петров Михаил Сергеевич",
      internalId: "W-08234",
      npdStatus: "active",
      dependents: 3,
      paymentMethod: {
        bank: "vtb",
        type: "phone",
        value: "+7 925 345-67-89",
      },
      weeklyLoad: 89400,
      receipts: "all",
      risks: {},
    },
    {
      id: "4",
      name: "Васильева Ольга Ивановна",
      internalId: "W-08123",
      npdStatus: "pending-confirmation",
      dependents: 1,
      paymentMethod: {
        bank: "alfa",
        type: "card",
        value: "Карта •••• 8832",
      },
      weeklyLoad: 156700,
      receipts: "partial",
      risks: {
        npdConfirmation: true,
      },
    },
    {
      id: "5",
      name: "Николаев Дмитрий Александрович",
      internalId: "W-08567",
      npdStatus: "active",
      dependents: 7,
      paymentMethod: {
        bank: "sber",
        type: "card",
        value: "Карта •••• 9234",
      },
      weeklyLoad: 215000,
      receipts: "all",
      risks: {
        overload: true,
      },
    },
    {
      id: "6",
      name: "Федорова Елена Викторовна",
      internalId: "W-08456",
      npdStatus: "active",
      dependents: 1,
      paymentMethod: {
        bank: "tinkoff",
        type: "phone",
        value: "+7 903 456-78-90",
      },
      weeklyLoad: 78500,
      receipts: "all",
      risks: {
        detailsChanged: true,
      },
    },
  ];

  const totalDistributors = distributors.length;
  const activeDistributors = distributors.filter(d => d.npdStatus === "active").length;
  const needsAttention = distributors.filter(d => 
    d.npdStatus !== "active" || d.receipts === "errors" || hasRisks(d)
  ).length;
  const totalWeeklyLoad = distributors.reduce((sum, d) => sum + d.weeklyLoad, 0);

  return (
    <div className="flex-1 min-w-0">
      {/* Summary Metrics - 4 cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="h-12 bg-white rounded-[10px] border border-[#E6E9EE] px-3 flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#6A6E75]">
            Всего доверенных
          </div>
          <div className="text-[15px] font-semibold text-[#1A1D21]">
            {totalDistributors}
          </div>
        </div>

        <div className="h-12 bg-white rounded-[10px] border border-[#E6E9EE] px-3 flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#6A6E75]">
            Активных
          </div>
          <div className="text-[15px] font-semibold text-[#1A1D21]">
            {activeDistributors}
          </div>
        </div>

        <div className="h-12 bg-white rounded-[10px] border border-[#E6E9EE] px-3 flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#6A6E75]">
            Требуют внимания
          </div>
          <div className="text-[15px] font-semibold text-[#1A1D21]">
            {needsAttention}
          </div>
        </div>

        <div className="h-12 bg-white rounded-[10px] border border-[#E6E9EE] px-3 flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#6A6E75]">
            Месячная нагрузка
          </div>
          <div className="text-[15px] font-semibold text-[#165DFF]">
            {formatAmount(totalWeeklyLoad)}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-[12px] font-semibold text-gray-900">
            Доверенные самозанятые
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  ФИО
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  Статус НПД
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  Зависимых
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  Способ оплаты
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  Месячная нагрузка
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                  Квитанции
                </th>
                <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide w-12">
                  
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {distributors.map((distributor) => {
                // Get avatar initials
                const initials = distributor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);

                // Generate avatar color based on ID
                const avatarColors = [
                  "from-blue-500 to-blue-600",
                  "from-purple-500 to-purple-600",
                  "from-green-500 to-green-600",
                  "from-orange-500 to-orange-600",
                ];
                const avatarColor = avatarColors[parseInt(distributor.id) % avatarColors.length];

                const bankName =
                  distributor.paymentMethod.bank === "tinkoff"
                    ? "Т-Банк"
                    : distributor.paymentMethod.bank === "sber"
                    ? "Сбербанк"
                    : distributor.paymentMethod.bank === "vtb"
                    ? "ВТБ"
                    : "Альфа-Банк";

                return (
                  <tr
                    key={distributor.id}
                    className={cn(
                      "hover:bg-gray-100/50 transition-colors",
                      getRowBackground(distributor)
                    )}
                  >
                    {/* Распределитель */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0",
                            avatarColor
                          )}
                        >
                          {initials}
                        </div>
                        <div className="flex items-center">
                          <div className="text-[12px] font-semibold text-gray-900">
                            {distributor.name}
                          </div>
                          <RiskIcons risks={distributor.risks} />
                        </div>
                      </div>
                    </td>

                    {/* Статус НПД */}
                    <td className="px-3 py-2">
                      <NPDStatusBadge status={distributor.npdStatus} />
                    </td>

                    {/* Зависимых */}
                    <td className="px-3 py-2">
                      <DependentsCountBadge count={distributor.dependents} />
                    </td>

                    {/* Способ оплаты */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <BankIcon bank={distributor.paymentMethod.bank} />
                        <div>
                          <div className="text-[11px] text-gray-900 font-medium">
                            {distributor.paymentMethod.value}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {bankName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Недельная нагрузка */}
                    <td className="px-3 py-2">
                      <span className={cn(
                        "text-[12px] font-semibold",
                        getWeeklyLoadColor(distributor.weeklyLoad)
                      )}>
                        {formatAmount(distributor.weeklyLoad)}
                      </span>
                    </td>

                    {/* Квитанции */}
                    <td className="px-3 py-2">
                      <ReceiptsStatusBadge status={distributor.receipts} />
                    </td>

                    {/* Actions menu */}
                    <td className="px-3 py-2 text-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-gray-200 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1" align="end">
                          <button className="w-full text-left px-3 py-2 text-[11px] text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            Подробнее
                          </button>
                          <button className="w-full text-left px-3 py-2 text-[11px] text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            Изменить реквизиты
                          </button>
                          <button className="w-full text-left px-3 py-2 text-[11px] text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            История
                          </button>
                          <button className="w-full text-left px-3 py-2 text-[11px] text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            Зависимые
                          </button>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}