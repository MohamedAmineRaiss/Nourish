import { Locale } from '@/types';

const en: Record<string, string> = {
  'app.name': 'Nourish',
  'app.tagline': 'Plan meals, meet your nutrition goals',
  'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',

  'nav.home': 'Home', 'nav.plan': 'Plan', 'nav.track': 'Track',
  'nav.settings': 'Settings', 'nav.stock': 'Stock', 'nav.suggest': 'Suggest',

  'meal.breakfast': 'Breakfast', 'meal.lunch': 'Lunch', 'meal.dinner': 'Dinner', 'meal.snack': 'Snack',

  // Common
  'common.save': 'Save', 'common.cancel': 'Cancel', 'common.close': 'Close', 'common.edit': 'Edit', 'common.delete': 'Delete',

  // Dietary
  'diet.vegetarian': 'Vegetarian',
  'diet.vegan': 'Vegan',
  'diet.glutenFree': 'Gluten-free',
  'diet.dairyFree': 'Dairy-free',

  // Onboarding
  'onboarding.skip': 'Skip',
  'onboarding.next': 'Next',
  'onboarding.start': 'Get Started',
  'onboarding.welcome.title': 'Welcome to Nourish',
  'onboarding.welcome.desc': 'Your personal nutrition planner. Track what you eat, get smart portion suggestions, and close your daily nutrient rings — one meal at a time.',
  'onboarding.plan.title': 'Plan Your Meals',
  'onboarding.plan.desc': 'Search for ingredients, pick breakfast, lunch, dinner or snack, and get smart quantity suggestions tailored to your remaining daily needs.',
  'onboarding.stock.title': 'Track Your Stock',
  'onboarding.stock.desc': 'Add your groceries to the pantry. When you log a meal, stock auto-deducts. Get alerts when items run low so you never run out.',
  'onboarding.suggest.title': 'AI Meal Ideas',
  'onboarding.suggest.desc': 'Stuck on what to cook? Get meal suggestions based on your available stock or any ingredients you choose — powered by AI, in your language.',

  // Errors
  'error.network': 'Network error. Check your connection and try again.',
  'error.timeout': 'Request timed out. Please try again.',
  'error.loadFailed': 'Failed to load. Tap to retry.',
  'error.retry': 'Try Again',

  // Dashboard
  'dashboard.keyNutrients': 'Key Nutrients Today',
  'dashboard.stillNeeded': 'Still Needed Today',
  'dashboard.stillNeededDesc': 'These nutrients are below 70% of your daily target',
  'dashboard.todaysMeals': "Today's Meals",
  'dashboard.planNext': 'Plan Next Meal',
  'dashboard.noMeals': 'No meals logged yet. Plan your first meal!',
  'dashboard.weeklyReport': 'Weekly Report',

  // Plan
  'plan.title': 'Plan a Meal',
  'plan.subtitle': 'Search and add the ingredients you plan to cook',
  'plan.searchPlaceholder': 'Search ingredients (e.g. beef, spinach, eggs...)',
  'plan.selected': 'Selected Ingredients',
  'plan.generate': 'Generate Quantity Suggestions',
  'plan.searching': 'Searching...',
  'plan.noResults': 'No ingredients found. Try a different search or add a custom ingredient.',
  'plan.mealType': 'What meal is this?',
  'plan.filter': 'Filter by diet',
  'plan.clearFilters': 'Clear filters',
  'plan.addCustom': 'Add custom ingredient',

  // Suggestions
  'suggestions.title': 'Suggested Combinations',
  'suggestions.subtitle': 'Choose the option that feels right for you',
  'suggestions.option': 'Option', 'suggestions.score': 'Score',
  'suggestions.choose': 'Choose This Option', 'suggestions.back': 'Back to Ingredients',
  'suggestions.strongIn': 'High in',
  'suggestions.helpsWith': 'Helps with',
  'suggestions.balances': 'Balances',

  // Planned
  'planned.title': 'Your Planned Meal',
  'planned.ingredients': 'Ingredients',
  'planned.editHint': 'Tap any amount to adjust it',
  'planned.provides': 'This Meal Provides',
  'planned.addToDay': 'Add This Meal to Today',
  'planned.backSuggestions': 'Back to Suggestions',
  'planned.totalWeight': 'Total weight', 'planned.reset': 'Reset to suggested',

  // Tracker
  'tracker.title': 'Daily Tracker',
  'tracker.today': 'Today', 'tracker.week': 'Last 7 days', 'tracker.month': 'Last 30 days',
  'tracker.priority': 'Priority Nutrients',
  'tracker.all': 'All Nutrients',
  'tracker.trends': 'Trends',
  'tracker.mealsLogged': 'Meals Logged',
  'tracker.resetDay': 'Reset Day',
  'tracker.noMeals': 'No meals logged today.',

  // Trends
  'trends.avg': 'avg',
  'trends.target': 'target',
  'trends.overDays': 'over {n} days',
  'trends.empty': 'No data to show yet',

  // Edit meal
  'edit.title': 'Edit Meal',
  'edit.confirmDelete': 'Are you sure you want to delete this meal?',
  'edit.deleteConfirm': 'Yes, delete',

  // Custom food
  'custom.title': 'Add Custom Ingredient',
  'custom.subtitle': 'Create your own ingredient with nutrient values per 100g',
  'custom.names': 'Name (in your languages)',
  'custom.labelEnPh': 'e.g. Tajine seasoning',
  'custom.labelFrPh': 'ex: Ras el hanout',
  'custom.labelArPh': 'مثال: رأس الحانوت',
  'custom.category': 'Category',
  'custom.dietary': 'Dietary tags',
  'custom.nutrientsPer100g': 'Nutrients (per 100g)',
  'custom.nutrientsHint': 'Fill in what you know — leave 0 for unknown values',
  'custom.showAdvanced': 'Show advanced nutrients',
  'custom.hideAdvanced': 'Hide advanced nutrients',
  'custom.needLabel': 'Please enter a name in at least one language',

  // Stock
  'stock.title': 'Grocery Stock', 'stock.subtitle': 'Track your kitchen inventory',
  'stock.searchAdd': 'Search to add ingredients...',
  'stock.current': 'Current Stock',
  'stock.empty': 'No items in stock. Search above to add ingredients.',
  'stock.add': 'Add', 'stock.left': 'left', 'stock.lowAlert': 'Low Stock Warning',

  // Suggest
  'suggest.title': 'Meal Ideas', 'suggest.subtitle': 'Get AI-powered meal suggestions',
  'suggest.fromStock': 'From my stock', 'suggest.fromCustom': 'Custom ingredients',
  'suggest.generate': 'Get Suggestions', 'suggest.generating': 'Thinking...',
  'suggest.noResults': 'No suggestions available. Try different ingredients.',
  'suggest.ingredientsPlaceholder': 'Enter ingredients, one per line...',
  'suggest.respectingDiet': 'Respecting your diet',

  // Weekly
  'weekly.title': 'Weekly Report', 'weekly.loading': 'Analyzing your week...',
  'weekly.noData': 'No meals tracked this week yet.',
  'weekly.daysTracked': 'days tracked', 'weekly.strengths': 'Strengths',
  'weekly.gaps': 'Areas to Improve', 'weekly.suggestions': 'Suggestions',
  'weekly.dailyAvg': 'Daily Averages',

  // Settings
  'settings.title': 'Settings', 'settings.profile': 'Profile', 'settings.yourName': 'Your Name',
  'settings.language': 'Language', 'settings.targets': 'Daily Nutrient Targets',
  'settings.targetsNote': 'Consult your healthcare provider for personalized targets',
  'settings.save': 'Save Settings',
  'settings.healthNote': 'This app supports meal planning and nutrient tracking only. It does not diagnose or treat any condition.',
  'settings.resetOnboarding': 'Show Tutorial Again',
  'settings.dietary': 'Dietary Preferences',
  'settings.dietaryHint': 'Applied to search and AI suggestions',

  // Nutrients
  'nutrient.iron': 'Iron', 'nutrient.protein': 'Protein', 'nutrient.iodine': 'Iodine',
  'nutrient.selenium': 'Selenium', 'nutrient.vitaminB12': 'Vitamin B12', 'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamin C', 'nutrient.zinc': 'Zinc', 'nutrient.fiber': 'Fiber',
  'nutrient.calories': 'Calories', 'nutrient.carbs': 'Carbs', 'nutrient.fat': 'Fat',

  // Toasts
  'toast.mealAdded': 'Meal added! ✅', 'toast.dayReset': 'Day reset! 🌅',
  'toast.settingsSaved': 'Settings saved! 🎯', 'toast.saving': 'Saving...',
  'toast.error': 'Something went wrong. Please try again.',
  'toast.stockLow': 'is running low! Time to restock.',
  'toast.mealUpdated': 'Meal updated ✅',
  'toast.mealDeleted': 'Meal deleted',
  'toast.customAdded': 'Custom ingredient created ✨',
};

const ar: Record<string, string> = {
  'app.name': 'تغذية',
  'app.tagline': 'خططي لوجباتك وحققي أهدافك الغذائية',
  'greeting.morning': 'صباح الخير', 'greeting.afternoon': 'مساء الخير', 'greeting.evening': 'مساء الخير',

  'nav.home': 'الرئيسية', 'nav.plan': 'تخطيط', 'nav.track': 'متابعة',
  'nav.settings': 'إعدادات', 'nav.stock': 'المخزون', 'nav.suggest': 'اقتراحات',

  'meal.breakfast': 'فطور', 'meal.lunch': 'غداء', 'meal.dinner': 'عشاء', 'meal.snack': 'وجبة خفيفة',

  'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.close': 'إغلاق', 'common.edit': 'تعديل', 'common.delete': 'حذف',

  'diet.vegetarian': 'نباتي',
  'diet.vegan': 'نباتي صرف',
  'diet.glutenFree': 'بدون غلوتين',
  'diet.dairyFree': 'بدون ألبان',

  'onboarding.skip': 'تخطي',
  'onboarding.next': 'التالي',
  'onboarding.start': 'ابدأي الآن',
  'onboarding.welcome.title': 'مرحباً بك في تغذية',
  'onboarding.welcome.desc': 'مخططك الغذائي الشخصي. تتبعي ما تأكلين، واحصلي على اقتراحات ذكية للكميات، وأكملي حلقات العناصر الغذائية اليومية — وجبة بوجبة.',
  'onboarding.plan.title': 'خططي لوجباتك',
  'onboarding.plan.desc': 'ابحثي عن المكونات، اختاري فطور أو غداء أو عشاء أو وجبة خفيفة، واحصلي على اقتراحات كميات مصممة حسب احتياجاتك المتبقية.',
  'onboarding.stock.title': 'تتبعي مخزونك',
  'onboarding.stock.desc': 'أضيفي مشترياتك للمخزن. عند تسجيل وجبة، يُخصم المخزون تلقائياً. تنبيهات عندما تنخفض الكمية.',
  'onboarding.suggest.title': 'أفكار وجبات بالذكاء الاصطناعي',
  'onboarding.suggest.desc': 'محتارة ماذا تطبخين؟ احصلي على اقتراحات وجبات من مخزونك أو من مكونات تختارينها — بالذكاء الاصطناعي، بلغتك.',

  'error.network': 'خطأ في الشبكة. تحققي من الاتصال وحاولي مجدداً.',
  'error.timeout': 'انتهت المهلة. يرجى المحاولة مرة أخرى.',
  'error.loadFailed': 'فشل التحميل. اضغطي لإعادة المحاولة.',
  'error.retry': 'أعيدي المحاولة',

  'dashboard.keyNutrients': 'العناصر الغذائية الرئيسية اليوم',
  'dashboard.stillNeeded': 'ما زلت تحتاجين اليوم',
  'dashboard.stillNeededDesc': 'هذه العناصر الغذائية أقل من 70% من هدفك اليومي',
  'dashboard.todaysMeals': 'وجبات اليوم',
  'dashboard.planNext': 'خططي الوجبة القادمة',
  'dashboard.noMeals': 'لم يتم تسجيل أي وجبات بعد. خططي لوجبتك الأولى!',
  'dashboard.weeklyReport': 'التقرير الأسبوعي',

  'plan.title': 'خططي لوجبة',
  'plan.subtitle': 'ابحثي وأضيفي المكونات التي تريدين طبخها',
  'plan.searchPlaceholder': 'ابحثي عن مكونات (مثال: لحم، سبانخ، بيض...)',
  'plan.selected': 'المكونات المختارة',
  'plan.generate': 'إنشاء اقتراحات الكميات',
  'plan.searching': 'جاري البحث...',
  'plan.noResults': 'لم يتم العثور على مكونات. جربي بحثاً مختلفاً أو أضيفي مكوناً مخصصاً.',
  'plan.mealType': 'ما نوع هذه الوجبة؟',
  'plan.filter': 'فلترة حسب النظام الغذائي',
  'plan.clearFilters': 'مسح الفلاتر',
  'plan.addCustom': 'أضيفي مكوناً مخصصاً',

  'suggestions.title': 'التركيبات المقترحة', 'suggestions.subtitle': 'اختاري الخيار الذي يناسبك',
  'suggestions.option': 'خيار', 'suggestions.score': 'النتيجة',
  'suggestions.choose': 'اختاري هذا الخيار', 'suggestions.back': 'العودة للمكونات',
  'suggestions.strongIn': 'غني بـ',
  'suggestions.helpsWith': 'يساعد في',
  'suggestions.balances': 'يوازن',

  'planned.title': 'وجبتك المخططة', 'planned.ingredients': 'المكونات',
  'planned.editHint': 'اضغطي على أي كمية لتعديلها',
  'planned.provides': 'هذه الوجبة توفر', 'planned.addToDay': 'أضيفي هذه الوجبة لليوم',
  'planned.backSuggestions': 'العودة للاقتراحات',
  'planned.totalWeight': 'الوزن الإجمالي', 'planned.reset': 'إعادة للمقترح',

  'tracker.title': 'متابعة يومية',
  'tracker.today': 'اليوم', 'tracker.week': 'آخر 7 أيام', 'tracker.month': 'آخر 30 يوم',
  'tracker.priority': 'العناصر الغذائية ذات الأولوية',
  'tracker.all': 'جميع العناصر الغذائية',
  'tracker.trends': 'الاتجاهات',
  'tracker.mealsLogged': 'الوجبات المسجلة',
  'tracker.resetDay': 'إعادة تعيين اليوم',
  'tracker.noMeals': 'لم يتم تسجيل وجبات اليوم.',

  'trends.avg': 'المتوسط', 'trends.target': 'الهدف',
  'trends.overDays': 'خلال {n} أيام',
  'trends.empty': 'لا توجد بيانات لعرضها بعد',

  'edit.title': 'تعديل الوجبة',
  'edit.confirmDelete': 'هل أنت متأكدة من حذف هذه الوجبة؟',
  'edit.deleteConfirm': 'نعم، احذفي',

  'custom.title': 'إضافة مكون مخصص',
  'custom.subtitle': 'أنشئي مكوناً خاصاً بك مع قيم العناصر الغذائية لكل 100غ',
  'custom.names': 'الاسم (بلغاتك)',
  'custom.labelEnPh': 'مثال: Tajine seasoning',
  'custom.labelFrPh': 'ex: Ras el hanout',
  'custom.labelArPh': 'مثال: رأس الحانوت',
  'custom.category': 'الفئة',
  'custom.dietary': 'وسوم النظام الغذائي',
  'custom.nutrientsPer100g': 'العناصر الغذائية (لكل 100غ)',
  'custom.nutrientsHint': 'املئي ما تعرفينه — اتركي 0 للقيم غير المعروفة',
  'custom.showAdvanced': 'إظهار العناصر المتقدمة',
  'custom.hideAdvanced': 'إخفاء العناصر المتقدمة',
  'custom.needLabel': 'يرجى إدخال اسم بلغة واحدة على الأقل',

  'stock.title': 'مخزون البقالة', 'stock.subtitle': 'تتبعي محتويات مطبخك',
  'stock.searchAdd': 'ابحثي لإضافة مكونات...', 'stock.current': 'المخزون الحالي',
  'stock.empty': 'لا توجد مواد في المخزون. ابحثي أعلاه لإضافة مكونات.',
  'stock.add': 'أضيفي', 'stock.left': 'متبقي', 'stock.lowAlert': 'تنبيه مخزون منخفض',

  'suggest.title': 'أفكار وجبات', 'suggest.subtitle': 'احصلي على اقتراحات وجبات بالذكاء الاصطناعي',
  'suggest.fromStock': 'من مخزوني', 'suggest.fromCustom': 'مكونات مخصصة',
  'suggest.generate': 'اقتراحات', 'suggest.generating': 'جاري التفكير...',
  'suggest.noResults': 'لا توجد اقتراحات. جربي مكونات مختلفة.',
  'suggest.ingredientsPlaceholder': 'أدخلي المكونات، واحد في كل سطر...',
  'suggest.respectingDiet': 'يحترم نظامك الغذائي',

  'weekly.title': 'التقرير الأسبوعي', 'weekly.loading': 'جاري تحليل أسبوعك...',
  'weekly.noData': 'لم يتم تتبع وجبات هذا الأسبوع بعد.',
  'weekly.daysTracked': 'أيام تم تتبعها', 'weekly.strengths': 'نقاط القوة',
  'weekly.gaps': 'مجالات للتحسين', 'weekly.suggestions': 'اقتراحات',
  'weekly.dailyAvg': 'المعدلات اليومية',

  'settings.title': 'الإعدادات', 'settings.profile': 'الملف الشخصي', 'settings.yourName': 'اسمك',
  'settings.language': 'اللغة', 'settings.targets': 'الأهداف الغذائية اليومية',
  'settings.targetsNote': 'استشيري مقدم الرعاية الصحية للحصول على أهداف مخصصة',
  'settings.save': 'حفظ الإعدادات',
  'settings.healthNote': 'هذا التطبيق يدعم تخطيط الوجبات وتتبع التغذية فقط. لا يشخص أو يعالج أي حالة.',
  'settings.resetOnboarding': 'عرض الشرح مجدداً',
  'settings.dietary': 'تفضيلات النظام الغذائي',
  'settings.dietaryHint': 'تُطبَّق على البحث واقتراحات الذكاء الاصطناعي',

  'nutrient.iron': 'حديد', 'nutrient.protein': 'بروتين', 'nutrient.iodine': 'يود',
  'nutrient.selenium': 'سيلينيوم', 'nutrient.vitaminB12': 'فيتامين ب12', 'nutrient.folate': 'حمض الفوليك',
  'nutrient.vitaminC': 'فيتامين سي', 'nutrient.zinc': 'زنك', 'nutrient.fiber': 'ألياف',
  'nutrient.calories': 'سعرات', 'nutrient.carbs': 'كربوهيدرات', 'nutrient.fat': 'دهون',

  'toast.mealAdded': 'تم إضافة الوجبة! ✅', 'toast.dayReset': 'تم إعادة تعيين اليوم! 🌅',
  'toast.settingsSaved': 'تم حفظ الإعدادات! 🎯', 'toast.saving': 'جاري الحفظ...',
  'toast.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  'toast.stockLow': 'على وشك النفاد! حان وقت التسوق.',
  'toast.mealUpdated': 'تم تحديث الوجبة ✅',
  'toast.mealDeleted': 'تم حذف الوجبة',
  'toast.customAdded': 'تم إنشاء المكون المخصص ✨',
};

const fr: Record<string, string> = {
  'app.name': 'Nourish',
  'app.tagline': 'Planifiez vos repas, atteignez vos objectifs nutritionnels',
  'greeting.morning': 'Bonjour', 'greeting.afternoon': 'Bon après-midi', 'greeting.evening': 'Bonsoir',

  'nav.home': 'Accueil', 'nav.plan': 'Planifier', 'nav.track': 'Suivi',
  'nav.settings': 'Réglages', 'nav.stock': 'Stock', 'nav.suggest': 'Idées',

  'meal.breakfast': 'Petit-déj', 'meal.lunch': 'Déjeuner', 'meal.dinner': 'Dîner', 'meal.snack': 'Snack',

  'common.save': 'Enregistrer', 'common.cancel': 'Annuler', 'common.close': 'Fermer', 'common.edit': 'Modifier', 'common.delete': 'Supprimer',

  'diet.vegetarian': 'Végétarien',
  'diet.vegan': 'Végan',
  'diet.glutenFree': 'Sans gluten',
  'diet.dairyFree': 'Sans lactose',

  'onboarding.skip': 'Passer',
  'onboarding.next': 'Suivant',
  'onboarding.start': 'Commencer',
  'onboarding.welcome.title': 'Bienvenue sur Nourish',
  'onboarding.welcome.desc': 'Votre planificateur nutritionnel personnel. Suivez vos repas, obtenez des suggestions de portions intelligentes et complétez vos anneaux nutritionnels — repas par repas.',
  'onboarding.plan.title': 'Planifiez vos repas',
  'onboarding.plan.desc': 'Cherchez des ingrédients, choisissez petit-déjeuner, déjeuner, dîner ou snack, et obtenez des suggestions adaptées à vos besoins restants.',
  'onboarding.stock.title': 'Suivez votre stock',
  'onboarding.stock.desc': 'Ajoutez vos courses au garde-manger. Quand vous enregistrez un repas, le stock se déduit automatiquement. Alertes quand un produit s\'épuise.',
  'onboarding.suggest.title': 'Idées repas par IA',
  'onboarding.suggest.desc': 'En panne d\'inspiration ? Obtenez des suggestions de repas basées sur votre stock ou vos ingrédients — propulsées par l\'IA, dans votre langue.',

  'error.network': 'Erreur réseau. Vérifiez votre connexion et réessayez.',
  'error.timeout': 'Délai dépassé. Veuillez réessayer.',
  'error.loadFailed': 'Échec du chargement. Appuyez pour réessayer.',
  'error.retry': 'Réessayer',

  'dashboard.keyNutrients': "Nutriments clés aujourd'hui",
  'dashboard.stillNeeded': "Encore nécessaire aujourd'hui",
  'dashboard.stillNeededDesc': 'Ces nutriments sont en dessous de 70% de votre objectif',
  'dashboard.todaysMeals': "Repas d'aujourd'hui",
  'dashboard.planNext': 'Planifier le prochain repas',
  'dashboard.noMeals': 'Aucun repas enregistré. Planifiez votre premier repas !',
  'dashboard.weeklyReport': 'Rapport hebdomadaire',

  'plan.title': 'Planifier un repas',
  'plan.subtitle': 'Cherchez et ajoutez les ingrédients que vous comptez cuisiner',
  'plan.searchPlaceholder': 'Chercher des ingrédients (ex: bœuf, épinards, œufs...)',
  'plan.selected': 'Ingrédients sélectionnés',
  'plan.generate': 'Générer des suggestions',
  'plan.searching': 'Recherche en cours...',
  'plan.noResults': 'Aucun ingrédient trouvé. Essayez une autre recherche ou ajoutez un ingrédient personnalisé.',
  'plan.mealType': 'Quel type de repas ?',
  'plan.filter': 'Filtrer par régime',
  'plan.clearFilters': 'Effacer les filtres',
  'plan.addCustom': 'Ajouter un ingrédient personnalisé',

  'suggestions.title': 'Combinaisons suggérées', 'suggestions.subtitle': "Choisissez l'option qui vous convient",
  'suggestions.option': 'Option', 'suggestions.score': 'Score',
  'suggestions.choose': 'Choisir cette option', 'suggestions.back': 'Retour aux ingrédients',
  'suggestions.strongIn': 'Riche en',
  'suggestions.helpsWith': 'Aide avec',
  'suggestions.balances': 'Équilibre',

  'planned.title': 'Votre repas planifié', 'planned.ingredients': 'Ingrédients',
  'planned.editHint': 'Appuyez sur une quantité pour la modifier',
  'planned.provides': 'Ce repas fournit', 'planned.addToDay': "Ajouter ce repas à aujourd'hui",
  'planned.backSuggestions': 'Retour aux suggestions',
  'planned.totalWeight': 'Poids total', 'planned.reset': 'Remettre la suggestion',

  'tracker.title': 'Suivi quotidien',
  'tracker.today': "Aujourd'hui", 'tracker.week': '7 derniers jours', 'tracker.month': '30 derniers jours',
  'tracker.priority': 'Nutriments prioritaires',
  'tracker.all': 'Tous les nutriments',
  'tracker.trends': 'Tendances',
  'tracker.mealsLogged': 'Repas enregistrés',
  'tracker.resetDay': 'Réinitialiser la journée',
  'tracker.noMeals': "Aucun repas enregistré aujourd'hui.",

  'trends.avg': 'moy', 'trends.target': 'objectif',
  'trends.overDays': 'sur {n} jours',
  'trends.empty': 'Pas encore de données',

  'edit.title': 'Modifier le repas',
  'edit.confirmDelete': 'Êtes-vous sûre de vouloir supprimer ce repas ?',
  'edit.deleteConfirm': 'Oui, supprimer',

  'custom.title': 'Ajouter un ingrédient personnalisé',
  'custom.subtitle': 'Créez votre propre ingrédient avec les valeurs nutritionnelles pour 100g',
  'custom.names': 'Nom (dans vos langues)',
  'custom.labelEnPh': 'e.g. Tajine seasoning',
  'custom.labelFrPh': 'ex: Ras el hanout',
  'custom.labelArPh': 'مثال: رأس الحانوت',
  'custom.category': 'Catégorie',
  'custom.dietary': 'Tags de régime',
  'custom.nutrientsPer100g': 'Nutriments (pour 100g)',
  'custom.nutrientsHint': 'Remplissez ce que vous savez — laissez 0 pour les inconnus',
  'custom.showAdvanced': 'Afficher nutriments avancés',
  'custom.hideAdvanced': 'Masquer nutriments avancés',
  'custom.needLabel': 'Veuillez saisir un nom dans au moins une langue',

  'stock.title': 'Stock alimentaire', 'stock.subtitle': 'Suivez votre inventaire de cuisine',
  'stock.searchAdd': 'Chercher pour ajouter des ingrédients...',
  'stock.current': 'Stock actuel', 'stock.empty': "Aucun article en stock. Cherchez ci-dessus pour ajouter.",
  'stock.add': 'Ajouter', 'stock.left': 'restant', 'stock.lowAlert': 'Alerte stock faible',

  'suggest.title': 'Idées de repas', 'suggest.subtitle': 'Obtenez des suggestions par IA',
  'suggest.fromStock': 'Depuis mon stock', 'suggest.fromCustom': 'Ingrédients personnalisés',
  'suggest.generate': 'Obtenir des idées', 'suggest.generating': 'Réflexion...',
  'suggest.noResults': 'Pas de suggestions. Essayez d\'autres ingrédients.',
  'suggest.ingredientsPlaceholder': 'Entrez les ingrédients, un par ligne...',
  'suggest.respectingDiet': 'Respecte votre régime',

  'weekly.title': 'Rapport hebdomadaire', 'weekly.loading': 'Analyse de votre semaine...',
  'weekly.noData': 'Pas encore de repas suivis cette semaine.',
  'weekly.daysTracked': 'jours suivis', 'weekly.strengths': 'Points forts',
  'weekly.gaps': 'Axes d\'amélioration', 'weekly.suggestions': 'Suggestions',
  'weekly.dailyAvg': 'Moyennes quotidiennes',

  'settings.title': 'Réglages', 'settings.profile': 'Profil', 'settings.yourName': 'Votre nom',
  'settings.language': 'Langue', 'settings.targets': 'Objectifs nutritionnels quotidiens',
  'settings.targetsNote': 'Consultez votre professionnel de santé pour des objectifs personnalisés',
  'settings.save': 'Enregistrer', 'settings.healthNote': "Cette application aide à la planification des repas uniquement.",
  'settings.resetOnboarding': 'Revoir le tutoriel',
  'settings.dietary': 'Préférences alimentaires',
  'settings.dietaryHint': 'Appliquées à la recherche et aux suggestions IA',

  'nutrient.iron': 'Fer', 'nutrient.protein': 'Protéines', 'nutrient.iodine': 'Iode',
  'nutrient.selenium': 'Sélénium', 'nutrient.vitaminB12': 'Vitamine B12', 'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamine C', 'nutrient.zinc': 'Zinc', 'nutrient.fiber': 'Fibres',
  'nutrient.calories': 'Calories', 'nutrient.carbs': 'Glucides', 'nutrient.fat': 'Lipides',

  'toast.mealAdded': 'Repas ajouté ! ✅', 'toast.dayReset': 'Journée réinitialisée ! 🌅',
  'toast.settingsSaved': 'Réglages enregistrés ! 🎯', 'toast.saving': 'Enregistrement...',
  'toast.error': "Quelque chose s'est mal passé. Réessayez.",
  'toast.stockLow': 'bientôt épuisé ! Pensez à réapprovisionner.',
  'toast.mealUpdated': 'Repas mis à jour ✅',
  'toast.mealDeleted': 'Repas supprimé',
  'toast.customAdded': 'Ingrédient personnalisé créé ✨',
};

const dictionaries: Record<Locale, Record<string, string>> = { en, ar, fr };

export function t(key: string, locale: Locale): string {
  return dictionaries[locale]?.[key] || dictionaries.en[key] || key;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English', ar: 'العربية', fr: 'Français',
};
