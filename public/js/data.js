/**
 * MC Oran — Club Data Store with LocalStorage Persistence
 */
const STORAGE_KEY = 'mco_club_data_v1';

const DEFAULT_DATA = {
  news: [
    {
      id: 1,
      title: 'مولودية وهران يحسم الديربي في ملعب ميلود هدفي بثلاثية نظيفة',
      summary: 'أداء بطولي للحمراوة أمام جماهيرهم الغفيرة في ليلة كروية استثنائية بوهران.',
      content: 'حقق نادي مولودية وهران فوزاً مستحقاً بثلاثة أهداف دون رد في أجواء جماهيرية مهيبة بملعب ميلود هدفي، ليؤكد الفريق جاهزيته للمنافسة على اللقب.',
      date: '2026-11-08',
      author: 'المكتب الإعلامي',
      category: 'الفريق الأول',
      views: 4820,
      image: '/assets/hero-stadium.jpg'
    },
    {
      id: 2,
      title: 'تقديم القميص الرسمي الجديد لموسم 2026/2027 باللونين الأحمر والأبيض',
      summary: 'تصميم عصري مستوحى من تاريخ النادي العريق منذ التأسيس سنة 1946.',
      content: 'كشفت إدارة مولودية وهران عن القميص الرسمي الجديد الذي يجمع بين الهوية التاريخية للنادي وأحدث تقنيات الأقمصة الرياضية.',
      date: '2026-11-04',
      author: 'إدارة التسويق',
      category: 'المتجر',
      views: 3190,
      image: '/assets/hero-stadium.jpg'
    },
    {
      id: 3,
      title: 'انطلاق بيع تذاكر المواجهة القارية القادمة إلكترونياً',
      summary: 'يمكن لأنصار الحمراوة حجز مقاعدهم الآن عبر البوابة الرقمية الرسمية.',
      content: 'أعلنت إدارة الملعب عن فتح باب الحجز الإلكتروني لتذاكر المباراة القادمة مع توفير خريطة تفاعلية لاختيار المقاعد ورمز QR للدخول السريع.',
      date: '2026-11-01',
      author: 'لجنة التنظيم',
      category: 'التذاكر',
      views: 2640,
      image: '/assets/hero-stadium.jpg'
    }
  ],
  players: [
    {
      id: 1,
      name: 'يوسف بلايلي',
      number: 10,
      position: 'مهاجم',
      age: 28,
      nationality: 'الجزائر',
      height: '179 سم',
      weight: '75 كغ',
      foot: 'اليمنى',
      appearances: 26,
      goals: 14,
      assists: 11,
      cards: 3,
      minutes: 2240,
      bio: 'قائد خط الهجوم وصانع ألعاب الفريق، يتميز بالمهارة الفردية والرؤية الثاقبة.'
    },
    {
      id: 2,
      name: 'أمين بن عياد',
      number: 9,
      position: 'مهاجم',
      age: 25,
      nationality: 'الجزائر',
      height: '184 سم',
      weight: '78 كغ',
      foot: 'اليمنى',
      appearances: 25,
      goals: 16,
      assists: 4,
      cards: 2,
      minutes: 2110,
      bio: 'هداف الفريق الأول وقناص منطقة الجزاء بقدرات تهديفية عالية.'
    },
    {
      id: 3,
      name: 'حسام الدين مرازيق',
      number: 6,
      position: 'وسط',
      age: 24,
      nationality: 'الجزائر',
      height: '181 سم',
      weight: '74 كغ',
      foot: 'اليمنى',
      appearances: 26,
      goals: 3,
      assists: 8,
      cards: 5,
      minutes: 2310,
      bio: 'محور ارتكاز عصري يربط بين الدفاع والهجوم بدقة تمرير تتجاوز 88%.'
    },
    {
      id: 4,
      name: 'زكرياء بلعيد',
      number: 4,
      position: 'دفاع',
      age: 27,
      nationality: 'الجزائر',
      height: '188 سم',
      weight: '82 كغ',
      foot: 'اليمنى',
      appearances: 24,
      goals: 2,
      assists: 1,
      cards: 4,
      minutes: 2160,
      bio: 'صخرة الدفاع وقائد الخط الخلفي في الكرات الهوائية والمواجهات الثنائية.'
    },
    {
      id: 5,
      name: 'شمس الدين رحماني',
      number: 1,
      position: 'حارس',
      age: 30,
      nationality: 'الجزائر',
      height: '189 سم',
      weight: '84 كغ',
      foot: 'اليمنى',
      appearances: 26,
      goals: 0,
      assists: 0,
      cards: 1,
      minutes: 2340,
      bio: 'حارس مرمى دولي صاحب ردود فعل سريعة و12 مباراة بشباك نظيفة.'
    }
  ],
  staff: [
    { name: 'إيريك شيل', role: 'المدرب الرئيسي', nationality: 'مالي / فرنسا', experience: '12 سنة' },
    { name: 'كريم بوعلام', role: 'المدرب المساعد', nationality: 'الجزائر', experience: '9 سنوات' },
    { name: 'نصر الدين بن جبار', role: 'مدرب الحراس', nationality: 'الجزائر', experience: '15 سنة' },
    { name: 'د. سفيان ماحي', role: 'رئيس الطاقم الطبي', nationality: 'الجزائر', experience: '11 سنة' }
  ],
  matches: [
    {
      id: 1,
      type: 'upcoming',
      home: 'مولودية وهران',
      away: 'شباب بلوزداد',
      date: '2026-11-15',
      time: '19:00',
      stadium: 'ملعب ميلود هدفي - وهران',
      referee: 'مصطفى غربال',
      score: 'VS',
      competition: 'الرابطة المحترفة الأولى',
      lineup: ['رحماني', 'بلعيد', 'بن عمارة', 'مرازيق', 'بلايلي', 'بن عياد'],
      stats: { possession: '58% - 42%', shots: '15 - 8', corners: '7 - 3' }
    },
    {
      id: 2,
      type: 'upcoming',
      home: 'اتحاد العاصمة',
      away: 'مولودية وهران',
      date: '2026-11-22',
      time: '18:00',
      stadium: 'ملعب 5 جويلية - الجزائر',
      referee: 'يوسف قاموح',
      score: 'VS',
      competition: 'الرابطة المحترفة الأولى',
      lineup: ['رحماني', 'بلعيد', 'مرازيق', 'بلايلي', 'بن عياد'],
      stats: { possession: '-', shots: '-', corners: '-' }
    },
    {
      id: 3,
      type: 'result',
      home: 'مولودية وهران',
      away: 'وفاق سطيف',
      date: '2026-11-08',
      time: '19:00',
      stadium: 'ملعب ميلود هدفي - وهران',
      referee: 'لحلو بن براهم',
      score: '3 - 0',
      competition: 'الرابطة المحترفة الأولى',
      lineup: ['رحماني', 'بلعيد', 'مرازيق', 'بلايلي', 'بن عياد'],
      stats: { possession: '61% - 39%', shots: '18 - 6', corners: '9 - 2' }
    },
    {
      id: 4,
      type: 'result',
      home: 'شبيبة القبائل',
      away: 'مولودية وهران',
      date: '2026-11-01',
      time: '17:30',
      stadium: 'ملعب حسين آيت أحمد',
      referee: 'نبيل بوخالفة',
      score: '1 - 2',
      competition: 'الرابطة المحترفة الأولى',
      lineup: ['رحماني', 'بلعيد', 'مرازيق', 'بلايلي', 'بن عياد'],
      stats: { possession: '52% - 48%', shots: '11 - 13', corners: '5 - 6' }
    }
  ],
  standings: [
    { pos: 1, team: 'مولودية وهران', p: 26, w: 15, d: 7, l: 4, gd: '+21', pts: 52, isMco: true },
    { pos: 2, team: 'مولودية الجزائر', p: 26, w: 14, d: 8, l: 4, gd: '+18', pts: 50 },
    { pos: 3, team: 'شباب بلوزداد', p: 26, w: 14, d: 6, l: 6, gd: '+15', pts: 48 },
    { pos: 4, team: 'اتحاد العاصمة', p: 26, w: 12, d: 7, l: 7, gd: '+10', pts: 43 },
    { pos: 5, team: 'وفاق سطيف', p: 26, w: 11, d: 6, l: 9, gd: '+4', pts: 39 }
  ],
  history: [
    { year: '1946', title: 'تأسيس النادي', desc: 'تأسيس مولودية وهران في 14 ماي 1946 بحي الحمري العريق بمدينة وهران.' },
    { year: '1971', title: 'أول لقب وطني', desc: 'التتويج بأول بطولة وطنية جزائرية وبداية العصر الذهبي للحمراوة.' },
    { year: '1988', title: 'التتويج بالبطولة والسيطرة المحلية', desc: 'جيل ذهبي بقيادة لخضر بلومي يحصد الألقاب ويمتع الجماهير.' },
    { year: '1997', title: 'بطولة الأندية العربية', desc: 'تتويج عربي وإقليمي تاريخي رفع راية وهران عالياً.' },
    { year: '2026', title: 'عصر ملعب ميلود هدفي', desc: 'انتقال النادي إلى التحفة المعمارية ملعب ميلود هدفي ومنافسة قوية على كل الجبهات.' }
  ],
  legends: [
    { name: 'لخضر بلومي', era: '1979 - 1999', honours: 'الكرة الذهبية الأفريقية 1981 · بطل الجزائر', bio: 'أسطورة كرة القدم الجزائرية وأحد أعظم صناع اللعب في تاريخ القارة السمراء.' },
    { name: 'تاج بن سحاولة', era: '1977 - 1983', honours: 'بطل الجزائر · نجم مونديال 1982', bio: 'مهاجم فذ ساهم في كتابة أمجاد المولودية والمنتخب الوطني الجزائري.' },
    { name: 'عبد القادر فرحاوي', era: '1984 - 1990', honours: 'بطل الجزائر · كأس الجمهورية', bio: 'لاعب خط وسط أنيق ارتبط اسمه بأجمل فترات مولودية وهران.' }
  ],
  products: [
    { id: 1, name: 'القميص الرسمي 2026/2027', price: 6500, desc: 'قميص المباراة الرسمي باللون الأحمر والأبيض مع شعار النادي.', image: '/assets/hero-stadium.jpg' },
    { id: 2, name: 'وشاح الحمراوة الفاخر', price: 1800, desc: 'وشاح شتوي مطرز بشعار مولودية وهران وسنة التأسيس 1946.', image: '/assets/hero-stadium.jpg' },
    { id: 3, name: 'قبعة النادي الرسمية', price: 1500, desc: 'قبعة رياضية سوداء بشعار MCO المطرز باللون الذهبي.', image: '/assets/hero-stadium.jpg' },
    { id: 4, name: 'كرة قدم مولودية وهران', price: 4200, desc: 'كرة احترافية معتمدة بتصميم خاص بألوان النادي.', image: '/assets/hero-stadium.jpg' },
    { id: 5, name: 'كوب سيراميك MCO 1946', price: 950, desc: 'كوب أنيق لمحبي الحمراوة باللونين الأحمر والأسود.', image: '/assets/hero-stadium.jpg' }
  ],
  gallery: [
    { id: 1, title: 'تيفو جماهير الحمراوة في ملعب ميلود هدفي', category: 'الجماهير', image: '/assets/hero-stadium.jpg' },
    { id: 2, title: 'احتفالية الفوز بالديربي الوهراني', category: 'المباريات', image: '/assets/hero-stadium.jpg' },
    { id: 3, title: 'تدريبات الفريق الأول قبل المواجهة القارية', category: 'التدريبات', image: '/assets/hero-stadium.jpg' }
  ],
  videos: [
    { id: 1, title: 'ملخص أهداف مولودية وهران 3-0 وفاق سطيف', duration: '04:32', views: '125K' },
    { id: 2, title: 'كواليس غرفة الملابس بعد الفوز الكبير', duration: '06:15', views: '89K' },
    { id: 3, title: 'أهازيج وتيفو مدرجات ميلود هدفي', duration: '03:48', views: '210K' }
  ],
  sponsors: ['Sonatrach', 'Hyproc', 'Mobilis', 'Air Algérie', 'Macron'],
  faq: [
    { q: 'كيف يمكنني شراء تذاكر المباريات؟', a: 'من خلال صفحة التذاكر، اختر مقعدك من خريطة الملعب واحصل على رمز QR فوري.' },
    { q: 'هل التوصيل متاح لجميع ولايات الجزائر؟', a: 'نعم، يوفر المتجر الرسمي التوصيل السريع إلى 58 ولاية.' },
    { q: 'كيف أثبت التطبيق على هاتفي؟', a: 'اضغط على زر "تثبيت التطبيق" في أعلى الموقع أو من قائمة المتصفح.' }
  ]
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      return structuredClone(DEFAULT_DATA);
    }
    return JSON.parse(raw);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
