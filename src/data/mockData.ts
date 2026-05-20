import { User, Service, Announcement, PaymentSettings, ConnectedProvider, LogEntry, Order, DepositRequest, Ticket } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'superadmin',
    email: 'super@flexapanel.net',
    whatsapp: '+21695989977',
    role: 'superadmin',
    tier: 'vip',
    balance: 9999.00,
    spent: 12500.00,
    points: 50000,
    isBanned: false,
    passwordMock: 'super123456',
    twoFactorEnabled: false,
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@flexapanel.net',
    whatsapp: '+21655999888',
    role: 'admin',
    tier: 'plus',
    balance: 500.00,
    spent: 1200.00,
    points: 8000,
    isBanned: false,
    passwordMock: 'admin789',
    twoFactorEnabled: false,
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    username: 'ahmed_vip',
    email: 'ahmed@gmail.com',
    whatsapp: '+21622334455',
    role: 'user',
    tier: 'vip',
    balance: 180.50,
    spent: 650.00,
    points: 4500,
    isBanned: false,
    passwordMock: 'ahmed123',
    twoFactorEnabled: false,
    createdAt: '2025-02-01'
  },
  {
    id: '4',
    username: 'sami_tnd',
    email: 'sami@yahoo.fr',
    whatsapp: '', // Deliberately blank to trigger missing phone modal on login
    role: 'user',
    tier: 'normal',
    balance: 25.00,
    spent: 90.00,
    points: 350,
    isBanned: false,
    passwordMock: 'sami321',
    twoFactorEnabled: false,
    createdAt: '2025-02-10'
  }
];

export const INITIAL_SERVICES: Service[] = [
  // SMM Services
  {
    id: 's1',
    categoryId: 'c1',
    categoryName: 'متابعين انستغرام (ضمان 30 يوم)',
    name: 'متابعين انستغرام حقيقيين - جودة عالية جداً 🚀',
    ratePer1000: 1.00, // $1.00 per 1000 => 3.1 DT
    minQty: 100,
    maxQty: 50000,
    avgTime: '15 دقيقة',
    description: 'متابعين حقيقيين بجودة فائقة مع ضمان التعويض التلقائي لمدة 30 يوم في حال حدوث أي نقص.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isDigitalGood: false
  },
  {
    id: 's2',
    categoryId: 'c1',
    categoryName: 'متابعين انستغرام (ضمان 30 يوم)',
    name: 'متابعين انستغرام عرب متفاعلين 🔥',
    ratePer1000: 2.50, // $2.50 per 1000 => 7.75 DT
    minQty: 50,
    maxQty: 10000,
    avgTime: '30 دقيقة',
    description: 'حسابات عربية نشطة بأسماء وصور حقيقية، مثالي لزيادة مصداقية حسابك.',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: false
  },
  {
    id: 's3',
    categoryId: 'c2',
    categoryName: 'إعجابات انستغرام',
    name: 'إعجابات انستغرام فورية - وصول فوري ⚡',
    ratePer1000: 0.30, // $0.30 per 1000 => ~0.93 DT
    minQty: 50,
    maxQty: 100000,
    avgTime: 'دقيقتين',
    description: 'إعجابات فورية تبدأ فور وضع الطلب. جودة ممتازة بدون أي نقص.',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: false
  },
  {
    id: 's4',
    categoryId: 'c3',
    categoryName: 'متابعين تيك توك',
    name: 'متابعين تيك توك جودة فائقة (تفعيل البث المباشر) 🎥',
    ratePer1000: 1.80,
    minQty: 100,
    maxQty: 20000,
    avgTime: '1 ساعة',
    description: 'متابعين تيك توك لتخطي حاجز 1000 متابع وفتح البث المباشر والربح.',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: false
  },
  {
    id: 's5',
    categoryId: 'c4',
    categoryName: 'مشاهدات يوتيوب',
    name: 'مشاهدات يوتيوب حقيقية (تساعد في تحقيق الدخل) 📺',
    ratePer1000: 3.00,
    minQty: 500,
    maxQty: 100000,
    avgTime: '6 ساعات',
    description: 'مشاهدات عالية الاحتفاظ، آمنة 100% وتساعد في اقتراح الفيديو في خوارزميات اليوتيوب.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: false
  },

  // Digital Goods / Accounts
  {
    id: 'acc1',
    categoryId: 'store1',
    categoryName: 'حسابات نتفليكس (Netflix)',
    name: 'حساب نتفليكس بريميوم 4K (ملف شخصي خاص - شهر كامل) 🎬',
    ratePer1000: 3.50, // Represents price for 1 item ($3.50 => ~10.8 DT)
    minQty: 1,
    maxQty: 5,
    avgTime: 'تسليم فوري وتلقائي',
    description: 'حساب نتفليكس رسمي أعلى جودة 4K Ultra HD، مع ملف شخصي مقفل برمز سري وضمان كامل المدة.',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86fe27?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: true,
    accountsAvailable: [
      'netflix_user01@flexapanel.net:PassNet2026#',
      'netflix_user02@flexapanel.net:FlexaKing99@',
      'netflix_user03@flexapanel.net:Ultra4kStream!',
      'netflix_user04@flexapanel.net:CinemaTime77*'
    ]
  },
  {
    id: 'acc2',
    categoryId: 'store2',
    categoryName: 'حسابات سبوتيفاي (Spotify)',
    name: 'حساب سبوتيفاي بريميوم (3 أشهر بدون إعلانات) 🎧',
    ratePer1000: 2.00, // Price for 1 item ($2.00 => 6.2 DT)
    minQty: 1,
    maxQty: 10,
    avgTime: 'تسليم فوري وتلقائي',
    description: 'حساب سبوتيفاي بريميوم فردي، استمع للموسيقى بدون أي إعلانات مع إمكانية التحميل للاستماع بدون انترنت.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: true,
    accountsAvailable: [
      'spotify_music1@tunisia.fm:SpotVip2026',
      'spotify_music2@tunisia.fm:VibeCheck88#',
      'spotify_music3@tunisia.fm:RockPopSoul!'
    ]
  },
  {
    id: 'acc3',
    categoryId: 'store3',
    categoryName: 'اشتراكات IPTV',
    name: 'اشتراك IPTV فليكسا الذهبي (12 شهر - جميع القنوات والبطولات) ⚽',
    ratePer1000: 15.00, // Price for 1 item ($15 => ~46.5 DT)
    minQty: 1,
    maxQty: 5,
    avgTime: 'تسليم فوري وتلقائي',
    description: 'أكثر من 15,000 قناة بجودة FHD/4K، يضم مكتبة ضخمة من الأفلام والمسلسلات المحدثة يومياً.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&auto=format&fit=crop&q=60',
    isDigitalGood: true,
    accountsAvailable: [
      'http://flexa-iptv.net:8080/get.php?username=flexa101&password=xyz123&type=m3u',
      'http://flexa-iptv.net:8080/get.php?username=flexa102&password=abc987&type=m3u'
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    userId: '3',
    serviceName: 'متابعين انستغرام حقيقيين - جودة عالية جداً 🚀',
    linkOrTarget: 'https://instagram.com/ahmed_official',
    quantity: 2000,
    pricePaid: 2.00,
    status: 'completed',
    createdAt: '2025-02-18 14:30',
    avgTime: '15 دقيقة',
    refillAvailable: true
  },
  {
    id: 'ORD-9822',
    userId: '3',
    serviceName: 'حساب نتفليكس بريميوم 4K (ملف شخصي خاص - شهر كامل) 🎬',
    linkOrTarget: 'تسليم فوري (متجر الحسابات)',
    quantity: 1,
    pricePaid: 3.50,
    status: 'completed',
    createdAt: '2025-02-19 10:15',
    avgTime: 'تسليم فوري وتلقائي',
    deliveredAccount: 'netflix_user01@flexapanel.net:PassNet2026#',
    refillAvailable: false
  },
  {
    id: 'ORD-9823',
    userId: '4',
    serviceName: 'إعجابات انستغرام فورية - وصول فوري ⚡',
    linkOrTarget: 'https://instagram.com/p/C123456789',
    quantity: 500,
    pricePaid: 0.15,
    status: 'processing',
    createdAt: '2025-02-20 09:00',
    avgTime: 'دقيقتين',
    refillAvailable: true
  }
];

export const INITIAL_DEPOSITS: DepositRequest[] = [
  {
    id: 'DEP-101',
    userId: '4',
    username: 'sami_tnd',
    gateway: 'D17 Post',
    amount: 10.00,
    amountLocal: 31.00,
    currency: 'TND',
    senderPhoneOrRef: '+216 55 111 222',
    status: 'pending',
    createdAt: '2025-02-20 11:20'
  },
  {
    id: 'DEP-102',
    userId: '3',
    username: 'ahmed_vip',
    gateway: 'Crypto (USDT)',
    amount: 50.00,
    amountLocal: 50.00,
    currency: 'USD',
    senderPhoneOrRef: 'TX_9988aabbcc',
    status: 'approved',
    createdAt: '2025-02-19 16:45'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-501',
    userId: '4',
    username: 'sami_tnd',
    subject: 'تأكيد إيداع عبر تطبيق D17',
    category: 'deposit',
    status: 'open',
    createdAt: '2025-02-20 11:25',
    messages: [
      {
        sender: 'sami_tnd',
        role: 'user',
        content: 'قمت بتحويل مبلغ 31 دينار تونسي عبر D17 من الرقم 55111222. أرجو إضافة الرصيد لحسابي.',
        timestamp: '2025-02-20 11:25'
      }
    ]
  },
  {
    id: 'TCK-502',
    userId: '3',
    username: 'ahmed_vip',
    subject: 'طلب تعويض نقص متابعين الطلب ORD-9821',
    category: 'refill',
    status: 'answered',
    createdAt: '2025-02-18 20:00',
    messages: [
      {
        sender: 'ahmed_vip',
        role: 'user',
        content: 'مرحباً، لاحظت نقص حوالي 50 متابع في حسابي، الرجاء تفعيل التعويض التلقائي.',
        timestamp: '2025-02-18 20:00'
      },
      {
        sender: 'admin',
        role: 'admin',
        content: 'أهلاً بك أستاذ أحمد، تم إرسال أمر التعويض للسيرفر بنجاح وسيتم اكتمال العدد خلال دقائق.',
        timestamp: '2025-02-18 20:15'
      }
    ]
  }
];

export const INITIAL_SETTINGS: PaymentSettings = {
  d17Phone: '28 444 555',
  posteAccount: '17001 0000 4567 89',
  cryptoWallet: 'TXab89sJ9kL1mN3oP4qR5sT6uV7wX8yZ9 (TRC20)',
  paypalEmail: 'payments@flexashop.shop',
  logoUrl: '/Flogo.svg',
  wordmarkUrl: '/Flogo.svg',
  database: {
    provider: 'supabase',
    supabaseUrl: 'https://iinakypsmwooxnjmmvfz.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbmFreXBzbXdvb3huam1tdmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjUyNDUsImV4cCI6MjA5NDgwMTI0NX0.bh7IZBwu-QUnoL6yMb9OPFNRpxjlNsNpSFKu9J4noUg',
    tableName: 'flexapanel_data',
    isEnabled: true,
    autoSyncEnabled: true,
    autoSyncIntervalMs: 1000,
    autoPullEnabled: true,
    autoPullIntervalMs: 1000
  }
};

export const INITIAL_PROVIDERS: ConnectedProvider[] = [
  {
    id: 'prov_1',
    name: 'SMM Party (Main)',
    apiUrl: 'https://smmparty.com/api/v2',
    apiKey: 'smm_party_live_key_998877665544332211',
    balance: '100.84',
    currency: 'USD',
    isActive: true
  },
  {
    id: 'prov_2',
    name: 'Global SMM Server',
    apiUrl: 'https://globalsmm.net/api/v2',
    apiKey: 'glob_key_xyz123abc987',
    balance: '45.20',
    currency: 'USD',
    isActive: true
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'LOG-1',
    timestamp: '2025-02-20 11:25',
    userId: '4',
    username: 'sami_tnd',
    action: 'طلب إيداع جديد عبر D17 بمبلغ 10$',
    ip: '197.2.14.88',
    severity: 'info'
  },
  {
    id: 'LOG-2',
    timestamp: '2025-02-19 16:45',
    userId: '1',
    username: 'superadmin',
    action: 'موافقة على إيداع وإضافة رصيد 50$ للمستخدم ahmed_vip',
    ip: '197.10.45.12',
    severity: 'success'
  },
  {
    id: 'LOG-3',
    timestamp: '2025-02-18 12:00',
    userId: '2',
    username: 'admin',
    action: 'تعديل سعر خدمة متابعين انستغرام',
    ip: '102.150.32.1',
    severity: 'warning'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: '🎉 إطلاق الإصدار الجديد من Flexapanel (v3.5)',
    content: 'تم تحديث جميع سيرفرات المتابعين وزيادة سرعة التسليم التلقائي. استمتعوا بخصومات تصل إلى 20% للأعضاء VIP!',
    date: '2025-02-20',
    type: 'update'
  },
  {
    id: 'ann2',
    title: '🎁 هدية يومية للأعضاء النشطين',
    content: 'يمكنك الآن الحصول على 100 نقطة مجانية يومياً عند تسجيل الدخول وتحويلها إلى رصيد حقيقي!',
    date: '2025-02-19',
    type: 'gift'
  },
  {
    id: 'ann3',
    title: '💳 دعم كامل للدفع عبر D17 و العملات الرقمية',
    content: 'أضفنا طرق دفع مخصصة وتلقائية لتسهيل شحن الرصيد لعملائنا في تونس ومختلف دول العالم.',
    date: '2025-02-15',
    type: 'info'
  }
];
