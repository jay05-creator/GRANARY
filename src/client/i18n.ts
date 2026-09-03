export type Locale = "en" | "hi" | "mr" | "bn" | "ta" | "te" | "kn";

export type LocaleLabel = Record<Locale, string>;

export const localeLabels: LocaleLabel = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
};

/** Minimal UI translations – only keys used in the header / top-level shell. */
export type TranslationKey =
  | "nav.home"
  | "nav.farmerDesk"
  | "nav.warehouse"
  | "nav.loginPortal"
  | "auth.signIn"
  | "auth.logout"
  | "auth.activeUser"
  | "auth.farmerAccount"
  | "auth.warehouseOwner"
  | "header.lots"
  | "header.desk"
  | "header.yard"
  | "error.title"
  | "error.message"
  | "error.refresh"
  | "home.title"
  | "home.subtitle"
  | "home.getStarted"
  | "home.exploreMap"
  | "login.title"
  | "login.subtitle"
  | "login.farmer"
  | "login.operator"
  | "login.selectRole"
  | "login.farmerPrompt"
  | "login.operatorPrompt"
  | "login.continue"
  | "farmer.title"
  | "farmer.myLots"
  | "farmer.addLot"
  | "farmer.noLots"
  | "operator.title"
  | "operator.incoming"
  | "operator.noIncoming"
  | "common.loading"
  | "common.save"
  | "common.cancel"
  | "common.close"
  | "common.search"
  | "common.filter"
  | "common.status"
  | "common.tons"
  | "common.date"
  | "common.name"
  | "common.phone";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.farmerDesk": "Farmer desk",
    "nav.warehouse": "Warehouse",
    "nav.loginPortal": "Login Portal",
    "auth.signIn": "Sign In / Register",
    "auth.logout": "Log Out",
    "auth.activeUser": "Active User",
    "auth.farmerAccount": "Farmer Account",
    "auth.warehouseOwner": "Warehouse Owner",
    "header.lots": "lots",
    "header.desk": "Desk",
    "header.yard": "Yard",
    "error.title": "Something went wrong",
    "error.message":
      "An unexpected error occurred. Please try refreshing the page.",
    "error.refresh": "Refresh Page",
    "home.title": "Granary",
    "home.subtitle":
      "Book cold rooms and dry yards around Nashik. Watch your harvest on a live map.",
    "home.getStarted": "Get Started",
    "home.exploreMap": "Explore Map",
    "login.title": "Welcome Back",
    "login.subtitle": "Choose your role to continue",
    "login.farmer": "Farmer",
    "login.operator": "Warehouse Owner",
    "login.selectRole": "Select your role",
    "login.farmerPrompt": "I want to book storage for my harvest",
    "login.operatorPrompt": "I manage cold rooms and dry yards",
    "login.continue": "Continue",
    "farmer.title": "Farmer Desk",
    "farmer.myLots": "My Lots",
    "farmer.addLot": "Add Lot",
    "farmer.noLots": "No lots yet",
    "operator.title": "Warehouse",
    "operator.incoming": "Incoming Lots",
    "operator.noIncoming": "No incoming lots",
    "common.loading": "Loading…",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.status": "Status",
    "common.tons": "tons",
    "common.date": "Date",
    "common.name": "Name",
    "common.phone": "Phone",
  },
  hi: {
    "nav.home": "होम",
    "nav.farmerDesk": "किसान डेस्क",
    "nav.warehouse": "गोदाम",
    "nav.loginPortal": "लॉगिन पोर्टल",
    "auth.signIn": "साइन इन / रजिस्टर",
    "auth.logout": "लॉग आउट",
    "auth.activeUser": "सक्रिय उपयोगकर्ता",
    "auth.farmerAccount": "किसान खाता",
    "auth.warehouseOwner": "गोदाम मालिक",
    "header.lots": "लॉट",
    "header.desk": "डेस्क",
    "header.yard": "यार्ड",
    "error.title": "कुछ गलत हो गया",
    "error.message":
      "एक अप्रत्याशित त्रुटि हुई। कृपया पृष्ठ को रीफ्रेश करने का प्रयास करें।",
    "error.refresh": "पृष्ठ रीफ्रेश करें",
    "home.title": "ग्रैनरी",
    "home.subtitle":
      "नाशिक के आसपास ठंडे कमरे और सूखे यार्ड बुक करें। लाइव मानचित्र पर अपनी फसल देखें।",
    "home.getStarted": "शुरू करें",
    "home.exploreMap": "मानचित्र देखें",
    "login.title": "वापस स्वागत है",
    "login.subtitle": "जारी रखने के लिए अपनी भूमिका चुनें",
    "login.farmer": "किसान",
    "login.operator": "गोदाम मालिक",
    "login.selectRole": "अपनी भूमिका चुनें",
    "login.farmerPrompt": "मैं अपनी फसल के लिए भंडारण बुक करना चाहता हूँ",
    "login.operatorPrompt": "मैं ठंडे कमरे और सूखे यार्ड प्रबंधित करता हूँ",
    "login.continue": "जारी रखें",
    "farmer.title": "किसान डेस्क",
    "farmer.myLots": "मेरे लॉट",
    "farmer.addLot": "लॉट जोड़ें",
    "farmer.noLots": "अभी तक कोई लॉट नहीं",
    "operator.title": "गोदाम",
    "operator.incoming": "आने वाले लॉट",
    "operator.noIncoming": "कोई आने वाला लॉट नहीं",
    "common.loading": "लोड हो रहा है…",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.close": "बंद करें",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.status": "स्थिति",
    "common.tons": "टन",
    "common.date": "तारीख़",
    "common.name": "नाम",
    "common.phone": "फ़ोन",
  },
  mr: {
    "nav.home": "होम",
    "nav.farmerDesk": "शेतकरी डेस्क",
    "nav.warehouse": "गोदाम",
    "nav.loginPortal": "लॉगिन पोर्टल",
    "auth.signIn": "साइन इन / रजिस्टर",
    "auth.logout": "लॉग आउट",
    "auth.activeUser": "सक्रिय वापरकर्ता",
    "auth.farmerAccount": "शेतकरी खाते",
    "auth.warehouseOwner": "गोदाम मालक",
    "header.lots": "लॉट",
    "header.desk": "डेस्क",
    "header.yard": "यार्ड",
    "error.title": "काहीतरी चूक झाली",
    "error.message":
      "अनपेक्षित त्रुटी आली. कृपया पृष्ठ रीफ्रेश करण्याचा प्रयत्न करा.",
    "error.refresh": "पृष्ठ रीफ्रेश करा",
    "home.title": "ग्रॅनरी",
    "home.subtitle":
      "नाशिक भोवती थंड खोल्या आणि कोरडे यार्ड बुक करा. लाइव्ह नकाशावर तुमचे पिक पहा.",
    "home.getStarted": "सुरू करा",
    "home.exploreMap": "नकाशा पहा",
    "login.title": "पुन्हा स्वागत आहे",
    "login.subtitle": "सुरू ठेवण्यासाठी तुमची भूमिका निवडा",
    "login.farmer": "शेतकरी",
    "login.operator": "गोदाम मालक",
    "login.selectRole": "तुमची भूमिका निवडा",
    "login.farmerPrompt": "मी माझ्या पिकांसाठी साठा बुक करू इच्छितो",
    "login.operatorPrompt": "मी थंड खोल्या आणि कोरडे यार्ड व्यवस्थापित करतो",
    "login.continue": "सुरू ठेवा",
    "farmer.title": "शेतकरी डेस्क",
    "farmer.myLots": "माझे लॉट",
    "farmer.addLot": "लॉट जोडा",
    "farmer.noLots": "अजून कोणतेही लॉट नाहीत",
    "operator.title": "गोदाम",
    "operator.incoming": "येणाऱ्या लॉट",
    "operator.noIncoming": "कोणतेही येणारे लॉट नाहीत",
    "common.loading": "लोड होत आहे…",
    "common.save": "जतन करा",
    "common.cancel": "रद्द करा",
    "common.close": "बंद करा",
    "common.search": "शोधा",
    "common.filter": "फिल्टर",
    "common.status": "स्थिती",
    "common.tons": "टन",
    "common.date": "तारीख",
    "common.name": "नाव",
    "common.phone": "फोन",
  },
  bn: {
    "nav.home": "হোম",
    "nav.farmerDesk": "কৃষক ডেস্ক",
    "nav.warehouse": "গুদাম",
    "nav.loginPortal": "লগইন পোর্টাল",
    "auth.signIn": "সাইন ইন / নিবন্ধন",
    "auth.logout": "লগ আউট",
    "auth.activeUser": "সক্রিয় ব্যবহারকারী",
    "auth.farmerAccount": "কৃষক অ্যাকাউন্ট",
    "auth.warehouseOwner": "গুদাম মালিক",
    "header.lots": "লট",
    "header.desk": "ডেস্ক",
    "header.yard": "ইয়ার্ড",
    "error.title": "কিছু ভুল হয়েছে",
    "error.message":
      "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পৃষ্ঠা রিফ্রেশ করার চেষ্টা করুন।",
    "error.refresh": "পৃষ্ঠা রিফ্রেশ করুন",
    "home.title": "গ্রানারি",
    "home.subtitle":
      "নাশিকের চারপাশে ঠান্ডা ঘর এবং শুকনো ইয়ার্ড বুক করুন। লাইভ মানচিত্রে আপনার ফসল দেখুন।",
    "home.getStarted": "শুরু করুন",
    "home.exploreMap": "মানচিত্র দেখুন",
    "login.title": "আবার স্বাগতম",
    "login.subtitle": "চালিয়ে যেতে আপনার ভূমিকা বেছে নিন",
    "login.farmer": "কৃষক",
    "login.operator": "গুদাম মালিক",
    "login.selectRole": "আপনার ভূমিকা নির্বাচন করুন",
    "login.farmerPrompt": "আমি আমার ফসলের জন্য স্টোরেজ বুক করতে চাই",
    "login.operatorPrompt": "আমি ঠান্ডা ঘর এবং শুকনো ইয়ার্ড পরিচালনা করি",
    "login.continue": "চালিয়ে যান",
    "farmer.title": "কৃষক ডেস্ক",
    "farmer.myLots": "আমার লট",
    "farmer.addLot": "লট যোগ করুন",
    "farmer.noLots": "এখনো কোনো লট নেই",
    "operator.title": "গুদাম",
    "operator.incoming": "আসন্ন লট",
    "operator.noIncoming": "কোনো আসন্ন লট নেই",
    "common.loading": "লোড হচ্ছে…",
    "common.save": "সংরক্ষণ করুন",
    "common.cancel": "বাতিল করুন",
    "common.close": "বন্ধ করুন",
    "common.search": "অনুসন্ধান",
    "common.filter": "ফিল্টার",
    "common.status": "অবস্থা",
    "common.tons": "টন",
    "common.date": "তারিখ",
    "common.name": "নাম",
    "common.phone": "ফোন",
  },
  ta: {
    "nav.home": "முகப்பு",
    "nav.farmerDesk": "விவசாயி டெஸ்க்",
    "nav.warehouse": "கிடங்கு",
    "nav.loginPortal": "உள்நுழைவு போர்டல்",
    "auth.signIn": "உள்நுழை / பதிவு செய்",
    "auth.logout": "வெளியேறு",
    "auth.activeUser": "செயலில் உள்ள பயனர்",
    "auth.farmerAccount": "விவசாயி கணக்கு",
    "auth.warehouseOwner": "கிடங்கு உரிமையாளர்",
    "header.lots": "லாட்கள்",
    "header.desk": "டெஸ்க்",
    "header.yard": "யார்டு",
    "error.title": "ஏதோ தவறு நடந்தது",
    "error.message":
      "எதிர்பாராத பிழை ஏற்பட்டது. பக்கத்தைப் புதுப்பிக்க முயற்சிக்கவும்.",
    "error.refresh": "பக்கத்தைப் புதுப்பி",
    "home.title": "கிரானரி",
    "home.subtitle":
      "நாசிக் சுற்றுப்புறத்தில் குளிர்சாதன அறைகள் மற்றும் உலர் யார்டுகளை முன்பதிவு செய்யுங்கள். நேரடி வரைபடத்தில் உங்கள் அறுவடையைப் பாருங்கள்.",
    "home.getStarted": "தொடங்குங்கள்",
    "home.exploreMap": "வரைபடம் பார்க்க",
    "login.title": "மீண்டும் வரவேற்கிறோம்",
    "login.subtitle": "தொடர உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
    "login.farmer": "விவசாயி",
    "login.operator": "கிடங்கு உரிமையாளர்",
    "login.selectRole": "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
    "login.farmerPrompt": "என் அறுவடைக்கு சேமிப்பிடம் முன்பதிவு செய்ய விரும்புகிறேன்",
    "login.operatorPrompt": "நான் குளிர்சாதன அறைகள் மற்றும் உலர் யார்டுகளை நிர்வகிக்கிறேன்",
    "login.continue": "தொடரவும்",
    "farmer.title": "விவசாயி டெஸ்க்",
    "farmer.myLots": "என் லாட்கள்",
    "farmer.addLot": "லாட் சேர்",
    "farmer.noLots": "இன்னும் லாட்கள் இல்லை",
    "operator.title": "கிடங்கு",
    "operator.incoming": "வரும் லாட்கள்",
    "operator.noIncoming": "வரும் லாட்கள் இல்லை",
    "common.loading": "ஏற்றுகிறது…",
    "common.save": "சேமி",
    "common.cancel": "ரத்து செய்",
    "common.close": "மூடு",
    "common.search": "தேடு",
    "common.filter": "வடிகட்டு",
    "common.status": "நிலை",
    "common.tons": "டன்",
    "common.date": "தேதி",
    "common.name": "பெயர்",
    "common.phone": "தொலைபேசி",
  },
  te: {
    "nav.home": "హోమ్",
    "nav.farmerDesk": "రైతు డెస్క్",
    "nav.warehouse": "గోదాం",
    "nav.loginPortal": "లాగిన్ పోర్టల్",
    "auth.signIn": "సైన్ ఇన్ / రిజిస్టర్",
    "auth.logout": "లాగ్ అవుట్",
    "auth.activeUser": "యాక్టివ్ యూజర్",
    "auth.farmerAccount": "రైతు ఖాతా",
    "auth.warehouseOwner": "గోదాం యజమాని",
    "header.lots": "లాట్లు",
    "header.desk": "డెస్క్",
    "header.yard": "యార్డ్",
    "error.title": "ఏదో తప్పు జరిగింది",
    "error.message":
      "అనూహ్యమైన లోపం సంభవించింది. దయచేసి పేజీని రీఫ్రెష్ చేయండి.",
    "error.refresh": "పేజీ రీఫ్రెష్ చేయండి",
    "home.title": "గ్రానరీ",
    "home.subtitle":
      "నాసిక్ చుట్టూ ఉన్న చల్లని గదులు మరియు ఎండిన యార్డులను బుక్ చేయండి. లైవ్ మ్యాప్‌లో మీ పంటను చూడండి.",
    "home.getStarted": "ప్రారంభించండి",
    "home.exploreMap": "మ్యాప్ అన్వేషించండి",
    "login.title": "తిరిగి స్వాగతం",
    "login.subtitle": "కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి",
    "login.farmer": "రైతు",
    "login.operator": "గోదాం యజమాని",
    "login.selectRole": "మీ పాత్రను ఎంచుకోండి",
    "login.farmerPrompt": "నా పంట కోసం నిల్వ బుక్ చేయాలనుకుంటున్నాను",
    "login.operatorPrompt": "నేను చల్లని గదులు మరియు ఎండిన యార్డులను నిర్వహిస్తాను",
    "login.continue": "కొనసాగించండి",
    "farmer.title": "రైతు డెస్క్",
    "farmer.myLots": "నా లాట్లు",
    "farmer.addLot": "లాట్ జోడించండి",
    "farmer.noLots": "ఇంకా లాట్లు లేవు",
    "operator.title": "గోదాం",
    "operator.incoming": "రాబోయే లాట్లు",
    "operator.noIncoming": "రాబోయే లాట్లు లేవు",
    "common.loading": "లోడ్ అవుతోంది…",
    "common.save": "సేవ్ చేయండి",
    "common.cancel": "రద్దు చేయండి",
    "common.close": "మూసివేయండి",
    "common.search": "శోధించండి",
    "common.filter": "ఫిల్టర్",
    "common.status": "స్థితి",
    "common.tons": "టన్నులు",
    "common.date": "తేదీ",
    "common.name": "పేరు",
    "common.phone": "ఫోన్",
  },
  kn: {
    "nav.home": "ಹೋಮ್",
    "nav.farmerDesk": "ರೈತ ಡೆಸ್ಕ್",
    "nav.warehouse": "ಗೋದಾಮ್",
    "nav.loginPortal": "ಲಾಗಿನ್ ಪೋರ್ಟಲ್",
    "auth.signIn": "ಸೈನ್ ಇನ್ / ನೋಂದಾಯಿಸಿ",
    "auth.logout": "ಲಾಗ್ ಔಟ್",
    "auth.activeUser": "ಸಕ್ರಿಯ ಬಳಕೆದಾರ",
    "auth.farmerAccount": "ರೈತ ಖಾತೆ",
    "auth.warehouseOwner": "ಗೋದಾಮ್ ಮಾಲೀಕ",
    "header.lots": "ಲಾಟ್‌ಗಳು",
    "header.desk": "ಡೆಸ್ಕ್",
    "header.yard": "ಯಾರ್ಡ್",
    "error.title": "ಏನೋ ತಪ್ಪಾಗಿದೆ",
    "error.message":
      "ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ರೀಫ್ರೆಶ್ ಮಾಡಿ.",
    "error.refresh": "ಪುಟ ರೀಫ್ರೆಶ್ ಮಾಡಿ",
    "home.title": "ಗ್ರಾನರಿ",
    "home.subtitle":
      "ನಾಸಿಕ್ ಸುತ್ತಮುತ್ತಲಿನ ಚಳಿ ಕೊಠಡಿಗಳು ಮತ್ತು ಒಣ ಯಾರ್ಡ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಿ. ಲೈವ್ ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ನೋಡಿ.",
    "home.getStarted": "ಪ್ರಾರಂಭಿಸಿ",
    "home.exploreMap": "ನಕ್ಷೆ ನೋಡಿ",
    "login.title": "ಮರಳಿ ಸ್ವಾಗತ",
    "login.subtitle": "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "login.farmer": "ರೈತ",
    "login.operator": "ಗೋದಾಮ್ ಮಾಲೀಕ",
    "login.selectRole": "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "login.farmerPrompt": "ನನ್ನ ಬೆಳೆಗೆ ಸಂಗ್ರಹಣೆ ಬುಕ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ",
    "login.operatorPrompt": "ನಾನು ಚಳಿ ಕೊಠಡಿಗಳು ಮತ್ತು ಒಣ ಯಾರ್ಡ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತೇನೆ",
    "login.continue": "ಮುಂದುವರಿಸಿ",
    "farmer.title": "ರೈತ ಡೆಸ್ಕ್",
    "farmer.myLots": "ನನ್ನ ಲಾಟ್‌ಗಳು",
    "farmer.addLot": "ಲಾಟ್ ಸೇರಿಸಿ",
    "farmer.noLots": "ಇನ್ನೂ ಲಾಟ್‌ಗಳು ಇಲ್ಲ",
    "operator.title": "ಗೋದಾಮ್",
    "operator.incoming": "ಬರುತ್ತಿರುವ ಲಾಟ್‌ಗಳು",
    "operator.noIncoming": "ಬರುತ್ತಿರುವ ಲಾಟ್‌ಗಳು ಇಲ್ಲ",
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
    "common.save": "ಉಳಿಸಿ",
    "common.cancel": "ರದ್ದುಮಾಡಿ",
    "common.close": "ಮುಚ್ಚಿ",
    "common.search": "ಹುಡುಕಿ",
    "common.filter": "ಫಿಲ್ಟರ್",
    "common.status": "ಸ್ಥಿತಿ",
    "common.tons": "ಟನ್",
    "common.date": "ದಿನಾಂಕ",
    "common.name": "ಹೆಸರು",
    "common.phone": "ಫೋನ್",
  },
};

/** Resolve a translation key for the given locale, falling back to English. */
export function t(key: TranslationKey, locale: Locale): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
