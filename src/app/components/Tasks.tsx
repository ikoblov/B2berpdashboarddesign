import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Clock,
  MapPin,
  Route,
  Play,
  CheckCircle2,
  SkipForward,
  LayoutList,
  Columns3,
  CalendarDays,
  AlertTriangle,
  FileText,
  Building2,
  Users,
  Zap,
  Handshake,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";

// ─── Types ───

type TaskStatus = "planned" | "in-progress" | "review" | "done" | "cancelled";
type TaskCategory = "objects" | "documents" | "clients" | "internal" | "urgent";
type TaskPriority = "urgent" | "high" | "medium" | "low";
type ViewMode = "list" | "board" | "calendar";
type RoutePointStatus = "planned" | "in-progress" | "done" | "missed";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  object: { name: string; address: string } | null;
  assignee: string;
  priority: TaskPriority;
  deadline: string; // DD.MM.YYYY
  deadlineDate: Date;
  status: TaskStatus;
}

interface RoutePoint {
  id: string;
  order: number;
  time: string;
  objectName: string;
  checkType: string;
  priority: TaskPriority;
  distanceToNext: string | null;
  status: RoutePointStatus;
}

// ─── Configs ───

const statusConfig: Record<TaskStatus, { label: string; cls: string }> = {
  planned: { label: "Запланировано", cls: "bg-gray-50 text-gray-600 border-gray-200" },
  "in-progress": { label: "В работе", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  review: { label: "На проверке", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  done: { label: "Выполнено", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Отменено", cls: "bg-gray-50 text-gray-400 border-gray-200 line-through" },
};

const categoryConfig: Record<TaskCategory, { label: string; icon: string; cls: string; Icon: typeof Building2 }> = {
  objects: { label: "По объектам", icon: "🏗", cls: "bg-blue-50 text-blue-700 border-blue-200", Icon: Building2 },
  documents: { label: "Документы", icon: "📄", cls: "bg-purple-50 text-purple-700 border-purple-200", Icon: FileText },
  clients: { label: "Клиенты", icon: "🤝", cls: "bg-green-50 text-green-700 border-green-200", Icon: Handshake },
  internal: { label: "Внутренние", icon: "🏢", cls: "bg-gray-50 text-gray-600 border-gray-200", Icon: Users },
  urgent: { label: "Срочные", icon: "⚠️", cls: "bg-red-50 text-red-700 border-red-200", Icon: Zap },
};

const priorityConfig: Record<TaskPriority, { label: string; cls: string }> = {
  urgent: { label: "Срочный", cls: "bg-red-50 text-red-700 border-red-200" },
  high: { label: "Высокий", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  medium: { label: "Средний", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  low: { label: "Низкий", cls: "bg-gray-50 text-gray-500 border-gray-200" },
};

const routeStatusConfig: Record<RoutePointStatus, { label: string; cls: string }> = {
  planned: { label: "Запланировано", cls: "bg-gray-50 text-gray-600 border-gray-200" },
  "in-progress": { label: "В работе", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  done: { label: "Выполнено", cls: "bg-green-50 text-green-700 border-green-200" },
  missed: { label: "Пропущено", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

const assignees = [
  { id: "alexey", name: "Куратор Алексей К.", short: "Алексей К.", gradient: "from-blue-400 to-cyan-500" },
  { id: "anna", name: "Менеджер Анна П.", short: "Анна П.", gradient: "from-pink-400 to-rose-500" },
  { id: "dmitry", name: "Менеджер Дмитрий С.", short: "Дмитрий С.", gradient: "from-amber-400 to-orange-500" },
];

const objectsList = [
  { name: "Склад Столбище", address: "ул. Промышленная 5" },
  { name: "ТЦ Мега Казань", address: "пр. Победы 141" },
  { name: "Логопарк Казань", address: "ул. Складская 12" },
  { name: "Завод КОС", address: "ул. Заводская 3, Казань" },
  { name: "Склад Зеленодольск", address: "ул. Промзона 1" },
  { name: "Склад Ozon Казань", address: "ул. Логистическая 8" },
];

// ─── Helpers ───

const TODAY = new Date(2026, 3, 3); // 03.04.2026

function getDeadlineInfo(d: Date): { text: string; cls: string } {
  const diff = Math.floor((d.getTime() - TODAY.getTime()) / 86400000);
  if (diff < 0) return { text: `Просрочено ${Math.abs(diff)} дн.`, cls: "text-red-600" };
  if (diff === 0) return { text: "Сегодня", cls: "text-orange-600" };
  if (diff === 1) return { text: "Завтра", cls: "text-gray-600" };
  return { text: d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }), cls: "text-gray-500" };
}

function getTimeGroup(d: Date): "overdue" | "today" | "week" | "later" {
  const diff = Math.floor((d.getTime() - TODAY.getTime()) / 86400000);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 6) return "week";
  return "later";
}

function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).filter(Boolean).join("").slice(0, 2);
}

function getAssigneeGradient(name: string) {
  const a = assignees.find(x => x.short === name || x.name === name);
  return a?.gradient || "from-gray-400 to-gray-500";
}

// ─── Mock Data ───

const mockTasks: TaskItem[] = [
  // Overdue
  { id: "T-001", title: "Подготовить акт для ООО Магнит за март", description: "Закрывающие документы по договору оказания услуг", category: "documents", object: null, assignee: "Анна П.", priority: "high", deadline: "01.04.2026", deadlineDate: new Date(2026, 3, 1), status: "in-progress" },
  { id: "T-002", title: "Разбор инцидента на Заводе КОС", description: "Травма на производственной линии — разбор и акт", category: "urgent", object: { name: "Завод КОС", address: "ул. Заводская 3, Казань" }, assignee: "Алексей К.", priority: "urgent", deadline: "02.04.2026", deadlineDate: new Date(2026, 3, 2), status: "in-progress" },
  // Today
  { id: "T-003", title: "Проверка начала смен — Склад Столбище", description: "Утренний обход, контроль явки исполнителей", category: "objects", object: { name: "Склад Столбище", address: "ул. Промышленная 5" }, assignee: "Алексей К.", priority: "medium", deadline: "03.04.2026", deadlineDate: new Date(2026, 3, 3), status: "in-progress" },
  { id: "T-004", title: "Согласовать заявку на 15 чел. Мега Казань", description: "Запрос от заказчика на расширение штата", category: "clients", object: { name: "ТЦ Мега Казань", address: "пр. Победы 141" }, assignee: "Дмитрий С.", priority: "high", deadline: "03.04.2026", deadlineDate: new Date(2026, 3, 3), status: "planned" },
  { id: "T-005", title: "Оформить договор с новым клиентом", description: "Подготовка и согласование договора с ООО СтройЛогистик", category: "documents", object: null, assignee: "Анна П.", priority: "medium", deadline: "03.04.2026", deadlineDate: new Date(2026, 3, 3), status: "review" },
  { id: "T-006", title: "Инструктаж новых исполнителей", description: "Вводный инструктаж для 5 новых исполнителей на складе", category: "objects", object: { name: "Логопарк Казань", address: "ул. Складская 12" }, assignee: "Алексей К.", priority: "medium", deadline: "03.04.2026", deadlineDate: new Date(2026, 3, 3), status: "done" },
  // This week
  { id: "T-007", title: "Встреча с заказчиком Wildberries", description: "Обсуждение условий нового контракта", category: "clients", object: { name: "ТЦ Мега Казань", address: "пр. Победы 141" }, assignee: "Дмитрий С.", priority: "high", deadline: "05.04.2026", deadlineDate: new Date(2026, 3, 5), status: "planned" },
  { id: "T-008", title: "Проверка качества — Логопарк", description: "Контроль качества уборки после ночно�� смены", category: "objects", object: { name: "Логопарк Казань", address: "ул. Складская 12" }, assignee: "Алексей К.", priority: "medium", deadline: "05.04.2026", deadlineDate: new Date(2026, 3, 5), status: "planned" },
  { id: "T-009", title: "Обновить шаблон реестра выплат", description: "Внести изменения в шаблон Excel для бухгалтерии", category: "internal", object: null, assignee: "Анна П.", priority: "low", deadline: "06.04.2026", deadlineDate: new Date(2026, 3, 6), status: "planned" },
  { id: "T-010", title: "Собеседование кандидатов (5 чел)", description: "Первичный отбор кандидатов для объекта Ozon", category: "internal", object: null, assignee: "Дмитрий С.", priority: "medium", deadline: "06.04.2026", deadlineDate: new Date(2026, 3, 6), status: "planned" },
  { id: "T-011", title: "Проверка завершения — Склад Зеленодольск", description: "Вечерний обход, контроль закрытия смен", category: "objects", object: { name: "Склад Зеленодольск", address: "ул. Промзона 1" }, assignee: "Алексей К.", priority: "medium", deadline: "07.04.2026", deadlineDate: new Date(2026, 3, 7), status: "planned" },
  // Later
  { id: "T-012", title: "Подготовить отчёт за Q1 2026", description: "Квартальный отчёт по всем объектам", category: "documents", object: null, assignee: "Анна П.", priority: "medium", deadline: "11.04.2026", deadlineDate: new Date(2026, 3, 11), status: "planned" },
  { id: "T-013", title: "Ревизия СИЗ на Складе Ozon", description: "Проверка наличия и состояния средств индивидуальной защиты", category: "objects", object: { name: "Склад Ozon Казань", address: "ул. Логистическая 8" }, assignee: "Алексей К.", priority: "low", deadline: "12.04.2026", deadlineDate: new Date(2026, 3, 12), status: "planned" },
  { id: "T-014", title: "Обучение новых кураторов", description: "Тренинг по работе с PF ERP для новых кураторов", category: "internal", object: null, assignee: "Дмитрий С.", priority: "medium", deadline: "14.04.2026", deadlineDate: new Date(2026, 3, 14), status: "planned" },
  { id: "T-015", title: "Продлить договор с ООО Магнит", description: "Согласование условий продления на Q2", category: "clients", object: null, assignee: "Анна П.", priority: "high", deadline: "15.04.2026", deadlineDate: new Date(2026, 3, 15), status: "planned" },
];

const mockRoutePoints: RoutePoint[] = [
  { id: "R-1", order: 1, time: "09:00", objectName: "Склад Столбище", checkType: "Проверка начала смен", priority: "medium", distanceToNext: "23.5 км", status: "done" },
  { id: "R-2", order: 2, time: "10:00", objectName: "Склад Столбище", checkType: "Проверка качества", priority: "high", distanceToNext: "0 км", status: "in-progress" },
  { id: "R-3", order: 3, time: "11:30", objectName: "ТЦ Мега Казань", checkType: "Встреча с представителем", priority: "high", distanceToNext: "15.2 км", status: "planned" },
  { id: "R-4", order: 4, time: "13:00", objectName: "Логопарк Казань", checkType: "Проверка начала смен", priority: "medium", distanceToNext: "8.1 км", status: "planned" },
  { id: "R-5", order: 5, time: "14:30", objectName: "Завод КОС", checkType: "Инструктаж новых исполнителей", priority: "medium", distanceToNext: null, status: "planned" },
];

// ─── Main Component ───

interface TasksProps {
  onNavigate?: (view: string) => void;
}

export function Tasks({ onNavigate }: TasksProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "routes" | "my">("tasks");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-1">Задачи</h1>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Создать задачу
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <KpiCard icon={<LayoutList className="w-4 h-4 text-gray-500" />} label="Всего задач" value={47} color="text-gray-900" bg="bg-gray-100" />
          <KpiCard icon={<Clock className="w-4 h-4 text-blue-500" />} label="В работе" value={12} color="text-blue-600" bg="bg-blue-50" />
          <KpiCard icon={<AlertTriangle className="w-4 h-4 text-red-500" />} label="Просрочено" value={3} color="text-red-600" bg="bg-red-50" />
          <KpiCard icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} label="Выполнено сегодня" value={8} color="text-green-600" bg="bg-green-50" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 p-1.5">
          <div className="flex items-center gap-1">
            {([
              { key: "tasks", label: "Все задачи" },
              { key: "routes", label: "Маршруты" },
              { key: "my", label: "Мои задачи" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 px-4 py-2 rounded text-xs transition-all",
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "tasks" && <AllTasksTab tasks={mockTasks} />}
          {activeTab === "routes" && <RoutesTab />}
          {activeTab === "my" && <MyTasksTab tasks={mockTasks.filter(t => t.assignee === "Анна П.")} />}
        </div>

        <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </div>
  );
}

// ─── KPI Card ───

function KpiCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bg)}>{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className={cn("text-2xl", color)}>{value}</div>
    </div>
  );
}

// ─── Tab 1: All Tasks ───

function AllTasksTab({ tasks }: { tasks: TaskItem[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterAssignee !== "all") {
        const a = assignees.find(x => x.id === filterAssignee);
        if (a && t.assignee !== a.short) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tasks, search, filterStatus, filterCategory, filterPriority, filterAssignee]);

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Поиск задач..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white border-gray-200" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200"><SelectValue placeholder="Статус" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="planned">Запланировано</SelectItem>
              <SelectItem value="in-progress">В работе</SelectItem>
              <SelectItem value="review">На проверке</SelectItem>
              <SelectItem value="done">Выполнено</SelectItem>
              <SelectItem value="cancelled">Отменено</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[155px] bg-white border-gray-200"><SelectValue placeholder="Категория" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="objects">По объектам</SelectItem>
              <SelectItem value="documents">Документы</SelectItem>
              <SelectItem value="clients">Клиенты</SelectItem>
              <SelectItem value="internal">Внутренние</SelectItem>
              <SelectItem value="urgent">Срочные</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[145px] bg-white border-gray-200"><SelectValue placeholder="Приоритет" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="urgent">Срочный</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="low">Низкий</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200"><SelectValue placeholder="Исполнитель" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {assignees.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="ml-auto flex bg-gray-100 rounded-lg p-0.5">
            {([
              { key: "list" as ViewMode, Icon: LayoutList, label: "Список" },
              { key: "board" as ViewMode, Icon: Columns3, label: "Доска" },
              { key: "calendar" as ViewMode, Icon: CalendarDays, label: "Календарь" },
            ]).map(v => (
              <button
                key={v.key}
                onClick={() => setViewMode(v.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all",
                  viewMode === v.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <v.Icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Views */}
      {viewMode === "list" && <TaskListView tasks={filtered} checked={checked} onToggle={toggleCheck} />}
      {viewMode === "board" && <TaskBoardView tasks={filtered} />}
      {viewMode === "calendar" && <TaskCalendarView tasks={filtered} />}
    </div>
  );
}

// ─── List View (grouped) ───

const groupLabels: Record<string, { label: string; borderCls: string }> = {
  overdue: { label: "Просрочено", borderCls: "border-l-red-500" },
  today: { label: "Сегодня", borderCls: "border-l-orange-400" },
  week: { label: "Эта неделя", borderCls: "border-l-blue-400" },
  later: { label: "Позже", borderCls: "border-l-gray-300" },
};

function TaskListView({ tasks, checked, onToggle }: { tasks: TaskItem[]; checked: Set<string>; onToggle: (id: string) => void }) {
  const groups = useMemo(() => {
    const g: Record<string, TaskItem[]> = { overdue: [], today: [], week: [], later: [] };
    tasks.forEach(t => {
      const grp = t.status === "done" || t.status === "cancelled" ? getTimeGroup(t.deadlineDate) : getTimeGroup(t.deadlineDate);
      g[grp].push(t);
    });
    return g;
  }, [tasks]);

  const orderedKeys = ["overdue", "today", "week", "later"];

  return (
    <div className="space-y-4">
      {orderedKeys.map(key => {
        const items = groups[key];
        if (items.length === 0) return null;
        const cfg = groupLabels[key];
        return (
          <div key={key} className={cn("bg-white rounded-lg border border-gray-200 shadow-sm border-l-4", cfg.borderCls)}>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">{cfg.label}</span>
              <span className="ml-2 text-xs text-gray-400">{items.length}</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[300px]">Задача</TableHead>
                  <TableHead className="w-[150px]">Категория</TableHead>
                  <TableHead className="w-[200px]">Объект / Привязка</TableHead>
                  <TableHead className="w-[160px]">Исполнитель</TableHead>
                  <TableHead className="w-[100px]">Приоритет</TableHead>
                  <TableHead className="w-[130px]">Срок</TableHead>
                  <TableHead className="w-[130px]">Статус</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(task => <TaskRow key={task.id} task={task} checked={checked.has(task.id)} onToggle={() => onToggle(task.id)} />)}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}

function TaskRow({ task, checked, onToggle }: { task: TaskItem; checked: boolean; onToggle: () => void }) {
  const catCfg = categoryConfig[task.category];
  const priCfg = priorityConfig[task.priority];
  const stsCfg = statusConfig[task.status];
  const dlInfo = getDeadlineInfo(task.deadlineDate);
  const grad = getAssigneeGradient(task.assignee);

  return (
    <TableRow className="group hover:bg-gray-50">
      <TableCell className="pr-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-900">{task.title}</div>
        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{task.description}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs gap-1", catCfg.cls)}>
          <span>{catCfg.icon}</span> {catCfg.label}
        </Badge>
      </TableCell>
      <TableCell>
        {task.object ? (
          <div>
            <div className="text-sm text-gray-900">{task.object.name}</div>
            <div className="text-xs text-gray-400">{task.object.address}</div>
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className={cn("text-white text-xs bg-gradient-to-br", grad)}>
              {getInitials(task.assignee)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-700">{task.assignee}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs", priCfg.cls)}>{priCfg.label}</Badge>
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm text-gray-700">{task.deadline}</div>
          <div className={cn("text-xs", dlInfo.cls)}>{dlInfo.text}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs", stsCfg.cls)}>{stsCfg.label}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Открыть</DropdownMenuItem>
            <DropdownMenuItem>Редактировать</DropdownMenuItem>
            <DropdownMenuItem>Назначить</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// ─── Board View (Kanban) ───

function TaskBoardView({ tasks }: { tasks: TaskItem[] }) {
  const columns: { key: TaskStatus; label: string }[] = [
    { key: "planned", label: "Запланировано" },
    { key: "in-progress", label: "В работе" },
    { key: "review", label: "На проверке" },
    { key: "done", label: "Выполнено" },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map(col => {
        const items = tasks.filter(t => t.status === col.key);
        return (
          <div key={col.key} className="min-w-[280px] flex-1">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-gray-500">{col.label}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(task => {
                const catCfg = categoryConfig[task.category];
                const dlInfo = getDeadlineInfo(task.deadlineDate);
                const grad = getAssigneeGradient(task.assignee);
                return (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-sm text-gray-900 mb-2">{task.title}</div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Badge variant="outline" className={cn("text-xs gap-1", catCfg.cls)}>
                        <span className="text-[10px]">{catCfg.icon}</span> {catCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className={cn("text-white text-xs bg-gradient-to-br", grad)}>
                          {getInitials(task.assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn("text-xs", dlInfo.cls)}>{task.deadline}</span>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-xs text-gray-300">
                  Нет задач
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Calendar View ───

function TaskCalendarView({ tasks }: { tasks: TaskItem[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 3, 3 + i - ((TODAY.getDay() + 6) % 7)); // Mon-Sun of current week
    // simplify: show Mon Apr 30 - Sun Apr 6, anchored from today=Thu Apr 3
    // Let's just show 7 days starting from Mon Mar 30
    return new Date(2026, 2, 30 + i); // Mon Mar 30 ... Sun Apr 5
  });
  // Actually let's compute the week properly
  const dayOfWeek = (TODAY.getDay() + 6) % 7; // Mon=0
  const monday = new Date(TODAY);
  monday.setDate(monday.getDate() - dayOfWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === TODAY.toDateString();
          const dayTasks = tasks.filter(t => t.deadlineDate.toDateString() === day.toDateString());
          return (
            <div key={i} className={cn("border-r border-b border-gray-100 last:border-r-0 min-h-[160px]", isToday && "bg-blue-50/30")}>
              <div className={cn("px-2 py-1.5 border-b border-gray-100 text-center", isToday && "bg-blue-50")}>
                <div className="text-xs text-gray-400">{dayNames[i]}</div>
                <div className={cn("text-sm", isToday ? "text-blue-700" : "text-gray-700")}>
                  {day.getDate()}
                </div>
              </div>
              <div className="p-1 space-y-1">
                {dayTasks.map(task => {
                  const catCfg = categoryConfig[task.category];
                  return (
                    <div key={task.id} className={cn("rounded px-1.5 py-1 text-xs cursor-pointer border", catCfg.cls)} title={task.title}>
                      <div className="truncate">{task.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 2: Routes ───

function RoutesTab() {
  const [routeDate, setRouteDate] = useState("2026-04-03");
  const [routeCurator, setRouteCurator] = useState("alexey");
  const [points, setPoints] = useState(mockRoutePoints);

  const updateStatus = (id: string, s: RoutePointStatus) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, status: s } : p));
  };

  const uniqueObjects = new Set(points.map(p => p.objectName)).size;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Дата</Label>
            <Input type="date" value={routeDate} onChange={e => setRouteDate(e.target.value)} className="w-[170px] bg-white border-gray-200" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Куратор</Label>
            <Select value={routeCurator} onValueChange={setRouteCurator}>
              <SelectTrigger className="w-[200px] bg-white border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {assignees.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="self-end">
            <Button className="gap-2">
              <Route className="w-4 h-4" />
              Сгенерировать маршрут
            </Button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Всего точек", value: points.length, icon: "📋", color: "text-gray-900" },
          { label: "Объектов", value: uniqueObjects, icon: "🏢", color: "text-gray-900" },
          { label: "Расстояние", value: "52 км", icon: "📍", color: "text-gray-900" },
          { label: "Время в пути", value: "~1.5 ч", icon: "🕐", color: "text-gray-900" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{kpi.icon}</span>
              <span className="text-xs text-gray-500">{kpi.label}</span>
            </div>
            <div className={cn("text-2xl", kpi.color)}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Route Points */}
      <div className="space-y-2">
        {points.map((point, idx) => {
          const priCfg = priorityConfig[point.priority];
          const stsCfg = routeStatusConfig[point.status];
          const isLast = idx === points.length - 1;
          return (
            <div key={point.id} className="relative">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-4">
                  {/* Order */}
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0",
                    point.status === "done" ? "bg-green-100 text-green-700"
                      : point.status === "in-progress" ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {point.status === "done" ? <CheckCircle2 className="w-5 h-5" /> : point.order}
                  </div>

                  {/* Time */}
                  <div className="text-sm text-gray-500 w-12 shrink-0">{point.time}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 mb-0.5">{point.objectName}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">{point.checkType}</span>
                      <Badge variant="outline" className={cn("text-xs", priCfg.cls)}>{priCfg.label}</Badge>
                      <Badge variant="outline" className={cn("text-xs", stsCfg.cls)}>{stsCfg.label}</Badge>
                    </div>
                  </div>

                  {/* Distance */}
                  {point.distanceToNext && (
                    <div className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                      <span>→</span> {point.distanceToNext}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {point.status === "planned" && (
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => updateStatus(point.id, "in-progress")}>
                        <Play className="w-3 h-3" /> Начал
                      </Button>
                    )}
                    {point.status === "in-progress" && (
                      <Button size="sm" className="gap-1 text-xs" onClick={() => updateStatus(point.id, "done")}>
                        <CheckCircle2 className="w-3 h-3" /> Завершил
                      </Button>
                    )}
                    {(point.status === "planned" || point.status === "in-progress") && (
                      <Button size="sm" variant="ghost" className="gap-1 text-xs text-gray-500" onClick={() => updateStatus(point.id, "missed")}>
                        <SkipForward className="w-3 h-3" /> Пропустить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div className="flex justify-start ml-[26px] py-0.5">
                  <div className="w-px h-3 bg-gray-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map placeholder */}
      <div id="route-map" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-100 flex items-center justify-center" style={{ height: 400 }}>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Карта маршрута (Яндекс.Карты)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: My Tasks ───

function MyTasksTab({ tasks }: { tasks: TaskItem[] }) {
  const groups = useMemo(() => {
    const g: Record<string, TaskItem[]> = { overdue: [], today: [], week: [], later: [] };
    tasks.forEach(t => g[getTimeGroup(t.deadlineDate)].push(t));
    return g;
  }, [tasks]);

  const orderedKeys = ["overdue", "today", "week", "later"];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white text-sm">АП</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm text-gray-900">Анна Петрова</div>
            <div className="text-xs text-gray-400">Администратор · {tasks.length} задач</div>
          </div>
        </div>
      </div>

      {orderedKeys.map(key => {
        const items = groups[key];
        if (items.length === 0) return null;
        const cfg = groupLabels[key];
        return (
          <div key={key} className={cn("bg-white rounded-lg border border-gray-200 shadow-sm border-l-4", cfg.borderCls)}>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">{cfg.label}</span>
              <span className="ml-2 text-xs text-gray-400">{items.length}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(task => {
                const catCfg = categoryConfig[task.category];
                const priCfg = priorityConfig[task.priority];
                const stsCfg = statusConfig[task.status];
                const dlInfo = getDeadlineInfo(task.deadlineDate);
                return (
                  <div key={task.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">{task.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{task.description}</div>
                    </div>
                    <Badge variant="outline" className={cn("text-xs gap-1 shrink-0", catCfg.cls)}>
                      <span>{catCfg.icon}</span> {catCfg.label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs shrink-0", priCfg.cls)}>{priCfg.label}</Badge>
                    <div className="text-right shrink-0 w-24">
                      <div className="text-xs text-gray-600">{task.deadline}</div>
                      <div className={cn("text-xs", dlInfo.cls)}>{dlInfo.text}</div>
                    </div>
                    <Badge variant="outline" className={cn("text-xs shrink-0", stsCfg.cls)}>{stsCfg.label}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Открыть</DropdownMenuItem>
                        <DropdownMenuItem>Завершить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {tasks.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center text-sm text-gray-400">
          Нет задач
        </div>
      )}
    </div>
  );
}

// ─── Create Task Dialog ───

function CreateTaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [category, setCategory] = useState<string>("objects");
  const showObject = category === "objects" || category === "urgent";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Создать задачу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-gray-500">Заголовок</Label>
            <Input placeholder="Введите название задачи..." className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Описание</Label>
            <Textarea placeholder="Опишите задачу..." className="mt-1" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="objects">По объектам</SelectItem>
                  <SelectItem value="documents">Документы</SelectItem>
                  <SelectItem value="clients">Клиенты</SelectItem>
                  <SelectItem value="internal">Внутренние</SelectItem>
                  <SelectItem value="urgent">Срочные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showObject && (
              <div>
                <Label className="text-xs text-gray-500">Объект</Label>
                <Select defaultValue={objectsList[0].name}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {objectsList.map(o => <SelectItem key={o.name} value={o.name}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {!showObject && <div />}
            <div>
              <Label className="text-xs text-gray-500">Исполнитель</Label>
              <Select defaultValue="alexey">
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {assignees.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] bg-gradient-to-br", a.gradient)}>
                          {getInitials(a.short)}
                        </div>
                        {a.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Приоритет</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Срочный</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Срок</Label>
            <Input type="date" className="mt-1" defaultValue="2026-04-05" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={() => onOpenChange(false)}>Создать задачу</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
