import { useState } from 'react';
import { 
  MapPin, 
  Star, 
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Send,
  CheckSquare,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Candidate {
  id: string;
  photo: string | null;
  firstName: string;
  lastName: string;
  rating: number;
  distance: number;
  district: string;
  specializations: string[];
  permits: string[];
  npdStatus: 'active' | 'needs_confirmation' | 'expired';
  isSelfEmployed: boolean;
  recommendation: string;
  recommendationScore: 'high' | 'medium' | 'low';
  status: 'ready' | 'needs_approval' | 'rejected';
  rejectionReason?: string;
}

export function AutoPlanning() {
  const [selectedObject, setSelectedObject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [requiredCount, setRequiredCount] = useState(5);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [showRejected, setShowRejected] = useState(false);
  const [showRejectedBlock, setShowRejectedBlock] = useState(true);

  // Mock data - смена
  const shift = {
    object: 'ЖК "Оазис" (корпус 3)',
    client: 'ООО "Строймастер"',
    date: '15.12.2024',
    timeStart: '09:00',
    timeEnd: '18:00',
    role: 'Разнорабочий',
    requiredCount: 5,
    hourlyRate: 520,
    requirements: {
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      specialization: 'Разнорабочий',
      experience: 'От 6 месяцев'
    },
    location: {
      address: 'ул. Шарикоподшипниковская, 40',
      district: 'Южнопортовый'
    },
    approvalStatus: 'approved' as const
  };

  // Mock data - кандидаты
  const candidates: Candidate[] = [
    {
      id: '1',
      photo: null,
      firstName: 'Михаил',
      lastName: 'Соколов',
      rating: 4.8,
      distance: 2.3,
      district: 'Южнопортовый',
      specializations: ['Разнорабочий', 'Грузчик'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: 'Уже работал на объекте 8 раз, высокий рейтинг, близко к объекту',
      recommendationScore: 'high',
      status: 'ready'
    },
    {
      id: '2',
      photo: null,
      firstName: 'Дмитрий',
      lastName: 'Иванов',
      rating: 4.6,
      distance: 3.1,
      district: 'Печатники',
      specializations: ['Разнорабочий'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: 'Стабильные выходы, работал с заказчиком раньше',
      recommendationScore: 'high',
      status: 'ready'
    },
    {
      id: '3',
      photo: null,
      firstName: 'Алексей',
      lastName: 'Петров',
      rating: 4.4,
      distance: 5.8,
      district: 'Нагатинский затон',
      specializations: ['Разнорабочий', 'Демонтаж'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: 'Опыт работы на похожих объектах, стабильный исполнитель',
      recommendationScore: 'high',
      status: 'ready'
    },
    {
      id: '4',
      photo: null,
      firstName: 'Сергей',
      lastName: 'Кузнецов',
      rating: 4.2,
      distance: 4.2,
      district: 'Марьино',
      specializations: ['Разнорабочий'],
      permits: ['Инструктаж по ТБ'],
      npdStatus: 'needs_confirmation',
      isSelfEmployed: true,
      recommendation: 'НПД требует подтверждения, нет допуска на высоту',
      recommendationScore: 'medium',
      status: 'needs_approval'
    },
    {
      id: '5',
      photo: null,
      firstName: 'Андрей',
      lastName: 'Смирнов',
      rating: 4.1,
      distance: 7.5,
      district: 'Люблино',
      specializations: ['Разнорабочий'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: 'Доступен, нет опыта на объекте, дальнее расстояние',
      recommendationScore: 'medium',
      status: 'needs_approval'
    }
  ];

  const rejectedCandidates: Candidate[] = [
    {
      id: '6',
      photo: null,
      firstName: 'Иван',
      lastName: 'Васильев',
      rating: 3.8,
      distance: 3.5,
      district: 'Южнопортовый',
      specializations: ['Разнорабочий'],
      permits: ['Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: '',
      recommendationScore: 'low',
      status: 'rejected',
      rejectionReason: 'Нет допуска "Работа на высоте"'
    },
    {
      id: '7',
      photo: null,
      firstName: 'Павел',
      lastName: 'Новиков',
      rating: 4.5,
      distance: 2.8,
      district: 'Южнопортовый',
      specializations: ['Разнорабочий', 'Грузчик'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'active',
      isSelfEmployed: true,
      recommendation: '',
      recommendationScore: 'low',
      status: 'rejected',
      rejectionReason: 'Занят на другой смене в это время'
    },
    {
      id: '8',
      photo: null,
      firstName: 'Владимир',
      lastName: 'Морозов',
      rating: 4.3,
      distance: 4.1,
      district: 'Печатники',
      specializations: ['Разнорабочий'],
      permits: ['Работа на высоте', 'Инструктаж по ТБ'],
      npdStatus: 'expired',
      isSelfEmployed: true,
      recommendation: '',
      recommendationScore: 'low',
      status: 'rejected',
      rejectionReason: 'НПД просрочен'
    }
  ];

  const toggleCandidate = (id: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCandidates(newSelected);
  };

  const getStatusBadge = (npdStatus: Candidate['npdStatus']) => {
    const badges = {
      active: { icon: CheckCircle, color: 'text-green-600' },
      needs_confirmation: { icon: AlertTriangle, color: 'text-yellow-600' },
      expired: { icon: XCircle, color: 'text-red-600' }
    };
    return badges[npdStatus];
  };

  const getRowColor = (status: Candidate['status']) => {
    if (status === 'ready') return 'bg-green-50/50 hover:bg-green-50';
    if (status === 'needs_approval') return 'bg-yellow-50/50 hover:bg-yellow-50';
    return 'bg-red-50/50 hover:bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6">
        
        {/* A) Верхняя панель */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select 
                value={selectedObject}
                onChange={(e) => setSelectedObject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Выберите объект</option>
                <option value="oasis">ЖК "Оазис" (корпус 3)</option>
                <option value="capital">БЦ "Столица"</option>
                <option value="horizon">ТЦ "Горизонт"</option>
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Роль/тип смены</option>
                <option value="worker">Разнорабочий</option>
                <option value="loader">Грузчик</option>
                <option value="demolition">Демонтаж</option>
              </select>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Требуется:</span>
                <input
                  type="number"
                  value={requiredCount}
                  onChange={(e) => setRequiredCount(Number(e.target.value))}
                  className="w-16 px-3 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">чел.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                Подобрать автоматически
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                Сформировать назначения
              </button>
            </div>
          </div>
        </div>

        {/* Основной контент: 3 колонки */}
        <div className="grid grid-cols-[280px_1fr_280px] gap-4">
          
          {/* B) Левая колонка - карточка смены */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Детали смены</h3>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="text-gray-500 mb-0.5">Объект</div>
                  <div className="text-gray-900">{shift.object}</div>
                </div>

                <div>
                  <div className="text-gray-500 mb-0.5">Заказчик</div>
                  <div className="text-gray-900">{shift.client}</div>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-900">{shift.date}</div>
                    <div className="text-gray-500">{shift.timeStart} — {shift.timeEnd}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-gray-500 mb-1">Роль</div>
                  <div className="text-gray-900">{shift.role}</div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">Требуется</div>
                  <div className="text-gray-900">{shift.requiredCount} человек × {shift.hourlyRate} ₽/ч</div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-gray-500 mb-1.5">Требования</div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Shield className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-700 leading-tight">
                        {shift.requirements.permits.join(', ')}
                      </div>
                    </div>
                    <div className="text-gray-700">
                      Опыт: {shift.requirements.experience}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 pt-2 border-t border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900">{shift.location.address}</div>
                    <div className="text-gray-500">{shift.location.district}</div>
                  </div>
                </div>

                {shift.approvalStatus === 'approved' && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-green-700">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Согласовано заказчиком</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* C) Центральная колонка - таблица кандидатов */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Рекомендованные ({candidates.length})
                </h3>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRejected}
                    onChange={(e) => setShowRejected(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Показать отклонённых
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-8"></th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">ФИО</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Рейтинг</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Дистанция</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Специализация</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Допуски</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">НПД</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Причина рекомендации</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => {
                      const StatusIcon = getStatusBadge(candidate.npdStatus).icon;
                      const statusColor = getStatusBadge(candidate.npdStatus).color;
                      
                      return (
                        <tr
                          key={candidate.id}
                          className={cn(
                            'border-b border-gray-100 transition-colors cursor-pointer',
                            getRowColor(candidate.status)
                          )}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.has(candidate.id)}
                              onChange={() => toggleCandidate(candidate.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button 
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors text-left"
                              onClick={() => window.open(`/executor/${candidate.id}`, '_blank')}
                            >
                              {candidate.photo ? (
                                <img 
                                  src={candidate.photo} 
                                  alt={candidate.firstName}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              <span className="text-gray-900">{candidate.lastName} {candidate.firstName}</span>
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-gray-900">{candidate.rating}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div>
                              <div className="text-gray-900">{candidate.distance} км</div>
                              <div className="text-xs text-gray-500">{candidate.district}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.specializations.map((spec, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              {candidate.permits.map((permit, idx) => (
                                <Shield 
                                  key={idx}
                                  className="w-3.5 h-3.5 text-green-600"
                                  title={permit}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <StatusIcon className={cn('w-4 h-4', statusColor)} />
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-xs text-gray-700 leading-tight">
                              {candidate.recommendation}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {showRejected && rejectedCandidates.map((candidate) => {
                      const StatusIcon = getStatusBadge(candidate.npdStatus).icon;
                      const statusColor = getStatusBadge(candidate.npdStatus).color;
                      
                      return (
                        <tr
                          key={candidate.id}
                          className="border-b border-gray-100 bg-gray-50 opacity-60"
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              disabled
                              className="w-4 h-4 text-gray-400 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="text-gray-600">{candidate.lastName} {candidate.firstName}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-600">{candidate.rating}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-gray-600">{candidate.distance} км</div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.specializations.map((spec, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              {candidate.permits.map((permit, idx) => (
                                <Shield 
                                  key={idx}
                                  className="w-3.5 h-3.5 text-gray-400"
                                  title={permit}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <StatusIcon className={cn('w-4 h-4', 'text-gray-400')} />
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-xs text-red-700">
                              {candidate.rejectionReason}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* D) Правая колонка - отклонённые */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setShowRejectedBlock(!showRejectedBlock)}
                className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>Отклонены ({rejectedCandidates.length})</span>
                {showRejectedBlock ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showRejectedBlock && (
                <div className="px-4 pb-4 space-y-2">
                  {rejectedCandidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start gap-2 mb-1.5">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 mb-0.5">
                            {candidate.lastName} {candidate.firstName}
                          </div>
                          <div className="text-xs text-red-700">
                            {candidate.rejectionReason}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* E) Нижняя панель действий */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <CheckSquare className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Выбрано:</span>
                <span className="text-gray-900 font-medium">{selectedCandidates.size} из {shift.requiredCount}</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Создать задачу куратору
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Отправить приглашение в Telegram
                </button>
                <button 
                  disabled={selectedCandidates.size === 0}
                  className={cn(
                    'px-6 py-2 text-sm rounded-lg transition-colors flex items-center gap-2',
                    selectedCandidates.size > 0
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  )}
                >
                  <CheckSquare className="w-4 h-4" />
                  Назначить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}