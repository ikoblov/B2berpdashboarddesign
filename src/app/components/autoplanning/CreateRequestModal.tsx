import { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateRequestModal({ isOpen, onClose, onSubmit }: CreateRequestModalProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    objectId: '',
    masterId: '',
    date: '',
    time: '08:00',
    duration: 8,
    requiredCount: 5,
    workType: '',
    isPhysicallyHard: false,
    genderRequired: 'any',
    priorityPreset: 'standard',
    preferredForemanId: '',
    hourlyRate: 1200,
    foremanBonus: 300,
    description: ''
  });

  const [livePreview, setLivePreview] = useState({
    zone: 'yellow' as 'green' | 'yellow' | 'red',
    healthScore: 68,
    candidatesFound: 47,
    candidatesByDistance: {
      walking: 12,
      transit: 23,
      other: 12
    },
    closurePrediction: 85,
    estimatedHours: 4,
    topCandidates: [
      { id: '1', name: 'Иванов И.', score: 0.92, experience: 'ЖК Восток 8 раз', distance: '15 мин пешком' },
      { id: '2', name: 'Петров С.', score: 0.88, experience: 'Работал с мастером', distance: '20 мин пешком' }
    ],
    channels: {
      telegram: 11,
      maks: 3,
      sms: 1
    },
    risks: [
      '3 канд. в красной зоне (явка <50%)',
      'Ставка на 10% ниже среднего'
    ]
  });

  // Simulate live preview recalculation
  useEffect(() => {
    if (!formData.objectId || !formData.date || !formData.requiredCount) return;
    
    // Simulate debounced API call
    const timer = setTimeout(() => {
      // Mock recalculation
      setLivePreview(prev => ({
        ...prev,
        healthScore: Math.floor(Math.random() * 40) + 60
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.objectId, formData.date, formData.requiredCount, formData.priorityPreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const getZoneColor = (zone: 'green' | 'yellow' | 'red') => {
    switch (zone) {
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
    }
  };

  const getZoneLabel = (zone: 'green' | 'yellow' | 'red') => {
    switch (zone) {
      case 'green': return '🟢 Зелёная';
      case 'yellow': return '🟡 Оранжевая';
      case 'red': return '🔴 Красная';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-gray-900">Создание заявки</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Left column - Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Параметры</h3>

                {/* Client */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Клиент <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите клиента</option>
                    <option value="client1">ООО "Стройгарант"</option>
                    <option value="client2">АО "ТехноСтрой"</option>
                  </select>
                </div>

                {/* Object */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Объект <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.objectId}
                    onChange={(e) => setFormData({ ...formData, objectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите объект</option>
                    <option value="obj1">ЖК Восток</option>
                    <option value="obj2">БЦ Столица</option>
                    <option value="obj3">ТЦ Горизонт</option>
                  </select>
                </div>

                {/* Master */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Мастер (контакт)
                  </label>
                  <select
                    value={formData.masterId}
                    onChange={(e) => setFormData({ ...formData, masterId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите мастера</option>
                    <option value="master1">Петров И.И.</option>
                    <option value="master2">Сидоров А.А.</option>
                  </select>
                </div>

                {/* Date and time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Дата начала <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Время <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Duration and count */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Длительность (ч) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="24"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Количество людей <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.requiredCount}
                      onChange={(e) => setFormData({ ...formData, requiredCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Work type */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Тип работ
                  </label>
                  <select
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="cleaning">Уборка этажей</option>
                    <option value="loading">Погрузка/разгрузка</option>
                    <option value="demolition">Демонтаж</option>
                  </select>
                </div>

                {/* Additional options */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPhysicallyHard}
                      onChange={(e) => setFormData({ ...formData, isPhysicallyHard: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    Физически тяжёлая работа
                  </label>
                </div>

                {/* Gender requirement */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Пол</label>
                  <div className="space-y-2">
                    {[
                      { value: 'any', label: 'Любой' },
                      { value: 'male', label: 'Только мужчины' },
                      { value: 'female', label: 'Только женщины' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={formData.genderRequired === option.value}
                          onChange={(e) => setFormData({ ...formData, genderRequired: e.target.value })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority preset */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Пресет приоритета
                  </label>
                  <select
                    value={formData.priorityPreset}
                    onChange={(e) => setFormData({ ...formData, priorityPreset: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Стандарт</option>
                    <option value="urgent">Срочно (дистанция)</option>
                    <option value="quality">Качество (лучшие)</option>
                    <option value="showcase">Показательная</option>
                  </select>
                </div>

                {/* Preferred foreman */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Предпочт. foreman
                  </label>
                  <select
                    value={formData.preferredForemanId}
                    onChange={(e) => setFormData({ ...formData, preferredForemanId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не указан</option>
                    <option value="foreman1">Иванов И.П.</option>
                    <option value="foreman2">Сидоров А.В.</option>
                  </select>
                </div>

                {/* Rates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Ставка исполнителю (₽)
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Доплата foreman (₽)
                    </label>
                    <input
                      type="number"
                      value={formData.foremanBonus}
                      onChange={(e) => setFormData({ ...formData, foremanBonus: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Уборка после ремонта, вынос мусора..."
                  />
                </div>
              </div>

              {/* Right column - Live preview */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Preview-прогноз</h3>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Zone and health score */}
                  <div>
                    <div className={cn('text-lg font-medium mb-1', getZoneColor(livePreview.zone))}>
                      {getZoneLabel(livePreview.zone)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Health Score: <span className="font-medium text-gray-900">{livePreview.healthScore}</span>
                    </div>
                  </div>

                  {/* Candidates found */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Найдено: {livePreview.candidatesFound} канд.
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 ml-6">
                      <div>├─ Пешком ≤30м: {livePreview.candidatesByDistance.walking}</div>
                      <div>├─ Автобус ≤60м: {livePreview.candidatesByDistance.transit}</div>
                      <div>└─ Остальные: {livePreview.candidatesByDistance.other}</div>
                    </div>
                  </div>

                  {/* Closure prediction */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Прогноз закрытия:</span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">
                      {livePreview.closurePrediction}% за {livePreview.estimatedHours} часа
                    </div>
                  </div>

                  {/* Top candidates */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-2">Топ-5 кандидатов:</div>
                    <div className="space-y-2">
                      {livePreview.topCandidates.map((candidate, idx) => (
                        <div key={candidate.id} className="ml-2 text-sm">
                          <div className="text-gray-900">
                            {idx + 1}. {candidate.name} ({candidate.score})
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {candidate.experience}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            📍 {candidate.distance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Communication channels */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Каналы достижимости:</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 ml-6">
                      <div>├─ Telegram: {livePreview.channels.telegram}/{formData.requiredCount}</div>
                      <div>├─ МАКС: {livePreview.channels.maks}/{formData.requiredCount}</div>
                      <div>└─ SMS→бот: {livePreview.channels.sms}/{formData.requiredCount}</div>
                    </div>
                  </div>

                  {/* Risks */}
                  {livePreview.risks.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-900">Риски:</span>
                      </div>
                      <div className="space-y-1 ml-6">
                        {livePreview.risks.map((risk, idx) => (
                          <div key={idx} className="text-sm text-amber-700">
                            • {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                  >
                    Пересчитать
                  </button>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Создать →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}