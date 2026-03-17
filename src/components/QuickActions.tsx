import { Plus, FileText, UserPlus, ClipboardList, Clock } from "lucide-react";
import { Button } from "./ui/button";

const actions = [
  {
    title: "Создать заявку",
    description: "Новая заявка на сотрудника",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Добавить сотрудника",
    description: "Регистрация нового сотрудника",
    icon: <UserPlus className="w-5 h-5" />,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Создать заказ-наряд",
    description: "Новый заказ-наряд",
    icon: <ClipboardList className="w-5 h-5" />,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 mb-1">Быстрые действия</h3>
      <p className="text-sm text-gray-500 mb-6">Часто используемые операции</p>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all group"
          >
            <div className={`${action.color} text-white p-3 rounded-lg transition-transform group-hover:scale-110`}>
              {action.icon}
            </div>
            <div className="text-left flex-1">
              <div className="text-sm text-gray-900">{action.title}</div>
              <div className="text-xs text-gray-500">{action.description}</div>
            </div>
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        ))}
      </div>

      {/* Additional Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-3">Дополнительно</div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Запланировать смену
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Создать отчёт
          </Button>
        </div>
      </div>
    </div>
  );
}