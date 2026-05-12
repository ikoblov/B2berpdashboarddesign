import { useState } from 'react';
import { ReviewsTab } from './ReviewsTab';
import { CommunicationsTab } from './CommunicationsTab';
import { RatingTab } from './RatingTab';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  Shield,
  Clock,
  DollarSign,
  MessageSquare,
  CheckSquare,
  Briefcase,
  Award,
  User,
  CheckCircle,
  AlertCircle,
  Camera,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ExecutorCardProps {
  executorId: string;
  onBack: () => void;
}

type TabType = 'shifts' | 'payments' | 'permits' | 'passport' | 'reviews' | 'rating' | 'communications' | 'tasks';

export function ExecutorCard({ executorId, onBack }: ExecutorCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('shifts');
  const [showExperienceDetails, setShowExperienceDetails] = useState(false);
  const [paymentsFilter, setPaymentsFilter] = useState<'own' | 'others'>('own');
  const [expandedShiftId, setExpandedShiftId] = useState<string | null>(null);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Mock data
  const executor = {
    id: executorId,
    photo: null,
    firstName: 'Михаил',
    lastName: 'Соколов',
    middleName: 'Александрович',
    birthDate: '15.03.1989',
    city: 'Москва',
    district: 'Южнопортовый',
    address: 'ул. Шарикоподшипниковская, 40',
    
    // Status
    isVerified: true,
    npdStatus: 'active' as const, // active | needs_confirmation | expired
    isSelfEmployed: true,
    isTrustedSMZ: true, // Является доверенным СМЗ
    
    // Performance
    rating: 4.6,
    reliabilityPercent: 94,
    shiftsPerMonth: 18,
    lastShiftDate: '12.12.2024',
    
    // Work info
    specializations: ['Разнорабочий', 'Грузчик'],
    experience: {
      total: '2 года 4 месяца',
      details: [
        'Погрузочно-разгрузочные работы',
        'Строительные работы',
        'Демонтаж'
      ]
    },
    
    // Recent issues
    violationsCount: 2,
    overallOpinion: 'Надёжный исполнитель, стабильно выходит',
    riskFlags: ['late'], // late, no_show, complaint
    
    phone: '+7 (926) 123-45-67',
    email: 'sokolov.m@example.com'
  };

  const calculateAge = (birthDate: string) => {
    const [day, month, year] = birthDate.split('.');
    const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getNpdBadge = () => {
    const badges = {
      active: { label: 'НПД активен', color: 'bg-green-50 text-green-700 border-green-200' },
      needs_confirmation: { label: 'Требует подтверждения', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      expired: { label: 'НПД просрочен', color: 'bg-red-50 text-red-700 border-red-200' }
    };
    return badges[executor.npdStatus];
  };

  const getRiskIcon = (risk: string) => {
    const icons = {
      late: { icon: Clock, color: 'text-yellow-600', title: 'Опоздания' },
      no_show: { icon: XCircle, color: 'text-red-600', title: 'Не выходы' },
      complaint: { icon: AlertTriangle, color: 'text-orange-600', title: 'Жалобы' }
    };
    return icons[risk as keyof typeof icons];
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1400px] mx-auto p-6">
          
          {/* Header with back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </button>

          {/* Three-column top section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <div className="grid grid-cols-[240px_1fr_300px] gap-8">
              
              {/* LEFT COLUMN - Photo */}
              <div className="flex flex-col">
                {executor.photo ? (
                  <img 
                    src={executor.photo} 
                    alt={executor.firstName} 
                    className="w-full aspect-[3/4] rounded-lg object-cover border border-gray-200" 
                  />
                ) : (
                  <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                    <User className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                
                {/* Status badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {executor.isVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Верифицирован</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Не верифицирован</span>
                      </>
                    )}
                  </div>
                  <div className={cn('text-xs px-3 py-1.5 rounded-md border text-center', getNpdBadge().color)}>
                    {getNpdBadge().label}
                  </div>
                </div>

                {/* Photo button */}
                <button className="mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4" />
                  Заменить фото
                </button>
              </div>

              {/* CENTER COLUMN - Information */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl text-gray-900 mb-4">
                    {executor.lastName} {executor.firstName} {executor.middleName}
                  </h1>
                  
                  <div className="space-y-2.5 text-sm mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 w-32">Дата рождения:</span>
                      <span className="text-gray-900">{executor.birthDate} ({calculateAge(executor.birthDate)} лет)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 w-32">Город:</span>
                      <span className="text-gray-900">{executor.city}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 w-32">Район:</span>
                      <span className="text-gray-900">{executor.district}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">{executor.address}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {executor.specializations.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Work experience */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExperienceDetails(!showExperienceDetails)}
                      className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700 transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{executor.experience.total}</span>
                      {showExperienceDetails ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {showExperienceDetails && (
                      <div className="mt-2 ml-6 pl-4 border-l border-gray-200 space-y-1">
                        {executor.experience.details.map((detail, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            {detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Metrics & Actions */}
              <div className="flex flex-col justify-between border-l border-gray-200 pl-8">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="text-3xl text-gray-900">{executor.rating}</div>
                      <div className="text-xs text-gray-500">Рейтинг</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Надёжность</span>
                        <span className="text-gray-900 font-medium">{executor.reliabilityPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${executor.reliabilityPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                      <span className="text-gray-500">Частота выходов</span>
                      <span className="text-gray-900 font-medium">{executor.shiftsPerMonth} / мес</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Последняя смена</span>
                      <span className="text-gray-900 font-medium">{executor.lastShiftDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Написать
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second row - Info bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                {/* Violations */}
                {executor.violationsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">Нарушений:</span>
                    <span className="text-gray-900 font-medium">{executor.violationsCount}</span>
                  </div>
                )}

                {/* Risk flags */}
                {executor.riskFlags.length > 0 && (
                  <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                    <span className="text-gray-600">Риски:</span>
                    <div className="flex items-center gap-1.5">
                      {executor.riskFlags.map((risk, idx) => {
                        const riskData = getRiskIcon(risk);
                        const Icon = riskData.icon;
                        return (
                          <div key={idx} title={riskData.title}>
                            <Icon className={cn('w-4 h-4', riskData.color)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Overall opinion */}
              <div className="text-gray-700">
                {executor.overallOpinion}
              </div>
            </div>
          </div>

          {/* Tabbed content area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex items-center px-4 overflow-x-auto">
                {[
                  { key: 'shifts', label: 'Смены', icon: Clock },
                  { key: 'payments', label: 'Выплаты', icon: DollarSign },
                  { key: 'permits', label: 'Допуски', icon: Shield },
                  { key: 'passport', label: 'Паспортные данные', icon: FileText },
                  { key: 'reviews', label: 'Мнения', icon: Award },
                  { key: 'rating', label: 'Рейтинг', icon: Star },
                  { key: 'communications', label: 'Коммуникации', icon: MessageSquare },
                  { key: 'tasks', label: 'Задачи', icon: CheckSquare }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as TabType)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap',
                        activeTab === tab.key
                          ? 'border-blue-600 text-blue-700'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'shifts' && (
                <div>
                  {/* 1. Верхняя строка статистики */}
                  <div className="flex items-center gap-8 mb-4 pb-4 border-b border-gray-200 text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-600">Выходов за 30 дней:</span>
                      <span className="text-gray-900 font-medium">18</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-600">Не выходы:</span>
                      <span className="text-red-700 font-medium">2</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-600">Средняя ставка:</span>
                      <span className="text-gray-900 font-medium">520 ₽/ч</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-600">Последний выход:</span>
                      <span className="text-gray-900 font-medium">12.12.2024</span>
                    </div>
                  </div>

                  {/* 2. Фильтры */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        placeholder="От"
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="date"
                        placeholder="До"
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Все объекты</option>
                      <option>ЖК "Оазис"</option>
                      <option>БЦ "Столица"</option>
                      <option>ТЦ "Горизонт"</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Все клиенты</option>
                      <option>ООО "Строймастер"</option>
                      <option>АО "ГлавСтрой"</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Все статусы</option>
                      <option>Завершена</option>
                      <option>Не вышел</option>
                      <option>Отменена</option>
                    </select>
                  </div>

                  {/* 3. Основная таблица смен */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Дата</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Объект</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Роль</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Часы</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Начислено</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { 
                            id: '1',
                            date: '12.12.2024', 
                            object: 'ЖК "Оазис" (корпус 3)', 
                            role: 'Разнорабочий',
                            hours: '8', 
                            amount: '4 800', 
                            status: 'completed',
                            timeStart: '09:00',
                            timeEnd: '18:00',
                            supervisor: 'Петров Д.А.',
                            comment: null,
                            violation: false,
                            adjustments: []
                          },
                          { 
                            id: '2',
                            date: '11.12.2024', 
                            object: 'ЖК "Оазис" (корпус 3)', 
                            role: 'Разнорабочий',
                            hours: '8', 
                            amount: '4 800', 
                            status: 'completed',
                            timeStart: '09:00',
                            timeEnd: '18:00',
                            supervisor: 'Петров Д.А.',
                            comment: null,
                            violation: false,
                            adjustments: []
                          },
                          { 
                            id: '3',
                            date: '10.12.2024', 
                            object: 'БЦ "Столица"', 
                            role: 'Грузчик',
                            hours: '10', 
                            amount: '6 000', 
                            status: 'completed',
                            timeStart: '08:00',
                            timeEnd: '19:00',
                            supervisor: 'Иванов С.П.',
                            comment: 'Отличная работа',
                            violation: false,
                            adjustments: [{ type: 'bonus', amount: 500, reason: 'За оперативность' }]
                          },
                          { 
                            id: '4',
                            date: '09.12.2024', 
                            object: 'ЖК "Оазис" (корпус 3)', 
                            role: 'Разнорабочий',
                            hours: '—', 
                            amount: '—', 
                            status: 'noShow',
                            timeStart: null,
                            timeEnd: null,
                            supervisor: 'Петров Д.А.',
                            comment: null,
                            violation: true,
                            noShowReason: 'Не предупредил заранее',
                            adjustments: [{ type: 'penalty', amount: -500, reason: 'Штраф за невыход' }]
                          },
                          { 
                            id: '5',
                            date: '08.12.2024', 
                            object: 'ЖК "Оазис" (корпус 3)', 
                            role: 'Разнорабочий',
                            hours: '8', 
                            amount: '4 800', 
                            status: 'completed',
                            timeStart: '09:00',
                            timeEnd: '18:00',
                            supervisor: 'Петров Д.А.',
                            comment: null,
                            violation: false,
                            adjustments: []
                          },
                          { 
                            id: '6',
                            date: '05.12.2024', 
                            object: 'ТЦ "Горизонт"', 
                            role: 'Разнорабочий',
                            hours: '—', 
                            amount: '—', 
                            status: 'cancelled',
                            timeStart: null,
                            timeEnd: null,
                            supervisor: 'Смирнова О.В.',
                            comment: 'Смена отменена заказчиком',
                            violation: false,
                            adjustments: []
                          }
                        ].map((shift) => (
                          <>
                            <tr 
                              key={shift.id}
                              onClick={() => setExpandedShiftId(expandedShiftId === shift.id ? null : shift.id)}
                              className={cn(
                                'border-b border-gray-100 cursor-pointer transition-colors',
                                expandedShiftId === shift.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                              )}
                            >
                              <td className="px-3 py-2.5 text-gray-900">{shift.date}</td>
                              <td className="px-3 py-2.5 text-gray-900">{shift.object}</td>
                              <td className="px-3 py-2.5 text-gray-700">{shift.role}</td>
                              <td className="px-3 py-2.5 text-gray-700">{shift.hours}</td>
                              <td className="px-3 py-2.5 text-right text-gray-900">
                                {shift.amount !== '—' ? `${shift.amount} ₽` : shift.amount}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  {shift.violation && (
                                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                                  )}
                                  {shift.status === 'completed' && (
                                    <span className="text-xs text-green-700">Завершена</span>
                                  )}
                                  {shift.status === 'noShow' && (
                                    <span className="text-xs text-red-700 font-medium">Не вышел</span>
                                  )}
                                  {shift.status === 'cancelled' && (
                                    <span className="text-xs text-yellow-700">Отменена</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            
                            {/* 5. Детали смены (раскрытие) */}
                            {expandedShiftId === shift.id && (
                              <tr>
                                <td colSpan={6} className="px-3 py-3 bg-gray-50 border-b border-gray-200">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                                    {shift.timeStart && shift.timeEnd && (
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-gray-500 w-32">Время:</span>
                                        <span className="text-gray-900">{shift.timeStart} — {shift.timeEnd}</span>
                                      </div>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-gray-500 w-32">Ответственный:</span>
                                      <span className="text-gray-900">{shift.supervisor}</span>
                                    </div>
                                    {shift.noShowReason && (
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-gray-500 w-32">Причина невыхода:</span>
                                        <span className="text-red-700">{shift.noShowReason}</span>
                                      </div>
                                    )}
                                    {shift.comment && (
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-gray-500 w-32">Комментарий:</span>
                                        <span className="text-gray-700">{shift.comment}</span>
                                      </div>
                                    )}
                                    {shift.adjustments.length > 0 && (
                                      <div className="col-span-2 pt-2 border-t border-gray-200">
                                        <div className="text-gray-500 mb-1.5">Корректировки:</div>
                                        <div className="space-y-1">
                                          {shift.adjustments.map((adj, idx) => (
                                            <div key={idx} className="flex items-baseline gap-2">
                                              <span className={cn(
                                                'font-medium',
                                                adj.type === 'bonus' ? 'text-green-700' : 'text-red-700'
                                              )}>
                                                {adj.type === 'bonus' ? '+' : ''}{adj.amount} ₽
                                              </span>
                                              <span className="text-gray-600">— {adj.reason}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <div className="flex items-center gap-4 mb-4 border-b border-gray-200">
                    <button
                      onClick={() => setPaymentsFilter('own')}
                      className={cn(
                        'px-4 py-2 text-sm border-b-2 transition-colors',
                        paymentsFilter === 'own'
                          ? 'border-blue-600 text-blue-700'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      )}
                    >
                      Свои выплаты
                    </button>
                    <button
                      onClick={() => setPaymentsFilter('others')}
                      className={cn(
                        'px-4 py-2 text-sm border-b-2 transition-colors',
                        paymentsFilter === 'others'
                          ? 'border-blue-600 text-blue-700'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      )}
                    >
                      Выплаты за других
                    </button>
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Все реестры</option>
                      <option>Реестр #2024-048</option>
                      <option>Реестр #2024-047</option>
                    </select>
                  </div>

                  {paymentsFilter === 'own' && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Период</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Реестр</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Начислено</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">НПД (6%)</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">К выплате</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { period: '02–08.12', registry: '#2024-048', accrued: '28 800 ₽', npd: '1 838 ₽', amount: '26 962 ₽', status: 'paid' },
                            { period: '25.11–01.12', registry: '#2024-047', accrued: '33 600 ₽', npd: '2 145 ₽', amount: '31 455 ₽', status: 'paid' },
                            { period: '18–24.11', registry: '#2024-046', accrued: '24 000 ₽', npd: '1 532 ₽', amount: '22 468 ₽', status: 'paid' }
                          ].map((payment, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900">{payment.period}</td>
                              <td className="px-4 py-3 text-gray-900">{payment.registry}</td>
                              <td className="px-4 py-3 text-right text-gray-900">{payment.accrued}</td>
                              <td className="px-4 py-3 text-right text-gray-600">{payment.npd}</td>
                              <td className="px-4 py-3 text-right text-gray-900">{payment.amount}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                  Выплачено
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {paymentsFilter === 'others' && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Период</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">За кого</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Сумма</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { period: '02–08.12', worker: 'Иванов Петр', amount: '18 940 ₽', status: 'paid' },
                            { period: '25.11–01.12', worker: 'Сидоров Иван', amount: '22 468 ₽', status: 'paid' }
                          ].map((payment, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900">{payment.period}</td>
                              <td className="px-4 py-3 text-gray-900">{payment.worker}</td>
                              <td className="px-4 py-3 text-right text-gray-900">{payment.amount}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                  Выплачено
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'permits' && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Допуск</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Действителен до</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Работа на высоте', validUntil: '15.08.2025', status: 'valid' },
                        { name: 'Электробезопасность (2 группа)', validUntil: '22.06.2025', status: 'valid' },
                        { name: 'Медицинская книжка', validUntil: '10.03.2025', status: 'valid' },
                        { name: 'Инструктаж по ТБ', validUntil: '28.12.2024', status: 'expiring' }
                      ].map((permit, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{permit.name}</td>
                          <td className="px-4 py-3 text-gray-700">{permit.validUntil}</td>
                          <td className="px-4 py-3">
                            {permit.status === 'valid' && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                Активен
                              </span>
                            )}
                            {permit.status === 'expiring' && (
                              <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                                Истекает скоро
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'passport' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Паспортные данные</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Серия и номер</span>
                        <span className="text-gray-900">4520 123456</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Дата выдачи</span>
                        <span className="text-gray-900">12.04.2009</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">СНИЛС</span>
                        <span className="text-gray-900">123-456-789 01</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">ИНН</span>
                        <span className="text-gray-900">772345678901</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Адрес регистрации</h3>
                    <p className="text-sm text-gray-700">
                      г. Москва, ул. Шарикоподшипниковская, д. 40, кв. 15
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Контакты</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{executor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{executor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewsTab />
              )}

              {activeTab === 'rating' && (
                <RatingTab />
              )}

              {activeTab === 'communications' && (
                <CommunicationsTab />
              )}

              {activeTab === 'tasks' && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Задача</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ответственный</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Срок</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { title: 'Обновить медкнижку', responsible: 'Ольга Смирнова', deadline: '20.12.2024', status: 'inProgress' },
                        { title: 'Пройти инструктаж по ТБ', responsible: 'Дмитрий Петров', deadline: '28.12.2024', status: 'pending' }
                      ].map((task, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{task.title}</td>
                          <td className="px-4 py-3 text-gray-700">{task.responsible}</td>
                          <td className="px-4 py-3 text-gray-700">{task.deadline}</td>
                          <td className="px-4 py-3">
                            {task.status === 'inProgress' && (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                В работе
                              </span>
                            )}
                            {task.status === 'pending' && (
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                Ожидает
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}