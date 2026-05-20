import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header & Navigation
    'app.title': 'Flexapanel | فليكسا بانل',
    'nav.welcome': 'مرحباً',
    'nav.currentBalance': 'الرصيد الحالي',
    'nav.spentBalance': 'الرصيد المنفق',
    'nav.points': 'النقاط',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'حساب جديد',

    // Sidebar titles
    'side.mainLinks': 'روابط رئيسية',
    'side.newOrder': 'طلب جديد',
    'side.massOrder': 'طلبات جماعية',
    'side.orderHistory': 'سجل الطلبات',
    'side.services': 'الخدمات',
    'side.memberships': 'الاشتراكات والعضوية',
    'side.refill': 'التعويض',
    
    'side.finance': 'الشحن والسحب',
    'side.addBalance': 'إضافة رصيد',
    'side.affiliate': 'التسويق بالعمولة',
    'side.digitalStore': 'متجر الحسابات (فليكسا)',

    'side.help': 'المساعدة',
    'side.supportTickets': 'مساعدة فنية / التذاكر',

    'side.clientInfo': 'معلومات العميل',
    'side.gifts': 'هدايا ومكافآت',
    'side.updates': 'التحديثات',
    'side.dashboard': 'لوحة المعلومات',
    'side.api': 'ربط API',
    'side.aiAutomation': 'أتمتة الذكاء الاصطناعي',

    'side.admin': 'لوحة الإدارة',
    'side.adminPanel': 'إدارة الموقع والأعضاء',

    // Order form
    'order.category': 'الفئة',
    'order.service': 'الخدمة',
    'order.link': 'الرابط / الحساب المستهدف',
    'order.quantity': 'الكمية المطلوبة',
    'order.minMax': 'الحد الأدنى والأقصى',
    'order.price': 'السعر الإجمالي',
    'order.avgTime': 'متوسط وقت التنفيذ',
    'order.submit': 'تأكيد وإرسال الطلب 🚀',
    'order.calcNote': 'يتم حساب السعر تلقائياً بناءً على الكمية المدخلة',
    
    // Store
    'store.title': 'متجر الحسابات الرقمية الفورية',
    'store.subtitle': 'تسليم تلقائي وفوري لحسابات Netflix, Spotify و IPTV بعد الشراء',
    'store.buy': 'شراء واستلام فوري ⚡',
    'store.stock': 'الكمية المتاحة',
    
    // Deposit
    'deposit.title': 'إضافة رصيد لحسابك',
    'deposit.method': 'طريقة الدفع',
    'deposit.amount': 'المبلغ المراد شحنه (بالدولار)',
    'deposit.amountLocal': 'المبلغ المطلوب إرساله',
    'deposit.phoneRef': 'رقم هاتف المرسل أو معرف المعاملة (Ref)',
    'deposit.instructions': 'تعليمات التحويل',
    'deposit.submit': 'تأكيد وإرسال إشعار الدفع 📤',
    'deposit.whatsappConfirm': 'تأكيد عبر الواتساب المباشر',
    'deposit.ticketConfirm': 'فتح تذكرة شحن',

    // Tier
    'tier.normal': 'عضوية عادية',
    'tier.plus': 'عضوية بلاس (Plus)',
    'tier.vip': 'عضوية ذهبية VIP',
    'tier.pointsText': 'تكسب 5 نقاط على كل 1$ تنفقه بالموقع',

    // General
    'general.search': 'بحث...',
    'general.status': 'الحالة',
    'general.date': 'التاريخ',
    'general.actions': 'الإجراءات',
    'general.success': 'نجاح!',
    'general.error': 'خطأ!',
    'general.copied': 'تم النسخ بنجاح',
    'general.close': 'إغلاق',
    'general.save': 'حفظ التعديلات'
  },
  fr: {
    'app.title': 'Flexapanel | SMM & Comptes',
    'nav.welcome': 'Bienvenue',
    'nav.currentBalance': 'Solde Actuel',
    'nav.spentBalance': 'Solde Dépensé',
    'nav.points': 'Points',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',

    'side.mainLinks': 'Liens Principaux',
    'side.newOrder': 'Nouvelle Commande',
    'side.massOrder': 'Commandes de Masse',
    'side.orderHistory': 'Historique des Commandes',
    'side.services': 'Services',
    'side.memberships': 'Abonnements & VIP',
    'side.refill': 'Garantie & Recharge',
    
    'side.finance': 'Finances',
    'side.addBalance': 'Ajouter du Solde',
    'side.affiliate': 'Affiliation',
    'side.digitalStore': 'Boutique de Comptes',

    'side.help': 'Assistance',
    'side.supportTickets': 'Tickets de Support',

    'side.clientInfo': 'Infos Client',
    'side.gifts': 'Cadeaux & Récompenses',
    'side.updates': 'Mises à jour',
    'side.dashboard': 'Tableau de bord',
    'side.api': 'API',
    'side.aiAutomation': 'Automatisation IA',

    'side.admin': 'Administration',
    'side.adminPanel': 'Panneau Admin',

    'order.category': 'Catégorie',
    'order.service': 'Service',
    'order.link': 'Lien / Cible',
    'order.quantity': 'Quantité',
    'order.minMax': 'Min / Max',
    'order.price': 'Prix Total',
    'order.avgTime': 'Temps Moyen',
    'order.submit': 'Soumettre la Commande 🚀',
    'order.calcNote': 'Le prix est calculé automatiquement selon la quantité',

    'store.title': 'Boutique de Comptes Numériques',
    'store.subtitle': 'Livraison instantanée de comptes Netflix, Spotify, IPTV',
    'store.buy': 'Acheter Instantanément ⚡',
    'store.stock': 'Stock Disponible',

    'deposit.title': 'Ajouter du Solde',
    'deposit.method': 'Méthode de Paiement',
    'deposit.amount': 'Montant (USD)',
    'deposit.amountLocal': 'Montant à Envoyer',
    'deposit.phoneRef': 'Numéro de téléphone ou Réf transaction',
    'deposit.instructions': 'Instructions de Virement',
    'deposit.submit': 'Envoyer la Preuve de Paiement 📤',
    'deposit.whatsappConfirm': 'Confirmer via WhatsApp',
    'deposit.ticketConfirm': 'Ouvrir un Ticket',

    'tier.normal': 'Membre Standard',
    'tier.plus': 'Membre Plus',
    'tier.vip': 'Membre VIP Or',
    'tier.pointsText': 'Gagnez 5 points pour chaque 1$ dépensé',

    'general.search': 'Rechercher...',
    'general.status': 'Statut',
    'general.date': 'Date',
    'general.actions': 'Actions',
    'general.success': 'Succès!',
    'general.error': 'Erreur!',
    'general.copied': 'Copié avec succès',
    'general.close': 'Fermer',
    'general.save': 'Enregistrer'
  },
  en: {
    'app.title': 'Flexapanel | SMM & Store',
    'nav.welcome': 'Welcome',
    'nav.currentBalance': 'Current Balance',
    'nav.spentBalance': 'Spent Balance',
    'nav.points': 'Points',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',

    'side.mainLinks': 'Main Links',
    'side.newOrder': 'New Order',
    'side.massOrder': 'Mass Order',
    'side.orderHistory': 'Order History',
    'side.services': 'Services',
    'side.memberships': 'Memberships & VIP',
    'side.refill': 'Refill Guarantee',
    
    'side.finance': 'Finance',
    'side.addBalance': 'Add Balance',
    'side.affiliate': 'Affiliate Program',
    'side.digitalStore': 'Digital Store (Flexapanel)',

    'side.help': 'Support',
    'side.supportTickets': 'Support Tickets',

    'side.clientInfo': 'Client Info',
    'side.gifts': 'Gifts & Rewards',
    'side.updates': 'Platform Updates',
    'side.dashboard': 'Dashboard',
    'side.api': 'API Connection',
    'side.aiAutomation': 'AI Automation Bot',

    'side.admin': 'Administration',
    'side.adminPanel': 'Admin Management',

    'order.category': 'Category',
    'order.service': 'Service',
    'order.link': 'Target Link',
    'order.quantity': 'Quantity',
    'order.minMax': 'Min / Max Qty',
    'order.price': 'Total Price',
    'order.avgTime': 'Average Time',
    'order.submit': 'Submit Order 🚀',
    'order.calcNote': 'Price is calculated automatically based on quantity',

    'store.title': 'Digital Accounts Instant Store',
    'store.subtitle': 'Instant auto-delivery for Netflix, Spotify, IPTV accounts',
    'store.buy': 'Buy Instantly ⚡',
    'store.stock': 'Available Stock',

    'deposit.title': 'Add Account Balance',
    'deposit.method': 'Payment Gateway',
    'deposit.amount': 'Amount (USD)',
    'deposit.amountLocal': 'Amount to Send',
    'deposit.phoneRef': 'Sender Phone No. or Transaction Ref',
    'deposit.instructions': 'Transfer Instructions',
    'deposit.submit': 'Submit Deposit Proof 📤',
    'deposit.whatsappConfirm': 'Confirm via WhatsApp',
    'deposit.ticketConfirm': 'Open Deposit Ticket',

    'tier.normal': 'Standard Member',
    'tier.plus': 'Plus Member',
    'tier.vip': 'Gold VIP Member',
    'tier.pointsText': 'Earn 5 points for every $1 spent',

    'general.search': 'Search...',
    'general.status': 'Status',
    'general.date': 'Date',
    'general.actions': 'Actions',
    'general.success': 'Success!',
    'general.error': 'Error!',
    'general.copied': 'Copied successfully',
    'general.close': 'Close',
    'general.save': 'Save Changes'
  }
};
