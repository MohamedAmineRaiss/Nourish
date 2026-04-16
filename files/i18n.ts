import { Locale } from '@/types';

// ─── Translation dictionaries ───
const en: Record<string, string> = {
  'app.name': 'Nourish',
  'app.tagline': 'Plan meals, meet your nutrition goals',

  // Greetings
  'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',

  // Nav
  'nav.home': 'Home',
  'nav.plan': 'Plan',
  'nav.track': 'Track',
  'nav.settings': 'Settings',

  // Dashboard
  'dashboard.keyNutrients': 'Key Nutrients Today',
  'dashboard.stillNeeded': 'Still Needed Today',
  'dashboard.stillNeededDesc': 'These nutrients are below 70% of your daily target',
  'dashboard.todaysMeals': "Today's Meals",
  'dashboard.planNext': 'Plan Next Meal',
  'dashboard.noMeals': 'No meals logged yet. Plan your first meal!',

  // Plan meal
  'plan.title': 'Plan a Meal',
  'plan.subtitle': 'Search and add the ingredients you plan to cook',
  'plan.searchPlaceholder': 'Search ingredients (e.g. beef, spinach, eggs...)',
  'plan.selected': 'Selected Ingredients',
  'plan.generate': 'Generate Quantity Suggestions',
  'plan.searching': 'Searching...',
  'plan.noResults': 'No ingredients found. Try a different search.',
  'plan.apiNote': 'Searching Nourish Food Database',
  'plan.mealsRemaining': 'Meals remaining today',
  'plan.mealsHint': 'Portions are sized to close your daily rings in this many meals',

  // Suggestions
  'suggestions.title': 'Suggested Combinations',
  'suggestions.subtitle': 'Choose the option that feels right for you',
  'suggestions.option': 'Option',
  'suggestions.score': 'Score',
  'suggestions.choose': 'Choose This Option',
  'suggestions.back': 'Back to Ingredients',

  // Planned meal
  'planned.title': 'Your Planned Meal',
  'planned.ingredients': 'Ingredients',
  'planned.editHint': 'Tap any amount to adjust it',
  'planned.provides': 'This Meal Provides',
  'planned.addToDay': 'Add This Meal to Today',
  'planned.backSuggestions': 'Back to Suggestions',
  'planned.totalWeight': 'Total weight',
  'planned.reset': 'Reset to suggested',

  // Tracker
  'tracker.title': 'Daily Tracker',
  'tracker.priority': 'Priority Nutrients',
  'tracker.all': 'All Nutrients',
  'tracker.mealsLogged': 'Meals Logged',
  'tracker.resetDay': 'Reset Day',
  'tracker.noMeals': 'No meals logged today.',

  // Settings
  'settings.title': 'Settings',
  'settings.profile': 'Profile',
  'settings.yourName': 'Your Name',
  'settings.language': 'Language',
  'settings.targets': 'Daily Nutrient Targets',
  'settings.targetsNote': 'Consult your healthcare provider for personalized targets',
  'settings.save': 'Save Settings',
  'settings.healthNote': 'This app supports meal planning and nutrient tracking only. It does not diagnose or treat any condition. If your clinician has set specific nutrient targets, those should override the defaults. Always discuss supplements and medication timing with your healthcare provider.',

  // Nutrients
  'nutrient.iron': 'Iron',
  'nutrient.protein': 'Protein',
  'nutrient.iodine': 'Iodine',
  'nutrient.selenium': 'Selenium',
  'nutrient.vitaminB12': 'Vitamin B12',
  'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamin C',
  'nutrient.zinc': 'Zinc',
  'nutrient.fiber': 'Fiber',
  'nutrient.calories': 'Calories',
  'nutrient.carbs': 'Carbs',
  'nutrient.fat': 'Fat',

  // Toasts
  'toast.mealAdded': 'Meal added to today\'s tracker! ✅',
  'toast.dayReset': 'Day reset! Fresh start 🌅',
  'toast.settingsSaved': 'Settings saved! 🎯',
  'toast.saving': 'Saving...',
  'toast.error': 'Something went wrong. Please try again.',
};

const ar: Record<string, string> = {
  'app.name': 'تغذية',
  'app.tagline': 'خططي لوجباتك وحققي أهدافك الغذائية',

  'greeting.morning': 'صباح الخير',
  'greeting.afternoon': 'مساء الخير',
  'greeting.evening': 'مساء الخير',

  'nav.home': 'الرئيسية',
  'nav.plan': 'تخطيط',
  'nav.track': 'متابعة',
  'nav.settings': 'إعدادات',

  'dashboard.keyNutrients': 'العناصر الغذائية الرئيسية اليوم',
  'dashboard.stillNeeded': 'ما زلت تحتاجين اليوم',
  'dashboard.stillNeededDesc': 'هذه العناصر الغذائية أقل من 70% من هدفك اليومي',
  'dashboard.todaysMeals': 'وجبات اليوم',
  'dashboard.planNext': 'خططي الوجبة القادمة',
  'dashboard.noMeals': 'لم يتم تسجيل أي وجبات بعد. خططي لوجبتك الأولى!',

  'plan.title': 'خططي لوجبة',
  'plan.subtitle': 'ابحثي وأضيفي المكونات التي تريدين طبخها',
  'plan.searchPlaceholder': 'ابحثي عن مكونات (مثال: لحم، سبانخ، بيض...)',
  'plan.selected': 'المكونات المختارة',
  'plan.generate': 'إنشاء اقتراحات الكميات',
  'plan.searching': 'جاري البحث...',
  'plan.noResults': 'لم يتم العثور على مكونات. جربي بحثاً مختلفاً.',
  'plan.apiNote': 'البحث في قاعدة بيانات تغذية',
  'plan.mealsRemaining': 'الوجبات المتبقية اليوم',
  'plan.mealsHint': 'الكميات مصممة لتحقيق أهدافك اليومية خلال هذا العدد من الوجبات',

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

  'settings.title': 'الإعدادات',
  'settings.profile': 'الملف الشخصي',
  'settings.yourName': 'اسمك',
  'settings.language': 'اللغة',
  'settings.targets': 'الأهداف الغذائية اليومية',
  'settings.targetsNote': 'استشيري مقدم الرعاية الصحية للحصول على أهداف مخصصة',
  'settings.save': 'حفظ الإعدادات',
  'settings.healthNote': 'هذا التطبيق يدعم تخطيط الوجبات وتتبع التغذية فقط. لا يشخص أو يعالج أي حالة. إذا حدد طبيبك أهدافاً غذائية محددة، فيجب أن تتجاوز الإعدادات الافتراضية. ناقشي دائماً المكملات وتوقيت الأدوية مع مقدم الرعاية الصحية.',

  'nutrient.iron': 'حديد',
  'nutrient.protein': 'بروتين',
  'nutrient.iodine': 'يود',
  'nutrient.selenium': 'سيلينيوم',
  'nutrient.vitaminB12': 'فيتامين ب12',
  'nutrient.folate': 'حمض الفوليك',
  'nutrient.vitaminC': 'فيتامين سي',
  'nutrient.zinc': 'زنك',
  'nutrient.fiber': 'ألياف',
  'nutrient.calories': 'سعرات',
  'nutrient.carbs': 'كربوهيدرات',
  'nutrient.fat': 'دهون',

  'toast.mealAdded': 'تم إضافة الوجبة لمتابعة اليوم! ✅',
  'toast.dayReset': 'تم إعادة تعيين اليوم! بداية جديدة 🌅',
  'toast.settingsSaved': 'تم حفظ الإعدادات! 🎯',
  'toast.saving': 'جاري الحفظ...',
  'toast.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
};

const fr: Record<string, string> = {
  'app.name': 'Nourish',
  'app.tagline': 'Planifiez vos repas, atteignez vos objectifs nutritionnels',

  'greeting.morning': 'Bonjour',
  'greeting.afternoon': 'Bon après-midi',
  'greeting.evening': 'Bonsoir',

  'nav.home': 'Accueil',
  'nav.plan': 'Planifier',
  'nav.track': 'Suivi',
  'nav.settings': 'Réglages',

  'dashboard.keyNutrients': "Nutriments clés aujourd'hui",
  'dashboard.stillNeeded': "Encore nécessaire aujourd'hui",
  'dashboard.stillNeededDesc': 'Ces nutriments sont en dessous de 70% de votre objectif quotidien',
  'dashboard.todaysMeals': "Repas d'aujourd'hui",
  'dashboard.planNext': 'Planifier le prochain repas',
  'dashboard.noMeals': "Aucun repas enregistré. Planifiez votre premier repas !",

  'plan.title': 'Planifier un repas',
  'plan.subtitle': 'Cherchez et ajoutez les ingrédients que vous comptez cuisiner',
  'plan.searchPlaceholder': 'Chercher des ingrédients (ex: bœuf, épinards, œufs...)',
  'plan.selected': 'Ingrédients sélectionnés',
  'plan.generate': 'Générer des suggestions de quantités',
  'plan.searching': 'Recherche en cours...',
  'plan.noResults': "Aucun ingrédient trouvé. Essayez une autre recherche.",
  'plan.apiNote': 'Recherche dans la base de données Nourish',
  'plan.mealsRemaining': 'Repas restants aujourd\'hui',
  'plan.mealsHint': 'Les portions sont calculées pour atteindre vos objectifs en ce nombre de repas',

  'suggestions.title': 'Combinaisons suggérées',
  'suggestions.subtitle': "Choisissez l'option qui vous convient",
  'suggestions.option': 'Option',
  'suggestions.score': 'Score',
  'suggestions.choose': 'Choisir cette option',
  'suggestions.back': 'Retour aux ingrédients',

  'planned.title': 'Votre repas planifié',
  'planned.ingredients': 'Ingrédients',
  'planned.editHint': 'Appuyez sur une quantité pour la modifier',
  'planned.provides': 'Ce repas fournit',
  'planned.addToDay': "Ajouter ce repas à aujourd'hui",
  'planned.backSuggestions': 'Retour aux suggestions',
  'planned.totalWeight': 'Poids total',
  'planned.reset': 'Remettre la suggestion',

  'tracker.title': 'Suivi quotidien',
  'tracker.priority': 'Nutriments prioritaires',
  'tracker.all': 'Tous les nutriments',
  'tracker.mealsLogged': 'Repas enregistrés',
  'tracker.resetDay': 'Réinitialiser la journée',
  'tracker.noMeals': "Aucun repas enregistré aujourd'hui.",

  'settings.title': 'Réglages',
  'settings.profile': 'Profil',
  'settings.yourName': 'Votre nom',
  'settings.language': 'Langue',
  'settings.targets': 'Objectifs nutritionnels quotidiens',
  'settings.targetsNote': 'Consultez votre professionnel de santé pour des objectifs personnalisés',
  'settings.save': 'Enregistrer les réglages',
  'settings.healthNote': "Cette application aide à la planification des repas et au suivi nutritionnel uniquement. Elle ne diagnostique ni ne traite aucune condition. Si votre médecin a défini des objectifs nutritionnels spécifiques, ceux-ci doivent prévaloir sur les valeurs par défaut. Discutez toujours des suppléments et du timing des médicaments avec votre professionnel de santé.",

  'nutrient.iron': 'Fer',
  'nutrient.protein': 'Protéines',
  'nutrient.iodine': 'Iode',
  'nutrient.selenium': 'Sélénium',
  'nutrient.vitaminB12': 'Vitamine B12',
  'nutrient.folate': 'Folate',
  'nutrient.vitaminC': 'Vitamine C',
  'nutrient.zinc': 'Zinc',
  'nutrient.fiber': 'Fibres',
  'nutrient.calories': 'Calories',
  'nutrient.carbs': 'Glucides',
  'nutrient.fat': 'Lipides',

  'toast.mealAdded': "Repas ajouté au suivi d'aujourd'hui ! ✅",
  'toast.dayReset': 'Journée réinitialisée ! Nouveau départ 🌅',
  'toast.settingsSaved': 'Réglages enregistrés ! 🎯',
  'toast.saving': 'Enregistrement...',
  'toast.error': "Quelque chose s'est mal passé. Veuillez réessayer.",
};

const dictionaries: Record<Locale, Record<string, string>> = { en, ar, fr };

export function t(key: string, locale: Locale): string {
  return dictionaries[locale]?.[key] || dictionaries.en[key] || key;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};
