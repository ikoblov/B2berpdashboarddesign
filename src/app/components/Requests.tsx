import { useState } from "react";
import { RequestDetailPanel } from "./RequestDetailPanel";
import { GridView } from "./GridView";
import {
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  PanelRightClose,
  PanelRightOpen,
  X,
  ChevronDown,
  Lock,
  Pencil,
  CheckCircle2,
  CircleDot,
  Circle,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Tabs from "@radix-ui/react-tabs";

// Типы данных
type RequestStatus =
  | "created"
  | "in_work"
  | "planning_done"
  | "exit_tracked"
  | "shifts_closed"
  | "shifts_approved"
  | "payments_done"
  | "completed";

type PipelineStage =
  | "all"
  | "new"
  | "planning"
  | "exit"
  | "closing"
  | "approval"
  | "payment"
  | "done";

interface Request {
  id: string;
  client: string;
  object: string;
  date: string;
  fullDate: string;
  status: RequestStatus;
  stage: PipelineStage;
  needed?: number;
  planned?: number;
  reserve?: number;
  exitedPlanned?: number;
  exitedActual?: number;
  hoursClosedTotal?: number;
  hoursClosed?: number;
  hoursCustomer?: number;
  hoursFact?: number;
  paidTotal?: number;
  paid?: number;
  hasProblem?: boolean;
  problemDescription?: string;
  zone?: "green" | "yellow" | "red";
}

interface Executor {
  name: string;
  rating: number;
  phone: string;
  isCoordinator?: boolean;
}

interface ReserveExecutor {
  name: string;
  rating: number;
  phone: string;
  status: string;
}

// Mock data — 8 примеров с разными статусами
const mockRequests: Request[] = [
  {
    id: "1234",
    client: "Лента",
    object: "БЦ Столица",
    date: "15.05",
    fullDate: "15.05.2026 09:00",
    status: "created",
    stage: "new",
    needed: 15,
    hasProblem: false,
  },
  {
    id: "1235",
    client: "Метро",
    object: "ЖК Северный",
    date: "15.05",
    fullDate: "15.05.2026 08:00",
    status: "in_work",
    stage: "planning",
    needed: 20,
    planned: 18,
    hasProblem: false,
  },
  {
    id: "1236",
    client: "Стройгарант",
    object: "ЖК Восток",
    date: "15.05",
    fullDate: "15.05.2026 10:00",
    status: "planning_done",
    stage: "planning",
    needed: 15,
    planned: 4,
    reserve: -11,
    hasProblem: true,
    problemDescription: "Недобор 11 человек, срочная: осталось 3ч 12мин, НПД 25% (ниже порога 60%)",
    zone: "red",
  },
  {
    id: "1237",
    client: "БизнесПарк",
    object: "БЦ Кристалл",
    date: "15.05",
    fullDate: "15.05.2026 09:30",
    status: "exit_tracked",
    stage: "exit",
    exitedPlanned: 6,
    exitedActual: 6,
    hasProblem: false,
  },
  {
    id: "1238",
    client: "ТЦ Мега",
    object: "ТЦ Мега",
    date: "15.05",
    fullDate: "15.05.2026 11:00",
    status: "exit_tracked",
    stage: "exit",
    exitedPlanned: 10,
    exitedActual: 7,
    hasProblem: true,
    problemDescription: "Не вышло 3 человека",
    zone: "red",
  },
  {
    id: "1239",
    client: "Логистик+",
    object: "Склад",
    date: "15.05",
    fullDate: "15.05.2026 08:00",
    status: "shifts_closed",
    stage: "closing",
    hoursClosed: 96,
    hoursClosedTotal: 100,
    hasProblem: false,
  },
  {
    id: "1240",
    client: "ЖК Застройщик",
    object: "ЖК Парковый",
    date: "14.05",
    fullDate: "14.05.2026 09:00",
    status: "shifts_approved",
    stage: "approval",
    hoursCustomer: 120,
    hoursFact: 120,
    hasProblem: false,
  },
  {
    id: "1241",
    client: "Офис Холдинг",
    object: "Офис Skyline",
    date: "13.05",
    fullDate: "13.05.2026 10:00",
    status: "payments_done",
    stage: "payment",
    paid: 8,
    paidTotal: 8,
    hasProblem: false,
  },
];

const statusConfig: Record<
  RequestStatus,
  { label: string; bg: string; text: string }
> = {
  created: { label: "Создана", bg: "#F1F5F9", text: "#475569" },
  in_work: { label: "В работе", bg: "#F5F3FF", text: "#6D28D9" },
  planning_done: { label: "Подбор завершён", bg: "#DBEAFE", text: "#1E40AF" },
  exit_tracked: { label: "Выход отслежен", bg: "#CFFAFE", text: "#0E7490" },
  shifts_closed: { label: "Смены закрыты", bg: "#FEF9C3", text: "#854D0E" },
  shifts_approved: { label: "Согласовано", bg: "#DCFCE7", text: "#166534" },
  payments_done: { label: "Выплачено", bg: "#D1FAE5", text: "#065F46" },
  completed: { label: "Завершена", bg: "#F1F5F9", text: "#475569" },
};

const stageConfig: Record<PipelineStage, { label: string; key: string }> = {
  all: { label: "Все", key: "all" },
  new: { label: "Новые", key: "new" },
  planning: { label: "Планирование", key: "planning" },
  exit: { label: "Выход", key: "exit" },
  closing: { label: "Закрытие", key: "closing" },
  approval: { label: "Согласование", key: "approval" },
  payment: { label: "Выплата", key: "payment" },
  done: { label: "Завершено", key: "done" },
};

export function Requests({ onOpenRequestDetail }: { onOpenRequestDetail?: (id: string) => void } = {}) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    period: "today",
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Фильтрация заявок
  const filteredRequests =
    selectedStage === "all"
      ? mockRequests
      : mockRequests.filter((r) => r.stage === selectedStage);

  // Подсчет количества по этапам
  const stageCounts = Object.keys(stageConfig).reduce(
    (acc, stage) => {
      if (stage === "all") {
        acc[stage] = mockRequests.length;
      } else {
        acc[stage] = mockRequests.filter((r) => r.stage === stage).length;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const removeFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
  };

  const renderMetrics = (request: Request) => {
    const { status, needed, planned, reserve, exitedPlanned, exitedActual, hoursClosed, hoursClosedTotal, hoursCustomer, hoursFact, paid, paidTotal } = request;

    if (status === "created") {
      return <span className="font-[var(--font-mono)] text-[13px] text-slate-900">{needed}</span>;
    }

    if (status === "in_work") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {needed} / {planned}
        </span>
      );
    }

    if (status === "planning_done") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {needed} / {planned} /{" "}
          <span
            className={cn(
              "font-semibold",
              reserve! < 0 && "text-red-500",
              reserve! > 0 && "text-green-500",
              reserve === 0 && "text-slate-500"
            )}
          >
            {reserve! > 0 ? "+" : ""}
            {reserve}
          </span>
        </span>
      );
    }

    if (status === "exit_tracked") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {exitedPlanned} / {exitedActual}
        </span>
      );
    }

    if (status === "shifts_closed") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {hoursClosed}ч / {hoursClosedTotal}ч
        </span>
      );
    }

    if (status === "shifts_approved") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {hoursCustomer}ч / {hoursFact}ч
        </span>
      );
    }

    if (status === "payments_done") {
      return (
        <span className="font-[var(--font-mono)] text-[13px] text-slate-900">
          {paid} / {paidTotal}
        </span>
      );
    }

    return <span className="font-[var(--font-mono)] text-[13px] text-slate-500">—</span>;
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Табы по этапам пайплайна - только для вида "Список" */}
      {viewMode === "list" && (
        <div className="border-b border-slate-200 px-6 pt-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {Object.entries(stageConfig).map(([stage, config]) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage as PipelineStage)}
                className={cn(
                  "pb-3 px-2 text-[14px] font-[var(--font-nunito)] font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5",
                  selectedStage === stage
                    ? "text-[#4877A5] border-[#4877A5]"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                )}
              >
                <span>{config.label}</span>
                {stageCounts[stage] && (
                  <span className="text-[12px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {stageCounts[stage]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Строка фильтров - только для вида "Список" */}
      {viewMode === "list" && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          {/* Переключатель видов */}
          <div className="flex items-center rounded-md border border-slate-200 bg-white">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors rounded-l-md",
                  viewMode === "list"
                    ? "bg-[#EFF6FF] text-[#4877A5] font-semibold"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <List className="w-3.5 h-3.5" />
                Список
              </button>
              <div className="w-px h-6 bg-slate-200" />
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors rounded-r-md",
                  viewMode === "grid"
                    ? "bg-[#EFF6FF] text-[#4877A5] font-semibold"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Сетка
              </button>
            </div>

            {/* Кнопка фильтр */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1.5 text-sm rounded-md border border-slate-200 hover:bg-slate-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Фильтр
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[280px] p-4">
                <div className="text-sm font-semibold mb-3">ФИЛЬТРЫ</div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Период</label>
                    <Select defaultValue="today">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Сегодня</SelectItem>
                        <SelectItem value="tomorrow">Завтра</SelectItem>
                        <SelectItem value="week">Неделя</SelectItem>
                        <SelectItem value="month">Месяц</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Клиент</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="lenta">Лента</SelectItem>
                        <SelectItem value="metro">Метро</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Объект</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Статус</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Координатор</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">С проблемами</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="yes">Да</SelectItem>
                        <SelectItem value="no">Нет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-3" />

                <div className="text-sm font-semibold mb-3">СОРТИРОВКА</div>

                <div className="space-y-2">
                  <Select defaultValue="date">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Дата создания</SelectItem>
                      <SelectItem value="client">Клиент</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="sort" value="asc" className="w-4 h-4" />
                      По возрастанию
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="sort"
                        value="desc"
                        defaultChecked
                        className="w-4 h-4"
                      />
                      По убыванию
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                  <Button variant="outline" size="sm" className="flex-1">
                    Сбросить
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#4877A5] hover:bg-[#3d6589]">
                    Применить
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Активные фильтры */}
            {Object.entries(activeFilters).map(([key, value]) => {
              if (key === "period" && value === "today") {
                return (
                  <div
                    key={key}
                    className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md flex items-center gap-1"
                  >
                    Период: Сегодня
                    <button
                      onClick={() => removeFilter(key)}
                      className="hover:bg-slate-200 rounded-sm p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }
              return null;
            })}

          {/* Поиск */}
          <div className="ml-auto w-[30%] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по клиенту, объекту, номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Вид "Сетка" */}
        {viewMode === "grid" && (
          <div className="flex-1">
            <GridView onViewModeChange={setViewMode} />
          </div>
        )}

        {/* Вид "Список" */}
        {viewMode === "list" && (
          <>
            {/* Левая колонка */}
            <div
              className={cn(
                "flex-1 flex flex-col border-r border-slate-200 transition-all duration-200",
                isPanelCollapsed ? "w-full" : "w-[50%]"
              )}
            >
              {/* Список заявок */}
              <div className="flex-1 overflow-y-auto">
            {filteredRequests.map((request) => (
              <TooltipProvider key={request.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setSelectedRequest(request)}
                      className={cn(
                        "h-[36px] flex items-center border-b border-slate-100 cursor-pointer transition-colors",
                        request.hasProblem ? "bg-red-50" : "bg-white",
                        "hover:bg-slate-50",
                        selectedRequest?.id === request.id &&
                          "bg-blue-50 border-l-2 border-l-[#4877A5]"
                      )}
                    >
                    {/* Цветная полоса слева */}
                    {request.hasProblem && (
                      <div className="w-1 h-full bg-red-500 flex-shrink-0" />
                    )}

                    {/* Дата */}
                    <div className="w-[60px] px-3 text-[13px] font-[var(--font-nunito)] text-slate-600 flex-shrink-0">
                      {request.date}
                    </div>

                    {/* Клиент · Объект */}
                    <div className="flex-1 text-[14px] font-[var(--font-nunito)] font-medium text-slate-900 truncate">
                      {request.client} · {request.object}
                    </div>

                    {/* Статус-бейдж */}
                    <div className="w-[180px] px-3 flex-shrink-0">
                      <span
                        className="inline-block px-[10px] py-1 rounded-xl text-[12px] font-medium"
                        style={{
                          backgroundColor: statusConfig[request.status].bg,
                          color: statusConfig[request.status].text,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {statusConfig[request.status].label}
                      </span>
                    </div>

                    {/* Адаптивные цифры */}
                    <div className="w-[120px] px-3 flex justify-end flex-shrink-0">
                      {renderMetrics(request)}
                    </div>

                    {/* Стрелка */}
                    <div className="w-[24px] flex justify-center flex-shrink-0">
                      <ChevronRight
                        className={cn(
                          "w-[14px] h-[14px] transition-colors",
                          selectedRequest?.id === request.id
                            ? "text-slate-500"
                            : "text-slate-300"
                        )}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{request.fullDate}</p>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Правая панель */}
          {!isPanelCollapsed && (
              <div className="w-[50%] flex flex-col bg-white overflow-y-auto">
                {/* Контент панели */}
                {selectedRequest ? (
                  <RequestDetailPanel
                    onBack={() => setSelectedRequest(null)}
                  />
                ) : (
                  <DaySummary />
                )}
            </div>
          )}

          {/* Унифицированная кнопка сворачивания/разворачивания */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  className={cn(
                    "absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 z-10",
                    "w-7 h-7 rounded-md bg-white border border-slate-200 shadow-sm",
                    "hover:bg-slate-50 transition-all flex items-center justify-center"
                  )}
                  style={{
                    left: isPanelCollapsed ? "calc(100% - 14px)" : "50%",
                  }}
                >
                  {isPanelCollapsed ? (
                    <PanelRightOpen className="w-4 h-4 text-slate-500" />
                  ) : (
                    <PanelRightClose className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isPanelCollapsed ? "Развернуть панель" : "Свернуть панель"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
        )}
      </div>
    </div>
  );
}

// Компонент сводки дня
function DaySummary() {
  const attentionItems = [
    {
      id: "1236",
      client: "Стройгарант",
      object: "ЖК Восток",
      zone: "red",
      problem: "Недобор 11, срочная 3ч 12мин",
    },
    {
      id: "1238",
      client: "ТЦ Мега",
      object: "ТЦ Мега",
      zone: "red",
      problem: "Не вышло 3 человека",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
        <h2 className="text-[16px] font-[var(--font-montserrat)] font-semibold">
          Сводка за 15.05.2026
        </h2>
      </div>
      <div className="px-6 pb-6 pt-6 flex-1 overflow-y-auto">

      {/* Основные метрики */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-[var(--font-nunito)] text-slate-500">
            Заявок всего
          </span>
          <span className="text-[16px] font-[var(--font-nunito)] font-semibold text-slate-900">
            12
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-[var(--font-nunito)] text-slate-500">
            Сумма запланировано
          </span>
          <span className="text-[16px] font-[var(--font-nunito)] font-semibold text-slate-900">
            178
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-[var(--font-nunito)] text-slate-500">
            Сумма нужно
          </span>
          <span className="text-[16px] font-[var(--font-nunito)] font-semibold text-slate-900">
            195
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-[var(--font-nunito)] text-slate-500">
            Недобор
          </span>
          <span className="text-[16px] font-[var(--font-nunito)] font-bold text-red-500">
            −17
          </span>
        </div>
      </div>

      <div className="h-px bg-slate-200 my-4" />

      {/* По зонам */}
      <div className="mb-6">
        <div className="text-[12px] font-[var(--font-nunito)] uppercase text-slate-400 tracking-wide mb-3">
          По зонам
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[14px] font-[var(--font-nunito)] text-slate-700">
              Зелёная
            </span>
            <span className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900 ml-auto">
              7
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[14px] font-[var(--font-nunito)] text-slate-700">
              Оранжевая
            </span>
            <span className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900 ml-auto">
              3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[14px] font-[var(--font-nunito)] text-slate-700">
              Красная
            </span>
            <span className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900 ml-auto">
              2
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 my-4" />

      {/* Требуют внимания */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-[12px] font-[var(--font-nunito)] uppercase text-slate-700 tracking-wide font-semibold">
            ТРЕБУЮТ ВНИМАНИЯ
          </span>
        </div>

        <div className="space-y-2">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-2 p-3 bg-red-50 rounded-md border-l-4 border-red-500 cursor-pointer hover:bg-red-100 transition-colors"
            >
              <div>
                <div className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900">
                  {item.client} · {item.object}
                </div>
                <div className="text-[12px] font-[var(--font-nunito)] text-red-500">
                  {item.problem}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

// Компонент детали заявки
function RequestDetail({
  request,
  onBack,
}: {
  request: Request;
  onBack: () => void;
}) {
  const mockExecutors: Executor[] = [
    { name: "Иванов И. И.", rating: 0.92, phone: "+7 999 123-45-67", isCoordinator: true },
    { name: "Петров С. А.", rating: 0.88, phone: "+7 999 234-56-78" },
    { name: "Сидоров А. В.", rating: 0.75, phone: "+7 999 345-67-89" },
    { name: "Козлов М. П.", rating: 0.68, phone: "+7 999 456-78-90" },
  ];

  const mockReserve: ReserveExecutor[] = [
    { name: "Николаев П. А.", rating: 0.72, phone: "+7 999 555-66-77", status: "ждёт ответа" },
    { name: "Михайлов А. С.", rating: 0.65, phone: "+7 999 666-77-88", status: "ждёт ответа" },
    { name: "Волков Д. Н.", rating: 0.58, phone: "+7 999 777-88-99", status: "отказ" },
  ];

  const problems = [
    "Недобор 11",
    "Срочная 3ч 12м",
    "НПД 25%"
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 0.8) return "#22C55E";
    if (rating >= 0.6) return "#0F172A";
    return "#EAB308";
  };

  const getStatusColor = (status: string) => {
    if (status === "отказ") return "#EF4444";
    if (status === "today-pool") return "#4877A5";
    return "#64748B";
  };

  return (
    <div className="px-5 pb-5">
      {/* Назад к сводке */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[14px] font-[var(--font-nunito)] text-[#4877A5] hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад к сводке
      </button>

      {/* Заголовок заявки */}
      <h2 className="text-[18px] font-[var(--font-montserrat)] font-semibold text-slate-900 mb-1 cursor-pointer hover:text-[#4877A5] transition-colors">
        {request.client} · {request.object}
      </h2>
      <div className="text-[13px] font-[var(--font-nunito)] text-slate-500 mb-3">
        {request.date} 08:00 · #{request.id}
      </div>

      {/* Статус и счётчик проблем */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="inline-block px-[10px] py-1 rounded-xl text-[12px] font-medium"
          style={{
            backgroundColor: statusConfig[request.status].bg,
            color: statusConfig[request.status].text,
            whiteSpace: 'nowrap',
          }}
        >
          {statusConfig[request.status].label}
        </span>
        {request.hasProblem && problems.length > 0 && (
          <div className="flex items-center gap-1 text-[#EF4444]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[13px] font-[var(--font-nunito)] font-medium">
              {problems.length} {problems.length === 1 ? 'проблема' : problems.length < 5 ? 'проблемы' : 'проблем'}
            </span>
          </div>
        )}
      </div>

      {/* Цифры заявки */}
      {request.status === "planning_done" && (
        <div className="bg-[#F8FAFC] rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="text-[20px] font-[var(--font-mono)] font-bold text-slate-900">
              {request.needed}
            </div>
            <div className="text-[12px] font-[var(--font-nunito)] text-slate-500">
              нужно
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex-1 text-center">
            <div className="text-[20px] font-[var(--font-mono)] font-bold text-slate-900">
              {request.planned}
            </div>
            <div className="text-[12px] font-[var(--font-nunito)] text-slate-500">
              запл.
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex-1 text-center">
            <div
              className="text-[20px] font-[var(--font-mono)] font-bold"
              style={{
                color: request.reserve! < 0 ? "#EF4444" : request.reserve! > 0 ? "#22C55E" : "#0F172A"
              }}
            >
              {request.reserve! > 0 ? "+" : ""}
              {request.reserve}
            </div>
            <div className="text-[12px] font-[var(--font-nunito)] text-slate-500">
              резерв
            </div>
          </div>
        </div>
      )}

      {/* Состав */}
      <div className="mb-4">
        <div className="text-[12px] font-[var(--font-nunito)] uppercase tracking-wider text-[#94A3B8] mb-2">
          Состав ({mockExecutors.length} / {request.needed || 15})
        </div>
        <div className="space-y-0">
          {mockExecutors.map((executor, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 h-8">
                <span
                  className="w-10 text-[13px] font-[var(--font-mono)] font-semibold"
                  style={{ color: getRatingColor(executor.rating) }}
                >
                  {executor.rating.toFixed(2)}
                </span>
                <span className="text-[14px] font-[var(--font-nunito)] text-slate-900 min-w-[120px]">
                  {executor.name}
                </span>
                <span className="text-[13px] font-[var(--font-nunito)] text-slate-500 flex-1">
                  {executor.phone}
                </span>
                {executor.isCoordinator && (
                  <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#4338CA] text-[11px] rounded-md">
                    координатор
                  </span>
                )}
              </div>
              {idx < mockExecutors.length - 1 && (
                <div className="h-px bg-[#F1F5F9]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Резерв */}
      <div className="mb-4">
        <div className="text-[12px] font-[var(--font-nunito)] uppercase tracking-wider text-[#94A3B8] mb-2">
          Резерв ({mockReserve.length})
        </div>
        <div className="space-y-0">
          {mockReserve.map((executor, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 h-8">
                <span
                  className="w-10 text-[13px] font-[var(--font-mono)] font-semibold"
                  style={{ color: getRatingColor(executor.rating) }}
                >
                  {executor.rating.toFixed(2)}
                </span>
                <span className="text-[14px] font-[var(--font-nunito)] text-slate-900 min-w-[120px]">
                  {executor.name}
                </span>
                <span className="text-[13px] font-[var(--font-nunito)] text-slate-500 flex-1">
                  {executor.phone}
                </span>
                <span
                  className="text-[12px] font-[var(--font-nunito)]"
                  style={{ color: getStatusColor(executor.status) }}
                >
                  {executor.status}
                </span>
              </div>
              {idx < mockReserve.length - 1 && (
                <div className="h-px bg-[#F1F5F9]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Проблемы */}
      {request.hasProblem && problems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900">
              Проблемы
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {problems.map((problem, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#FEF2F2] text-[#DC2626] text-[12px] font-medium rounded-xl"
              >
                {problem}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Блок действий */}
      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-[#EFF6FF] text-[#4877A5] text-[14px] font-[var(--font-nunito)] rounded-md border border-[#E2E8F0] hover:bg-[#DBEAFE] transition-colors">
            Запустить обзвон
          </button>
          <button className="px-3 py-2 bg-white text-[#475569] text-[14px] font-[var(--font-nunito)] rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
            + Бонусы к заявке
          </button>
          <button className="px-3 py-2 bg-white text-[#475569] text-[14px] font-[var(--font-nunito)] rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
            Поднять приоритет
          </button>
          <button className="px-3 py-2 bg-white text-[#475569] text-[14px] font-[var(--font-nunito)] rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
            Эскалация
          </button>
        </div>
      </div>
    </div>
  );
}
