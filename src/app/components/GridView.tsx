import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Layers,
  Plus,
  X,
  Check,
  CalendarX2,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

type PeriodType = "7days" | "14days" | "month" | "custom";

interface DayColumn {
  date: string;
  dayOfWeek: string;
  fullDate: string;
  isWeekend: boolean;
  isToday: boolean;
}

interface ObjectRow {
  id: string;
  name: string;
}

interface ClientGroup {
  id: string;
  name: string;
  objects: ObjectRow[];
  isExpanded: boolean;
}

interface CellData {
  planned: number;
  needed: number;
  hasMultiple?: boolean;
  zone?: "green" | "yellow" | "red";
}

interface GridData {
  [clientId: string]: {
    [objectId: string]: {
      [date: string]: CellData | null;
    };
  };
}

// Mock данные
const generateMockDays = (): DayColumn[] => {
  const days: DayColumn[] = [];
  const startDate = new Date(2026, 4, 15); // 15.05.2026 (месяцы с 0)
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayOfWeek = dayNames[date.getDay()];
    const day = date.getDate();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday = i === 0;

    days.push({
      date: day.toString(),
      dayOfWeek,
      fullDate: `${day}.05`,
      isWeekend,
      isToday,
    });
  }

  return days;
};

const mockClients: ClientGroup[] = [
  {
    id: "lenta",
    name: "Лента",
    isExpanded: true,
    objects: [
      { id: "bc-stolica", name: "БЦ Столица" },
      { id: "parking-lenta", name: "Парковка Лента" },
      { id: "tc-lenta-vostok", name: "ТЦ Лента-Восток" },
    ],
  },
  {
    id: "stroygarant",
    name: "Стройгарант",
    isExpanded: true,
    objects: [
      { id: "zhk-vostok", name: "ЖК Восток" },
      { id: "zhk-parkovy", name: "ЖК Парковый" },
    ],
  },
  {
    id: "biznespark",
    name: "БизнесПарк",
    isExpanded: true,
    objects: [
      { id: "bc-kristall", name: "БЦ Кристалл" },
    ],
  },
  {
    id: "logistik",
    name: "Логистик+",
    isExpanded: true,
    objects: [
      { id: "sklad", name: "Склад" },
    ],
  },
  {
    id: "metro",
    name: "Метро",
    isExpanded: true,
    objects: [
      { id: "zhk-severny", name: "ЖК Северный" },
    ],
  },
];

// Mock данные для заявок (из примера в инструкции)
const mockGridData: GridData = {
  "lenta": {
    "bc-stolica": {
      "15": { planned: 12, needed: 12, zone: "green" },
      "16": { planned: 8, needed: 12, zone: "yellow" },
      "17": null,
      "18": { planned: 4, needed: 15, zone: "red" },
      "19": null,
      "20": null,
      "21": null,
    },
    "parking-lenta": {
      "15": { planned: 8, needed: 8, zone: "green" },
      "16": { planned: 8, needed: 8, zone: "green" },
      "17": { planned: 8, needed: 8, zone: "green" },
      "18": { planned: 8, needed: 8, zone: "green" },
      "19": { planned: 8, needed: 8, zone: "green" },
      "20": null,
      "21": null,
    },
    "tc-lenta-vostok": {
      "15": null,
      "16": null,
      "17": { planned: 15, needed: 20, zone: "yellow" },
      "18": null,
      "19": null,
      "20": null,
      "21": null,
    },
  },
  "stroygarant": {
    "zhk-vostok": {
      "15": { planned: 4, needed: 15, zone: "red" },
      "16": { planned: 15, needed: 15, zone: "green" },
      "17": { planned: 15, needed: 15, zone: "green" },
      "18": null,
      "19": null,
      "20": null,
      "21": null,
    },
    "zhk-parkovy": {
      "15": null,
      "16": null,
      "17": null,
      "18": { planned: 10, needed: 10, zone: "green" },
      "19": { planned: 10, needed: 10, zone: "green" },
      "20": null,
      "21": null,
    },
  },
  "biznespark": {
    "bc-kristall": {
      "15": null,
      "16": { planned: 6, needed: 6, zone: "green" },
      "17": null,
      "18": null,
      "19": null,
      "20": null,
      "21": null,
    },
  },
  "logistik": {
    "sklad": {
      "15": null,
      "16": null,
      "17": null,
      "18": null,
      "19": { planned: 25, needed: 10, zone: "red" },
      "20": null,
      "21": null,
    },
  },
  "metro": {
    "zhk-severny": {
      "15": { planned: 18, needed: 20, zone: "yellow" },
      "16": null,
      "17": null,
      "18": null,
      "19": null,
      "20": null,
      "21": null,
    },
  },
};

interface GridViewProps {
  onViewModeChange?: (mode: "list" | "grid") => void;
}

export function GridView({ onViewModeChange }: GridViewProps = {}) {
  const [period, setPeriod] = useState<PeriodType>("7days");
  const [clients, setClients] = useState<ClientGroup[]>(mockClients);
  const [days] = useState<DayColumn[]>(generateMockDays());
  const [editingCell, setEditingCell] = useState<{ clientId: string; objectId: string; date: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleClient = (clientId: string) => {
    setClients(
      clients.map((c) =>
        c.id === clientId ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };

  const toggleAllClients = () => {
    const allExpanded = clients.every((c) => c.isExpanded);
    setClients(clients.map((c) => ({ ...c, isExpanded: !allExpanded })));
  };

  const getCellBgColor = (data: CellData | null) => {
    if (!data) return "bg-white";
    if (data.zone === "green") return "bg-green-50 border border-green-200";
    if (data.zone === "yellow") return "bg-yellow-50 border border-yellow-200";
    if (data.zone === "red") return "bg-red-50 border border-red-300";
    return "bg-white";
  };

  const getCellTextColor = (data: CellData) => {
    if (data.planned < data.needed) return "text-red-500";
    return "text-slate-900";
  };

  const getClientTotal = (clientId: string, date: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    if (!client) return 0;

    let total = 0;
    client.objects.forEach((obj) => {
      const cellData = mockGridData[clientId]?.[obj.id]?.[date];
      if (cellData) {
        total += cellData.needed;
      }
    });
    return total;
  };

  const getTotals = (date: string) => {
    let totalNeeded = 0;
    let totalPlanned = 0;

    clients.forEach((client) => {
      client.objects.forEach((obj) => {
        const cellData = mockGridData[client.id]?.[obj.id]?.[date];
        if (cellData) {
          totalNeeded += cellData.needed;
          totalPlanned += cellData.planned;
        }
      });
    });

    return { totalNeeded, totalPlanned, deficit: totalPlanned - totalNeeded };
  };

  const handleCellClick = (clientId: string, objectId: string, date: string, hasData: boolean) => {
    if (!hasData) {
      setEditingCell({ clientId, objectId, date });
      setEditValue("");
    }
  };

  const handleCellEdit = () => {
    if (editingCell && editValue) {
      // Здесь будет логика создания заявки
      console.log("Creating request:", editingCell, editValue);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const allExpanded = clients.every((c) => c.isExpanded);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Верхняя панель управления */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Переключатель видов */}
          <div className="flex items-center rounded-md border border-slate-200 bg-white">
            <button
              onClick={() => onViewModeChange?.("list")}
              className="px-3 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors rounded-l-md bg-white text-slate-500 hover:bg-slate-50"
            >
              <List className="w-3.5 h-3.5" />
              Список
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <button
              className="px-3 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors rounded-r-md bg-[#EFF6FF] text-[#4877A5] font-semibold"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Сетка
            </button>
          </div>

          {/* Переключатель периода */}
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Сегодня + 7 дней</SelectItem>
              <SelectItem value="14days">Сегодня + 14 дней</SelectItem>
              <SelectItem value="month">Этот месяц</SelectItem>
              <SelectItem value="custom">Произвольный период</SelectItem>
            </SelectContent>
          </Select>

          {/* Навигация по периоду */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 px-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3">
              Сегодня
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Свернуть/Развернуть все */}
        <Button variant="outline" size="sm" onClick={toggleAllClients}>
          {allExpanded ? "Свернуть всё" : "Развернуть всё"}
        </Button>
      </div>

      {/* Таблица сетки */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Шапка таблицы */}
          <div className="sticky top-0 z-20 flex bg-slate-50 border-b-2 border-slate-200">
            {/* Первая колонка - Клиент/Объект */}
            <div className="sticky left-0 z-30 w-[280px] bg-slate-50 border-r border-slate-200 px-4 py-3">
              <div className="text-[12px] font-[var(--font-nunito)] uppercase text-slate-500 font-semibold">
                КЛИЕНТ · ОБЪЕКТ
              </div>
            </div>

            {/* Колонки дат */}
            {days.map((day) => (
              <div
                key={day.fullDate}
                className={cn(
                  "w-[100px] px-2 py-2 text-center flex flex-col items-center justify-center",
                  day.isToday && "bg-blue-50",
                  day.isWeekend && !day.isToday && "bg-red-50"
                )}
              >
                <div
                  className={cn(
                    "text-[12px] font-[var(--font-nunito)] uppercase",
                    day.isToday ? "text-[#4877A5]" : "text-slate-500"
                  )}
                >
                  {day.dayOfWeek} {day.date}
                </div>
              </div>
            ))}
          </div>

          {/* Строки клиентов и объектов */}
          {clients.map((client) => (
            <div key={client.id}>
              {/* Строка-заголовок клиента */}
              <div className="flex bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="sticky left-0 z-10 w-[280px] bg-slate-50 border-r border-slate-200 px-4 py-3">
                  <button
                    onClick={() => toggleClient(client.id)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    {client.isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="text-[14px] font-[var(--font-nunito)] font-semibold text-slate-900">
                      {client.name}
                    </span>
                    <span className="text-[12px] font-[var(--font-nunito)] text-slate-500">
                      ({client.objects.length} {client.objects.length === 1 ? 'объект' : 'объекта'})
                    </span>
                  </button>
                </div>

                {/* Суммы по клиенту */}
                {days.map((day) => {
                  const total = getClientTotal(client.id, day.date);
                  return (
                    <div
                      key={day.fullDate}
                      className={cn(
                        "w-[100px] px-2 py-3 text-center",
                        day.isToday && "bg-blue-50",
                        day.isWeekend && !day.isToday && "bg-red-50"
                      )}
                    >
                      <span className="text-[14px] font-[var(--font-mono)] font-semibold text-slate-700">
                        {total > 0 ? total : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Строки объектов */}
              {client.isExpanded &&
                client.objects.map((object) => (
                  <div key={object.id} className="flex border-b border-slate-100">
                    <div className="sticky left-0 z-10 w-[280px] bg-white border-r border-slate-200 px-4 py-2.5 pl-9">
                      <span className="text-[14px] font-[var(--font-nunito)] text-slate-900">
                        {object.name}
                      </span>
                    </div>

                    {/* Ячейки данных */}
                    {days.map((day) => {
                      const cellData = mockGridData[client.id]?.[object.id]?.[day.date];
                      const isEditing = editingCell?.clientId === client.id &&
                                       editingCell?.objectId === object.id &&
                                       editingCell?.date === day.date;

                      return (
                        <div
                          key={day.fullDate}
                          className={cn(
                            "w-[100px] px-2 py-2.5 text-center relative group",
                            day.isWeekend && "bg-red-50"
                          )}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleCellEdit();
                                  if (e.key === "Escape") handleCancelEdit();
                                }}
                                autoFocus
                                className="w-14 px-1 py-0.5 text-[14px] font-[var(--font-mono)] text-center border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleCellEdit}
                                className="p-0.5 hover:bg-green-100 rounded"
                              >
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-0.5 hover:bg-red-100 rounded"
                              >
                                <X className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          ) : cellData ? (
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    onClick={() => handleCellClick(client.id, object.id, day.date, true)}
                                    className={cn(
                                      "inline-flex items-center gap-1 px-2 py-1 rounded cursor-pointer",
                                      getCellBgColor(cellData),
                                      "hover:shadow-sm transition-shadow"
                                    )}
                                  >
                                    <span className={cn("text-[14px] font-[var(--font-mono)] font-medium", getCellTextColor(cellData))}>
                                      {cellData.planned}/{cellData.needed}
                                    </span>
                                    {cellData.hasMultiple && (
                                      <Layers className="w-3 h-3 text-slate-400" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <div>Запланировано: {cellData.planned}</div>
                                    <div>Нужно: {cellData.needed}</div>
                                    <div>Дефицит: {cellData.planned - cellData.needed}</div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div
                              onClick={() => handleCellClick(client.id, object.id, day.date, false)}
                              className="cursor-pointer group-hover:bg-slate-50 rounded py-1 transition-colors"
                            >
                              <span className="text-slate-300 group-hover:hidden">—</span>
                              <Plus className="w-4 h-4 text-slate-400 mx-auto hidden group-hover:block" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          ))}

          {/* Строки итогов */}
          <div className="sticky bottom-0 z-20 bg-slate-50 border-t-2 border-slate-200">
            {/* ИТОГО НУЖНО */}
            <div className="flex border-b border-slate-100">
              <div className="sticky left-0 z-10 w-[280px] bg-slate-50 border-r border-slate-200 px-4 py-2">
                <span className="text-[12px] font-[var(--font-nunito)] uppercase font-semibold text-slate-600">
                  ИТОГО НУЖНО
                </span>
              </div>
              {days.map((day) => {
                const { totalNeeded } = getTotals(day.date);
                return (
                  <div
                    key={day.fullDate}
                    className="w-[100px] px-2 py-2 text-center"
                  >
                    <span className="text-[14px] font-[var(--font-mono)] font-semibold text-slate-900">
                      {totalNeeded}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ЗАПЛАНИРОВАНО */}
            <div className="flex border-b border-slate-100">
              <div className="sticky left-0 z-10 w-[280px] bg-slate-50 border-r border-slate-200 px-4 py-2">
                <span className="text-[12px] font-[var(--font-nunito)] uppercase font-semibold text-slate-600">
                  ЗАПЛАНИРОВАНО
                </span>
              </div>
              {days.map((day) => {
                const { totalPlanned } = getTotals(day.date);
                return (
                  <div
                    key={day.fullDate}
                    className="w-[100px] px-2 py-2 text-center"
                  >
                    <span className="text-[14px] font-[var(--font-mono)] font-semibold text-slate-900">
                      {totalPlanned}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ДЕФИЦИТ */}
            <div className="flex">
              <div className="sticky left-0 z-10 w-[280px] bg-slate-50 border-r border-slate-200 px-4 py-2">
                <span className="text-[12px] font-[var(--font-nunito)] uppercase font-semibold text-slate-600">
                  ДЕФИЦИТ
                </span>
              </div>
              {days.map((day) => {
                const { deficit } = getTotals(day.date);
                return (
                  <div
                    key={day.fullDate}
                    className="w-[100px] px-2 py-2 text-center"
                  >
                    <span
                      className={cn(
                        "text-[14px] font-[var(--font-mono)] font-bold",
                        deficit < 0 ? "text-red-500" : "text-slate-400"
                      )}
                    >
                      {deficit < 0 ? deficit : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
