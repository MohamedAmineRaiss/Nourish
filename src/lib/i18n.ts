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

  'dashboard.keyNutrients': 'Key Nutrients Today',
  'dashboard.stillNeeded': 'Still Needed Today',
  'dashboard.stillNeededDesc': 'These nutrients are below 70% of your daily target',
  'dashboard.todaysMeals': "Today's Meals",
  'dashboard.planNext': 'Plan Next Meal',
  'dashboard.noMeals': 'No meals logged yet. Plan your first meal!',
  'dashboard.weeklyReport': 'Weekly Report',

  'plan.title': 'Plan a Meal',
  'plan.subtitle': 'Search and add the ingredients you plan to cook',
  'plan.searchPlaceholder': 'Search ingredients (e.g. beef, spinach, eggs...)',
  'plan.selected': 'Selected Ingredients',
  'plan.generate': 'Generate Quantity Suggestions',
  'plan.searching': 'Searching...',
  'plan.noResults': 'No ingredients found. Try a different search.',
  'plan.mealType': 'What meal is this?',

  'suggestions.title': 'Suggested Combinations',
  'suggestions.subtitle': 'Choose the option that feels right for you',
  'suggestions.option': 'Option',
  'suggestions.score': 'Score',
  'suggestions.choose': 'Choose This Option',
  'suggestions.back': 'Back to Ingredients',

  'planned.title': 'Your Planned Meal',
  'planned.ingredients': 'Ingredients',
  'planned.editHint': 'Tap any amount to adjust it',
  'planned.provides': 'This Meal Provides',
  'planned.addToDay': 'Add This Meal to Today',
  'planned.backSuggestions': 'Back to Suggestions',
  'planned.totalWeight': 'Total weight',
  'planned.reset': 'Reset to suggested',

  'tracker.title': 'Daily Tracker',
  'tracker.priority': 'Priority Nutrients',
  'tracker.all': 'All Nutrients',
  'tracker.mealsLogged': 'Meals Logged',
  'tracker.resetDay': 'Reset Day',
  'tracker.noMeals': 'No meals logged today.',

  'stock.title': 'Grocery Stock',
  'stock.subtitle': 'Track your kitchen inventory',
  'stock.searchAdd': 'Search to add ingredients...',
  'stock.current': 'Current Stock',
  'stock.empty': 'No items in stock. Search above to add ingredients.',
  'stock.add': 'Add',
  'stock.left': 'left',
  'stock.lowAlert': 'Low Stock Warning',

  'suggest.title': 'Meal Ideas',
  'suggest.subtitle': 'Get AI-powered meal suggestions',
  'suggest.fromStock': 'From my stock',
  'suggest.fromCustom': 'Custom ingredients',
  'suggest.generate': 'Get Suggestions',
  'suggest.generating': 'Thinking...',
  'suggest.noResults': 'No suggestions available. Try different ingredients.',
  'suggest.ingredientsPlaceholder': 'Enter ingredients, one per line...',

  'weekly.title': 'Weekly Report',
  'weekly.loading': 'Analyzing your week...',
  'weekly.noData': 'No meals tracked this week yet.',
  'weekly.daysTracked': 'days tracked',
  'weekly.strengths': 'Strengths',
  'weekly.gaps': 'Areas to Improve',
  'weekly.suggestions': 'Suggestions',
  'weekly.dailyAvg': 'Daily Averages',

  'settings.title': 'Settings', 'settings.profile': 'Profile', 'settings.yourName': 'Your Name',
  'settings.language': 'Language', 'settings.targets': 'Daily Nutrient Targets',
  'settings.targetsNote': 'Consult your healthcare provider for personalized targets',
  'settings.save': 'Save Settings',
  'settings.healthNote': 'This app supports meal planning and nutrient tracking only. It does not diagnose or treat any condition.',

  'nutrient.iron': 'Iron', 'nutrient.protein': 'Protein', 'nutrient.iodine': 'Iodine',
  'nutrient.selenium': 'Selenium', 'nutrient.vitaminB12': 'Vitamin B12', 'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamin C', 'nutrient.zinc': 'Zinc', 'nutrient.fiber': 'Fiber',
  'nutrient.calories': 'Calories', 'nutrient.carbs': 'Carbs', 'nutrient.fat': 'Fat',

  'toast.mealAdded': 'Meal added! ✅', 'toast.dayReset': 'Day reset! 🌅',
  'toast.settingsSaved': 'Settings saved! 🎯', 'toast.saving': 'Saving...',
  'toast.error': 'Something went wrong. Please try again.',
  'toast.stockLow': 'is running low! Time to restock.',
};

const ar: Record<string, string> = {
  'app.name': 'تغذية',
  'app.tagline': 'خططي لوجباتك وحققي أهدافك الغذائية',
  'greeting.morning': 'صباح الخير',
  'greeting.afternoon': 'مساء الخير',
  'greeting.evening': 'مساء الخير',

  'nav.home': 'الرئيسية', 'nav.plan': 'تخطيط', 'nav.track': 'متابعة',
  'nav.settings': 'إعدادات', 'nav.stock': 'المخزون', 'nav.suggest': 'اقتراحات',

  'meal.breakfast': 'فطور', 'meal.lunch': 'غداء', 'meal.dinner': 'عشاء', 'meal.snack': 'وجبة خفيفة',

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
  'plan.noResults': 'لم يتم العثور على مكونات. جربي بحثاً مختلفاً.',
  'plan.mealType': 'ما نوع هذه الوجبة؟',

  'suggestions.title': 'التركيبات المقترحة',
  'suggestions.subtitle': 'اختاري الخيار الذي يناسبك',
  'suggestions.option': 'خيار',
  'suggestions.score': 'النتيجة',
  'suggestions.choose': 'اختاري هذا الخيار',
  'suggestions.back': 'العودة للمكونات',

  'planned.title': 'وجبتك المخططة',
  'planned.ingredients': 'المكونات',
  'planned.editHint': 'اضغطي على أي كمية لتعديلها',
  'planned.provides': 'هذه الوجبة توفر',
  'planned.addToDay': 'أضيفي هذه الوجبة لليوم',
  'planned.backSuggestions': 'العودة للاقتراحات',
  'planned.totalWeight': 'الوزن الإجمالي',
  'planned.reset': 'إعادة للمقترح',

  'tracker.title': 'متابعة يومية',
  'tracker.priority': 'العناصر الغذائية ذات الأولوية',
  'tracker.all': 'جميع العناصر الغذائية',
  'tracker.mealsLogged': 'الوجبات المسجلة',
  'tracker.resetDay': 'إعادة تعيين اليوم',
  'tracker.noMeals': 'لم يتم تسجيل وجبات اليوم.',

  'stock.title': 'مخزون البقالة',
  'stock.subtitle': 'تتبعي محتويات مطبخك',
  'stock.searchAdd': 'ابحثي لإضافة مكونات...',
  'stock.current': 'المخزون الحالي',
  'stock.empty': 'لا توجد مواد في المخزون. ابحثي أعلاه لإضافة مكونات.',
  'stock.add': 'أضيفي',
  'stock.left': 'متبقي',
  'stock.lowAlert': 'تنبيه مخزون منخفض',

  'suggest.title': 'أفكار وجبات',
  'suggest.subtitle': 'احصلي على اقتراحات وجبات بالذكاء الاصطناعي',
  'suggest.fromStock': 'من مخزوني',
  'suggest.fromCustom': 'مكونات مخصصة',
  'suggest.generate': 'اقتراحات',
  'suggest.generating': 'جاري التفكير...',
  'suggest.noResults': 'لا توجد اقتراحات. جربي مكونات مختلفة.',
  'suggest.ingredientsPlaceholder': 'أدخلي المكونات، واحد في كل سطر...',

  'weekly.title': 'التقرير الأسبوعي',
  'weekly.loading': 'جاري تحليل أسبوعك...',
  'weekly.noData': 'لم يتم تتبع وجبات هذا الأسبوع بعد.',
  'weekly.daysTracked': 'أيام تم تتبعها',
  'weekly.strengths': 'نقاط القوة',
  'weekly.gaps': 'مجالات للتحسين',
  'weekly.suggestions': 'اقتراحات',
  'weekly.dailyAvg': 'المعدلات اليومية',

  'settings.title': 'الإعدادات', 'settings.profile': 'الملف الشخصي', 'settings.yourName': 'اسمك',
  'settings.language': 'اللغة', 'settings.targets': 'الأهداف الغذائية اليومية',
  'settings.targetsNote': 'استشيري مقدم الرعاية الصحية للحصول على أهداف مخصصة',
  'settings.save': 'حفظ الإعدادات',
  'settings.healthNote': 'هذا التطبيق يدعم تخطيط الوجبات وتتبع التغذية فقط. لا يشخص أو يعالج أي حالة.',

  'nutrient.iron': 'حديد', 'nutrient.protein': 'بروتين', 'nutrient.iodine': 'يود',
  'nutrient.selenium': 'سيلينيوم', 'nutrient.vitaminB12': 'فيتامين ب12', 'nutrient.folate': 'حمض الفوليك',
  'nutrient.vitaminC': 'فيتامين سي', 'nutrient.zinc': 'زنك', 'nutrient.fiber': 'ألياف',
  'nutrient.calories': 'سعرات', 'nutrient.carbs': 'كربوهيدرات', 'nutrient.fat': 'دهون',

  'toast.mealAdded': 'تم إضافة الوجبة! ✅', 'toast.dayReset': 'تم إعادة تعيين اليوم! 🌅',
  'toast.settingsSaved': 'تم حفظ الإعدادات! 🎯', 'toast.saving': 'جاري الحفظ...',
  'toast.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  'toast.stockLow': 'على وشك النفاد! حان وقت التسوق.',
};

const fr: Record<string, string> = {
  'app.name': 'Nourish',
  'app.tagline': 'Planifiez vos repas, atteignez vos objectifs nutritionnels',
  'greeting.morning': 'Bonjour', 'greeting.afternoon': 'Bon après-midi', 'greeting.evening': 'Bonsoir',

  'nav.home': 'Accueil', 'nav.plan': 'Planifier', 'nav.track': 'Suivi',
  'nav.settings': 'Réglages', 'nav.stock': 'Stock', 'nav.suggest': 'Idées',

  'meal.breakfast': 'Petit-déj', 'meal.lunch': 'Déjeuner', 'meal.dinner': 'Dîner', 'meal.snack': 'Snack',

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
  'plan.noResults': 'Aucun ingrédient trouvé. Essayez une autre recherche.',
  'plan.mealType': 'Quel type de repas ?',

  'suggestions.title': 'Combinaisons suggérées',
  'suggestions.subtitle': "Choisissez l'option qui vous convient",
  'suggestions.option': 'Option', 'suggestions.score': 'Score',
  'suggestions.choose': 'Choisir cette option', 'suggestions.back': 'Retour aux ingrédients',

  'planned.title': 'Votre repas planifié',
  'planned.ingredients': 'Ingrédients',
  'planned.editHint': 'Appuyez sur une quantité pour la modifier',
  'planned.provides': 'Ce repas fournit',
  'planned.addToDay': "Ajouter ce repas à aujourd'hui",
  'planned.backSuggestions': 'Retour aux suggestions',
  'planned.totalWeight': 'Poids total', 'planned.reset': 'Remettre la suggestion',

  'tracker.title': 'Suivi quotidien', 'tracker.priority': 'Nutriments prioritaires',
  'tracker.all': 'Tous les nutriments', 'tracker.mealsLogged': 'Repas enregistrés',
  'tracker.resetDay': 'Réinitialiser la journée', 'tracker.noMeals': "Aucun repas enregistré aujourd'hui.",

  'stock.title': 'Stock alimentaire', 'stock.subtitle': 'Suivez votre inventaire de cuisine',
  'stock.searchAdd': 'Chercher pour ajouter des ingrédients...',
  'stock.current': 'Stock actuel', 'stock.empty': "Aucun article en stock. Cherchez ci-dessus pour ajouter.",
  'stock.add': 'Ajouter', 'stock.left': 'restant', 'stock.lowAlert': 'Alerte stock faible',

  'suggest.title': 'Idées de repas', 'suggest.subtitle': 'Obtenez des suggestions par IA',
  'suggest.fromStock': 'Depuis mon stock', 'suggest.fromCustom': 'Ingrédients personnalisés',
  'suggest.generate': 'Obtenir des idées', 'suggest.generating': 'Réflexion...',
  'suggest.noResults': 'Pas de suggestions. Essayez d\'autres ingrédients.',
  'suggest.ingredientsPlaceholder': 'Entrez les ingrédients, un par ligne...',

  'weekly.title': 'Rapport hebdomadaire', 'weekly.loading': 'Analyse de votre semaine...',
  'weekly.noData': 'Pas encore de repas suivis cette semaine.',
  'weekly.daysTracked': 'jours suivis', 'weekly.strengths': 'Points forts',
  'weekly.gaps': 'Axes d\'amélioration', 'weekly.suggestions': 'Suggestions',
  'weekly.dailyAvg': 'Moyennes quotidiennes',

  'settings.title': 'Réglages', 'settings.profile': 'Profil', 'settings.yourName': 'Votre nom',
  'settings.language': 'Langue', 'settings.targets': 'Objectifs nutritionnels quotidiens',
  'settings.targetsNote': 'Consultez votre professionnel de santé pour des objectifs personnalisés',
  'settings.save': 'Enregistrer', 'settings.healthNote': "Cette application aide à la planification des repas uniquement.",

  'nutrient.iron': 'Fer', 'nutrient.protein': 'Protéines', 'nutrient.iodine': 'Iode',
  'nutrient.selenium': 'Sélénium', 'nutrient.vitaminB12': 'Vitamine B12', 'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamine C', 'nutrient.zinc': 'Zinc', 'nutrient.fiber': 'Fibres',
  'nutrient.calories': 'Calories', 'nutrient.carbs': 'Glucides', 'nutrient.fat': 'Lipides',

  'toast.mealAdded': 'Repas ajouté ! ✅', 'toast.dayReset': 'Journée réinitialisée ! 🌅',
  'toast.settingsSaved': 'Réglages enregistrés ! 🎯', 'toast.saving': 'Enregistrement...',
  'toast.error': "Quelque chose s'est mal passé. Réessayez.",
  'toast.stockLow': 'bientôt épuisé ! Pensez à réapprovisionner.',
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
