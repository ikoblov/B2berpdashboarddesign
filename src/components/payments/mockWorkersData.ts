type SelfEmployedStatus = 'active' | 'pending-confirmation' | 'connecting' | 'refused' | 'disabled';
type ApprovalStatus = 'approved' | 'waiting' | 'mismatch';
type CardStatus = 'no-card' | 'own-card' | 'trusted-card';

interface Deduction {
  id: string;
  type: 'bonus' | 'penalty' | 'deduction';
  amount: number;
  comment: string;
}

interface Shift {
  id: string;
  date: string;
  project: string;
  client: string;
  object: string;
  role: string;
  rate: number;
  ourHours: number;
  clientHours?: number;
  approvalStatus: ApprovalStatus;
}

export interface Worker {
  id: string;
  name: string;
  workerId: string;
  shiftPeriod: string;
  shiftCount: number;
  accrued: number;
  deductions: Deduction[];
  toPay: number;
  selfEmployedStatus: SelfEmployedStatus;
  approvalStatus: ApprovalStatus;
  hoursMismatch?: number;
  paymentMethod?: 'self-employed' | 'trusted-smz' | 'personal-card';
  trustedSmzName?: string;
  cardStatus: CardStatus;
  cardInfo?: {
    bank?: string;
    lastDigits?: string;
    sbpPhone?: string;
    owner?: string;
  };
  shifts: Shift[];
}

export const mockAwaitingAccrual: Worker[] = [
  {
    id: 'aw1',
    name: 'Григорьев Павел Сергеевич',
    workerId: 'W-10456',
    shiftPeriod: '25–26 ноя',
    shiftCount: 2,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'active',
    approvalStatus: 'waiting',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Козлов А.В.',
    },
    shifts: [
      { id: 's1', date: '25.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's2', date: '26.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: 'aw2',
    name: 'Федоров Дмитрий Олегович',
    workerId: 'W-10457',
    shiftPeriod: '26 ноя',
    shiftCount: 1,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Т-Банк',
      lastDigits: '4821',
    },
    shifts: [
      { id: 's3', date: '26.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: 'aw3',
    name: 'Лебедев Александр Викторович',
    workerId: 'W-10458',
    shiftPeriod: '25–26 ноя',
    shiftCount: 2,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'connecting',
    approvalStatus: 'mismatch',
    hoursMismatch: -2,
    cardStatus: 'no-card',
    shifts: [
      { id: 's4', date: '25.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3200, ourHours: 8, clientHours: 6, approvalStatus: 'mismatch' },
      { id: 's5', date: '26.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3200, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
  {
    id: 'aw4',
    name: 'Морозов Игорь Валентинович',
    workerId: 'W-10501',
    shiftPeriod: '25–26 ноя',
    shiftCount: 2,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Сбер',
      lastDigits: '7732',
    },
    shifts: [
      { id: 's100', date: '25.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Электрик', rate: 4500, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's101', date: '26.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Электрик', rate: 4500, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: 'aw5',
    name: 'Соколова Елена Дмитриевна',
    workerId: 'W-10512',
    shiftPeriod: '26 ноя',
    shiftCount: 1,
    accrued: 0,
    deductions: [],
    toPay: 0,
    selfEmployedStatus: 'refused',
    approvalStatus: 'approved',
    cardStatus: 'no-card',
    shifts: [
      { id: 's102', date: '26.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Маляр', rate: 3800, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
];

export const mockAwaitingPayment: Worker[] = [
  {
    id: '1',
    name: 'Иванов Олег Петрович',
    workerId: 'W-10234',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 14000,
    deductions: [
      { id: 'd1', type: 'deduction', amount: 500, comment: 'Спецовка' },
      { id: 'd2', type: 'deduction', amount: 400, comment: 'Косяки' },
    ],
    toPay: 13100,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов Андрей Викторович',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Иванов И.',
    },
    shifts: [
      { id: 's6', date: '21.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's7', date: '22.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's8', date: '23.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's9', date: '24.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Подсобник', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
  {
    id: '2',
    name: 'Петрова Мария Александровна',
    workerId: 'W-10189',
    shiftPeriod: '22–24 ноя',
    shiftCount: 3,
    accrued: 12600,
    deductions: [],
    toPay: 12600,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Козлов А.В.',
    },
    shifts: [
      { id: 's10', date: '22.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's11', date: '23.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's12', date: '24.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Отделочник', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '3',
    name: 'Сидоров Петр Николаевич',
    workerId: 'W-10156',
    shiftPeriod: '22–23 ноя',
    shiftCount: 2,
    accrued: 7200,
    deductions: [
      { id: 'd3', type: 'bonus', amount: 1000, comment: 'За качество' },
    ],
    toPay: 8200,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Т-Банк',
      lastDigits: '4821',
    },
    shifts: [
      { id: 's13', date: '22.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3600, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's14', date: '23.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Грузчик', rate: 3600, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
    ],
  },
  {
    id: '4',
    name: 'Кузнецова Анна Сергеевна',
    workerId: 'W-10099',
    shiftPeriod: '23–24 ноя',
    shiftCount: 2,
    accrued: 7600,
    deductions: [],
    toPay: 7600,
    selfEmployedStatus: 'pending-confirmation',
    approvalStatus: 'waiting',
    cardStatus: 'no-card',
    shifts: [
      { id: 's15', date: '23.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Подсобник', rate: 3800, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's16', date: '24.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Подсобник', rate: 3800, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: '5',
    name: 'Волков Дмитрий Игоревич',
    workerId: 'W-09875',
    shiftPeriod: '21–23 ноя',
    shiftCount: 3,
    accrued: 11400,
    deductions: [
      { id: 'd4', type: 'deduction', amount: 300, comment: 'Инструмент' },
    ],
    toPay: 11100,
    selfEmployedStatus: 'active',
    approvalStatus: 'mismatch',
    hoursMismatch: 3,
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Петров М.С.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 916 234-55-77',
      owner: 'Петров М.С.',
    },
    shifts: [
      { id: 's17', date: '21.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
      { id: 's18', date: '22.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
      { id: 's19', date: '23.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Отделочник', rate: 3800, ourHours: 8, clientHours: 9, approvalStatus: 'mismatch' },
    ],
  },
  {
    id: '6',
    name: 'Новиков Сергей Владимирович',
    workerId: 'W-10345',
    shiftPeriod: '20–22 ноя',
    shiftCount: 3,
    accrued: 10500,
    deductions: [],
    toPay: 10500,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Альфа-Банк',
      lastDigits: '5523',
    },
    shifts: [
      { id: 's20', date: '20.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Каменщик', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's21', date: '21.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Каменщик', rate: 3500, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's22', date: '22.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Каменщик', rate: 3500, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '7',
    name: 'Романова Ирина Павловна',
    workerId: 'W-10423',
    shiftPeriod: '23–24 ноя',
    shiftCount: 2,
    accrued: 8400,
    deductions: [
      { id: 'd5', type: 'bonus', amount: 500, comment: 'Перевыполнение плана' },
    ],
    toPay: 8900,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Козлов А.В.',
    },
    shifts: [
      { id: 's23', date: '23.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Уборщица', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's24', date: '24.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Уборщица', rate: 4200, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '8',
    name: 'Федотов Максим Андреевич',
    workerId: 'W-09234',
    shiftPeriod: '21–23 ноя',
    shiftCount: 3,
    accrued: 12000,
    deductions: [
      { id: 'd6', type: 'penalty', amount: 500, comment: 'Опоздание' },
    ],
    toPay: 11500,
    selfEmployedStatus: 'pending-confirmation',
    approvalStatus: 'waiting',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'ВТБ',
      lastDigits: '9012',
    },
    shifts: [
      { id: 's25', date: '21.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Сварщик', rate: 4000, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's26', date: '22.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Сварщик', rate: 4000, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's27', date: '23.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Сварщик', rate: 4000, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: '9',
    name: 'Захарова Ольга Ивановна',
    workerId: 'W-10567',
    shiftPeriod: '22–24 ноя',
    shiftCount: 3,
    accrued: 9600,
    deductions: [],
    toPay: 9600,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Петров М.С.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 916 234-55-77',
      owner: 'Петров М.С.',
    },
    shifts: [
      { id: 's28', date: '22.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Плиточник', rate: 3200, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's29', date: '23.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Плиточник', rate: 3200, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's30', date: '24.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Плиточник', rate: 3200, ourHours: 12, clientHours: 12, approvalStatus: 'approved' },
    ],
  },
  {
    id: '10',
    name: 'Белов Алексей Юрьевич',
    workerId: 'W-10678',
    shiftPeriod: '20–21 ноя',
    shiftCount: 2,
    accrued: 6800,
    deductions: [],
    toPay: 6800,
    selfEmployedStatus: 'disabled',
    approvalStatus: 'approved',
    cardStatus: 'no-card',
    shifts: [
      { id: 's31', date: '20.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Разнорабочий', rate: 3400, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's32', date: '21.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Разнорабочий', rate: 3400, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '11',
    name: 'Крылова Елена Сергеевна',
    workerId: 'W-09789',
    shiftPeriod: '22 ноя',
    shiftCount: 1,
    accrued: 4500,
    deductions: [
      { id: 'd7', type: 'deduction', amount: 200, comment: 'Форма' },
    ],
    toPay: 4300,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Райффайзен',
      lastDigits: '3344',
    },
    shifts: [
      { id: 's33', date: '22.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Маляр', rate: 4500, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '12',
    name: 'Тихонов Андрей Михайлович',
    workerId: 'W-10891',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 15600,
    deductions: [
      { id: 'd8', type: 'bonus', amount: 1000, comment: 'Срочность' },
      { id: 'd9', type: 'deduction', amount: 300, comment: 'Оборудование' },
    ],
    toPay: 16300,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Козлов А.В.',
    },
    shifts: [
      { id: 's34', date: '21.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Электромонтёр', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's35', date: '22.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Электромонтёр', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's36', date: '23.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Электромонтёр', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's37', date: '24.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Электромонтёр', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '13',
    name: 'Смирнова Татьяна Викторовна',
    workerId: 'W-10012',
    shiftPeriod: '23–24 ноя',
    shiftCount: 2,
    accrued: 7000,
    deductions: [],
    toPay: 7000,
    selfEmployedStatus: 'connecting',
    approvalStatus: 'waiting',
    cardStatus: 'no-card',
    shifts: [
      { id: 's38', date: '23.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Уборщица', rate: 3500, ourHours: 8, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's39', date: '24.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Уборщица', rate: 3500, ourHours: 12, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: '14',
    name: 'Павлов Николай Дмитриевич',
    workerId: 'W-10923',
    shiftPeriod: '20–23 ноя',
    shiftCount: 4,
    accrued: 13200,
    deductions: [
      { id: 'd10', type: 'penalty', amount: 400, comment: 'Нарушение безопасности' },
    ],
    toPay: 12800,
    selfEmployedStatus: 'active',
    approvalStatus: 'mismatch',
    hoursMismatch: -1,
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Газпромбанк',
      lastDigits: '6677',
    },
    shifts: [
      { id: 's40', date: '20.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Арматурщик', rate: 3300, ourHours: 8, clientHours: 7, approvalStatus: 'mismatch' },
      { id: 's41', date: '21.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Арматурщик', rate: 3300, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's42', date: '22.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Арматурщик', rate: 3300, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's43', date: '23.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Арматурщик', rate: 3300, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '15',
    name: 'Егорова Светлана Александровна',
    workerId: 'W-09654',
    shiftPeriod: '22–23 ноя',
    shiftCount: 2,
    accrued: 8000,
    deductions: [],
    toPay: 8000,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Васильева О.И.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 925 888-44-33',
      owner: 'Васильева О.И.',
    },
    shifts: [
      { id: 's44', date: '22.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Штукатур', rate: 4000, ourHours: 8, clientHours: 8, approvalStatus: 'approved' },
      { id: 's45', date: '23.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Штукатур', rate: 4000, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '16',
    name: 'Борисов Игорь Александрович',
    workerId: 'W-10235',
    shiftPeriod: '21 ноя',
    shiftCount: 1,
    accrued: 3600,
    deductions: [],
    toPay: 3600,
    selfEmployedStatus: 'refused',
    approvalStatus: 'approved',
    cardStatus: 'no-card',
    shifts: [
      { id: 's46', date: '21.11', project: 'ЖК Академик', client: 'РР-Групп', object: 'Объект А', role: 'Охранник', rate: 3600, ourHours: 12, clientHours: 12, approvalStatus: 'approved' },
    ],
  },
  {
    id: '17',
    name: 'Морозова Анна Петровна',
    workerId: 'W-10445',
    shiftPeriod: '20–22 ноя',
    shiftCount: 3,
    accrued: 11700,
    deductions: [
      { id: 'd11', type: 'bonus', amount: 800, comment: 'За переработку' },
    ],
    toPay: 12500,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'self-employed',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'МКБ',
      lastDigits: '2255',
    },
    shifts: [
      { id: 's47', date: '20.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Штукатур', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's48', date: '21.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Штукатур', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's49', date: '22.11', project: 'ЖК Звёздный', client: 'СтройМастер', object: 'Объект Б', role: 'Штукатур', rate: 3900, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '18',
    name: 'Дмитриев Сергей Николаевич',
    workerId: 'W-10789',
    shiftPeriod: '23–24 ноя',
    shiftCount: 2,
    accrued: 8800,
    deductions: [
      { id: 'd12', type: 'deduction', amount: 600, comment: 'Аванс' },
    ],
    toPay: 8200,
    selfEmployedStatus: 'active',
    approvalStatus: 'approved',
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Козлов А.В.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 903 555-22-11',
      owner: 'Козлов А.В.',
    },
    shifts: [
      { id: 's50', date: '23.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Столяр', rate: 4400, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's51', date: '24.11', project: 'ЖК Трио', client: 'Вершина', object: 'Объект В', role: 'Столяр', rate: 4400, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
  {
    id: '19',
    name: 'Андреева Виктория Владимировна',
    workerId: 'W-09321',
    shiftPeriod: '21–24 ноя',
    shiftCount: 4,
    accrued: 14400,
    deductions: [],
    toPay: 14400,
    selfEmployedStatus: 'pending-confirmation',
    approvalStatus: 'waiting',
    cardStatus: 'own-card',
    cardInfo: {
      bank: 'Открытие',
      lastDigits: '8899',
    },
    shifts: [
      { id: 's52', date: '21.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Маляр', rate: 3600, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's53', date: '22.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Маляр', rate: 3600, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's54', date: '23.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Маляр', rate: 3600, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
      { id: 's55', date: '24.11', project: 'ЖК Наследие', client: 'Эверест', object: 'Объект Г', role: 'Маляр', rate: 3600, ourHours: 10, clientHours: undefined, approvalStatus: 'waiting' },
    ],
  },
  {
    id: '20',
    name: 'Соколов Артём Евгеньевич',
    workerId: 'W-10134',
    shiftPeriod: '20–24 ноя',
    shiftCount: 4,
    accrued: 17200,
    deductions: [
      { id: 'd13', type: 'bonus', amount: 1500, comment: 'Высокое качество' },
      { id: 'd14', type: 'deduction', amount: 400, comment: 'Спецодежда' },
    ],
    toPay: 18300,
    selfEmployedStatus: 'active',
    approvalStatus: 'mismatch',
    hoursMismatch: 2,
    paymentMethod: 'trusted-smz',
    trustedSmzName: 'Петров М.С.',
    cardStatus: 'trusted-card',
    cardInfo: {
      sbpPhone: '+7 916 234-55-77',
      owner: 'Петров М.С.',
    },
    shifts: [
      { id: 's56', date: '20.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Плиточник', rate: 4300, ourHours: 10, clientHours: 11, approvalStatus: 'mismatch' },
      { id: 's57', date: '21.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Плиточник', rate: 4300, ourHours: 10, clientHours: 11, approvalStatus: 'mismatch' },
      { id: 's58', date: '23.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Плиточник', rate: 4300, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
      { id: 's59', date: '24.11', project: 'ЖК Мечта', client: 'Альянс', object: 'Объект Д', role: 'Плиточник', rate: 4300, ourHours: 10, clientHours: 10, approvalStatus: 'approved' },
    ],
  },
];