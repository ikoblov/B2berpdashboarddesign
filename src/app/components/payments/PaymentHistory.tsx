import { Download, FileText, CheckCircle2, ExternalLink, TrendingUp, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface HistoryItem {
  id: string;
  registerNumber: string;
  date: string;
  amount: number;
  workerCount: number;
  exportId: string;
  npdStatus: 'completed' | 'pending' | 'partial';
  xlsxUrl: string;
  bankName: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    registerNumber: '122',
    date: '15 ноября 2025, 16:45',
    amount: 432800,
    workerCount: 14,
    exportId: 'EXP-20251115-001',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Тинькофф',
  },
  {
    id: '2',
    registerNumber: '120',
    date: '8 ноября 2025, 14:30',
    amount: 389500,
    workerCount: 12,
    exportId: 'EXP-20251108-002',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Сбербанк',
  },
  {
    id: '3',
    registerNumber: '119',
    date: '1 ноября 2025, 17:20',
    amount: 456200,
    workerCount: 15,
    exportId: 'EXP-20251101-001',
    npdStatus: 'partial',
    xlsxUrl: '#',
    bankName: 'Тинькофф',
  },
  {
    id: '4',
    registerNumber: '118',
    date: '25 октября 2025, 15:10',
    amount: 398700,
    workerCount: 13,
    exportId: 'EXP-20251025-003',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Альфа-Банк',
  },
  {
    id: '5',
    registerNumber: '117',
    date: '18 октября 2025, 16:00',
    amount: 421300,
    workerCount: 14,
    exportId: 'EXP-20251018-001',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Тинькофф',
  },
  {
    id: '6',
    registerNumber: '116',
    date: '11 октября 2025, 14:45',
    amount: 387900,
    workerCount: 11,
    exportId: 'EXP-20251011-002',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Сбербанк',
  },
  {
    id: '7',
    registerNumber: '115',
    date: '4 октября 2025, 12:30',
    amount: 445600,
    workerCount: 16,
    exportId: 'EXP-20251004-001',
    npdStatus: 'completed',
    xlsxUrl: '#',
    bankName: 'Тинькофф',
  },
];

export function PaymentHistory() {
  const getNpdStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершён';
      case 'pending': return 'В обработке';
      case 'partial': return 'Частично';
      default: return status;
    }
  };

  const getNpdStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'partial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalAmount = mockHistory.reduce((sum, item) => sum + item.amount, 0);
  const totalWorkers = mockHistory.reduce((sum, item) => sum + item.workerCount, 0);
  const completedCount = mockHistory.filter(item => item.npdStatus === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Всего выплат</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-gray-900">{mockHistory.length}</span>
            <span className="text-sm text-gray-500">реестров</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Общая сумма</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl text-gray-900">
            ₽{totalAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Исполнителей</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl text-gray-900">
            {totalWorkers}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Завершено</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-green-600">{completedCount}</span>
            <span className="text-sm text-gray-500">из {mockHistory.length}</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900 mb-1">История выплат</h3>
          <p className="text-sm text-gray-600">Архив всех экспортированных реестров</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-5 text-sm text-gray-600">Реестр</th>
                <th className="text-left py-4 px-5 text-sm text-gray-600">Дата выгрузки</th>
                <th className="text-right py-4 px-5 text-sm text-gray-600">Сумма</th>
                <th className="text-center py-4 px-5 text-sm text-gray-600">Исполнителей</th>
                <th className="text-left py-4 px-5 text-sm text-gray-600">ID экспорта</th>
                <th className="text-left py-4 px-5 text-sm text-gray-600">Банк</th>
                <th className="text-left py-4 px-5 text-sm text-gray-600">Статус НПД</th>
                <th className="text-center py-4 px-5 text-sm text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    index === 0 && "bg-blue-50/30"
                  )}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-900">№{item.registerNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-900">
                    {item.date}
                  </td>
                  <td className="py-4 px-5 text-right text-sm text-gray-900">
                    ₽{item.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-900 text-sm">
                      {item.workerCount}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <code className="text-xs bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-700 border border-gray-200">
                      {item.exportId}
                    </code>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm text-gray-900">{item.bankName}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border",
                      getNpdStatusColor(item.npdStatus)
                    )}>
                      {item.npdStatus === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {getNpdStatusLabel(item.npdStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Скачать XLSX"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Открыть детали"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-600">
            Показано {mockHistory.length} из {mockHistory.length} записей
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="shadow-sm">
              Предыдущая
            </Button>
            <Button variant="outline" size="sm" disabled className="shadow-sm">
              Следующая
            </Button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-900 mb-2">Экспорт данных</h3>
            <p className="text-sm text-gray-600">Скачайте сводный отчёт по всем выплатам за период</p>
          </div>
          <Button variant="outline" className="bg-white shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Скачать сводный XLSX
          </Button>
        </div>
      </div>
    </div>
  );
}