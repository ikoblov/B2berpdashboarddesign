import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  XCircle,
  Lock,
  MessageSquare,
  Plus,
  Clock,
  Users,
  DollarSign,
  Shield,
  Trash2,
  UserPlus,
  CalendarCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  FileText,
  Activity,
  CheckCircle2,
  MessageCircle,
  User,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ShiftTemplateModal } from "./ShiftTemplateModal";

interface ShiftTemplate {
  id: string;
  workTime: string;
  staffCount: number;
  workType: string;
  rate: number;
  permits: string[];
  clientResponsible: string;
  assignedStaff: number;
}

interface RequestDetailProps {
  requestId: string;
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
  onBack?: () => void;
}

const mockShiftTemplates: ShiftTemplate[] = [
  {
    id: 'ШС-001',
    workTime: '07:00 – 17:00',
    staffCount: 8,
    workType: 'Разнорабочие',
    rate: 2500,
    permits: ['Высотные работы', 'Строительная безопасность'],
    clientResponsible: 'Иванов П.С.',
    assignedStaff: 8,
  },
  {
    id: 'ШС-002',
    workTime: '08:00 – 18:00',
    staffCount: 5,
    workType: 'Электрики',
    rate: 3200,
    permits: ['Электробезопасность до 1000В', 'Допуск СРО'],
    clientResponsible: 'Сидоров А.М.',
    assignedStaff: 3,
  },
  {
    id: 'ШС-003',
    workTime: '09:00 – 19:00',
    staffCount: 2,
    workType: 'Сантехники',
    rate: 2800,
    permits: ['Сантехника', 'Газовое оборудование'],
    clientResponsible: 'Петров К.А.',
    assignedStaff: 0,
  },
];

const mockCommunications = [
  {
    id: 'COM-1844',
    type: 'Входящее',
    channel: 'WhatsApp',
    message: 'Требуется 15 разнорабочих на объект в Подмосковье',
    timestamp: new Date('2025-11-20T12:45:00'),
    user: 'Михаил Кузнецов',
  },
  {
    id: 'COM-1847',
    type: 'Исходящее',
    channel: 'Email',
    message: 'Отправлено КП с расчётом стоимости',
    timestamp: new Date('2025-11-20T14:30:00'),
    user: 'Дмитрий Соколов',
  },
];

const mockTasks = [
  {
    id: 'ЗАД-843',
    title: 'Подобрать 2 электриков с допуском СРО',
    status: 'in-progress',
    assignee: 'Елена Волкова',
  },
  {
    id: 'ЗАД-844',
    title: 'Согласовать график смен с клиентом',
    status: 'completed',
    assignee: 'Дмитрий Соколов',
  },
];

const mockTimeline = [
  {
    id: '1',
    type: 'system',
    action: 'Заявка создана',
    user: 'Дмитрий Соколов',
    timestamp: new Date('2025-11-20T12:45:00'),
  },
  {
    id: '2',
    type: 'user',
    action: 'Добавлен шаблон смены ШС-001',
    user: 'Дмитрий Соколов',
    timestamp: new Date('2025-11-20T13:00:00'),
  },
  {
    id: '3',
    type: 'user',
    action: 'Назначено 8 сотрудников на ШС-001',
    user: 'Елена Волкова',
    timestamp: new Date('2025-11-20T14:15:00'),
  },
  {
    id: '4',
    type: 'system',
    action: 'Статус изменён: На подборе → Частично укомплектована',
    timestamp: new Date('2025-11-20T14:20:00'),
  },
  {
    id: '5',
    type: 'user',
    action: 'Назначено 3 сотрудника на ШС-002',
    user: 'Елена Волкова',
    timestamp: new Date('2025-11-20T15:30:00'),
  },
];

const statusConfig = {
  draft: { label: 'Черновик', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  selection: { label: 'На подборе', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  partial: { label: 'Частично', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  complete: { label: 'Укомплектована', color: 'bg-green-100 text-green-700 border-green-200' },
  withdrawn: { label: 'Отозвана', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  closed: { label: 'Закрыта', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export function RequestDetail({ requestId, onNavigate, onBack }: RequestDetailProps) {
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplateId(templateId);
    setIsAddTemplateOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsAddTemplateOpen(false);
    setEditingTemplateId(null);
  };

  const requestData = {
    id: 'ЗАЯ-4522',
    status: 'partial' as const,
    client: { name: 'МегаСтрой ООО', id: 'КЛ-038' },
    object: { name: 'ТЦ Гранд Плаза', id: 'ОБ-087' },
    jobOrder: { id: 'ЗН-1254', name: 'Электромонтажные работы' },
    date: new Date('2025-11-24T09:00:00'),
    manager: 'Дмитрий Соколов',
    clientResponsible: 'Петров Константин Алексеевич',
    comment: 'Требуется персонал с опытом работы на крупных объектах. Обязательны все допуски и сертификаты.',
    totalStaff: 15,
    assignedStaff: 11,
  };

  const progressPercentage = (requestData.assignedStaff / requestData.totalStaff) * 100;

  return (
    <>
      {/* Top Bar - Back Button */}
      <div className="bg-white border-b border-gray-200 px-8 py-3">
        <Button
          variant="ghost"
          className="gap-2 -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к списку заявок
        </Button>
      </div>

      {/* Summary Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900 font-mono">{requestData.id}</h1>
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm border',
                  statusConfig[requestData.status].color
                )}
              >
                {statusConfig[requestData.status].label}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{requestData.client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{requestData.object.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {requestData.date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Заказ-наряд: {requestData.jobOrder.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Редактировать
            </Button>
            <Button variant="outline" className="gap-2 text-orange-600 hover:text-orange-700">
              <XCircle className="w-4 h-4" />
              Отозвать
            </Button>
            <Button variant="outline" className="gap-2">
              <Lock className="w-4 h-4" />
              Закрыть
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Коммуникация
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Создать задачу
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Blocks */}
          <div className="col-span-2 space-y-6">
            {/* Block 1: Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900">Основная информация</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Клиент
                    </label>
                    <div className="text-sm text-gray-900">
                      {requestData.client.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {requestData.client.id}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Объект
                    </label>
                    <div className="text-sm text-gray-900">
                      {requestData.object.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {requestData.object.id}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Заказ-наряд
                    </label>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm text-gray-900">
                          {requestData.jobOrder.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {requestData.jobOrder.id}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Ответственный менеджер
                    </label>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          ДС
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">
                        {requestData.manager}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Ответственный со стороны клиента
                    </label>
                    <div className="text-sm text-gray-900">
                      {requestData.clientResponsible}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Комментарий менеджера
                    </label>
                    <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
                      {requestData.comment}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowChangeLog(!showChangeLog)}
                  >
                    <Activity className="w-4 h-4" />
                    {showChangeLog ? 'Скрыть лог' : 'Показать лог изменений'}
                    {showChangeLog ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>

                  {showChangeLog && (
                    <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded border border-gray-200">
                      <div className="text-xs text-gray-600 space-y-2">
                        <div>20.11.2025 12:45 — Заявка создана (Дмитрий Соколов)</div>
                        <div>20.11.2025 13:00 — Статус: Черновик → На подборе</div>
                        <div>20.11.2025 14:20 — Статус: На подборе → Частично укомплектована</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Block 2: Shift Templates */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-gray-900 mb-1">
                    Шаблоны смен
                  </h2>
                  <p className="text-sm text-gray-600">
                    Настройте графики и требования к персоналу
                  </p>
                </div>
                <Button className="gap-2" onClick={() => setIsAddTemplateOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Добавить шаблон
                </Button>
              </div>

              <div className="p-6 space-y-4">
                {mockShiftTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-600">
                            {template.id}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {template.workType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {template.workTime}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleEditTemplate(template.id)}
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <UserPlus className="w-4 h-4" />
                          Подбор
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <CalendarCheck className="w-4 h-4" />
                          Смены
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Сотрудников</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{template.assignedStaff}</span>
                          <span className="text-gray-500">/ {template.staffCount}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Входящая ставка</div>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{template.rate} ₽/час</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="text-xs text-gray-500 mb-1">Ответственный</div>
                        <div className="text-sm text-gray-900">{template.clientResponsible}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-2">Допуски</div>
                      <div className="flex flex-wrap gap-2">
                        {template.permits.map((permit, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200"
                          >
                            <Shield className="w-3 h-3" />
                            {permit}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress for this template */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Прогресс комплектации</span>
                        <span className="text-xs text-gray-900">
                          {Math.round((template.assignedStaff / template.staffCount) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(template.assignedStaff / template.staffCount) * 100}
                        className="h-2"
                        indicatorClassName={
                          template.assignedStaff === template.staffCount
                            ? 'bg-green-500'
                            : template.assignedStaff > 0
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block 3: Staffing Progress */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900 mb-1">
                  Прогресс комплектации
                </h2>
                <p className="text-sm text-gray-600">
                  Общий статус назначения персонала
                </p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Назначено сотрудников</span>
                    </div>
                    <div className="text-2xl text-gray-900">
                      <span>{requestData.assignedStaff}</span>
                      <span className="text-gray-500"> / {requestData.totalStaff}</span>
                    </div>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-3"
                    indicatorClassName={
                      progressPercentage === 100
                        ? 'bg-green-500'
                        : progressPercentage >= 50
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {Math.round(progressPercentage)}% завершено
                    </span>
                    <span className="text-xs text-gray-500">
                      Осталось: {requestData.totalStaff - requestData.assignedStaff}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-700 mb-3">
                    Распределение по шаблонам:
                  </div>
                  {mockShiftTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {template.id}
                        </Badge>
                        <span className="text-sm text-gray-700">{template.workType}</span>
                        <span className="text-xs text-gray-500">{template.workTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm',
                            template.assignedStaff === template.staffCount
                              ? 'text-green-600'
                              : template.assignedStaff > 0
                              ? 'text-orange-600'
                              : 'text-gray-600'
                          )}
                        >
                          {template.assignedStaff} / {template.staffCount}
                        </span>
                        {template.assignedStaff === template.staffCount ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : template.assignedStaff > 0 ? (
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contextual Info */}
          <div className="space-y-6">
            {/* Communications Block */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900">Коммуникации</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {mockCommunications.length}
                </Badge>
              </div>
              <div className="p-4 space-y-3">
                {mockCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{comm.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {comm.channel}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {comm.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{comm.user}</span>
                      <span className="text-xs text-gray-500">
                        {comm.timestamp.toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                  <ExternalLink className="w-4 h-4" />
                  Открыть в Коммуникациях
                </Button>
              </div>
            </div>

            {/* Tasks Block */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900">Задачи</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {mockTasks.length}
                </Badge>
              </div>
              <div className="p-4 space-y-3">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{task.id}</span>
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          {task.assignee.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{task.assignee}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                  <Plus className="w-4 h-4" />
                  Создать задачу
                </Button>
              </div>
            </div>

            {/* Timeline Block */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900">Хронология</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {mockTimeline.map((event, idx) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            event.type === 'system' ? 'bg-blue-500' : 'bg-purple-500'
                          )}
                        />
                        {idx < mockTimeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-gray-900 mb-1">{event.action}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {event.user && <span>{event.user}</span>}
                          <span>
                            {event.timestamp.toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Template Modal */}
      <ShiftTemplateModal
        open={isAddTemplateOpen}
        onOpenChange={handleCloseTemplateModal}
        mode={editingTemplateId ? 'edit' : 'create'}
        initialData={{
          workType: requestData.jobOrder.name,
          incomingRate: 2500,
        }}
      />
    </>
  );
}