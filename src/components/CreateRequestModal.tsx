import { useState } from "react";
import { X, Plus, Building2, FileText, Calendar, User, MessageSquare } from "lucide-react";
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
import { ShiftTemplateModal } from "./ShiftTemplateModal";

interface CreateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRequestModal({ open, onOpenChange }: CreateRequestModalProps) {
  const [clientId, setClientId] = useState('');
  const [objectId, setObjectId] = useState('');
  const [jobOrderId, setJobOrderId] = useState('');
  const [executionDate, setExecutionDate] = useState('');
  const [managerId, setManagerId] = useState('');
  const [comment, setComment] = useState('');
  const [shiftTemplates, setShiftTemplates] = useState<any[]>([]);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log({
      clientId,
      objectId,
      jobOrderId,
      executionDate,
      managerId,
      comment,
      shiftTemplates,
    });
    onOpenChange(false);
  };

  const handleAddTemplate = () => {
    setIsAddingTemplate(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-gray-900">
              Создать заявку
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Заполните информацию о новой заявке на подбор персонала
            </p>
          </DialogHeader>

          <div className="py-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Client & Object Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm text-gray-900">Клиент и объект</h3>
                  </div>
                  <div className="space-y-4">
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
                      <Label htmlFor="job-order" className="text-sm text-gray-700">
                        Заказ-наряд
                      </Label>
                      <Select value={jobOrderId} onValueChange={setJobOrderId}>
                        <SelectTrigger id="job-order" className="mt-1.5">
                          <SelectValue placeholder="Выберите заказ-наряд" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jo-1">ЗН-2024-1145 — Разнорабочие</SelectItem>
                          <SelectItem value="jo-2">ЗН-2024-1146 — Отделочники</SelectItem>
                          <SelectItem value="jo-3">ЗН-2024-1147 — Электрики</SelectItem>
                          <SelectItem value="jo-4">ЗН-2024-1148 — Сантехники</SelectItem>
                          <SelectItem value="jo-5">ЗН-2024-1149 — Грузчики</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm text-gray-900">График и ответственный</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="execution-date" className="text-sm text-gray-700">
                        Дата исполнения
                      </Label>
                      <Input
                        id="execution-date"
                        type="date"
                        value={executionDate}
                        onChange={(e) => setExecutionDate(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="manager" className="text-sm text-gray-700">
                        Ответственный
                      </Label>
                      <Select value={managerId} onValueChange={setManagerId}>
                        <SelectTrigger id="manager" className="mt-1.5">
                          <SelectValue placeholder="Выберите ответственного" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager-1">Анна Смирнова</SelectItem>
                          <SelectItem value="manager-2">Михаил Петров</SelectItem>
                          <SelectItem value="manager-3">Дмитрий Соколов</SelectItem>
                          <SelectItem value="manager-4">Елена Волкова</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Comment Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm text-gray-900">Дополнительная информация</h3>
                  </div>
                  <div>
                    <Label htmlFor="comment" className="text-sm text-gray-700">
                      Комментарий
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="Укажите особые требования, условия работы или другие важные детали..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={10}
                      className="mt-1.5 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {comment.length} / 500 символов
                    </p>
                  </div>
                </div>

                {/* Shift Templates Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm text-gray-900">Шаблоны смен</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddTemplate}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить
                    </Button>
                  </div>

                  {shiftTemplates.length > 0 ? (
                    <div className="space-y-2">
                      {shiftTemplates.map((template, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-900">
                              Шаблон {index + 1}
                            </div>
                            <button
                              onClick={() => {
                                setShiftTemplates(
                                  shiftTemplates.filter((_, i) => i !== index)
                                );
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">
                          Шаблоны смен не добавлены
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddTemplate}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Добавить первый шаблон
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              После создания заявка будет иметь статус "Черновик"
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave} className="gap-2">
                Создать заявку
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift Template Modal */}
      <ShiftTemplateModal
        open={isAddingTemplate}
        onOpenChange={(open) => {
          setIsAddingTemplate(open);
          if (!open) {
            // Template was saved, add it to the list
            setShiftTemplates([...shiftTemplates, { id: Date.now() }]);
          }
        }}
        mode="create"
      />
    </>
  );
}
