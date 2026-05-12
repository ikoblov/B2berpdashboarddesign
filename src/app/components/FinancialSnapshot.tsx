import { TrendingUp, TrendingDown, DollarSign, ChevronDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function FinancialSnapshot() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 mb-1">Финансовая сводка</h3>
          <p className="text-sm text-gray-500">Обзор за месяц</p>
        </div>
        <Select defaultValue="this-month">
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">Этот месяц</SelectItem>
            <SelectItem value="last-month">Прошлый месяц</SelectItem>
            <SelectItem value="this-quarter">Этот квартал</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-700">Доходы</span>
          </div>
          <div className="text-2xl text-gray-900 mb-1">$284,500</div>
          <div className="text-xs text-green-600">+12% от прошлого месяца</div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-700">Расходы</span>
          </div>
          <div className="text-2xl text-gray-900 mb-1">$156,200</div>
          <div className="text-xs text-red-600">+8% от прошлого месяца</div>
        </div>
      </div>

      {/* Net Profit */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Чистая прибыль</span>
          <DollarSign className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl text-gray-900 mb-1">$128,300</div>
        <div className="text-xs text-blue-600">Маржа: 45.1%</div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-3">Структура расходов</div>
        {[
          { category: "Выплаты", amount: "$98,400", percentage: 63, color: "bg-blue-500" },
          { category: "Операционные", amount: "$32,100", percentage: 21, color: "bg-purple-500" },
          { category: "Прочее", amount: "$25,700", percentage: 16, color: "bg-gray-400" },
        ].map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-600">{item.category}</span>
              <span className="text-xs text-gray-900">{item.amount}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}