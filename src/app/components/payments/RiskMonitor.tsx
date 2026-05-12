import { useState, Fragment } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type RiskLevel = "low" | "medium" | "high";

interface FNSCriterion {
  id: number;
  name: string;
  status: "risk" | "ok";
}

interface WorkerRisk {
  id: string;
  fullName: string;
  inn: string;
  riskLevel: RiskLevel;
  score: number;
  violations: string[];
  lastCheck: string;
  criteria: FNSCriterion[];
}

const allCriteriaNames = [
  "Единственный заказчик",
  "Регулярность выплат",
  "Фиксированная сумма выплат",
  "Режим работы совпадает с графиком заказчика",
  "Работа на территории заказчика",
  "Использование оборудования заказчика",
  "Подчинение внутреннему распорядку",
  "Длительность сотрудничества > 12 мес",
  "Отсутствие других заказчиков",
  "Контроль со стороны заказчика",
  "Выплаты совпадают с зарплатным графиком",
  "Исполнитель ранее был сотрудником",
  "Штрафные санкции от заказчика",
  "Отсутствие предпринимательских расходов",
  "Интеграция в организационную структуру",
  "Материальная зависимость от заказчика",
  "Выполнение функций штатного сотрудника",
];

function buildCriteria(riskIndices: number[]): FNSCriterion[] {
  return allCriteriaNames.map((name, i) => ({
    id: i + 1,
    name,
    status: riskIndices.includes(i) ? "risk" : "ok",
  }));
}

const mockWorkers: WorkerRisk[] = [
  {
    id: "W-001",
    fullName: "Иванов Олег Петрович",
    inn: "7712345678",
    riskLevel: "high",
    score: 82,
    violations: ["Один заказчик", "Регулярные выплаты", "Фиксированная сумма"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([0, 1, 2, 7, 8]),
  },
  {
    id: "W-002",
    fullName: "Петрова Мария Александровна",
    inn: "7798765432",
    riskLevel: "medium",
    score: 45,
    violations: ["Частые выплаты"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([1, 10]),
  },
  {
    id: "W-003",
    fullName: "Сидоров Пётр Николаевич",
    inn: "7756781234",
    riskLevel: "low",
    score: 12,
    violations: [],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([]),
  },
  {
    id: "W-004",
    fullName: "Козлов Дмитрий Сергеевич",
    inn: "7743218765",
    riskLevel: "high",
    score: 91,
    violations: ["Один заказчик", "Регулярные выплаты", "Фиксированная сумма", "Бывший сотрудник"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([0, 1, 2, 7, 8, 11]),
  },
  {
    id: "W-005",
    fullName: "Смирнова Елена Викторовна",
    inn: "7709876543",
    riskLevel: "medium",
    score: 38,
    violations: ["Регулярные выплаты"],
    lastCheck: "02.04.2026",
    criteria: buildCriteria([1]),
  },
  {
    id: "W-006",
    fullName: "Волков Андрей Игоревич",
    inn: "7765432109",
    riskLevel: "high",
    score: 76,
    violations: ["Один заказчик", "Длительное сотрудничество", "Фиксированная сумма"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([0, 2, 7, 8]),
  },
  {
    id: "W-007",
    fullName: "Новикова Ольга Павловна",
    inn: "7721098765",
    riskLevel: "medium",
    score: 52,
    violations: ["Частые выплаты", "Территория заказчика"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([1, 4, 10]),
  },
  {
    id: "W-008",
    fullName: "Морозов Игорь Владимирович",
    inn: "7754321098",
    riskLevel: "low",
    score: 8,
    violations: [],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([]),
  },
  {
    id: "W-009",
    fullName: "Лебедев Артём Константинович",
    inn: "7787654321",
    riskLevel: "high",
    score: 88,
    violations: ["Один заказчик", "Регулярные выплаты", "Контроль заказчика"],
    lastCheck: "02.04.2026",
    criteria: buildCriteria([0, 1, 7, 8, 9]),
  },
  {
    id: "W-010",
    fullName: "Федорова Наталья Дмитриевна",
    inn: "7732109876",
    riskLevel: "medium",
    score: 41,
    violations: ["Фиксированная сумма"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([2]),
  },
  {
    id: "W-011",
    fullName: "Кузнецов Алексей Романович",
    inn: "7710987654",
    riskLevel: "low",
    score: 15,
    violations: [],
    lastCheck: "01.04.2026",
    criteria: buildCriteria([]),
  },
  {
    id: "W-012",
    fullName: "Попов Сергей Михайлович",
    inn: "7776543210",
    riskLevel: "high",
    score: 79,
    violations: ["Один заказчик", "Регулярные выплаты", "Бывший сотрудник"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([0, 1, 7, 11]),
  },
  {
    id: "W-013",
    fullName: "Соколова Анна Сергеевна",
    inn: "7749876501",
    riskLevel: "medium",
    score: 48,
    violations: ["Частые выплаты", "Длительное сотрудничество"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([1, 7]),
  },
  {
    id: "W-014",
    fullName: "Михайлов Виктор Андреевич",
    inn: "7701234509",
    riskLevel: "high",
    score: 85,
    violations: ["Один заказчик", "Фиксированная сумма", "Контроль заказчика", "Внутренний распорядок"],
    lastCheck: "03.04.2026",
    criteria: buildCriteria([0, 2, 6, 8, 9]),
  },
  {
    id: "W-015",
    fullName: "Андреева Татьяна Ильинична",
    inn: "7768901234",
    riskLevel: "medium",
    score: 44,
    violations: ["Регулярные выплаты"],
    lastCheck: "02.04.2026",
    criteria: buildCriteria([1, 10]),
  },
];

const riskConfig: Record<RiskLevel, { label: string; color: string; badgeBg: string }> = {
  low: {
    label: "Низкий",
    color: "text-green-700",
    badgeBg: "bg-green-50 text-green-700 border-green-200",
  },
  medium: {
    label: "Средний",
    color: "text-orange-600",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  high: {
    label: "Высокий",
    color: "text-red-600",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
  },
};

function getScoreColor(score: number) {
  if (score >= 70) return "bg-red-500";
  if (score >= 30) return "bg-orange-400";
  return "bg-green-500";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

const totalWorkers = 156;
const lowRisk = 128;
const mediumRisk = 21;
const highRisk = 7;

export default function RiskMonitor() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [isChecking, setIsChecking] = useState(false);

  const filteredWorkers = mockWorkers.filter((w) => {
    if (filterRisk !== "all" && w.riskLevel !== filterRisk) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.fullName.toLowerCase().includes(q) ||
        w.inn.includes(q)
      );
    }
    return true;
  });

  const handleRunCheck = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">Проверка рисков переквалификации</h2>
            <p className="text-xs text-gray-500">
              Мониторинг 17 критериев ФНС для снижения налоговых рисков
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={handleRunCheck}
            disabled={isChecking}
          >
            <Play className={cn("w-4 h-4", isChecking && "animate-spin")} />
            {isChecking ? "Проверка..." : "Запустить проверку"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500">Всего исполнителей</span>
          </div>
          <div className="text-2xl text-gray-900">{totalWorkers}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Низкий риск</span>
          </div>
          <div className="text-2xl text-green-600">{lowRisk}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs text-gray-500">Средний риск</span>
          </div>
          <div className="text-2xl text-orange-600">{mediumRisk}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xs text-gray-500">Высокий риск</span>
          </div>
          <div className="text-2xl text-red-600">{highRisk}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по ФИО, ИНН..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200"
          />
        </div>
        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Уровень риска" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все уровни</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="low">Низкий</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-gray-500">
          Показано: {filteredWorkers.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30px]"></TableHead>
              <TableHead className="w-[240px]">ФИО</TableHead>
              <TableHead className="w-[120px]">ИНН</TableHead>
              <TableHead className="w-[120px]">Уровень риска</TableHead>
              <TableHead className="w-[160px]">Общий балл</TableHead>
              <TableHead className="w-[300px]">Критерии с нарушениями</TableHead>
              <TableHead className="w-[130px]">Последняя проверка</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.map((worker) => {
              const isExpanded = expandedId === worker.id;
              const cfg = riskConfig[worker.riskLevel];
              return (
                <Fragment key={worker.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : worker.id)
                    }
                  >
                    <TableCell className="pr-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={cn(
                              "text-xs text-white",
                              worker.riskLevel === "high"
                                ? "bg-gradient-to-br from-red-400 to-red-600"
                                : worker.riskLevel === "medium"
                                ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                : "bg-gradient-to-br from-green-400 to-green-600"
                            )}
                          >
                            {getInitials(worker.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">
                          {worker.fullName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-600 font-mono">
                        {worker.inn}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", cfg.badgeBg)}
                      >
                        {cfg.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={worker.score}
                          className="h-2 w-20 bg-gray-100"
                          indicatorClassName={getScoreColor(worker.score)}
                        />
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            cfg.color
                          )}
                        >
                          {worker.score}/100
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {worker.violations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {worker.violations.map((v) => (
                            <span
                              key={v}
                              className="inline-block text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {worker.lastCheck}
                      </span>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Детали проверки</DropdownMenuItem>
                          <DropdownMenuItem>Перезапустить проверку</DropdownMenuItem>
                          <DropdownMenuItem>Экспорт отчёта</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded criteria panel */}
                  {isExpanded && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={8} className="p-0">
                        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
                          <h4 className="text-xs text-gray-500 mb-3">
                            Детали проверки — 17 критериев ФНС
                          </h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                            {worker.criteria.map((c) => (
                              <div
                                key={c.id}
                                className="flex items-center gap-2 text-sm py-1"
                              >
                                <span className="text-xs text-gray-400 w-5 text-right tabular-nums">
                                  {c.id}.
                                </span>
                                {c.status === "risk" ? (
                                  <span className="text-orange-500 text-xs">⚠️</span>
                                ) : (
                                  <span className="text-green-500 text-xs">✅</span>
                                )}
                                <span
                                  className={cn(
                                    "text-xs",
                                    c.status === "risk"
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  )}
                                >
                                  {c.name}
                                </span>
                                <span
                                  className={cn(
                                    "ml-auto text-xs",
                                    c.status === "risk"
                                      ? "text-orange-600"
                                      : "text-green-600"
                                  )}
                                >
                                  {c.status === "risk" ? "Риск" : "Норма"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}