import { useState } from "react";
import {
  Plus,
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  ChevronRight,
  User,
  FileBarChart,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Progress } from "./ui/progress";

interface ReportsProps {
  onNavigate?: (view: string) => void;
}

const mockFinancialData = {
  grossProfit: 1245000,
  incomingRates: 1630000,
  outgoingRates: 385000,
  margin: 31,
  salaryProject: 67,
  trustedSelfEmployed: 33,
  growth: 15,
};

const mockOperationalData = {
  activeRequests: 24,
  fulfillmentRate: 87,
  totalShifts: 156,
  completedShifts: 142,
  delays: 8,
  cancellations: 6,
};

const mockHRData = {
  avgRating: 4.6,
  turnoverRate: 12,
  topWorkers: [
    { name: 'Иванов С.П.', rating: 4.9, shifts: 32 },
    { name: 'Петров А.М.', rating: 4.8, shifts: 28 },
    { name: 'Сидоров Д.И.', rating: 4.8, shifts: 30 },
    { name: 'Лебедев А.О.', rating: 4.7, shifts: 28 },
    { name: 'Морозов А.С.', rating: 4.6, shifts: 26 },
  ],
  worstWorkers: [
    { name: 'Козлов И.В.', delays: 5, cancellations: 2 },
    { name: 'Волков Н.П.', delays: 4, cancellations: 3 },
    { name: 'Соколов В.И.', delays: 3, cancellations: 2 },
  ],
};

const mockClientData = {
  topByRevenue: [
    { name: 'МегаСтрой ООО', revenue: 485000, margin: 32 },
    { name: 'СтройГрупп ООО', revenue: 420000, margin: 31 },
    { name: 'СтройИнвест Капитал', revenue: 340000, margin: 28 },
  ],
  topByMargin: [
    { name: 'МегаСтрой ООО', margin: 32, revenue: 485000 },
    { name: 'СтройГрупп ООО', margin: 31, revenue: 420000 },
    { name: 'СтройИнвест Капитал', margin: 28, revenue: 340000 },
  ],
};

const reportCategories = [
  { id: 'overview', label: 'Обзор', icon: Activity },
  { id: 'finance', label: 'Финансы', icon: DollarSign },
  { id: 'operations', label: 'Операционные', icon: Target },
  { id: 'clients', label: 'Клиенты', icon: Users },
  { id: 'objects', label: 'Объекты', icon: Building2 },
  { id: 'managers', label: 'Менеджеры', icon: User },
  { id: 'workers', label: 'Исполнители', icon: Award },
  { id: 'requests', label: 'Заявки', icon: FileText },
  { id: 'shifts', label: 'Смены', icon: Clock },
  { id: 'quality', label: 'Качество данных', icon: CheckCircle2 },
  { id: 'custom', label: 'Пользовательские', icon: FileBarChart },
];

export function Reports({ onNavigate }: ReportsProps) {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [period, setPeriod] = useState('month');

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Отчёты</h1>
              <p className="text-sm text-gray-600">
                Аналитика и ключевые метрики бизнеса
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">День</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="custom">Диапазон</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт PDF
              </Button>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт XLSX
              </Button>

              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Создать отчёт
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3">
            <Select defaultValue="all-clients">
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-clients">Все клиенты</SelectItem>
                <SelectItem value="client-1">МегаСтрой ООО</SelectItem>
                <SelectItem value="client-2">СтройГрупп ООО</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-objects">
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-objects">Все объекты</SelectItem>
                <SelectItem value="obj-1">ЖК Северный</SelectItem>
                <SelectItem value="obj-2">БЦ Skyline</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-work-types">
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-work-types">Все типы работ</SelectItem>
                <SelectItem value="type-1">Разнорабочие</SelectItem>
                <SelectItem value="type-2">Грузчики</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-managers">
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <User className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-managers">Все менеджеры</SelectItem>
                <SelectItem value="mgr-1">Анна Смирнова</SelectItem>
                <SelectItem value="mgr-2">Дмитрий Козлов</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content with Sidebar */}
      <div className="flex">
        {/* Category Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.20))]">
          <div className="p-4">
            <nav className="space-y-1">
              {reportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Overview Dashboard */}
          {activeCategory === 'overview' && (
            <div className="space-y-6">
              {/* Financial Metrics */}
              <div>
                <h2 className="text-gray-900 mb-4">Финансовые показатели</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Валовая прибыль</span>
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl text-gray-900 mb-1">
                      {mockFinancialData.grossProfit.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{mockFinancialData.growth}% за месяц</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Входящие ставки</span>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl text-gray-900 mb-1">
                      {mockFinancialData.incomingRates.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-gray-500">За текущий период</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Исходящие ставки</span>
                      <TrendingDown className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl text-orange-600 mb-1">
                      {mockFinancialData.outgoingRates.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-gray-500">Расходы на персонал</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Маржа</span>
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl text-green-600 mb-1">
                      {mockFinancialData.margin}%
                    </div>
                    <div className="text-xs text-gray-500">Рентабельность</div>
                  </div>
                </div>

                {/* Payment Distribution */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">
                      Динамика маржи по дням
                    </h3>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">График маржи</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">
                      Распределение выплат
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">ЗП-проект</span>
                          <span className="text-sm text-gray-900">
                            {mockFinancialData.salaryProject}%
                          </span>
                        </div>
                        <Progress value={mockFinancialData.salaryProject} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Доверенные самозанятые</span>
                          <span className="text-sm text-gray-900">
                            {mockFinancialData.trustedSelfEmployed}%
                          </span>
                        </div>
                        <Progress
                          value={mockFinancialData.trustedSelfEmployed}
                          className="h-2"
                        />
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Доход / Расход / Маржа</div>
                        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                          <PieChart className="w-10 h-10 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Metrics */}
              <div>
                <h2 className="text-gray-900 mb-4">Операционные метрики</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Активные заявки</span>
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl text-gray-900">
                      {mockOperationalData.activeRequests}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Укомплектованность</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl text-green-600">
                      {mockOperationalData.fulfillmentRate}%
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Всего смен</span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl text-gray-900">
                      {mockOperationalData.totalShifts}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Завершено</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl text-green-600">
                      {mockOperationalData.completedShifts}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Опоздания</span>
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl text-orange-600">
                      {mockOperationalData.delays}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((mockOperationalData.delays / mockOperationalData.totalShifts) * 100).toFixed(
                        1
                      )}
                      % от всех смен
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Пропуски</span>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-2xl text-red-600">
                      {mockOperationalData.cancellations}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(
                        (mockOperationalData.cancellations / mockOperationalData.totalShifts) *
                        100
                      ).toFixed(1)}
                      % от всех смен
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">Загрузка по объектам</h3>
                    <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <Activity className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* HR Metrics */}
              <div>
                <h2 className="text-gray-900 mb-4">HR-метрики</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Средний рейтинг</span>
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="text-2xl text-gray-900">{mockHRData.avgRating}</div>
                    <div className="text-xs text-gray-500">Из 5.0</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Текучесть кадров</span>
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl text-orange-600">{mockHRData.turnoverRate}%</div>
                    <div className="text-xs text-gray-500">Месячный показатель</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">Выходы по дням</h3>
                    <div className="h-16 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <Activity className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">ТОП-5 лучших исполнителей</h3>
                    <div className="space-y-3">
                      {mockHRData.topWorkers.map((worker, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm text-gray-900">{worker.name}</div>
                              <div className="text-xs text-gray-600">
                                {worker.shifts} смен
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-900">{worker.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">Проблемные исполнители</h3>
                    <div className="space-y-3">
                      {mockHRData.worstWorkers.map((worker, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div>
                            <div className="text-sm text-gray-900">{worker.name}</div>
                            <div className="text-xs text-gray-600">
                              Опоздания: {worker.delays}, Пропуски: {worker.cancellations}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Analytics */}
              <div>
                <h2 className="text-gray-900 mb-4">Клиентская аналитика</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">ТОП-клиенты по выручке</h3>
                    <div className="space-y-3">
                      {mockClientData.topByRevenue.map((client, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm text-gray-900">{client.name}</div>
                              <div className="text-xs text-gray-600">Маржа: {client.margin}%</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-900 font-mono">
                            {client.revenue.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm text-gray-900 mb-4">Распределение маржи по клиентам</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Горизонтальный бар-чарт</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Report */}
          {activeCategory === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Финансовый отчёт</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm text-gray-900 mb-4">График выручки</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Линейный график выручки</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm text-gray-900 mb-4">График маржи</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">График рентабельности</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm text-gray-900">Детализация по клиентам</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Клиент</TableHead>
                      <TableHead>Заказ-наряд</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead className="text-right">Входящие</TableHead>
                      <TableHead className="text-right">Исходящие</TableHead>
                      <TableHead className="text-right">Маржа</TableHead>
                      <TableHead className="text-center">Смен</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm text-gray-900">МегаСтрой ООО</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">ЗН-001</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">ЖК Северный</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-gray-900 font-mono">420 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-orange-600 font-mono">285 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-green-600 font-mono">135 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          48
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm text-gray-900">СтройГрупп ООО</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">ЗН-002</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">БЦ Skyline</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-gray-900 font-mono">380 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-orange-600 font-mono">260 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-green-600 font-mono">120 000 ₽</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          42
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Workers Report */}
          {activeCategory === 'workers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Отчёт по исполнителям</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Экспорт
                </Button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Исполнитель</TableHead>
                      <TableHead className="text-center">Смен</TableHead>
                      <TableHead className="text-center">Опоздания</TableHead>
                      <TableHead className="text-center">Отказы</TableHead>
                      <TableHead>Дисциплина</TableHead>
                      <TableHead>Рейтинг</TableHead>
                      <TableHead className="text-right">Выплата</TableHead>
                      <TableHead>Эффек��ивность</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHRData.topWorkers.map((worker) => (
                      <TableRow key={worker.name} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm text-gray-900">{worker.name}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {worker.shifts}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm text-green-600">0</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm text-green-600">0</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={95} className="h-2 w-24" />
                            <span className="text-sm text-gray-700">95%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-900">{worker.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-900 font-mono">
                            {(worker.shifts * 16200).toLocaleString('ru-RU')} ₽
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Отлично
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm text-gray-900 mb-4">Рейтинг → Дисциплина</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Scatter plot</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm text-gray-900 mb-4">Количество смен</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Bar chart</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Managers Report */}
          {activeCategory === 'managers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Отчёт по менеджерам</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Экспорт
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Укомплектованность</div>
                  <div className="text-2xl text-green-600">92%</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Закрыто заявок</div>
                  <div className="text-2xl text-gray-900">48</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Время реакции</div>
                  <div className="text-2xl text-blue-600">2.4 ч</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Нарушения</div>
                  <div className="text-2xl text-orange-600">3</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">KPI score</div>
                  <div className="text-2xl text-green-600">87</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Менеджер</TableHead>
                      <TableHead className="text-center">Клиенты</TableHead>
                      <TableHead className="text-center">Заявки</TableHead>
                      <TableHead className="text-center">Смены</TableHead>
                      <TableHead className="text-center">Нарушения</TableHead>
                      <TableHead>KPI score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm text-gray-900">Анна Смирнова</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          8
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          24
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-gray-900">82</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-green-600">1</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="h-2 w-24" />
                          <span className="text-sm text-green-600">92</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm text-gray-900">Дмитрий Козлов</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          6
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          18
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-gray-900">64</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-orange-600">3</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="h-2 w-24" />
                          <span className="text-sm text-gray-900">85</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Custom Reports */}
          {activeCategory === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Пользовательские отчёты</h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать отчёт
                </Button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                <div className="text-center">
                  <FileBarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Пользовательские отчёты</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Создавайте собственные отчёты с нужными полями и фильтрами
                  </p>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Создать первый отчёт
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}