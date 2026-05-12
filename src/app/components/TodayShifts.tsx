import { Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";
import { Progress } from "./ui/progress";

interface ShiftStatus {
  status: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const shiftsData: ShiftStatus[] = [
  { 
    status: "Назначена", 
    count: 23, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50",
    icon: <Circle className="w-4 h-4" />
  },
  { 
    status: "Подтверждена", 
    count: 45, 
    color: "text-green-600", 
    bgColor: "bg-green-50",
    icon: <CheckCircle className="w-4 h-4" />
  },
  { 
    status: "Опоздание", 
    count: 8, 
    color: "text-red-600", 
    bgColor: "bg-red-50",
    icon: <AlertCircle className="w-4 h-4" />
  },
  { 
    status: "Завершена", 
    count: 13, 
    color: "text-gray-600", 
    bgColor: "bg-gray-50",
    icon: <Clock className="w-4 h-4" />
  },
];

const totalShifts = shiftsData.reduce((sum, item) => sum + item.count, 0);

export function TodayShifts() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 mb-1">Смены сегодня</h3>
          <p className="text-sm text-gray-500">Обзор всех смен по статусам</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-200">
          {totalShifts} Всего
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
          {shiftsData.map((shift, index) => (
            <div
              key={index}
              className={shift.bgColor.replace('50', '400')}
              style={{ width: `${(shift.count / totalShifts) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        {shiftsData.map((shift, index) => (
          <div
            key={index}
            className={`${shift.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={shift.color}>{shift.icon}</span>
              <span className="text-sm text-gray-700">{shift.status}</span>
            </div>
            <div className="text-2xl text-gray-900">{shift.count}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((shift.count / totalShifts) * 100).toFixed(0)}% от общего
            </div>
          </div>
        ))}
      </div>

      {/* Recent Shifts */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-4">Последние обновления</div>
        <div className="space-y-3">
          {[
            { site: "Стройплощадка А", worker: "Иван Иванов", time: "2 мин назад", status: "подтверждена" },
            { site: "Стройплощадка Б", worker: "Пётр Петров", time: "5 мин назад", status: "опоздание" },
            { site: "Стройплощадка В", worker: "Сергей Сидоров", time: "12 мин назад", status: "назначена" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="text-sm text-gray-900">{item.worker}</div>
                <div className="text-xs text-gray-500">{item.site}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{item.time}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'подтверждена' ? 'bg-green-50 text-green-700' :
                  item.status === 'опоздание' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}