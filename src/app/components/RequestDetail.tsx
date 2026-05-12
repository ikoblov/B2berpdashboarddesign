import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Lock,
  AlertTriangle,
  Pencil,
  CheckCircle2,
  CircleDot,
  Circle,
} from "lucide-react";
import { cn } from "../lib/utils";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Tabs from "@radix-ui/react-tabs";

interface RequestDetailProps {
  requestId: string;
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
  onBack?: () => void;
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

export function RequestDetail({ requestId, onNavigate, onBack }: RequestDetailProps) {
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
    status: "created" as RequestStatus,
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

  const hasCriticalBlockers = requestData.blockers.some((b) => b.level === "critical");

  // Set page title
  useEffect(() => {
    document.title = `${requestData.title} — PF-ERP`;
    return () => {
      document.title = "PF-ERP";
    };
  }, [requestData.title]);

  const handleTransferToWork = () => {
    if (hasCriticalBlockers) {
      setTransferDialogOpen(true);
    } else {
      // Передача в работу без диалога
    }
  };

  const handleConfirmTransfer = () => {
    if (transferReason.trim()) {
      // Логика передачи под ответственность
      setTransferDialogOpen(false);
      setTransferReason("");
    }
  };

  const handleConfirmCancel = () => {
    if (cancelComment.trim()) {
      // Логика отмены заявки
      setCancelDialogOpen(false);
      setCancelComment("");
      setCancelReason("transferred");
    }
  };

  return (
    <div className="bg-gray-50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-colors hover:text-[#3a6189]"
          style={{ color: "#4877A5", fontFamily: "'Nunito Sans', sans-serif", fontSize: "14px" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Заявки
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        {/* Row 1: Title + Status */}
        <div className="flex items-start justify-between mb-3">
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
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
                className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: statusConfig[requestData.status].bg,
                  color: statusConfig[requestData.status].text,
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "6px 14px",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {statusConfig[requestData.status].label}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white rounded-lg shadow-lg min-w-[340px]"
                sideOffset={5}
                style={{ zIndex: 9999, padding: "16px", borderRadius: "8px" }}
              >
                <div className="mb-3" style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'Nunito Sans', sans-serif" }}>
                  ТЕКУЩИЙ СТАТУС
                </div>
                <div className="flex items-center gap-2 mb-4" style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[requestData.status].text }} />
                  {statusConfig[requestData.status].label}
                </div>

                <div className="border-t my-3" style={{ borderColor: "#E2E8F0" }} />

                {requestData.status === "created" && (
                  <>
                    <button
                      onClick={handleTransferToWork}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                      style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      → Передать в работу
                    </button>
                    {hasCriticalBlockers && (
                      <div className="flex items-center gap-2 px-3 py-1" style={{ color: "#EAB308", fontSize: "12px", fontFamily: "'Nunito Sans', sans-serif" }}>
                        <AlertTriangle className="w-3 h-3" />
                        Есть активные блокировки
                      </div>
                    )}
                  </>
                )}

                <div className="border-t my-3" style={{ borderColor: "#E2E8F0" }} />

                <button
                  onClick={() => {
                    setStatusDropdownOpen(false);
                    setCancelDialogOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                  style={{ fontSize: "14px", color: "#EF4444", fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  ✕ Заявка не состоится...
                </button>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Row 2: Metadata + Blockers */}
        <div className="flex items-center justify-between">
          <div style={{ fontSize: "13px", color: "#64748B" }}>
            #{requestData.id} · {requestData.date} · {requestData.author}
          </div>

          <div className="flex items-center gap-3">
            {/* Blockers Badge */}
            <Popover.Root open={blockersOpen} onOpenChange={setBlockersOpen}>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: hasCriticalBlockers ? "#FEF2F2" : "#F1F5F9",
                    color: hasCriticalBlockers ? "#DC2626" : "#64748B",
                    fontSize: "13px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <Lock style={{ width: "14px", height: "14px" }} />
                  {requestData.blockers.length} блокировки
                  <ChevronDown style={{ width: "14px", height: "14px" }} />
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  className="bg-white rounded-lg shadow-lg w-[380px]"
                  sideOffset={5}
                  style={{ zIndex: 9999, padding: "16px", borderRadius: "8px" }}
                >
                  <div className="mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>
                    БЛОКИРОВКИ ({requestData.blockers.length})
                  </div>

                  <div className="space-y-4">
                    {requestData.blockers.map((blocker) => (
                      <div key={blocker.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Lock
                              style={{
                                width: "14px",
                                height: "14px",
                                color: blocker.level === "critical" ? "#EF4444" : "#94A3B8",
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontSize: "14px", color: "#0F172A", fontWeight: 500, fontFamily: "'Nunito Sans', sans-serif" }}>
                              {blocker.title}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: blocker.level === "critical" ? "#DC2626" : "#64748B",
                              fontFamily: "'Nunito Sans', sans-serif",
                            }}
                          >
                            {blocker.level === "critical" ? "Критичное" : "Мягкое"}
                          </span>
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748B", marginLeft: "22px", fontFamily: "'Nunito Sans', sans-serif" }}>
                          {blocker.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200" style={{ fontSize: "12px", color: "#64748B", lineHeight: "1.5", fontFamily: "'Nunito Sans', sans-serif" }}>
                    Блокировки проверяются автоматически и снимаются при изменении данных.
                  </div>

                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Under Responsibility Badge (if applicable) */}
            {requestData.underResponsibility && (
              <div
                className="flex items-center gap-2"
                style={{
                  backgroundColor: "#FEF9C3",
                  color: "#854D0E",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                <AlertTriangle style={{ width: "14px", height: "14px", color: "#EAB308" }} />
                Под ответственностью: А. Петрова
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs.Root defaultValue="overview" onValueChange={setActiveTab}>
        <div className="bg-white border-b border-[#E2E8F0]">
          <div className="px-6">
            <Tabs.List className="flex items-center gap-6" style={{ border: "none", background: "transparent" }}>
              <Tabs.Trigger
                value="overview"
                className="py-3 transition-colors cursor-pointer bg-transparent"
                data-state={activeTab === "overview" ? "active" : "inactive"}
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: activeTab === "overview" ? "#4877A5" : "#64748B",
                  borderBottom: activeTab === "overview" ? "2px solid #4877A5" : "2px solid transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                Обзор
              </Tabs.Trigger>
              <Tabs.Trigger
                value="candidates"
                className="py-3 transition-colors cursor-pointer bg-transparent"
                data-state={activeTab === "candidates" ? "active" : "inactive"}
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: activeTab === "candidates" ? "#4877A5" : "#64748B",
                  borderBottom: activeTab === "candidates" ? "2px solid #4877A5" : "2px solid transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                Кандидаты
              </Tabs.Trigger>
              <Tabs.Trigger
                value="shifts"
                className="py-3 transition-colors cursor-pointer bg-transparent"
                data-state={activeTab === "shifts" ? "active" : "inactive"}
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: activeTab === "shifts" ? "#4877A5" : "#64748B",
                  borderBottom: activeTab === "shifts" ? "2px solid #4877A5" : "2px solid transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                Смены
              </Tabs.Trigger>
              <Tabs.Trigger
                value="communications"
                className="py-3 transition-colors cursor-pointer bg-transparent"
                data-state={activeTab === "communications" ? "active" : "inactive"}
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: activeTab === "communications" ? "#4877A5" : "#64748B",
                  borderBottom: activeTab === "communications" ? "2px solid #4877A5" : "2px solid transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                Коммуникации
              </Tabs.Trigger>
            </Tabs.List>
          </div>
        </div>

        {/* Tab Content - Overview */}
        <Tabs.Content value="overview">
          <div className="px-6 py-6 max-w-[1200px] mx-auto min-h-screen">
            {/* Section 1: Parameters Grid (2x2) */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Card 1: Client and Object */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 group hover:border-gray-300 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#94A3B8",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    КЛИЕНТ И ОБЪЕКТ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Клиент:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Объект:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.object}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Мастер:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.master}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Телефон:</span>
                    <a href={`tel:${requestData.phone}`} style={{ fontSize: "14px", color: "#4877A5", fontFamily: "'Nunito Sans', sans-serif" }}>
                      {requestData.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Time and Place */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 group hover:border-gray-300 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#94A3B8",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    ВРЕМЯ И МЕСТО
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Дата:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.workDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Начало:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Длительность:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Адрес:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.address}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Requirements */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 group hover:border-gray-300 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#94A3B8",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    ТРЕБОВАНИЯ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Нужно людей:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.needed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Тип работы:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.workType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Физ. тяжёлая:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.isPhysicallyHard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Пол:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>{requestData.gender}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Finances */}
              <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 group hover:border-gray-300 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    style={{
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#94A3B8",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    ФИНАНСЫ
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </button>
                </div>
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Ставка исполнителю:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif", textAlign: "right" }}>{requestData.executorRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Доплата координатору:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif", textAlign: "right" }}>{requestData.coordinatorBonus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Ставка клиенту:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif", textAlign: "right" }}>{requestData.clientRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>Маржа:</span>
                    <span style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif", textAlign: "right" }}>{requestData.margin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Numeric Summary */}
            <div className="bg-[#F8FAFC] rounded-lg p-5 mb-6">
              <div className="grid grid-cols-6 divide-x divide-[#E2E8F0]">
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>Нужно</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#0F172A" }}>
                    15
                  </div>
                </div>
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>Запл.</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#CBD5E1" }}>
                    —
                  </div>
                </div>
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>Резерв</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#CBD5E1" }}>
                    —
                  </div>
                </div>
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>Вышло</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#CBD5E1" }}>
                    —
                  </div>
                </div>
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>Часов факт</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#CBD5E1" }}>
                    —
                  </div>
                </div>
                <div className="text-center px-4">
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontFamily: "'Nunito Sans', sans-serif" }}>НПД</div>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#CBD5E1" }}>
                    —
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Timeline */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                Хронология
              </h2>

              <div className="space-y-6">
                {mockTimeline.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-4 relative">
                    {/* Icon Column with Connector */}
                    <div className="flex flex-col items-center relative" style={{ width: "16px" }}>
                      {event.status === "completed" && (
                        <CheckCircle2 className="w-4 h-4 relative z-10" style={{ color: "#22C55E" }} />
                      )}
                      {event.status === "current" && (
                        <CircleDot className="w-4 h-4 relative z-10" style={{ color: "#4877A5" }} />
                      )}
                      {event.status === "upcoming" && (
                        <Circle className="w-4 h-4 relative z-10" style={{ color: "#CBD5E1" }} />
                      )}
                      {idx < mockTimeline.length - 1 && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bg-[#E2E8F0]"
                          style={{ top: "20px", height: "24px", width: "1px" }}
                        />
                      )}
                    </div>

                    {/* Date/Time Column */}
                    <div
                      style={{
                        fontFamily: "'SF Mono', monospace",
                        fontSize: "13px",
                        color: "#64748B",
                        width: "100px",
                        flexShrink: 0,
                      }}
                    >
                      {event.date && event.time ? `${event.date} ${event.time}` : event.date || ""}
                    </div>

                    {/* Text Column */}
                    <div className="flex-1" style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>
                      {event.text}
                    </div>

                    {/* Author Column */}
                    <div
                      className="text-right"
                      style={{
                        fontSize: "13px",
                        color: "#64748B",
                        width: "150px",
                        flexShrink: 0,
                        fontFamily: "'Nunito Sans', sans-serif",
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
          <div className="px-6 py-12 min-h-screen text-center" style={{ color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>
            Этот таб будет добавлен позже
          </div>
        </Tabs.Content>

        {/* Tab Content - Shifts */}
        <Tabs.Content value="shifts">
          <div className="px-6 py-12 min-h-screen text-center" style={{ color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>
            Этот таб будет добавлен позже
          </div>
        </Tabs.Content>

        {/* Tab Content - Communications */}
        <Tabs.Content value="communications">
          <div className="px-6 py-12 min-h-screen text-center" style={{ color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>
            Этот таб будет добавлен позже
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Transfer to Work Dialog */}
      <Dialog.Root open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ zIndex: 9998 }} />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            style={{ zIndex: 9999 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: "#EAB308" }} />
              <div>
                <Dialog.Title
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "8px",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  Заявку нельзя передать автоматически
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: "14px", color: "#64748B", marginBottom: "12px", fontFamily: "'Nunito Sans', sans-serif" }}>
                  Активные блокировки:
                </Dialog.Description>
                <ul className="list-disc list-inside space-y-1 mb-4" style={{ fontSize: "14px", color: "#64748B", fontFamily: "'Nunito Sans', sans-serif" }}>
                  {requestData.blockers
                    .filter((b) => b.level === "critical")
                    .map((b) => (
                      <li key={b.id}>
                        {b.title} ({b.description})
                      </li>
                    ))}
                </ul>
                <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "12px", fontFamily: "'Nunito Sans', sans-serif" }}>
                  Если передаёте под свою ответственность — опишите причину:
                </p>
              </div>
            </div>

            <textarea
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="Укажите причину..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 resize-none"
              rows={3}
              style={{ fontSize: "14px", fontFamily: "'Nunito Sans', sans-serif" }}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTransferDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                style={{ fontSize: "14px", fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmTransfer}
                disabled={!transferReason.trim()}
                className="px-4 py-2 rounded transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "#4877A5",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                Передать под ответственность
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Cancel Request Dialog */}
      <Dialog.Root open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ zIndex: 9998 }} />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            style={{ zIndex: 9999 }}
          >
            <Dialog.Title
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#0F172A",
                marginBottom: "16px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Почему заявка не состоится?
            </Dialog.Title>

            <RadioGroup.Root value={cancelReason} onValueChange={setCancelReason} className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="client_cancel"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Отмена клиента</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="not_enough_people"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Недобор людей</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="no_payment"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Клиент не оплатил</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="force_majeure"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Форс-мажор</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="transferred"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Перенесена на другую дату</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item
                  value="other"
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ accentColor: "#4877A5" }}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <label style={{ fontSize: "14px", color: "#0F172A", fontFamily: "'Nunito Sans', sans-serif" }}>Другое</label>
              </div>
            </RadioGroup.Root>

            <label style={{ fontSize: "14px", color: "#0F172A", marginBottom: "8px", display: "block", fontFamily: "'Nunito Sans', sans-serif" }}>
              Комментарий (обязательно):
            </label>
            <textarea
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
              placeholder="Укажите дополнительную информацию..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 resize-none"
              rows={3}
              style={{ fontSize: "14px", fontFamily: "'Nunito Sans', sans-serif" }}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                style={{ fontSize: "14px", fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelComment.trim()}
                className="px-4 py-2 rounded transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "#EF4444",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
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
