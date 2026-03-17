import { CheckCircle, Clock, AlertCircle, Target, TrendingUp, Calendar, Award, Star } from "lucide-react";
import { Button } from "../ui/button";

interface PersonalPerformanceProps {
  period: 'day' | 'week' | 'month';
  onNavigate?: (view: string) => void;
}

export function PersonalPerformance({ period, onNavigate }: PersonalPerformanceProps) {
  return (
    <section className="mb-8">
      <h2 className="text-gray-900 mb-6">Мои показатели</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Мои задачи</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Завершено</span>
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">В процессе</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Просрочено</span>
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">2</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onNavigate?.('tasks')}
          >
            Открыть задачи
          </Button>
        </div>

        {/* My KPI (Gamified) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Мои KPI</h3>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-center justify-center mb-4">
            {/* Circular Progress */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Скорость</span>
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Точность</span>
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Качество данных</span>
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Инициативность</span>
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* My Bonuses */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Мои премии</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="mb-4">
            <div className="text-3xl text-gray-900 mb-1">₽45,200</div>
            <p className="text-sm text-gray-500">За {period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}</p>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">KPI</span>
              <span className="text-gray-900">₽25,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Точность</span>
              <span className="text-gray-900">₽12,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Выполнение задач</span>
              <span className="text-gray-900">₽8,200</span>
            </div>
          </div>
        </div>

        {/* My Payroll */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Мои начисления</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Начислено</span>
              <span className="text-gray-900">₽125,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Удержания</span>
              <span className="text-red-600">-₽15,000</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Итого к выплате</span>
                <span className="text-green-600">₽110,000</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </div>

        {/* My Vacation */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Мой отпуск</h3>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <div className="text-3xl text-gray-900 mb-1">14</div>
              <p className="text-sm text-gray-500">Доступно дней</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Следующий отпуск</p>
              <p className="text-gray-900">15 июля - 29 июля</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Подать заявку
          </Button>
        </div>

        {/* Gaming Progress */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Игровой прогресс</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Уровень</span>
              <span className="px-2 py-1 bg-purple-600 text-white rounded text-sm">12</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: '65%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">6,500 / 10,000 XP</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Достижения</p>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-800" />
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-800" />
              </div>
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-800" />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-400">+5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
