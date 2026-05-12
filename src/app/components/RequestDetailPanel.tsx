import { useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Lock,
  AlertTriangle,
  Pencil,
  CheckCircle2,
  CircleDot,
  Circle,
  Plus,
  Send,
  Phone,
  MessageCircle,
  MessageSquare,
  Clock,
  X,
  CalendarClock,
  Building2,
  User,
  Users,
  Radio,
  Check,
  ArrowRight,
  UserPlus,
  ChevronUp,
  MoreVertical,
  MapPin,
  UserCheck,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Tabs from "@radix-ui/react-tabs";

interface RequestDetailPanelProps {
  onBack: () => void;
}

type RequestStatus =
  | "created"
  | "in_work"
  | "planning_done"
  | "exit_tracked"
  | "shifts_closed"
  | "approved"
  | "paid"
  | "completed";

interface Blocker {
  id: string;
  title: string;
  description: string;
  level: "critical" | "soft";
}

interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  text: string;
  author?: string;
  status: "completed" | "current" | "upcoming";
}

const statusConfig: Record<RequestStatus, { label: string; bg: string; text: string }> = {
  created: { label: "Создана", bg: "#F1F5F9", text: "#475569" },
  in_work: { label: "В работе", bg: "#F5F3FF", text: "#6D28D9" },
  planning_done: { label: "Подбор завершён", bg: "#DBEAFE", text: "#1E40AF" },
  exit_tracked: { label: "Выход отслежен", bg: "#CFFAFE", text: "#0E7490" },
  shifts_closed: { label: "Смены закрыты", bg: "#FEF9C3", text: "#854D0E" },
  approved: { label: "Согласовано", bg: "#DCFCE7", text: "#166534" },
  paid: { label: "Выплачено", bg: "#D1FAE5", text: "#065F46" },
  completed: { label: "Завершена", bg: "#F1F5F9", text: "#475569" },
};

const mockBlockers: Blocker[] = [
  {
    id: "1",
    title: "Ждёт оплату",
    description: "Баланс клиента: −45 000 ₽",
    level: "critical",
  },
  {
    id: "2",
    title: "Мастер не назначен",
    description: "Не выбран контакт на объекте",
    level: "soft",
  },
];

const mockTimeline: TimelineEvent[] = [
  {
    id: "1",
    date: "13.05",
    time: "14:30",
    text: "Заявка создана",
    author: "Анна Петрова",
    status: "completed",
  },
  {
    id: "2",
    date: "15.05",
    time: "08:00",
    text: "Ожидается: Выход",
    author: "(сегодня)",
    status: "current",
  },
  {
    id: "3",
    date: "",
    text: "Ожидается: Смены закрыты",
    status: "upcoming",
  },
  {
    id: "4",
    date: "",
    text: "Ожидается: Смены согласованы",
    status: "upcoming",
  },
  {
    id: "5",
    date: "",
    text: "Ожидается: Выплаты",
    status: "upcoming",
  },
  {
    id: "6",
    date: "",
    text: "Ожидается: Завершена",
    status: "upcoming",
  },
];

export function RequestDetailPanel({ onBack }: RequestDetailPanelProps) {
  const [blockersOpen, setBlockersOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [transferReason, setTransferReason] = useState("");
  const [cancelReason, setCancelReason] = useState("transferred");
  const [cancelComment, setCancelComment] = useState("");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const requestData = {
    id: "1236",
    title: "Стройгарант · ЖК Восток",
    status: "planning_done" as RequestStatus,
    date: "13.05.2026",
    author: "Анна Петрова",
    blockers: mockBlockers,
    underResponsibility: null,
    client: "Стройгарант",
    object: "ЖК Восток",
    master: "Петров Иван Иванович",
    phone: "+7 999 234-56-78",
    workDate: "15.05.2026",
    startTime: "08:00",
    duration: "10 часов",
    address: "ул. Пушкина, д. 5",
    needed: 15,
    workType: "Уборка после ремонта",
    isPhysicallyHard: "Нет",
    gender: "Любой",
    executorRate: "1 200 ₽/смена",
    coordinatorBonus: "+300 ₽/смена",
    clientRate: "1 500 ₽/смена",
    margin: "300 ₽/смена",
  };

  const lines = [
    {
      id: "1",
      name: "Линия 1: Уборка этажей 1-3",
      master: "Петров И. И.",
      sector: "А",
      shift: "08:00–18:00 (10ч)",
      needed: 8,
      distributed: null,
      tasks: [
        { name: "Уборка этажей 1-3", unit: "м²", plan: 1500, fact: 1420 },
        { name: "Мойка окон", unit: "шт", plan: 80, fact: 75 },
      ],
      executorRate: "1 200 ₽",
      clientRate: "1 500 ₽",
      margin: "300 ₽",
      teams: 2,
    },
    {
      id: "2",
      name: "Линия 2: Уборка этажей 4-6",
      master: "Сидоров А. А.",
      sector: "Б",
      shift: "09:00–19:00 (10ч)",
      needed: 4,
      distributed: null,
      tasks: [
        { name: "Уборка этажей 4-6", unit: "м²", plan: 800, fact: null },
      ],
      executorRate: "1 200 ₽",
      clientRate: "1 500 ₽",
      margin: "300 ₽",
      teams: null,
    },
  ];

  const hasCriticalBlockers = requestData.blockers.some((b) => b.level === "critical");

  const handleTransferToWork = () => {
    if (hasCriticalBlockers) {
      setTransferDialogOpen(true);
    }
  };

  const handleConfirmTransfer = () => {
    if (transferReason.trim()) {
      setTransferDialogOpen(false);
      setTransferReason("");
    }
  };

  const handleConfirmCancel = () => {
    if (cancelComment.trim()) {
      setCancelDialogOpen(false);
      setCancelComment("");
      setCancelReason("transferred");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-colors hover:text-[#3a6189]"
          style={{ color: "#4877A5", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Назад к списку
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        {/* Row 1: Title + Status */}
        <div className="flex items-start justify-between mb-2">
          <h1
            className="text-lg"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "#0F172A",
            }}
          >
            {requestData.title}
          </h1>

          {/* Status Badge with Dropdown */}
          <DropdownMenu.Root open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-1.5 rounded-lg transition-opacity hover:opacity-80 text-xs"
                style={{
                  backgroundColor: statusConfig[requestData.status].bg,
                  color: statusConfig[requestData.status].text,
                  fontWeight: 500,
                  padding: "4px 10px",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {statusConfig[requestData.status].label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white rounded-lg shadow-lg min-w-[300px]"
                sideOffset={5}
                style={{ zIndex: 9999, padding: "12px", borderRadius: "8px" }}
              >
                <div className="mb-2 text-xs" style={{ fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  ТЕКУЩИЙ СТАТУС
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: "#0F172A" }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[requestData.status].text }} />
                  {statusConfig[requestData.status].label}
                </div>

                <div className="border-t my-2" style={{ borderColor: "#E2E8F0" }} />

                {requestData.status === "created" && (
                  <>
                    <button
                      onClick={handleTransferToWork}
                      className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded transition-colors text-sm"
                      style={{ color: "#0F172A" }}
                    >
                      → Передать в работу
                    </button>
                    {hasCriticalBlockers && (
                      <div className="flex items-center gap-1.5 px-2 py-1 text-xs" style={{ color: "#EAB308" }}>
                        <AlertTriangle className="w-3 h-3" />
                        Есть блокировки
                      </div>
                    )}
                  </>
                )}

                <div className="border-t my-2" style={{ borderColor: "#E2E8F0" }} />

                <button
                  onClick={() => {
                    setStatusDropdownOpen(false);
                    setCancelDialogOpen(true);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded transition-colors text-sm"
                  style={{ color: "#EF4444" }}
                >
                  ✕ Не состоится
                </button>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Row 2: Metadata + Blockers */}
        <div className="flex items-center justify-between text-xs" style={{ color: "#64748B" }}>
          <div>
            #{requestData.id} · {requestData.date} · {requestData.author}
          </div>

          <div className="flex items-center gap-2">
            {/* Blockers Badge */}
            <Popover.Root open={blockersOpen} onOpenChange={setBlockersOpen}>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-md transition-opacity hover:opacity-80 text-xs"
                  style={{
                    backgroundColor: hasCriticalBlockers ? "#FEF2F2" : "#F1F5F9",
                    color: hasCriticalBlockers ? "#DC2626" : "#64748B",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  <Lock style={{ width: "12px", height: "12px" }} />
                  {requestData.blockers.length}
                  <ChevronDown style={{ width: "12px", height: "12px" }} />
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  className="bg-white rounded-lg shadow-lg w-[340px]"
                  sideOffset={5}
                  style={{ zIndex: 9999, padding: "14px", borderRadius: "8px" }}
                >
                  <div className="mb-2 text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
                    БЛОКИРОВКИ ({requestData.blockers.length})
                  </div>

                  <div className="space-y-3">
                    {requestData.blockers.map((blocker) => (
                      <div key={blocker.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <Lock
                              style={{
                                width: "12px",
                                height: "12px",
                                color: blocker.level === "critical" ? "#EF4444" : "#94A3B8",
                              }}
                            />
                            <span className="text-sm" style={{ color: "#0F172A", fontWeight: 500 }}>
                              {blocker.title}
                            </span>
                          </div>
                          <span
                            className="text-xs"
                            style={{
                              color: blocker.level === "critical" ? "#DC2626" : "#64748B",
                            }}
                          >
                            {blocker.level === "critical" ? "Критичное" : "Мягкое"}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: "#64748B", marginLeft: "20px" }}>
                          {blocker.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs" style={{ color: "#64748B", lineHeight: "1.4" }}>
                    Блокировки проверяются автоматически.
                  </div>

                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview" onValueChange={setActiveTab}>
        <div className="bg-white border-b border-[#E2E8F0]">
          <div className="px-4">
            <Tabs.List className="flex items-center gap-4" style={{ border: "none", background: "transparent" }}>
              {["overview", "candidates", "shifts", "communications"].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="py-2 transition-colors cursor-pointer bg-transparent text-sm"
                  style={{
                    fontWeight: 500,
                    color: activeTab === tab ? "#4877A5" : "#64748B",
                    borderBottom: activeTab === tab ? "2px solid #4877A5" : "2px solid transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  {tab === "overview" && "Обзор"}
                  {tab === "candidates" && "Кандидаты"}
                  {tab === "shifts" && "Смены"}
                  {tab === "communications" && "Коммуникации"}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>
        </div>

        {/* Tab Content - Overview */}
        <Tabs.Content value="overview">
          <div className="px-4 py-4 space-y-4">
            {/* Section 1: Parameters Grid (2x2) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Client and Object */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 group hover:border-gray-300 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs" style={{ textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                    КЛИЕНТ И ОБЪЕКТ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-2 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Клиент:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Объект:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.object}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Мастер:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.master}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Телефон:</span>
                    <a href={`tel:${requestData.phone}`} style={{ color: "#4877A5" }}>
                      {requestData.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Time and Place */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 group hover:border-gray-300 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs" style={{ textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                    ВРЕМЯ И МЕСТО
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-2 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Дата:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.workDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Начало:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Длительность:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Адрес:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.address}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Requirements */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 group hover:border-gray-300 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs" style={{ textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                    ТРЕБОВАНИЯ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-2 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Нужно людей:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.needed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Тип работы:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.workType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Физ. тяжёлая:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.isPhysicallyHard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Пол:</span>
                    <span style={{ color: "#0F172A" }}>{requestData.gender}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Finances */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 group hover:border-gray-300 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs" style={{ textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                    ФИНАНСЫ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-2 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Ставка исполнителю:</span>
                    <span style={{ color: "#0F172A", textAlign: "right" }}>{requestData.executorRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Доплата координатору:</span>
                    <span style={{ color: "#0F172A", textAlign: "right" }}>{requestData.coordinatorBonus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Ставка клиенту:</span>
                    <span style={{ color: "#0F172A", textAlign: "right" }}>{requestData.clientRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Маржа:</span>
                    <span style={{ color: "#0F172A", textAlign: "right" }}>{requestData.margin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Numeric Summary */}
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <div className="grid grid-cols-6 divide-x divide-[#E2E8F0]">
                {[
                  { label: "Нужно", value: "15", color: "#0F172A" },
                  { label: "Запл.", value: "—", color: "#CBD5E1" },
                  { label: "Резерв", value: "—", color: "#CBD5E1" },
                  { label: "Вышло", value: "—", color: "#CBD5E1" },
                  { label: "Часов", value: "—", color: "#CBD5E1" },
                  { label: "НПД", value: "—", color: "#CBD5E1" },
                ].map((metric, idx) => (
                  <div key={idx} className="text-center px-2">
                    <div className="text-[10px]" style={{ color: "#64748B", marginBottom: "4px" }}>
                      {metric.label}
                    </div>
                    <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "16px", fontWeight: 700, color: metric.color }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2.5: Lines */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
                  Линии заявки ({lines.length})
                </h3>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs transition-colors hover:bg-blue-50"
                  style={{ borderColor: "#4877A5", color: "#4877A5" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Добавить линию
                </button>
              </div>

              <div className="space-y-3">
                {lines.map((line) => (
                  <div key={line.id} className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                    {/* Line Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
                        {line.name}
                      </h4>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <MoreVertical className="w-4 h-4" style={{ color: "#94A3B8" }} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-2 min-w-[180px]" style={{ zIndex: 9999 }}>
                            <DropdownMenu.Item className="px-3 py-2 text-xs hover:bg-gray-50 rounded cursor-pointer">Редактировать линию</DropdownMenu.Item>
                            <DropdownMenu.Item className="px-3 py-2 text-xs hover:bg-gray-50 rounded cursor-pointer">Добавить звено</DropdownMenu.Item>
                            <DropdownMenu.Item className="px-3 py-2 text-xs hover:bg-gray-50 rounded cursor-pointer">Дублировать линию</DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                            <DropdownMenu.Item className="px-3 py-2 text-xs hover:bg-gray-50 rounded cursor-pointer" style={{ color: "#EF4444" }}>Удалить линию</DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>

                    {/* Master and Sector */}
                    <div className="flex items-center gap-3 mb-2 text-xs" style={{ color: "#475569" }}>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                        Мастер: {line.master}
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                        Участок: {line.sector}
                      </div>
                    </div>

                    {/* Shift and People */}
                    <div className="flex items-center gap-3 mb-2 text-xs" style={{ color: "#475569" }}>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                        Смена: {line.shift}
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                        Нужно: {line.needed}
                      </div>
                      <span>·</span>
                      {line.distributed !== null ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                          Распределено: {line.distributed}
                        </div>
                      ) : (
                        <span style={{ color: "#64748B" }}>Запись идёт на заявку в целом</span>
                      )}
                    </div>

                    {/* Tasks */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 mb-1.5 text-xs" style={{ color: "#64748B" }}>
                        <ClipboardList className="w-3.5 h-3.5" />
                        Задания:
                      </div>
                      <div className="ml-5 space-y-0.5 text-xs" style={{ color: "#475569" }}>
                        {line.tasks.map((task, idx) => (
                          <div key={idx}>
                            • {task.name} — {task.plan} {task.unit}
                            {task.fact && <span style={{ color: "#64748B" }}> (факт: {task.fact} {task.unit})</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Finances */}
                    <div className="text-xs mb-2" style={{ color: "#64748B" }}>
                      Ставка исп.: {line.executorRate} · Ставка клиенту: {line.clientRate} · Маржа: {line.margin}
                    </div>

                    {/* Teams */}
                    {line.teams && (
                      <div className="text-xs" style={{ color: "#4877A5" }}>
                        Звеньев: {line.teams}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Timeline */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
              <h3 className="mb-3 text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
                Хронология
              </h3>

              <div className="space-y-3">
                {mockTimeline.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-2 relative text-xs">
                    <div className="flex flex-col items-center relative" style={{ width: "14px" }}>
                      {event.status === "completed" && (
                        <CheckCircle2 className="w-3.5 h-3.5 relative z-10" style={{ color: "#22C55E" }} />
                      )}
                      {event.status === "current" && (
                        <CircleDot className="w-3.5 h-3.5 relative z-10" style={{ color: "#4877A5" }} />
                      )}
                      {event.status === "upcoming" && (
                        <Circle className="w-3.5 h-3.5 relative z-10" style={{ color: "#CBD5E1" }} />
                      )}
                      {idx < mockTimeline.length - 1 && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bg-[#E2E8F0]"
                          style={{ top: "16px", height: "16px", width: "1px" }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        fontFamily: "'SF Mono', monospace",
                        color: "#64748B",
                        width: "70px",
                        flexShrink: 0,
                      }}
                    >
                      {event.date && event.time ? `${event.date} ${event.time}` : event.date || ""}
                    </div>

                    <div className="flex-1" style={{ color: "#0F172A" }}>
                      {event.text}
                    </div>

                    <div
                      className="text-right"
                      style={{
                        color: "#64748B",
                        width: "100px",
                        flexShrink: 0,
                      }}
                    >
                      {event.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab Content - Candidates */}
        <Tabs.Content value="candidates">
          <CandidatesTab />
        </Tabs.Content>

        {/* Tab Content - Shifts */}
        <Tabs.Content value="shifts">
          <ShiftsTab />
        </Tabs.Content>

        {/* Tab Content - Communications */}
        <Tabs.Content value="communications">
          <CommunicationsTab />
        </Tabs.Content>
      </Tabs.Root>

      {/* Dialogs */}
      <Dialog.Root open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ zIndex: 9998 }} />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-5 w-full max-w-sm text-sm"
            style={{ zIndex: 9999 }}
          >
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#EAB308" }} />
              <div>
                <Dialog.Title className="font-semibold mb-2" style={{ color: "#0F172A" }}>
                  Нельзя передать автоматически
                </Dialog.Title>
                <Dialog.Description style={{ color: "#64748B", marginBottom: "8px" }}>
                  Активные блокировки:
                </Dialog.Description>
                <ul className="list-disc list-inside space-y-1 mb-3" style={{ color: "#64748B" }}>
                  {requestData.blockers
                    .filter((b) => b.level === "critical")
                    .map((b) => (
                      <li key={b.id} className="text-xs">
                        {b.title} ({b.description})
                      </li>
                    ))}
                </ul>
                <p style={{ color: "#64748B", marginBottom: "8px" }}>
                  Опишите причину:
                </p>
              </div>
            </div>

            <textarea
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="Укажите причину..."
              className="w-full border border-gray-300 rounded px-2 py-1.5 mb-3 resize-none text-xs"
              rows={3}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setTransferDialogOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmTransfer}
                disabled={!transferReason.trim()}
                className="px-3 py-1.5 rounded transition-colors disabled:opacity-50 text-xs"
                style={{ backgroundColor: "#4877A5", color: "white" }}
              >
                Передать
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ zIndex: 9998 }} />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-5 w-full max-w-sm text-sm"
            style={{ zIndex: 9999 }}
          >
            <Dialog.Title className="font-semibold mb-3" style={{ color: "#0F172A" }}>
              Почему заявка не состоится?
            </Dialog.Title>

            <RadioGroup.Root value={cancelReason} onValueChange={setCancelReason} className="space-y-2 mb-3">
              {[
                { value: "client_cancel", label: "Отмена клиента" },
                { value: "not_enough_people", label: "Недобор людей" },
                { value: "no_payment", label: "Клиент не оплатил" },
                { value: "force_majeure", label: "Форс-мажор" },
                { value: "transferred", label: "Перенесена на другую дату" },
                { value: "other", label: "Другое" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroup.Item
                    value={option.value}
                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                  >
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <label className="text-xs" style={{ color: "#0F172A" }}>
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup.Root>

            <label className="block mb-2 text-xs" style={{ color: "#0F172A" }}>
              Комментарий (обязательно):
            </label>
            <textarea
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
              placeholder="Укажите информацию..."
              className="w-full border border-gray-300 rounded px-2 py-1.5 mb-3 resize-none text-xs"
              rows={3}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelComment.trim()}
                className="px-3 py-1.5 rounded transition-colors disabled:opacity-50 text-xs"
                style={{ backgroundColor: "#EF4444", color: "white" }}
              >
                Подтвердить
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// Tab Components

function CandidatesTab() {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "lines">("list");

  // Для демо используем статус "planning_done" - линии есть, но распределения ещё нет
  const isAfterExit = false; // Будет true после "exit_tracked"

  const candidates = {
    enrolled: [
      {
        id: "1",
        rating: 0.92,
        name: "Иванов Иван Иванович",
        phone: "+7 999 123-45-67",
        channel: "Telegram",
        channelStatus: "delivered",
        isCoordinator: true,
        context: "Пешком 15 мин · ЖК Восток 8 раз · у Петрова 12 смен",
      },
      {
        id: "2",
        rating: 0.88,
        name: "Петров Сергей Алексеевич",
        phone: "+7 999 234-56-78",
        channel: "IVR",
        channelStatus: "delivered",
        context: "Автобус 45 мин · у Петрова 5 смен",
      },
      {
        id: "3",
        rating: 0.75,
        name: "Сидоров Андрей Витальевич",
        phone: "+7 999 345-67-89",
        channel: "МАКС",
        channelStatus: "pending",
        context: "На машине 25 мин",
      },
      {
        id: "4",
        rating: 0.68,
        name: "Козлов Михаил Петрович",
        phone: "+7 999 456-78-90",
        channel: "SMS",
        channelStatus: "delivered",
        context: "Пешком 20 мин · ЖК Восток 3 раза",
      },
    ],
    reserve: [
      {
        id: "5",
        rating: 0.72,
        name: "Николаев Пётр Александрович",
        phone: "+7 999 555-66-77",
        channel: "Telegram",
        channelStatus: "pending",
        status: "ждёт ответа",
        context: "Пешком 12 мин",
      },
      {
        id: "6",
        rating: 0.65,
        name: "Михайлов Антон Сергеевич",
        phone: "+7 999 666-77-88",
        channel: "IVR",
        channelStatus: "pending",
        status: "ждёт ответа",
        context: "Автобус 30 мин",
      },
      {
        id: "7",
        rating: 0.58,
        name: "Волков Дмитрий Николаевич",
        phone: "+7 999 777-88-99",
        channel: "SMS",
        channelStatus: "failed",
        status: "таймаут",
        context: "На машине 40 мин",
      },
    ],
    declined: [
      {
        id: "8",
        rating: 0.81,
        name: "Алексеев Константин Игоревич",
        phone: "+7 999 888-99-00",
        channel: "Telegram",
        channelStatus: "delivered",
        status: "отказ",
        context: "Пешком 10 мин",
      },
      {
        id: "9",
        rating: 0.74,
        name: "Смирнов Олег Васильевич",
        phone: "+7 999 999-00-11",
        channel: "IVR",
        channelStatus: "delivered",
        status: "отказ",
        context: "Автобус 25 мин",
      },
    ],
    noResponse: [
      { id: "10", rating: 0.69, name: "Федоров Артём Дмитриевич", phone: "+7 999 100-11-22", channel: "—", channelStatus: "failed", status: "не ответил" },
      { id: "11", rating: 0.64, name: "Кузнецов Максим Александрович", phone: "+7 999 200-22-33", channel: "—", channelStatus: "failed", status: "не ответил" },
      { id: "12", rating: 0.61, name: "Попов Валерий Михайлович", phone: "+7 999 300-33-44", channel: "—", channelStatus: "failed", status: "не ответил" },
      { id: "13", rating: 0.57, name: "Морозов Игорь Петрович", phone: "+7 999 400-44-55", channel: "—", channelStatus: "failed", status: "не ответил" },
      { id: "14", rating: 0.52, name: "Лебедев Роман Андреевич", phone: "+7 999 500-55-66", channel: "—", channelStatus: "failed", status: "не ответил" },
    ],
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 0.8) return "#22C55E";
    if (rating >= 0.6) return "#0F172A";
    return "#EAB308";
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Telegram": return <Send className="w-3 h-3" />;
      case "IVR": return <Phone className="w-3 h-3" />;
      case "МАКС": return <MessageCircle className="w-3 h-3" />;
      case "SMS": return <MessageSquare className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="w-3 h-3" style={{ color: "#22C55E" }} />;
      case "pending": return <Clock className="w-3 h-3" style={{ color: "#EAB308" }} />;
      case "failed": return <X className="w-3 h-3" style={{ color: "#EF4444" }} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "отказ": return "#EF4444";
      case "в today-pool": return "#4877A5";
      case "таймаут": return "#EAB308";
      default: return "#64748B";
    }
  };

  const renderCandidate = (candidate: any) => (
    <div key={candidate.id} className="border-b border-[#F1F5F9]">
      <div
        onClick={() => setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)}
        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="text-sm"
            style={{
              fontFamily: "'SF Mono', monospace",
              fontWeight: 600,
              color: getRatingColor(candidate.rating),
              width: "48px",
            }}
          >
            {candidate.rating.toFixed(2)}
          </div>
          <div className="flex-1 text-sm" style={{ color: "#0F172A" }}>
            {candidate.name}
          </div>
          <a href={`tel:${candidate.phone}`} className="text-xs" style={{ color: "#64748B" }}>
            {candidate.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 ml-[60px] text-xs" style={{ color: "#64748B" }}>
          {candidate.channel !== "—" && (
            <>
              <div className="flex items-center gap-1">
                {getChannelIcon(candidate.channel)}
                <span>{candidate.channel}</span>
                {getStatusIcon(candidate.channelStatus)}
              </div>
              <span>·</span>
            </>
          )}
          {candidate.isCoordinator && (
            <>
              <span
                className="px-2 py-0.5 rounded-full text-[11px]"
                style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}
              >
                координатор
              </span>
              <span>·</span>
            </>
          )}
          <span>{candidate.context}</span>
          {candidate.status && (
            <>
              <span>·</span>
              <span style={{ color: getStatusColor(candidate.status) }}>{candidate.status}</span>
            </>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expandedCandidate === candidate.id && (
        <div className="px-3 pb-3 pt-2 bg-gray-50 border-t border-[#E2E8F0]">
          <div className="text-xs space-y-2" style={{ color: "#64748B" }}>
            <div>
              <div className="mb-1">Базовый рейтинг: 0.82</div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span>Явка последних 10 смен: 0.90</span>
                  <div className="flex-1 max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "90%" }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Явка за всё время: 0.85</span>
                  <div className="flex-1 max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "85%" }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Качество: 0.70</span>
                  <div className="flex-1 max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1">Контекстные множители:</div>
              <div className="ml-4 space-y-0.5" style={{ fontFamily: "'SF Mono', monospace" }}>
                <div>Дистанция: ×1.5 (пешком 15 мин)</div>
                <div>Мастер: ×1.3 (Петров И., 12 смен)</div>
                <div>Объект: ×1.2 (ЖК Восток, 8 раз)</div>
                <div>Тип задач: ×1.2 (уборка)</div>
                <div>Усталость: ×0.9 (работал вчера)</div>
                <div>НПД: ×1.1 (активный)</div>
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <a href="#" className="text-xs" style={{ color: "#4877A5" }}>
                Подробнее в карточке →
              </a>
              <button className="text-xs" style={{ color: "#EF4444" }}>
                Убрать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: "#0F172A" }}>
            Кандидаты для заявки
          </h3>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Записано 4 из 15. Резерв −11 человек.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs transition-colors hover:bg-blue-50"
          style={{ borderColor: "#4877A5", color: "#4877A5" }}
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить вручную
        </button>
      </div>

      {/* View Mode Switcher (only after exit) */}
      {isAfterExit && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("lines")}
            className="px-3 py-1.5 rounded-md text-xs transition-colors"
            style={{
              backgroundColor: viewMode === "lines" ? "#EFF6FF" : "transparent",
              color: viewMode === "lines" ? "#4877A5" : "#64748B",
              border: `1px solid ${viewMode === "lines" ? "#4877A5" : "#E2E8F0"}`,
            }}
          >
            По линиям
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="px-3 py-1.5 rounded-md text-xs transition-colors"
            style={{
              backgroundColor: viewMode === "list" ? "#EFF6FF" : "transparent",
              color: viewMode === "list" ? "#4877A5" : "#64748B",
              border: `1px solid ${viewMode === "list" ? "#4877A5" : "#E2E8F0"}`,
            }}
          >
            Общим списком
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Enrolled */}
        <div>
          <div
            className="text-center text-xs py-2 mb-2"
            style={{
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            ЗАПИСАННЫЕ (4)
          </div>
          {!isAfterExit && (
            <div className="text-center text-[11px] mb-2" style={{ color: "#94A3B8" }}>
              Распределение по линиям произойдёт на точке сбора 15.05 в 08:00
            </div>
          )}
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            {candidates.enrolled.map(renderCandidate)}
          </div>
        </div>

        {/* Reserve */}
        <div>
          <div
            className="text-center text-xs py-2 mb-2"
            style={{
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            РЕЗЕРВ / ЖДУТ ОТВЕТА (3)
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            {candidates.reserve.map(renderCandidate)}
          </div>
        </div>

        {/* Declined */}
        <div>
          <div
            className="text-center text-xs py-2 mb-2"
            style={{
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            ОТКАЗАЛИСЬ (2)
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            {candidates.declined.map(renderCandidate)}
          </div>
        </div>

        {/* No Response */}
        <div>
          <div
            className="text-center text-xs py-2 mb-2"
            style={{
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            НЕ ОТВЕТИЛИ (5)
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            {candidates.noResponse.map(renderCandidate)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShiftsTab() {
  // Для демо используем статус "planning_done" - смены ещё не проведены
  const isBeforeExit = true; // До "exit_tracked"
  const isAfterClosed = false; // После "shifts_closed"

  const shifts = [
    { num: 1, name: "Иванов И. И.", start: "08:05", end: "18:00", hours: 9.92, plannedHours: 10, actualHours: 9, tasks: "Уборка этажей 1-3" },
    { num: 2, name: "Петров С. А.", start: "08:00", end: "17:30", hours: 9.5, plannedHours: 10, actualHours: 10, tasks: "Вынос мусора" },
    { num: 3, name: "Сидоров А. В.", start: "08:15", end: "18:00", hours: 9.75, plannedHours: 10, actualHours: 9, tasks: "Уборка подвала" },
    { num: 4, name: "Козлов М. П.", start: "08:00", end: "18:00", hours: 10.0, plannedHours: 10, actualHours: 10, tasks: "Общая уборка" },
  ];

  const totalPlanned = shifts.reduce((sum, s) => sum + s.plannedHours, 0);
  const totalActual = shifts.reduce((sum, s) => sum + s.actualHours, 0);
  const diff = totalActual - totalPlanned;

  // Empty state before exit
  if (isBeforeExit) {
    return (
      <div className="px-4 py-4">
        <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "300px" }}>
          <CalendarClock className="w-12 h-12 mb-4" style={{ color: "#CBD5E1" }} />
          <h3 className="text-base mb-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, color: "#0F172A" }}>
            Смены ещё не проведены
          </h3>
          <p className="text-sm max-w-md" style={{ color: "#64748B" }}>
            Кандидаты будут распределены по линиям координатором после отслеживания выхода на объекте 15.05 в 08:00.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
          Лист учёта · 15.05.2026
        </h3>
        <span className="text-xs" style={{ color: "#64748B" }}>
          Единица измерения: часы
        </span>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead style={{ backgroundColor: "#F8FAFC" }}>
            <tr>
              <th className="px-3 py-2 text-left" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "40px" }}>№</th>
              <th className="px-3 py-2 text-left" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "140px" }}>ФИО</th>
              <th className="px-3 py-2 text-center" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "60px" }}>Начало</th>
              <th className="px-3 py-2 text-center" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "60px" }}>Конец</th>
              <th className="px-3 py-2 text-center" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "60px" }}>Часы</th>
              <th className="px-3 py-2 text-center" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "70px" }}>Закр. заказ.</th>
              <th className="px-3 py-2 text-center" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px", width: "70px" }}>Закр. факт.</th>
              <th className="px-3 py-2 text-left" style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.3px" }}>Задачи</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.num} className="border-t border-[#E2E8F0] hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 text-center" style={{ color: "#94A3B8" }}>{shift.num}</td>
                <td className="px-3 py-3" style={{ color: "#0F172A" }}>{shift.name}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{shift.start}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{shift.end}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{shift.hours.toFixed(2)}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{shift.plannedHours}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{shift.actualHours}</td>
                <td className="px-3 py-3 truncate" style={{ color: "#64748B" }}>{shift.tasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span style={{ color: "#64748B" }}>Итого по заказчику:</span>
          <span style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{totalPlanned} ч</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "#64748B" }}>Итого по факту:</span>
          <span style={{ fontFamily: "'SF Mono', monospace", color: "#0F172A" }}>{totalActual} ч</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "#64748B" }}>Расхождение:</span>
          <span style={{ fontFamily: "'SF Mono', monospace", color: diff < 0 ? "#64748B" : "#22C55E" }}>
            {diff > 0 ? "+" : ""}{diff} ч {diff < 0 ? "(в пользу заказчика)" : ""}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: "#F0FDF4" }}>
        <div className="flex items-start gap-2 mb-2 text-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#22C55E" }} />
          <div style={{ color: "#475569" }}>
            <div>Подтверждено координатором: Иванов И. И.</div>
            <div className="text-[11px]" style={{ color: "#64748B" }}>Дата: 15.05.2026 19:45</div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#EAB308" }} />
          <div style={{ color: "#475569" }}>
            <div>Ждёт подтверждения мастером заказчика</div>
            <div className="text-[11px]" style={{ color: "#64748B" }}>Отправлено: 15.05.2026 19:45</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunicationsTab() {
  const [showExecutors, setShowExecutors] = useState(false);

  const events = [
    { icon: <Send className="w-4 h-4" style={{ color: "#22C55E" }} />, time: "13.05 15:05", text: "Иванов И. И. принял предложение", detail: "через Telegram bot" },
    { icon: <Phone className="w-4 h-4" style={{ color: "#EF4444" }} />, time: "13.05 15:12", text: "Волков Д. Н. отказался", detail: "через IVR-звонок, причина: \"не могу в это время\"" },
    { icon: <Radio className="w-4 h-4" style={{ color: "#64748B" }} />, time: "13.05 16:00", text: "Автоподбор запустил вторую волну", detail: "охват 15 исполнителей, причина: дефицит 11" },
    { icon: <AlertTriangle className="w-4 h-4" style={{ color: "#EAB308" }} />, time: "13.05 16:30", text: "Эскалация куратору", detail: "критический недобор" },
    { icon: <UserPlus className="w-4 h-4" style={{ color: "#4877A5" }} />, time: "13.05 17:15", text: "Куратор добавил кандидата вручную", detail: "Николаев П. А., контакт через Telegram" },
    { icon: <Pencil className="w-4 h-4" style={{ color: "#64748B" }} />, time: "13.05 17:30", text: "Куратор изменил ставку", detail: "1100 → 1200 ₽/смена" },
  ];

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Contacts Section */}
      <div>
        <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: "#0F172A" }}>
          Контакты по заявке
        </h3>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 space-y-3 text-xs">
          {/* Client Side */}
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#64748B" }}>
              <Building2 className="w-4 h-4" />
              <span className="uppercase text-[11px]" style={{ letterSpacing: "0.5px" }}>Со стороны клиента</span>
            </div>
            <div className="ml-6 space-y-3">
              <div>
                <div style={{ color: "#64748B", fontSize: "11px", marginBottom: "4px" }}>Линия 1: Уборка этажей 1-3 (участок А)</div>
                <div style={{ color: "#0F172A" }}>Мастер: Петров Иван Иванович</div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'SF Mono', monospace", color: "#64748B" }}>+7 999 234-56-78</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                </div>
              </div>
              <div>
                <div style={{ color: "#64748B", fontSize: "11px", marginBottom: "4px" }}>Линия 2: Уборка этажей 4-6 (участок Б)</div>
                <div style={{ color: "#0F172A" }}>Мастер: Сидоров Алексей Алексеевич</div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'SF Mono', monospace", color: "#64748B" }}>+7 999 345-67-89</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-[#F1F5F9]">
                <div style={{ color: "#0F172A" }}>Контакт ЛПР Стройгарант:</div>
                <div style={{ color: "#64748B" }}>Алексеев В. В.</div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'SF Mono', monospace", color: "#64748B" }}>+7 999 111-22-33</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Our Side */}
          <div className="pt-3 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-2 mb-2" style={{ color: "#64748B" }}>
              <User className="w-4 h-4" />
              <span className="uppercase text-[11px]" style={{ letterSpacing: "0.5px" }}>Наша сторона</span>
            </div>
            <div className="ml-6 space-y-2">
              <div>
                <div style={{ color: "#0F172A" }}>Координатор: Иванов И. И.</div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'SF Mono', monospace", color: "#64748B" }}>+7 999 111-22-33</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Send className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                </div>
              </div>
              <div>
                <div style={{ color: "#0F172A" }}>Куратор: Анна Петрова</div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'SF Mono', monospace", color: "#64748B" }}>+7 999 444-55-66</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-3.5 h-3.5" style={{ color: "#4877A5" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Executors */}
          <div className="pt-3 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-2 mb-2" style={{ color: "#64748B" }}>
              <Users className="w-4 h-4" />
              <span className="uppercase text-[11px]" style={{ letterSpacing: "0.5px" }}>Исполнители (12)</span>
            </div>
            <button
              onClick={() => setShowExecutors(!showExecutors)}
              className="ml-6 flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors text-xs"
              style={{ color: "#4877A5" }}
            >
              <span>Развернуть список</span>
              {showExecutors ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>
            {showExecutors && (
              <div className="ml-6 mt-2 space-y-1">
                {["Иванов И. И. +7 999 123-45-67", "Петров С. А. +7 999 234-56-78", "Сидоров А. В. +7 999 345-67-89", "Козлов М. П. +7 999 456-78-90"].map((exec, i) => (
                  <div key={i} className="text-xs" style={{ color: "#64748B" }}>{exec}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm" style={{ fontWeight: 600, color: "#0F172A" }}>
            События по заявке
          </h3>
          <button className="flex items-center gap-1 text-xs px-2 py-1 border border-[#E2E8F0] rounded hover:bg-gray-50" style={{ color: "#64748B" }}>
            Все события
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          {events.map((event, idx) => (
            <div key={idx} className="flex gap-3 p-3 border-b border-[#F1F5F9] last:border-0 relative">
              {idx < events.length - 1 && (
                <div className="absolute left-[18px] top-[32px] bottom-[-12px] w-0.5 bg-[#E2E8F0]" />
              )}
              <div className="flex-shrink-0 relative z-10">{event.icon}</div>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs" style={{ fontFamily: "'SF Mono', monospace", color: "#64748B", width: "80px" }}>
                    {event.time}
                  </span>
                  <span className="text-xs flex-1" style={{ color: "#0F172A" }}>
                    {event.text}
                  </span>
                </div>
                <div className="text-xs ml-[88px]" style={{ color: "#64748B" }}>
                  {event.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
