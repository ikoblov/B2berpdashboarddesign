import { useState } from "react";
import { X, Plus, Shield, Clock, Users, DollarSign, User, Info } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ShiftTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialData?: {
    startTime?: string;
    endTime?: string;
    staffCount?: number;
    workType?: string;
    permits?: string[];
    supervisor?: string;
    incomingRate?: number;
    outgoingRate?: number;
    comment?: string;
  };
}

const availablePermits = [
  'Высотные работы',
  'Строительная безопасность',
  'Электробезопасность до 1000В',
  'Допуск СРО',
  'Сантехника',
  'Газовое оборудование',
  'Работа на высоте',
  'Огневые работы',
  'Погрузочно-разгрузочные работы',
];

export function ShiftTemplateModal({
  open,
  onOpenChange,
  mode = 'create',
  initialData,
}: ShiftTemplateModalProps) {
  const [startTime, setStartTime] = useState(initialData?.startTime || '08:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '18:00');
  const [staffCount, setStaffCount] = useState(initialData?.staffCount || 5);
  const [selectedPermits, setSelectedPermits] = useState<string[]>(
    initialData?.permits || []
  );
  const [supervisor, setSupervisor] = useState(initialData?.supervisor || '');
  const [outgoingRate, setOutgoingRate] = useState(initialData?.outgoingRate || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isAddingPermit, setIsAddingPermit] = useState(false);

  const workType = initialData?.workType || 'Разнорабочие';
  const incomingRate = initialData?.incomingRate || 2500;

  const handleAddPermit = (permit: string) => {
    if (!selectedPermits.includes(permit)) {
      setSelectedPermits([...selectedPermits, permit]);
    }
    setIsAddingPermit(false);
  };

  const handleRemovePermit = (permit: string) => {
    setSelectedPermits(selectedPermits.filter((p) => p !== permit));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log({
      startTime,
      endTime,
      staffCount,
      workType,
      permits: selectedPermits,
      supervisor,
      incomingRate,
      outgoingRate,
      comment,
    });
    onOpenChange(false);
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationHours = endHour - startHour + (endMin - startMin) / 60;
    return durationHours;
  };

  const calculateMargin = () => {
    if (!incomingRate || !outgoingRate) return 0;
    return incomingRate - outgoingRate;
  };

  const calculateMarginPercentage = () => {
    if (!incomingRate || incomingRate === 0) return 0;
    return ((calculateMargin() / incomingRate) * 100).toFixed(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-gray-900">
            {mode === 'create' ? 'Создать шаблон смены' : 'Редактировать шаблон смены'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Настройте параметры смены и требования к персоналу
          </p>
        </DialogHeader>

        <div className="py-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Work Schedule Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">График работы</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-time" className="text-sm text-gray-700">
                      Время начала
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-time" className="text-sm text-gray-700">
                      Время окончания
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Продолжительность</span>
                      <span className="text-gray-900">
                        {calculateDuration()} ч
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Персонал</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="staff-count" className="text-sm text-gray-700">
                      Количество сотрудников
                    </Label>
                    <Input
                      id="staff-count"
                      type="number"
                      min="1"
                      value={staffCount}
                      onChange={(e) => setStaffCount(Number(e.target.value))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="work-type" className="text-sm text-gray-700">
                      Тип работ
                    </Label>
                    <div className="mt-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{workType}</span>
                        <span className="text-xs text-gray-500">Из заказ-наряда</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="supervisor" className="text-sm text-gray-700">
                      Ответственный
                    </Label>
                    <Select value={supervisor} onValueChange={setSupervisor}>
                      <SelectTrigger id="supervisor" className="mt-1.5">
                        <SelectValue placeholder="Выберите мастера" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ivanov">Иванов Петр Сергеевич</SelectItem>
                        <SelectItem value="sidorov">Сидоров Алексей Михайлович</SelectItem>
                        <SelectItem value="petrov">Петров Константин Алексеевич</SelectItem>
                        <SelectItem value="kozlov">Козлов Дмитрий Иванович</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Permits Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Допуски и сертификаты</h3>
                </div>
                <div className="space-y-3">
                  <div className="min-h-[80px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedPermits.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPermits.map((permit) => (
                          <span
                            key={permit}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-gray-700 rounded border border-gray-300 text-xs"
                          >
                            <Shield className="w-3 h-3 text-gray-500" />
                            {permit}
                            <button
                              onClick={() => handleRemovePermit(permit)}
                              className="ml-0.5 hover:text-gray-900 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-gray-500">Допуски не выбраны</span>
                      </div>
                    )}
                  </div>

                  {isAddingPermit ? (
                    <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
                      <div className="p-2 space-y-0.5 max-h-[200px] overflow-y-auto">
                        {availablePermits
                          .filter((permit) => !selectedPermits.includes(permit))
                          .map((permit) => (
                            <button
                              key={permit}
                              onClick={() => handleAddPermit(permit)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              {permit}
                            </button>
                          ))}
                      </div>
                      <div className="p-2 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingPermit(false)}
                          className="w-full"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingPermit(true)}
                      className="gap-2 w-full"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить допуск
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Rates Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Ставки и расчёты</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="incoming-rate" className="text-sm text-gray-700">
                      Входящая ставка (от клиента)
                    </Label>
                    <div className="mt-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{incomingRate} ₽/час</span>
                        <span className="text-xs text-gray-500">Из заказ-наряда</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="outgoing-rate" className="text-sm text-gray-700">
                      Исходящая ставка (для исполнителя)
                    </Label>
                    <div className="mt-1.5 relative">
                      <Input
                        id="outgoing-rate"
                        type="number"
                        min="0"
                        step="50"
                        value={outgoingRate}
                        onChange={(e) => setOutgoingRate(Number(e.target.value))}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        ₽/час
                      </span>
                    </div>
                  </div>

                  {/* Margin Calculation */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Маржа за час</span>
                        <span className="text-sm text-gray-900">
                          {calculateMargin()} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Процент маржи</span>
                        <span className="text-sm text-gray-900">
                          {calculateMarginPercentage()}%
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-xs text-gray-500">
                            За смену ({calculateDuration()} ч)
                          </span>
                          <span className="text-sm text-gray-900">
                            {(calculateMargin() * calculateDuration()).toFixed(0)} ₽
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-xs text-gray-500">
                            На {staffCount} чел.
                          </span>
                          <span className="text-sm text-gray-900">
                            {(calculateMargin() * calculateDuration() * staffCount).toFixed(0)} ₽
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Дополнительная информация</h3>
                </div>
                <div>
                  <Label htmlFor="comment" className="text-sm text-gray-700">
                    Комментарий
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Укажите особые требования к персоналу, условия работы или другие важные детали..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={8}
                    className="mt-1.5 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {comment.length} / 500 символов
                  </p>
                </div>
              </div>

              {/* Summary Info Box */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-3">Сводка по шаблону</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Время работы</span>
                    <span className="text-gray-900">
                      {startTime} – {endTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Сотрудников</span>
                    <span className="text-gray-900">{staffCount} чел.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Тип работ</span>
                    <span className="text-gray-900">{workType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Допусков</span>
                    <span className="text-gray-900">{selectedPermits.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} className="gap-2">
            {mode === 'create' ? 'Создать шаблон' : 'Сохранить изменения'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}