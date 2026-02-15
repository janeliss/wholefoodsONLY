import { createContext, useContext, useState, useCallback } from 'react';

export type Lang = 'en' | 'es';

const translations = {
  // Header
  tagline:                { en: 'Whole foods only. No slop.',        es: 'Solo alimentos reales. Sin porquer\u00eda.' },

  // Scanner
  scanTitle:              { en: 'Scan a product',                    es: 'Escanea un producto' },
  scanSubtitle:           { en: 'Point your camera at any barcode',  es: 'Apunta tu c\u00e1mara a cualquier c\u00f3digo de barras' },
  scanHint:               { en: 'Point at a barcode',                es: 'Apunta al c\u00f3digo de barras' },
  orManual:               { en: 'or enter barcode manually',         es: 'o ingresa el c\u00f3digo manualmente' },
  manualPlaceholder:      { en: 'e.g. 0049000006346',                es: 'ej. 0049000006346' },
  lookUp:                 { en: 'Look Up',                           es: 'Buscar' },
  cameraDenied:           { en: 'Camera access denied. Please allow camera permissions or enter a barcode manually.', es: 'Acceso a c\u00e1mara denegado. Permite los permisos o ingresa un c\u00f3digo manualmente.' },
  cameraFail:             { en: 'Could not access camera. Try entering a barcode manually.', es: 'No se pudo acceder a la c\u00e1mara. Intenta ingresar un c\u00f3digo manualmente.' },

  // Loading
  analyzing:              { en: 'Analyzing product...',              es: 'Analizando producto...' },

  // Results - Score
  scoreWhole:             { en: 'Whole',                             es: 'Natural' },
  scoreQuestionable:      { en: 'Questionable',                      es: 'Cuestionable' },
  scoreSlop:              { en: 'Slop',                              es: 'Porquer\u00eda' },

  // Results - Section titles
  whyThisScore:           { en: 'Why this score',                    es: 'Por qu\u00e9 este puntaje' },
  flaggedIngredients:     { en: 'Flagged Ingredients',               es: 'Ingredientes Se\u00f1alados' },
  sneakyIngredients:      { en: 'Sneaky Ingredients',                es: 'Ingredientes Enga\u00f1osos' },
  sodiumAnalysis:         { en: 'Sodium Analysis',                   es: 'An\u00e1lisis de Sodio' },
  ingredients:            { en: 'Ingredients',                       es: 'Ingredientes' },
  nutritionPer100g:       { en: 'Nutrition (per 100g)',              es: 'Nutrici\u00f3n (por 100g)' },
  wholeFoodAlternatives:  { en: 'Whole Food Alternatives',           es: 'Alternativas Naturales' },
  scanAnother:            { en: 'Scan Another Product',              es: 'Escanear Otro Producto' },

  // Results - Badges & labels
  flag:                   { en: 'Flag',                              es: 'Alerta' },
  sneaky:                 { en: 'Sneaky',                            es: 'Enga\u00f1oso' },
  learnMore:              { en: 'Learn more',                        es: 'Saber m\u00e1s' },
  whyItsSneaky:           { en: "Why it's sneaky",                   es: 'Por qu\u00e9 es enga\u00f1oso' },
  lookForInstead:         { en: 'Look for instead:',                 es: 'Busca en su lugar:' },

  // Results - Concern levels
  lowConcern:             { en: 'Low concern',                       es: 'Baja preocupaci\u00f3n' },
  moderateConcern:        { en: 'Moderate concern',                  es: 'Preocupaci\u00f3n moderada' },
  highConcern:            { en: 'High concern',                      es: 'Alta preocupaci\u00f3n' },

  // Results - Intel
  whyItsUsed:             { en: "Why it's used",                     es: 'Por qu\u00e9 se usa' },
  whyMayConcern:          { en: 'Why it may be concerning',          es: 'Por qu\u00e9 puede preocupar' },
  betterOptions:          { en: 'Better options',                    es: 'Mejores opciones' },
  unknownIngredient:      { en: "We're still learning about this ingredient. As a general rule, fewer processed additives means a cleaner product.", es: 'A\u00fan estamos aprendiendo sobre este ingrediente. Como regla general, menos aditivos procesados significa un producto m\u00e1s limpio.' },

  // Sodium
  sodiumUnavailable:      { en: 'Sodium data unavailable for this item.', es: 'Datos de sodio no disponibles para este producto.' },
  per100g:                { en: 'per 100g',                          es: 'por 100g' },
  ofDailyValue:           { en: 'of Daily Value',                    es: 'del Valor Diario' },
  lowSodium:              { en: 'low',                               es: 'bajo' },
  moderateSodium:         { en: 'moderate',                          es: 'moderado' },
  highSodium:             { en: 'high',                              es: 'alto' },
  sodium:                 { en: 'sodium',                            es: 'sodio' },
  sodiumLowDesc:          { en: 'Low sodium \u2014 140 mg or less per 100g. Generally heart-healthy.', es: 'Sodio bajo \u2014 140 mg o menos por 100g. Generalmente saludable para el coraz\u00f3n.' },
  sodiumModDesc:          { en: 'Moderate sodium \u2014 between 140\u2013600 mg per 100g. Watch total daily intake.', es: 'Sodio moderado \u2014 entre 140\u2013600 mg por 100g. Vigila tu consumo diario total.' },
  sodiumHighDesc:         { en: 'High sodium \u2014 over 600 mg per 100g. May contribute to elevated blood pressure.', es: 'Sodio alto \u2014 m\u00e1s de 600 mg por 100g. Puede contribuir a presi\u00f3n arterial elevada.' },
  sodiumFdaNote:          { en: 'FDA recommended daily limit: 2,300 mg.', es: 'L\u00edmite diario recomendado por la FDA: 2,300 mg.' },

  // Nutrition labels
  calories:               { en: 'Calories',        es: 'Calor\u00edas' },
  fat:                    { en: 'Fat',              es: 'Grasa' },
  satFat:                 { en: 'Sat. Fat',         es: 'Grasa Sat.' },
  carbs:                  { en: 'Carbs',            es: 'Carbohidratos' },
  sugars:                 { en: 'Sugars',           es: 'Az\u00facares' },
  fiber:                  { en: 'Fiber',            es: 'Fibra' },
  protein:                { en: 'Protein',          es: 'Prote\u00edna' },
  sodiumNutrition:        { en: 'Sodium',           es: 'Sodio' },

  // Error titles
  errNotFound:            { en: 'Product Not Found',    es: 'Producto No Encontrado' },
  errInvalidBarcode:      { en: 'Invalid Barcode',      es: 'C\u00f3digo de Barras Inv\u00e1lido' },
  errRateLimited:         { en: 'Too Many Requests',    es: 'Demasiadas Solicitudes' },
  errNetwork:             { en: 'Connection Error',     es: 'Error de Conexi\u00f3n' },
  errServer:              { en: 'Server Error',         es: 'Error del Servidor' },
  errUnknown:             { en: 'Something Went Wrong', es: 'Algo Sali\u00f3 Mal' },

  // Error UI
  searchFallbackLabel:    { en: 'Try searching by product name instead:', es: 'Intenta buscar por nombre del producto:' },
  searchPlaceholder:      { en: 'e.g. Cheerios, Kind Bar...',             es: 'ej. Cheerios, Kind Bar...' },
  search:                 { en: 'Search',             es: 'Buscar' },
  searching:              { en: 'Searching...',        es: 'Buscando...' },
  noResults:              { en: 'No results found. Try a different search term.', es: 'Sin resultados. Intenta con otro t\u00e9rmino.' },
  scanAnotherBtn:         { en: 'Scan Another',        es: 'Escanear Otro' },

  // Toasts
  barcodeDetected:        { en: 'Barcode detected',    es: 'C\u00f3digo detectado' },
  lookingUp:              { en: 'Looking up',           es: 'Buscando' },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => translations[key].en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key][lang];
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
