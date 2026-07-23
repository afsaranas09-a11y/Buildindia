export type LangCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'ur';

export const LANGUAGES: { code: LangCode; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو' },
];

export type TranslationKey =
  | 'appName' | 'tagline' | 'selectLanguage' | 'continue' | 'chooseRole'
  | 'customerMode' | 'professionalMode' | 'customerDesc' | 'professionalDesc'
  | 'searchPlaceholder' | 'search' | 'allCategories' | 'availableNow'
  | 'experience' | 'yearsExp' | 'startingFrom' | 'ratings' | 'rating'
  | 'callNow' | 'bookNow' | 'viewProfile' | 'workPhotos' | 'reviews'
  | 'noResults' | 'loading' | 'bookService' | 'yourName' | 'yourPhone'
  | 'serviceNeeded' | 'yourAddress' | 'pincode' | 'preferredDate' | 'notes'
  | 'submitBooking' | 'bookingSuccess' | 'close' | 'nearbyProfessionals'
  | 'filterByCategory' | 'sortRating' | 'sortPrice' | 'sortExperience'
  | 'registerAsPro' | 'proName' | 'proPhone' | 'proCategory' | 'proExperience'
  | 'proBio' | 'proCity' | 'proArea' | 'proPincode' | 'proStartingPrice'
  | 'register' | 'registrationSuccess' | 'myLeads' | 'noLeads' | 'leads'
  | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'status' | 'confirm'
  | 'markComplete' | 'cancel' | 'available' | 'unavailable' | 'toggleAvailability'
  | 'back' | 'home' | 'logout' | 'switchMode' | 'addWorkPhoto' | 'photoUrl'
  | 'photoCaption' | 'addPhoto' | 'noPhotos' | 'reviewerName' | 'yourRating'
  | 'yourReview' | 'submitReview' | 'reviewSuccess' | 'verified' | 'pro'
  | 'customer' | 'bookings' | 'profile' | 'editProfile' | 'save' | 'cancelBtn'
  | 'enterPincode' | 'enterCity' | 'enterArea' | 'allAreas' | 'contact' | 'about'
  | 'locationPrompt' | 'useMyLocation' | 'searchingIn' | 'resultsFound';

export type Translations = Record<TranslationKey, string>;
