import { useState } from "react";
import { Calendar, User, Building2, Briefcase, Clock, DollarSign, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
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

interface CreateShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialData?: any;
}

export function CreateShiftModal({ 
  open, 
  onOpenChange,
  mode = 'create',
  initialData 
}: CreateShiftModalProps) {
  const [date, setDate] = useState(initialData?.date || '');
  const [workerId, setWorkerId] = useState(initialData?.workerId || '');
  const [clientId, setClientId] = useState(initialData?.clientId || '');
  const [objectId, setObjectId] = useState(initialData?.objectId || '');
  const [workType, setWorkType] = useState(initialData?.workType || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [outgoingRate, setOutgoingRate] = useState(initialData?.outgoingRate || '');
  const [comment, setComment] = useState(initialData?.comment || '');

  const handleSave = () => {
    // Handle save logic here
    console.log({
      date,
      workerId,
      clientId,
      objectId,
      workType,
      startTime,
      endTime,
      outgoingRate,
      comment,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-gray-900">
            {mode === 'create' ? 'Создать смену' : 'Редактировать смену'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Заполните информацию о новой смене'
              : 'Измените данные смены'
            }
          </p>
        </DialogHeader>

        <div className="py-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Основная информация</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="text-sm text-gray-700">
                      Дата смены
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="worker" className="text-sm text-gray-700">
                      Исполнитель
                    </Label>
                    <Select value={workerId} onValueChange={setWorkerId}>
                      <SelectTrigger id="worker" className="mt-1.5">
                        <SelectValue placeholder="Выберите исполнителя" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker-1">Иванов Сергей Петрович (РАБ-145)</SelectItem>
                        <SelectItem value="worker-2">Петров Алексей Михайлович (РАБ-182)</SelectItem>
                        <SelectItem value="worker-3">Сидоров Дмитрий Иванович (РАБ-203)</SelectItem>
                        <SelectItem value="worker-4">Козлов Игорь Владимирович (РАБ-156)</SelectItem>
                        <SelectItem value="worker-5">Морозов Андрей Сергеевич (РАБ-189)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="client" className="text-sm text-gray-700">
                      Клиент
                    </Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger id="client" className="mt-1.5">
                        <SelectValue placeholder="Выберите клиента" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client-1">СтройГрупп ООО (КЛ-042)</SelectItem>
                        <SelectItem value="client-2">МегаСтрой ООО (КЛ-038)</SelectItem>
                        <SelectItem value="client-3">РемСтройСервис (КЛ-019)</SelectItem>
                        <SelectItem value="client-4">СтройИнвест (КЛ-056)</SelectItem>
                        <SelectItem value="client-5">ГлавСтрой (КЛ-023)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="object" className="text-sm text-gray-700">
                      Объект
                    </Label>
                    <Select value={objectId} onValueChange={setObjectId}>
                      <SelectTrigger id="object" className="mt-1.5">
                        <SelectValue placeholder="Выберите объект" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="object-1">ЖК Северный (ОБ-123)</SelectItem>
                        <SelectItem value="object-2">ТЦ Гранд Плаза (ОБ-087)</SelectItem>
                        <SelectItem value="object-3">БЦ Skyline (ОБ-045)</SelectItem>
                        <SelectItem value="object-4">ЖК Новый Горизонт (ОБ-112)</SelectItem>
                        <SelectItem value="object-5">Складской комплекс "Логистика+" (ОБ-098)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="work-type" className="text-sm text-gray-700">
                      Тип работ
                    </Label>
                    <Select value={workType} onValueChange={setWorkType}>
                      <SelectTrigger id="work-type" className="mt-1.5">
                        <SelectValue placeholder="Выберите тип работ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laborers">Разнорабочие</SelectItem>
                        <SelectItem value="electricians">Электрики</SelectItem>
                        <SelectItem value="plumbers">Сантехники</SelectItem>
                        <SelectItem value="painters">Маляры</SelectItem>
                        <SelectItem value="loaders">Грузчики</SelectItem>
                        <SelectItem value="finishers">Отделочники</SelectItem>
                        <SelectItem value="concrete-workers">Бетонщики</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Time Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Время и оплата</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
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
                  </div>

                  <div>
                    <Label htmlFor="outgoing-rate" className="text-sm text-gray-700">
                      Исходящая ставка (₽/час)
                    </Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="outgoing-rate"
                        type="number"
                        placeholder="1800"
                        value={outgoingRate}
                        onChange={(e) => setOutgoingRate(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Комментарий</h3>
                </div>
                <div>
                  <Label htmlFor="comment" className="text-sm text-gray-700">
                    Дополнительная информация
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Укажите особые требования или примечания..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    className="mt-1.5 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {comment.length} / 500 символов
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-3">Справка</div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>
                    • После создания смена будет иметь статус "Новый"
                  </p>
                  <p>
                    • Исполнитель получит уведомление о назначении
                  </p>
                  <p>
                    • Входящая ставка берется из заказ-наряда
                  </p>
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
            {mode === 'create' ? 'Создать смену' : 'Сохранить изменения'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}