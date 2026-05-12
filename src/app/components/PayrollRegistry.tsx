import { useState } from "react";
import {
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  FileText,
  Building2,
  User,
  Shield,
  AlertCircle,
  Edit,
  Send,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Checkbox } from "./ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface PayrollEntry {
  id: string;
  worker: {
    id: string;
    name: string;
    phone: string;
    selfEmployed: boolean;
    npdActive: boolean;
    fnsApproved: boolean;
    inn: string;
  };
  shiftDates: string;
  shiftCount: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  trustedSelfEmployed: string | null;
  errors: {
    type: 'no_npd' | 'no_fns' | 'invalid_inn' | 'expired_docs' | null;
    message: string;
    severity: 'high' | 'medium' | 'info';
  }[];
  status: 'ready' | 'exported' | 'error' | 'paid';
  shifts: {
    id: string;
    date: Date;
    object: string;
    incomingRate: number;
    outgoingRate: number;
    hours: number;
    amount: number;
  }[];
}

const mockPayrollData: PayrollEntry[] = [
  {
    id: 'REG-001',
    worker: {
      id: 'РАБ-145',
      name: 'Иванов Сергей Петрович',
      phone: '+7 (999) 123-45-67',
      selfEmployed: true,
      npdActive: true,
      fnsApproved: true,
      inn: '123456789012',
    },
    shiftDates: '20-23 ноя',
    shiftCount: 4,
    grossAmount: 64800,
    commission: 3888,
    netAmount: 60912,
    trustedSelfEmployed: null,
    errors: [],
    status: 'ready',
    shifts: [
      {
        id: 'СМ-001',
        date: new Date('2025-11-23'),
        object: 'ЖК Северный',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
      {
        id: 'СМ-002',
        date: new Date('2025-11-22'),
        object: 'ЖК Северный',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
      {
        id: 'СМ-003',
        date: new Date('2025-11-21'),
        object: 'БЦ Skyline',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
      {
        id: 'СМ-004',
        date: new Date('2025-11-20'),
        object: 'БЦ Skyline',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
    ],
  },
  {
    id: 'REG-002',
    worker: {
      id: 'РАБ-182',
      name: 'Петров Алексей Михайлович',
      phone: '+7 (999) 234-56-78',
      selfEmployed: true,
      npdActive: true,
      fnsApproved: true,
      inn: '123456789013',
    },
    shiftDates: '21-23 ноя',
    shiftCount: 3,
    grossAmount: 57600,
    commission: 3456,
    netAmount: 54144,
    trustedSelfEmployed: null,
    errors: [],
    status: 'ready',
    shifts: [
      {
        id: 'СМ-005',
        date: new Date('2025-11-23'),
        object: 'ТЦ Гранд Плаза',
        incomingRate: 3200,
        outgoingRate: 2400,
        hours: 8,
        amount: 19200,
      },
      {
        id: 'СМ-006',
        date: new Date('2025-11-22'),
        object: 'ТЦ Гранд Плаза',
        incomingRate: 3200,
        outgoingRate: 2400,
        hours: 8,
        amount: 19200,
      },
      {
        id: 'СМ-007',
        date: new Date('2025-11-21'),
        object: 'ТЦ Гранд Плаза',
        incomingRate: 3200,
        outgoingRate: 2400,
        hours: 8,
        amount: 19200,
      },
    ],
  },
  {
    id: 'REG-003',
    worker: {
      id: 'РАБ-203',
      name: 'Сидоров Дмитрий Иванович',
      phone: '+7 (999) 345-67-89',
      selfEmployed: false,
      npdActive: false,
      fnsApproved: false,
      inn: '',
    },
    shiftDates: '20-22 ноя',
    shiftCount: 3,
    grossAmount: 54000,
    commission: 3240,
    netAmount: 50760,
    trustedSelfEmployed: 'Иванов С.П. (РАБ-145)',
    errors: [
      {
        type: 'no_npd',
        message: 'Нет подключения к НПД',
        severity: 'high',
      },
    ],
    status: 'ready',
    shifts: [
      {
        id: 'СМ-008',
        date: new Date('2025-11-22'),
        object: 'БЦ Skyline',
        incomingRate: 2800,
        outgoingRate: 2000,
        hours: 9,
        amount: 18000,
      },
      {
        id: 'СМ-009',
        date: new Date('2025-11-21'),
        object: 'БЦ Skyline',
        incomingRate: 2800,
        outgoingRate: 2000,
        hours: 9,
        amount: 18000,
      },
      {
        id: 'СМ-010',
        date: new Date('2025-11-20'),
        object: 'БЦ Skyline',
        incomingRate: 2800,
        outgoingRate: 2000,
        hours: 9,
        amount: 18000,
      },
    ],
  },
  {
    id: 'REG-004',
    worker: {
      id: 'РАБ-156',
      name: 'Козлов Игорь Владимирович',
      phone: '+7 (999) 456-78-90',
      selfEmployed: true,
      npdActive: true,
      fnsApproved: false,
      inn: '123456789015',
    },
    shiftDates: '22-23 ноя',
    shiftCount: 2,
    grossAmount: 28800,
    commission: 1728,
    netAmount: 27072,
    trustedSelfEmployed: null,
    errors: [
      {
        type: 'no_fns',
        message: 'Нет разрешения ФНС',
        severity: 'high',
      },
    ],
    status: 'error',
    shifts: [
      {
        id: 'СМ-011',
        date: new Date('2025-11-23'),
        object: 'ЖК Новый Горизонт',
        incomingRate: 2200,
        outgoingRate: 1600,
        hours: 9,
        amount: 14400,
      },
      {
        id: 'СМ-012',
        date: new Date('2025-11-22'),
        object: 'ЖК Новый Горизонт',
        incomingRate: 2200,
        outgoingRate: 1600,
        hours: 9,
        amount: 14400,
      },
    ],
  },
  {
    id: 'REG-005',
    worker: {
      id: 'РАБ-189',
      name: 'Морозов Андрей Сергеевич',
      phone: '+7 (999) 567-89-01',
      selfEmployed: true,
      npdActive: true,
      fnsApproved: true,
      inn: '123456789016',
    },
    shiftDates: '20-23 ноя',
    shiftCount: 4,
    grossAmount: 62400,
    commission: 3744,
    netAmount: 58656,
    trustedSelfEmployed: null,
    errors: [],
    status: 'exported',
    shifts: [
      {
        id: 'СМ-013',
        date: new Date('2025-11-23'),
        object: 'Складской комплекс',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
      {
        id: 'СМ-014',
        date: new Date('2025-11-22'),
        object: 'Складской комплекс',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 16200,
      },
      {
        id: 'СМ-015',
        date: new Date('2025-11-21'),
        object: 'Складской комплекс',
        incomingRate: 2500,
        outgoingRate: 1600,
        hours: 9,
        amount: 14400,
      },
      {
        id: 'СМ-016',
        date: new Date('2025-11-20'),
        object: 'Складской комплекс',
        incomingRate: 2500,
        outgoingRate: 1800,
        hours: 9,
        amount: 15600,
      },
    ],
  },
];

const statusConfig = {
  ready: {
    label: 'Готов к выгрузке',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  exported: {
    label: 'Выгружено',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
  error: {
    label: 'Ошибка',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
  },
  paid: {
    label: 'Выплачено',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: CheckCircle2,
  },
};

interface PayrollRegistryProps {
  onNavigate?: (view: string) => void;
}

export function PayrollRegistry({ onNavigate }: PayrollRegistryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('week');
  const [viewMode, setViewMode] = useState<'workers' | 'shifts'>('workers');
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<PayrollEntry | null>(null);
  const [showErrorPanel, setShowErrorPanel] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const errorEntries = mockPayrollData.filter((entry) => entry.errors.length > 0);
  const totalGross = mockPayrollData.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalCommission = mockPayrollData.reduce((sum, e) => sum + e.commission, 0);
  const totalNet = mockPayrollData.reduce((sum, e) => sum + e.netAmount, 0);
  const totalWorkers = mockPayrollData.length;
  const directPayments = mockPayrollData.filter((e) => e.worker.selfEmployed && !e.trustedSelfEmployed).length;
  const trustedPayments = mockPayrollData.filter((e) => e.trustedSelfEmployed).length;

  const filteredData = mockPayrollData.filter((entry) => {
    if (showErrorsOnly && entry.errors.length === 0) return false;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((e) => e.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Реестр выплат</h1>
              <p className="text-sm text-gray-600">
                Управление начислениями и выплатами исполнителям
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="custom">Период</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('workers')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-colors',
                    viewMode === 'workers'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  По исполнителям
                </button>
                <button
                  onClick={() => setViewMode('shifts')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-colors',
                    viewMode === 'shifts'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  По сменам
                </button>
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Экспорт XLSX
              </Button>

              <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" />
                Выгрузить в Т-Банк
              </Button>

              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Создать реестр
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="px-8 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Общее начисление</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">
              {totalGross.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-gray-500">
              {totalWorkers} {totalWorkers === 1 ? 'исполнитель' : 'исполнителей'}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Комиссия 6% НПД</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl text-orange-600 mb-1">
              {totalCommission.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-gray-500">
              {((totalCommission / totalGross) * 100).toFixed(1)}% от начисления
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Итог к выплате</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-green-600 mb-1">
              {totalNet.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-gray-500">После удержаний</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Количество исполнителей</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{totalWorkers}</div>
            <div className="text-xs text-gray-500">В текущем периоде</div>
          </div>
        </div>

        {/* Extra Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-600 mb-1">Выплат�� через ЗП-проект</div>
                <div className="text-sm text-blue-900">{directPayments} исполнителей</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg border border-purple-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-purple-600 mb-1">Через доверенных</div>
                <div className="text-sm text-purple-900">{trustedPayments} исполнителей</div>
              </div>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg border border-red-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-red-600 mb-1">Ошибки / несоответствия</div>
                <div className="text-sm text-red-900">{errorEntries.length} записей</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Panel */}
      {errorEntries.length > 0 && showErrorPanel && (
        <div className="mx-8 mt-6">
          <div className="bg-red-50 rounded-lg border border-red-200 overflow-hidden">
            <div className="px-4 py-3 bg-red-100 border-b border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <span className="text-sm text-red-900">
                  Найдены ошибки ({errorEntries.length})
                </span>
              </div>
              <button
                onClick={() => setShowErrorPanel(false)}
                className="text-red-700 hover:text-red-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {errorEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {entry.worker.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm text-gray-900">{entry.worker.name}</div>
                      <div className="text-xs text-red-600">
                        {entry.errors.map((e) => e.message).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        entry.errors[0]?.severity === 'high'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      )}
                    >
                      {entry.errors[0]?.severity === 'high' ? 'Критично' : 'Требует внимания'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Исправить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск исполнителя..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
            </div>

            <Button
              variant={showErrorsOnly ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setShowErrorsOnly(!showErrorsOnly)}
            >
              <AlertTriangle className="w-4 h-4" />
              Показать только ошибки
            </Button>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Выбрано: {selectedRows.length}
              </span>
              <Button size="sm" className="gap-2">
                <Building2 className="w-4 h-4" />
                Выгрузить выбранные
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[250px]">Исполнитель</TableHead>
                <TableHead className="w-[120px]">Даты смен</TableHead>
                <TableHead className="w-[80px] text-center">Смен</TableHead>
                <TableHead className="w-[120px] text-right">Начисление</TableHead>
                <TableHead className="w-[100px] text-right">Комиссия</TableHead>
                <TableHead className="w-[120px] text-right">К выплате</TableHead>
                <TableHead className="w-[140px]">Самозанятость</TableHead>
                <TableHead className="w-[180px]">Доверенный</TableHead>
                <TableHead className="w-[140px]">Статус</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => {
                const StatusIcon = statusConfig[entry.status].icon;
                const hasErrors = entry.errors.length > 0;

                return (
                  <TableRow
                    key={entry.id}
                    className={cn(
                      'cursor-pointer group',
                      hasErrors ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50'
                    )}
                    onClick={() => setSelectedWorker(entry)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(entry.id)}
                        onCheckedChange={() => handleSelectRow(entry.id)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {entry.worker.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-gray-900">{entry.worker.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{entry.worker.id}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-gray-700">{entry.shiftDates}</div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {entry.shiftCount}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="text-sm text-gray-900 font-mono">
                        {entry.grossAmount.toLocaleString('ru-RU')} ₽
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="text-sm text-orange-600 font-mono">
                        {entry.commission.toLocaleString('ru-RU')} ₽
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="text-sm text-green-600 font-mono">
                        {entry.netAmount.toLocaleString('ru-RU')} ₽
                      </div>
                    </TableCell>

                    <TableCell>
                      {entry.worker.selfEmployed ? (
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 text-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Активна
                          </Badge>
                          {!entry.worker.fnsApproved && (
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Нет ФНС
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-200 text-xs"
                        >
                          Неактивна
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {entry.trustedSelfEmployed ? (
                        <div className="text-sm text-gray-700">{entry.trustedSelfEmployed}</div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', statusConfig[entry.status].color)}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[entry.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Side Panel */}
      <Sheet open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          {selectedWorker && (
            <>
              <SheetHeader className="border-b border-gray-200 pb-4">
                <SheetTitle className="text-gray-900">Детализация выплаты</SheetTitle>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Worker Summary */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm text-gray-900 mb-4">Информация об исполнителе</h3>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {selectedWorker.worker.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="text-sm text-gray-900">{selectedWorker.worker.name}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {selectedWorker.worker.id}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.worker.selfEmployed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 text-xs"
                          >
                            Самозанятый
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 border-gray-200 text-xs"
                          >
                            Физ. лицо
                          </Badge>
                        )}
                        {selectedWorker.worker.npdActive && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            НПД активен
                          </Badge>
                        )}
                        {selectedWorker.worker.fnsApproved ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 text-xs"
                          >
                            ФНС подтверждено
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200 text-xs"
                          >
                            ФНС не подтверждено
                          </Badge>
                        )}
                      </div>
                      {selectedWorker.worker.inn && (
                        <div className="text-xs text-gray-600">
                          ИНН: {selectedWorker.worker.inn}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shift List */}
                <div>
                  <h3 className="text-sm text-gray-900 mb-3">Детализация по сменам</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-gray-50">
                          <TableHead className="text-xs">Дата</TableHead>
                          <TableHead className="text-xs">Объект</TableHead>
                          <TableHead className="text-xs text-right">Вход</TableHead>
                          <TableHead className="text-xs text-right">Исход</TableHead>
                          <TableHead className="text-xs text-right">Часов</TableHead>
                          <TableHead className="text-xs text-right">Сумма</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedWorker.shifts.map((shift) => (
                          <TableRow key={shift.id} className="hover:bg-gray-50">
                            <TableCell className="text-xs text-gray-700">
                              {shift.date.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </TableCell>
                            <TableCell className="text-xs text-gray-700">{shift.object}</TableCell>
                            <TableCell className="text-xs text-gray-600 text-right">
                              {shift.incomingRate} ₽
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 text-right">
                              {shift.outgoingRate} ₽
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 text-right">
                              {shift.hours}
                            </TableCell>
                            <TableCell className="text-xs text-gray-900 text-right font-mono">
                              {shift.amount.toLocaleString('ru-RU')} ₽
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm text-gray-900 mb-4">Финансовая сводка</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Общее начисление</span>
                      <span className="text-gray-900 font-mono">
                        {selectedWorker.grossAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Комиссия 6% НПД</span>
                      <span className="text-orange-600 font-mono">
                        -{selectedWorker.commission.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-sm text-gray-900">Итог к выплате</span>
                      <span className="text-green-600 font-mono">
                        {selectedWorker.netAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {selectedWorker.errors.length > 0 && (
                  <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <h3 className="text-sm text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Ошибки и предупреждения
                    </h3>
                    <div className="space-y-2">
                      {selectedWorker.errors.map((error, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-red-200 p-3"
                        >
                          <div className="text-sm text-red-900 mb-2">{error.message}</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Send className="w-3 h-3" />
                              Запросить у исполнителя
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Edit className="w-3 h-3" />
                              Исправить данные
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Подтвердить выплату
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Скачать детализацию
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}