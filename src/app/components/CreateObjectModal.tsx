import { useState } from "react";
import { Building2, MapPin, User, MessageSquare, Map } from "lucide-react";
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

interface CreateObjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateObjectModal({ open, onOpenChange }: CreateObjectModalProps) {
  const [objectName, setObjectName] = useState('');
  const [clientId, setClientId] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [managerId, setManagerId] = useState('');
  const [comment, setComment] = useState('');

  const handleSave = () => {
    // Handle save logic here
    console.log({
      objectName,
      clientId,
      address,
      latitude,
      longitude,
      managerId,
      comment,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-gray-900">
            Создать объект
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Добавьте новый строительный объект в систему
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
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Основная информация</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="object-name" className="text-sm text-gray-700">
                      Название объекта
                    </Label>
                    <Input
                      id="object-name"
                      placeholder="Например: ЖК Северный"
                      value={objectName}
                      onChange={(e) => setObjectName(e.target.value)}
                      className="mt-1.5"
                    />
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
                    <Label htmlFor="manager" className="text-sm text-gray-700">
                      Ответственный
                    </Label>
                    <Select value={managerId} onValueChange={setManagerId}>
                      <SelectTrigger id="manager" className="mt-1.5">
                        <SelectValue placeholder="Выберите мастера" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager-1">Иванов Петр Сергеевич</SelectItem>
                        <SelectItem value="manager-2">Сидоров Алексей Михайлович</SelectItem>
                        <SelectItem value="manager-3">Петров Константин Алексеевич</SelectItem>
                        <SelectItem value="manager-4">Козлов Дмитрий Иванович</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm text-gray-900">Адрес и геолокация</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-sm text-gray-700">
                      Адрес
                    </Label>
                    <Input
                      id="address"
                      placeholder="г. Москва, ул. Полярная, д. 31"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="latitude" className="text-sm text-gray-700">
                        Широта
                      </Label>
                      <Input
                        id="latitude"
                        placeholder="55.751244"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="text-sm text-gray-700">
                        Долгота
                      </Label>
                      <Input
                        id="longitude"
                        placeholder="37.618423"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Map className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">
                          Карта с маркером объекта
                        </p>
                      </div>
                    </div>
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
                    Внутренний комментарий
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Укажите особенности объекта, требования к доступу, контактные данные..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={12}
                    className="mt-1.5 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {comment.length} / 1000 символов
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-3">Справка</div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>
                    • После создания объект получит уникальный ID
                  </p>
                  <p>
                    • Статус нового объекта: "Активный"
                  </p>
                  <p>
                    • Геолокация используется для подбора персонала
                  </p>
                  <p>
                    • Вы сможете создать заявки после сохранения
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
            Создать объект
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}