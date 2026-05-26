import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ArrowUpDown,
  Columns,
  Send,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Users,
  Pencil,
  ArrowRight,
  User,
  UserCog,
  Crown,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  location: string;
  age: number;
  rating: number;
  shiftsCount: number;
  status: "active" | "returning" | "new" | "inactive";
  isVerified: boolean;
  readyNow?: boolean;
  availabilityDate?: string;
  showUp10: number;
  showUpAll: number;
  qualityZ: number;
  gender: string;
  citizenship: string;
  hasSelfEmployed: boolean;
  hasCar: boolean;
  nightShifts: boolean;
  canCoordinate: boolean;
  source: string;
  curator: string;
}

const avatarColors = ["#FEE4D2", "#D6E4F3", "#DCFCE7", "#FEF3C7", "#FCE7F3"];

const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`;
};

const getRatingColor = (rating: number) => {
  if (rating >= 0.80) return "#16A34A";
  if (rating >= 0.60) return "#6B7280";
  return "#CA8A04";
};

const mockWorkers: Worker[] = [
  {
    id: "W-001",
    firstName: "Иван",
    lastName: "Иванов",
    middleName: "Иванович",
    phone: "+7 917 234-56-78",
    location: "Казань, Авиастроительный",
    age: 32,
    rating: 0.87,
    shiftsCount: 47,
    status: "active",
    isVerified: true,
    readyNow: true,
    showUp10: 1.0,
    showUpAll: 0.94,
    qualityZ: 0.2,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: true,
    nightShifts: true,
    canCoordinate: true,
    source: "Telegram",
    curator: "Алёна П.",
  },
  {
    id: "W-002",
    firstName: "Мария",
    lastName: "Петрова",
    middleName: "Сергеевна",
    phone: "+7 917 345-67-89",
    location: "Казань, Вахитовский",
    age: 28,
    rating: 0.92,
    shiftsCount: 63,
    status: "active",
    isVerified: true,
    availabilityDate: "15 мая",
    showUp10: 1.0,
    showUpAll: 0.98,
    qualityZ: 0.3,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: false,
    nightShifts: false,
    canCoordinate: true,
    source: "Рекомендация",
    curator: "Дмитрий К.",
  },
  {
    id: "W-003",
    firstName: "Алексей",
    lastName: "Сидоров",
    middleName: "Александрович",
    phone: "+7 917 456-78-90",
    location: "Казань, Московский",
    age: 25,
    rating: 0.75,
    shiftsCount: 28,
    status: "new",
    isVerified: false,
    readyNow: true,
    showUp10: 0.9,
    showUpAll: 0.85,
    qualityZ: -0.1,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: false,
    hasCar: true,
    nightShifts: true,
    canCoordinate: false,
    source: "Avito",
    curator: "Алёна П.",
  },
  {
    id: "W-004",
    firstName: "Елена",
    lastName: "Козлова",
    middleName: "Дмитриевна",
    phone: "+7 917 567-89-01",
    location: "Казань, Советский",
    age: 35,
    rating: 0.68,
    shiftsCount: 42,
    status: "returning",
    isVerified: true,
    availabilityDate: "сегодня",
    showUp10: 0.8,
    showUpAll: 0.88,
    qualityZ: 0.0,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: false,
    nightShifts: false,
    canCoordinate: false,
    source: "Telegram",
    curator: "Дмитрий К.",
  },
  {
    id: "W-005",
    firstName: "Дмитрий",
    lastName: "Морозов",
    middleName: "Викторович",
    phone: "+7 917 678-90-12",
    location: "Казань, Приволжский",
    age: 41,
    rating: 0.95,
    shiftsCount: 89,
    status: "active",
    isVerified: true,
    readyNow: true,
    showUp10: 1.0,
    showUpAll: 0.96,
    qualityZ: 0.5,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: true,
    nightShifts: true,
    canCoordinate: true,
    source: "Рекомендация",
    curator: "Алёна П.",
  },
  {
    id: "W-006",
    firstName: "Анна",
    lastName: "Новикова",
    middleName: "Олеговна",
    phone: "+7 917 789-01-23",
    location: "Казань, Ново-Савиновский",
    age: 27,
    rating: 0.58,
    shiftsCount: 19,
    status: "inactive",
    isVerified: false,
    showUp10: 0.7,
    showUpAll: 0.75,
    qualityZ: -0.2,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: false,
    hasCar: false,
    nightShifts: false,
    canCoordinate: false,
    source: "Avito",
    curator: "Дмитрий К.",
  },
  {
    id: "W-007",
    firstName: "Сергей",
    lastName: "Волков",
    middleName: "Николаевич",
    phone: "+7 917 890-12-34",
    location: "Казань, Кировский",
    age: 38,
    rating: 0.81,
    shiftsCount: 54,
    status: "active",
    isVerified: true,
    availabilityDate: "16 мая",
    showUp10: 0.9,
    showUpAll: 0.92,
    qualityZ: 0.15,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: true,
    nightShifts: true,
    canCoordinate: false,
    source: "Telegram",
    curator: "Алёна П.",
  },
  {
    id: "W-008",
    firstName: "Ольга",
    lastName: "Соколова",
    middleName: "Петровна",
    phone: "+7 917 901-23-45",
    location: "Казань, Авиастроительный",
    age: 30,
    rating: 0.89,
    shiftsCount: 71,
    status: "active",
    isVerified: true,
    readyNow: true,
    showUp10: 0.95,
    showUpAll: 0.96,
    qualityZ: 0.25,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: false,
    nightShifts: false,
    canCoordinate: true,
    source: "Рекомендация",
    curator: "Дмитрий К.",
  },
  {
    id: "W-009",
    firstName: "Артем",
    lastName: "Лебедев",
    middleName: "Андреевич",
    phone: "+7 917 012-34-56",
    location: "Казань, Московский",
    age: 24,
    rating: 0.72,
    shiftsCount: 15,
    status: "new",
    isVerified: false,
    readyNow: true,
    showUp10: 0.85,
    showUpAll: 0.83,
    qualityZ: -0.05,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: false,
    hasCar: false,
    nightShifts: true,
    canCoordinate: false,
    source: "Avito",
    curator: "Алёна П.",
  },
  {
    id: "W-010",
    firstName: "Татьяна",
    lastName: "Егорова",
    middleName: "Владимировна",
    phone: "+7 917 123-45-67",
    location: "Казань, Вахитовский",
    age: 33,
    rating: 0.84,
    shiftsCount: 58,
    status: "returning",
    isVerified: true,
    availabilityDate: "сегодня",
    showUp10: 0.92,
    showUpAll: 0.91,
    qualityZ: 0.18,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: true,
    nightShifts: false,
    canCoordinate: false,
    source: "Telegram",
    curator: "Дмитрий К.",
  },
  {
    id: "W-011",
    firstName: "Павел",
    lastName: "Кузнецов",
    middleName: "Сергеевич",
    phone: "+7 917 234-56-78",
    location: "Казань, Советский",
    age: 29,
    rating: 0.78,
    shiftsCount: 36,
    status: "active",
    isVerified: true,
    availabilityDate: "17 мая",
    showUp10: 0.88,
    showUpAll: 0.86,
    qualityZ: 0.1,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: false,
    nightShifts: true,
    canCoordinate: false,
    source: "Рекомендация",
    curator: "Алёна П.",
  },
  {
    id: "W-012",
    firstName: "Екатерина",
    lastName: "Михайлова",
    middleName: "Игоревна",
    phone: "+7 917 345-67-89",
    location: "Казань, Приволжский",
    age: 26,
    rating: 0.91,
    shiftsCount: 67,
    status: "active",
    isVerified: true,
    readyNow: true,
    showUp10: 0.98,
    showUpAll: 0.97,
    qualityZ: 0.28,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: true,
    nightShifts: false,
    canCoordinate: true,
    source: "Telegram",
    curator: "Дмитрий К.",
  },
  {
    id: "W-013",
    firstName: "Николай",
    lastName: "Орлов",
    middleName: "Павлович",
    phone: "+7 917 456-78-90",
    location: "Казань, Ново-Савиновский",
    age: 45,
    rating: 0.65,
    shiftsCount: 31,
    status: "inactive",
    isVerified: false,
    showUp10: 0.75,
    showUpAll: 0.78,
    qualityZ: -0.15,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: false,
    hasCar: true,
    nightShifts: true,
    canCoordinate: false,
    source: "Avito",
    curator: "Алёна П.",
  },
  {
    id: "W-014",
    firstName: "Светлана",
    lastName: "Попова",
    middleName: "Анатольевна",
    phone: "+7 917 567-89-01",
    location: "Казань, Кировский",
    age: 31,
    rating: 0.86,
    shiftsCount: 52,
    status: "active",
    isVerified: true,
    availabilityDate: "сегодня",
    showUp10: 0.93,
    showUpAll: 0.93,
    qualityZ: 0.2,
    gender: "Женский",
    citizenship: "РФ",
    hasSelfEmployed: true,
    hasCar: false,
    nightShifts: false,
    canCoordinate: true,
    source: "Рекомендация",
    curator: "Дмитрий К.",
  },
  {
    id: "W-015",
    firstName: "Андрей",
    lastName: "Васильев",
    middleName: "Юрьевич",
    phone: "+7 917 678-90-12",
    location: "Казань, Авиастроительный",
    age: 36,
    rating: 0.45,
    shiftsCount: 12,
    status: "inactive",
    isVerified: false,
    showUp10: 0.6,
    showUpAll: 0.65,
    qualityZ: -0.4,
    gender: "Мужской",
    citizenship: "РФ",
    hasSelfEmployed: false,
    hasCar: false,
    nightShifts: false,
    canCoordinate: false,
    source: "Avito",
    curator: "Алёна П.",
  },
];

export function WorkersRoster() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(mockWorkers[0]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeView, setActiveView] = useState<string>("all");

  const handleSelectAll = () => {
    if (selectedRows.size === mockWorkers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockWorkers.map(w => w.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const getStatusBadge = (status: Worker["status"]) => {
    const configs = {
      active: { bg: "#DCFCE7", text: "#16A34A", label: "ACTIVE" },
      returning: { bg: "#FFEDD5", text: "#EA580C", label: "RETURNING" },
      new: { bg: "#DBEAFE", text: "#2563EB", label: "NEW" },
      inactive: { bg: "#F3F4F6", text: "#6B7280", label: "INACTIVE" },
    };
    const config = configs[status];
    return (
      <span
        className="inline-block px-1.5 py-1 rounded-xl text-[11px] font-[var(--font-nunito)] font-semibold uppercase"
        style={{
          backgroundColor: config.bg,
          color: config.text,
          letterSpacing: "0.5px",
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      {/* TOP BAR */}
      <div className="bg-white border-b border-[#E5E7EB]">
        {/* Row 1 - Page header */}
        <div className="h-12 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-[var(--font-montserrat)] font-semibold text-[#111827] inline">
              Исполнители
            </h1>
            <span className="ml-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280]">
              2 347 в базе · 184 активных
            </span>
          </div>
          <Button
            className="h-9 px-4 rounded-md bg-[#FF9900] hover:bg-[#E68A00] text-white font-[var(--font-nunito)] text-[13px] font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить исполнителя
          </Button>
        </div>

        {/* Row 2 - Saved views tabs */}
        <div className="h-10 px-6 flex items-center gap-2 overflow-x-auto">
          {["Все", "Активные", "Новички", "Возвращенцы", "Координаторы", "Без смен >14 дней", "Чёрный список"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[13px] font-[var(--font-nunito)] font-medium whitespace-nowrap transition-colors",
                activeView === view
                  ? "bg-[#FFF7ED] text-[#FF9900] border border-[#FF9900]"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              )}
            >
              {view}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-xl text-[13px] font-[var(--font-nunito)] font-medium whitespace-nowrap border border-dashed border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Сохранить вид
          </button>
        </div>

        {/* Row 3 - Filter bar */}
        <div className="h-11 px-6 flex items-center gap-3">
          {/* Search */}
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Поиск по ФИО, телефону, ID..."
              className="w-full h-9 pl-10 pr-3 text-[13px] font-[var(--font-nunito)] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>

          {/* Filter chips */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                Рейтинг: все
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="text-xs text-[#6B7280]">Фильтры рейтинга</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                Гео: вся Казань
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="text-xs text-[#6B7280]">Фильтры геолокации</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                Гендер: все
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="text-xs text-[#6B7280]">Фильтры пола</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                НПД: все
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="text-xs text-[#6B7280]">Фильтры НПД</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                Возраст: все
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="text-xs text-[#6B7280]">Фильтры возраста</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-dashed border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Фильтр
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="space-y-1">
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-[#F9FAFB] rounded">Навыки</button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-[#F9FAFB] rounded">Стаж</button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-[#F9FAFB] rounded">Координатор</button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-[#F9FAFB] rounded">Верификация</button>
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-[#F9FAFB] rounded">Источник</button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-2">
            <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Сортировка
            </button>
            <button className="h-9 px-3 text-[13px] font-[var(--font-nunito)] text-[#6B7280] hover:bg-[#F9FAFB] rounded-md flex items-center gap-2">
              <Columns className="w-3.5 h-3.5" />
              Колонки
            </button>
          </div>
        </div>
      </div>

      {/* MASTER-DETAIL SPLIT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Workers list */}
        <div className="w-1/2 flex flex-col bg-white border-r border-[#E5E7EB]">
          {/* Header row */}
          <div className="h-9 flex items-center bg-[#FAFAFA] border-b border-[#E5E7EB] text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
            <div className="w-6 pl-4">
              <input
                type="checkbox"
                checked={selectedRows.size === mockWorkers.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#FF9900] focus:ring-[#FF9900]"
              />
            </div>
            <div className="flex-1 pl-4">Исполнитель</div>
            <div className="w-20 text-right pr-4">Рейтинг</div>
            <div className="w-28 pr-4">Статус</div>
            <div className="w-30 pr-4">Доступность</div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {mockWorkers.map((worker, idx) => (
              <div
                key={worker.id}
                onClick={() => setSelectedWorker(worker)}
                className={cn(
                  "h-18 flex items-center border-b border-[#E5E7EB] cursor-pointer transition-colors",
                  selectedWorker?.id === worker.id
                    ? "bg-[#FFF7ED] border-l-4 border-l-[#FF9900]"
                    : "hover:bg-[#F9FAFB]",
                  selectedRows.has(worker.id) && "bg-[#FFF7ED]"
                )}
              >
                <div className="w-6 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(worker.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(worker.id);
                    }}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#FF9900] focus:ring-[#FF9900]"
                  />
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-[var(--font-montserrat)] font-semibold text-[14px] ml-4"
                  style={{ backgroundColor: getAvatarColor(idx) }}
                >
                  {getInitials(worker.firstName, worker.lastName)}
                </div>
                <div className="flex-1 pl-3 min-w-0">
                  <div className="text-[14px] font-[var(--font-nunito)] font-semibold text-[#111827] truncate">
                    {worker.lastName} {worker.firstName} {worker.middleName}
                  </div>
                  <div className="text-[12px] font-[var(--font-nunito)] text-[#6B7280] truncate">
                    {worker.phone} · {worker.location} · {worker.age} года
                  </div>
                </div>
                <div className="w-20 text-right pr-4">
                  <div
                    className="text-[16px] font-[var(--font-mono)] font-semibold"
                    style={{ color: getRatingColor(worker.rating) }}
                  >
                    {worker.rating.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-[var(--font-mono)] text-[#9CA3AF]">
                    {worker.shiftsCount} смен
                  </div>
                </div>
                <div className="w-28 pr-4 flex items-center gap-1.5">
                  {worker.isVerified && (
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  )}
                  {getStatusBadge(worker.status)}
                </div>
                <div className="w-30 pr-4">
                  {worker.readyNow ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                      <span className="text-[12px] font-[var(--font-nunito)] font-semibold text-[#16A34A]">
                        Готов сейчас
                      </span>
                    </div>
                  ) : worker.availabilityDate === "сегодня" ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#EA580C]" />
                      <span className="text-[12px] font-[var(--font-nunito)] font-semibold text-[#EA580C]">
                        Сегодня
                      </span>
                    </div>
                  ) : worker.availabilityDate ? (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span className="text-[12px] font-[var(--font-nunito)] text-[#6B7280]">
                        {worker.availabilityDate}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[12px] font-[var(--font-nunito)] text-[#9CA3AF]">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="h-10 flex items-center justify-between px-4 border-t border-[#E5E7EB] text-[12px] font-[var(--font-nunito)] text-[#6B7280]">
            <div>Показано 1–50 из 2 347</div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-[#F9FAFB] rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-[#F9FAFB] rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedRows.size > 0 && (
            <div className="h-14 flex items-center justify-between px-4 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
              <div className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                Выбрано: {selectedRows.size}
              </div>
              <div className="flex items-center gap-2">
                <Button className="h-9 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-[var(--font-nunito)] text-[13px] flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Создать рассылку
                </Button>
                <Button variant="ghost" className="h-9 px-4 text-[13px] font-[var(--font-nunito)] text-[#6B7280]">
                  Изменить статус
                </Button>
                <Button variant="ghost" className="h-9 px-4 text-[13px] font-[var(--font-nunito)] text-[#6B7280] flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Экспорт
                </Button>
                <button
                  onClick={() => setSelectedRows(new Set())}
                  className="p-2 hover:bg-[#F9FAFB] rounded"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Worker detail */}
        <div className="w-1/2 bg-white overflow-y-auto">
          {!selectedWorker ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Users className="w-12 h-12 text-[#E5E7EB] mb-4" />
              <div className="text-[14px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                Выберите исполнителя из списка
              </div>
              <div className="text-[12px] font-[var(--font-nunito)] text-[#9CA3AF] mt-1">
                Слева — карточка с полной информацией
              </div>
            </div>
          ) : (
            <div>
              {/* Hero block */}
              <div className="h-45 p-6 border-b border-[#E5E7EB]">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-[var(--font-montserrat)] font-semibold text-[20px]"
                    style={{ backgroundColor: getAvatarColor(mockWorkers.indexOf(selectedWorker)) }}
                  >
                    {getInitials(selectedWorker.firstName, selectedWorker.lastName)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[20px] font-[var(--font-montserrat)] font-semibold text-[#111827]">
                      {selectedWorker.lastName} {selectedWorker.firstName} {selectedWorker.middleName}
                    </h2>
                    <div className="text-[13px] font-[var(--font-nunito)] text-[#6B7280] mt-1">
                      {selectedWorker.phone} · {selectedWorker.id} · Куратор: {selectedWorker.curator}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="h-9 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-[var(--font-nunito)] text-[13px] flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      Позвонить
                    </Button>
                    <Button variant="ghost" className="h-9 px-4 text-[13px] font-[var(--font-nunito)] text-[#6B7280] flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Чат
                    </Button>
                    <Button variant="ghost" className="h-9 w-9 p-0 flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                    </Button>
                  </div>
                </div>

                {/* Rating block */}
                <div className="mt-4 bg-[#FAFAFA] rounded-lg p-4 flex items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="text-[32px] font-[var(--font-mono)] font-bold cursor-help"
                          style={{ color: getRatingColor(selectedWorker.rating) }}
                        >
                          {selectedWorker.rating.toFixed(2)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Формула: 0.7×ShowUp10 + 0.2×ShowUpAll + 0.1×QualityZ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                        ShowUp 10
                      </span>
                      <span className="text-[13px] font-[var(--font-mono)] font-semibold text-[#111827]">
                        {(selectedWorker.showUp10 * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                        ShowUp all
                      </span>
                      <span className="text-[13px] font-[var(--font-mono)] font-semibold text-[#111827]">
                        {(selectedWorker.showUpAll * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                        Quality
                      </span>
                      <span className="text-[13px] font-[var(--font-mono)] font-semibold text-[#111827]">
                        {selectedWorker.qualityZ >= 0 ? "+" : ""}
                        {selectedWorker.qualityZ.toFixed(1)}σ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="h-11 flex items-center gap-6 px-6 border-b border-[#E5E7EB]">
                {["overview", "shifts", "docs", "opinions", "finance", "history", "contacts"].map((tab, idx) => {
                  const labels = ["Обзор", "Смены", "Документы", "Мнения", "Финансы", "История", "Контакты"];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-3 pt-3 text-[13px] font-[var(--font-nunito)] font-semibold border-b-2 transition-colors",
                        activeTab === tab
                          ? "text-[#111827] border-[#FF9900]"
                          : "text-[#6B7280] border-transparent hover:text-[#111827]"
                      )}
                    >
                      {labels[idx]}
                    </button>
                  );
                })}
              </div>

              {/* Tab content - Overview */}
              {activeTab === "overview" && (
                <div className="p-6 space-y-4">
                  {/* Ключевые факты */}
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-[var(--font-montserrat)] font-semibold text-[#111827]">
                        Ключевые факты
                      </h3>
                      <button className="p-1 hover:bg-[#F9FAFB] rounded">
                        <Pencil className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Пол:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.gender}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Возраст:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.age} года
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Гражданство:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.citizenship}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          НПД:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827] flex items-center gap-1.5">
                          {selectedWorker.hasSelfEmployed && (
                            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                          )}
                          {selectedWorker.hasSelfEmployed ? "Активен" : "Нет"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Авто:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.hasCar ? "Есть" : "Нет"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Ночные смены:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.nightShifts ? "Да" : "Нет"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Координатор:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.canCoordinate ? "Может быть" : "Нет"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[12px] font-[var(--font-nunito)] font-medium text-[#6B7280]">
                          Источник:
                        </span>
                        <span className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                          {selectedWorker.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Последние смены */}
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-[var(--font-montserrat)] font-semibold text-[#111827]">
                        Последние смены
                      </h3>
                      <button className="text-[13px] font-[var(--font-nunito)] font-medium text-[#4877A5] hover:underline flex items-center gap-1">
                        Все
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { date: "12", month: "мая", object: "БЦ Столица", client: "Лента", status: "attended" },
                        { date: "10", month: "мая", object: "ТЦ Мега", client: "БизнесПарк", status: "attended" },
                        { date: "8", month: "мая", object: "Склад", client: "Логистик+", status: "no-show" },
                        { date: "15", month: "мая", object: "ЖК Восток", client: "Стройгарант", status: "upcoming" },
                      ].map((shift, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2">
                          <div className="w-10 h-10 bg-[#F3F4F6] rounded-md flex flex-col items-center justify-center">
                            <div className="text-[14px] font-[var(--font-mono)] font-bold text-[#111827]">
                              {shift.date}
                            </div>
                            <div className="text-[10px] font-[var(--font-nunito)] text-[#6B7280]">
                              {shift.month}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                              {shift.object}
                            </div>
                            <div className="text-[12px] font-[var(--font-nunito)] text-[#6B7280]">
                              {shift.client}
                            </div>
                          </div>
                          {shift.status === "attended" && (
                            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                          )}
                          {shift.status === "no-show" && (
                            <XCircle className="w-4 h-4 text-[#EF4444]" />
                          )}
                          {shift.status === "upcoming" && (
                            <Clock className="w-4 h-4 text-[#EA580C]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Мнения */}
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-[var(--font-montserrat)] font-semibold text-[#111827]">
                        Мнения
                        <span className="ml-2 text-[#6B7280]">12</span>
                      </h3>
                      <button className="text-[13px] font-[var(--font-nunito)] font-medium text-[#4877A5] hover:underline flex items-center gap-1">
                        Все
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: User, text: "Отличный работник, всегда приходит вовремя", type: "positive" },
                        { icon: UserCog, text: "Может выполнять координаторские функции", type: "neutral" },
                        { icon: Crown, text: "Рекомендован для VIP объектов", type: "positive" },
                      ].map((opinion, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <opinion.icon className="w-4 h-4 text-[#6B7280] mt-1 flex-shrink-0" />
                          <p className="flex-1 text-[13px] font-[var(--font-nunito)] text-[#111827] line-clamp-2">
                            {opinion.text}
                          </p>
                          {opinion.type === "positive" && (
                            <ThumbsUp className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                          )}
                          {opinion.type === "neutral" && (
                            <Minus className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Финансы */}
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-[var(--font-montserrat)] font-semibold text-[#111827]">
                        Финансы
                      </h3>
                      <button className="text-[13px] font-[var(--font-nunito)] font-medium text-[#4877A5] hover:underline flex items-center gap-1">
                        Все
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { date: "12 мая", object: "БЦ Столица", amount: 1200, status: "paid" },
                        { date: "10 мая", object: "ТЦ Мега", amount: 1500, status: "paid" },
                        { date: "15 мая", object: "ЖК Восток", amount: 1800, status: "pending" },
                      ].map((payment, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <div className="flex-1">
                            <div className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#111827]">
                              {payment.date} · {payment.object}
                            </div>
                          </div>
                          <div className="text-[14px] font-[var(--font-mono)] font-semibold text-[#111827] mr-3">
                            {payment.amount.toLocaleString()} ₽
                          </div>
                          <span
                            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-[var(--font-nunito)] font-semibold uppercase"
                            style={{
                              backgroundColor: payment.status === "paid" ? "#DCFCE7" : "#FFEDD5",
                              color: payment.status === "paid" ? "#16A34A" : "#EA580C",
                            }}
                          >
                            {payment.status === "paid" ? "Выплачено" : "К выплате"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                      <div className="text-[13px] font-[var(--font-nunito)] font-semibold text-[#EA580C]">
                        К выплате: 12 400 ₽
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
