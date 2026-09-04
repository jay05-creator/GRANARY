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
  | "common.phone"
  | "error.404"
  | "error.404desc"
  | "error.returnFarmer"
  | "error.returnOperator"
  | "home.badge"
  | "home.heroDesc"
  | "home.accessPortal"
  | "home.registerUser"
  | "home.registeredYards"
  | "home.peakCapacity"
  | "home.liveMapSync"
  | "home.whatItDoes"
  | "home.whatItDoesDesc"
  | "home.forFarmers"
  | "home.forFarmersDesc"
  | "home.farmerFeature1"
  | "home.farmerFeature2"
  | "home.farmerFeature3"
  | "home.forOperators"
  | "home.forOperatorsDesc"
  | "home.operatorFeature1"
  | "home.operatorFeature2"
  | "home.operatorFeature3"
  | "home.activeYards"
  | "home.activeYardsDesc"
  | "home.ready"
  | "home.readyDesc"
  | "home.goToLogin"
  | "common.cap"
  | "login.loginTitle"
  | "login.registerTitle"
  | "login.loginDesc"
  | "login.registerDesc"
  | "login.signInBtn"
  | "login.newUserBtn"
  | "login.accCreds"
  | "login.phonePlaceholder"
  | "login.password"
  | "login.registerNewUser"
  | "login.registerNewUserDesc"
  | "login.selectAccRole"
  | "login.iAmFarmer"
  | "login.iAmOperator"
  | "login.fullName"
  | "login.namePlaceholder"
  | "login.phoneNumber"
  | "farmer.bookStorage"
  | "farmer.activeLots"
  | "farmer.inStorage"
  | "farmer.yardsOpen"
  | "farmer.myHarvestLots"
  | "farmer.harvestLotsDesc"
  | "farmer.addNewLot"
  | "operator.warehouseSections"
  | "operator.warehouseSectionsDesc"
  | "operator.storedLots"
  | "operator.openStorage"
  | "operator.incomingRequests";

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
    "error.404": "404 - Page Not Found",
    "error.404desc": "The requested URL was not found or is restricted while logged in.",
    "error.returnFarmer": "Return to Farmer Desk",
    "error.returnOperator": "Return to Warehouse Desk",
    "home.badge": "Nashik & Niphad Harvest Belt Storage Network",
    "home.heroDesc": "Granary is a real-time digital agricultural storage network. It connects grape, onion, and perishable crop growers across Nashik with verified cold rooms, dry yards, and packhouse facilities.",
    "home.accessPortal": "Access Portal / Sign In",
    "home.registerUser": "Register New User",
    "home.registeredYards": "Registered Yards",
    "home.peakCapacity": "Peak Capacity",
    "home.liveMapSync": "Live Map Sync",
    "home.whatItDoes": "What Granary Does",
    "home.whatItDoesDesc": "An end-to-end digital infrastructure designed specifically for agricultural storage management.",
    "home.forFarmers": "For Farmers & Growers",
    "home.forFarmersDesc": "Find available storage space around Nashik before leaving the farm. Book cold rooms or dry yards by crop, tonnage, and days, and track stored lots directly on the interactive map until market prices improve.",
    "home.farmerFeature1": "Live color-coded map pins showing empty, full, and reserved bays.",
    "home.farmerFeature2": "Instant online booking against live remaining capacity.",
    "home.farmerFeature3": "Release stored harvest lots with one click when selling.",
    "home.forOperators": "For Warehouse Owners & Operators",
    "home.forOperatorsDesc": "Maximize yard utilization by listing open storage space with custom daily rental rates (₹/ton/day) and location details. Monitor network fill and active incoming lots across all your warehouse units.",
    "home.operatorFeature1": "Publish available storage space specifying rate, location, and space.",
    "home.operatorFeature2": "Green-shaded dashboard hierarchy for yards, occupancy, and fill %.",
    "home.operatorFeature3": "Role-restricted secure access for warehouse management.",
    "home.activeYards": "Active Storage Yards on the Belt",
    "home.activeYardsDesc": "Explore verified cold storages, dry yards, and packhouses currently listed on the Granary network.",
    "home.ready": "Ready to manage your harvest storage?",
    "home.readyDesc": "Sign in or register a new user account as a Farmer or Warehouse Owner to access your dashboard.",
    "home.goToLogin": "Go to Login & Registration Portal",
    "common.cap": "cap",
    "login.loginTitle": "Log in to your desk",
    "login.registerTitle": "Create a new account",
    "login.loginDesc": "Select your profile to manage your harvest storage or warehouse capacity.",
    "login.registerDesc": "Register using your phone number, password, and required warehouse accreditation docs.",
    "login.signInBtn": "Sign In",
    "login.newUserBtn": "New User",
    "login.accCreds": "Account credentials",
    "login.phonePlaceholder": "Phone number (e.g. 9823012345)",
    "login.password": "Password",
    "login.registerNewUser": "Register New User Account",
    "login.registerNewUserDesc": "Create your account with mobile phone number, password, role, and verification docs.",
    "login.selectAccRole": "Select Account Role",
    "login.iAmFarmer": "I am a Farmer",
    "login.iAmOperator": "I am a Warehouse Owner",
    "login.fullName": "Full Name",
    "login.namePlaceholder": "e.g. Dnyaneshwar Shinde",
    "login.phoneNumber": "Phone Number",
    "farmer.bookStorage": "Book Storage",
    "farmer.activeLots": "Active lots",
    "farmer.inStorage": "In storage",
    "farmer.yardsOpen": "Yards open",
    "farmer.myHarvestLots": "My Harvest Lots",
    "farmer.harvestLotsDesc": "Manage your stored crops and active storage bookings.",
    "farmer.addNewLot": "Add New Lot",
    "operator.warehouseSections": "WAREHOUSE SECTIONS",
    "operator.warehouseSectionsDesc": "Manage your cold rooms, dry yards, and packhouses.",
    "operator.storedLots": "Stored harvest lots",
    "operator.openStorage": "Open storage ready to list",
    "operator.incomingRequests": "Incoming Bookings"
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
    "error.404": "404 - पृष्ठ नहीं मिला",
    "error.404desc": "अनुरोधित URL नहीं मिला या लॉग इन होने पर प्रतिबंधित है।",
    "error.returnFarmer": "किसान डेस्क पर लौटें",
    "error.returnOperator": "गोदाम डेस्क पर लौटें",
    "home.badge": "नासिक और निफाड फसल बेल्ट भंडारण नेटवर्क",
    "home.heroDesc": "ग्रैनरी एक रीयल-टाइम डिजिटल कृषि भंडारण नेटवर्क है। यह नासिक भर में अंगूर, प्याज और खराब होने वाली फसल के उत्पादकों को सत्यापित कोल्ड रूम, ड्राई यार्ड और पैकहाउस सुविधाओं से जोड़ता है।",
    "home.accessPortal": "पोर्टल एक्सेस करें / साइन इन करें",
    "home.registerUser": "नया उपयोगकर्ता पंजीकृत करें",
    "home.registeredYards": "पंजीकृत यार्ड",
    "home.peakCapacity": "चरम क्षमता",
    "home.liveMapSync": "लाइव मैप सिंक",
    "home.whatItDoes": "ग्रैनरी क्या करता है",
    "home.whatItDoesDesc": "विशेष रूप से कृषि भंडारण प्रबंधन के लिए डिज़ाइन किया गया एक एंड-टू-एंड डिजिटल बुनियादी ढांचा।",
    "home.forFarmers": "किसानों और उत्पादकों के लिए",
    "home.forFarmersDesc": "खेत छोड़ने से पहले नासिक के आसपास उपलब्ध भंडारण स्थान खोजें। फसल, टन भार और दिनों के हिसाब से कोल्ड रूम या ड्राई यार्ड बुक करें, और बाजार की कीमतें सुधरने तक सीधे इंटरेक्टिव मैप पर संग्रहीत लॉट को ट्रैक करें।",
    "home.farmerFeature1": "खाली, भरे हुए और आरक्षित बे दिखाने वाले लाइव रंग-कोडित मैप पिन।",
    "home.farmerFeature2": "लाइव शेष क्षमता के खिलाफ तत्काल ऑनलाइन बुकिंग।",
    "home.farmerFeature3": "बिक्री करते समय एक क्लिक के साथ संग्रहीत फसल लॉट जारी करें।",
    "home.forOperators": "गोदाम मालिकों और ऑपरेटरों के लिए",
    "home.forOperatorsDesc": "कस्टम दैनिक किराये की दरों (₹/टन/दिन) और स्थान विवरण के साथ खुली भंडारण स्थान सूचीबद्ध करके यार्ड उपयोग को अधिकतम करें। अपनी सभी गोदाम इकाइयों में नेटवर्क भरने और सक्रिय आने वाले लॉट की निगरानी करें।",
    "home.operatorFeature1": "दर, स्थान और स्थान निर्दिष्ट करते हुए उपलब्ध भंडारण स्थान प्रकाशित करें।",
    "home.operatorFeature2": "यार्ड, अधिभोग और भरण % के लिए हरे रंग की छाया वाली डैशबोर्ड पदानुक्रम।",
    "home.operatorFeature3": "गोदाम प्रबंधन के लिए भूमिका-प्रतिबंधित सुरक्षित पहुंच।",
    "home.activeYards": "बेल्ट पर सक्रिय भंडारण यार्ड",
    "home.activeYardsDesc": "वर्तमान में ग्रैनरी नेटवर्क पर सूचीबद्ध सत्यापित कोल्ड स्टोरेज, ड्राई यार्ड और पैकहाउस का अन्वेषण करें।",
    "home.ready": "क्या आप अपनी फसल के भंडारण का प्रबंधन करने के लिए तैयार हैं?",
    "home.readyDesc": "अपने डैशबोर्ड तक पहुंचने के लिए किसान या गोदाम मालिक के रूप में साइन इन करें या नया उपयोगकर्ता खाता पंजीकृत करें।",
    "home.goToLogin": "लॉगिन और पंजीकरण पोर्टल पर जाएं",
    "common.cap": "क्षमता",
    "login.loginTitle": "अपने डेस्क पर लॉग इन करें",
    "login.registerTitle": "एक नया खाता बनाएँ",
    "login.loginDesc": "अपनी फसल भंडारण या गोदाम क्षमता का प्रबंधन करने के लिए अपनी प्रोफ़ाइल चुनें।",
    "login.registerDesc": "अपने फोन नंबर, पासवर्ड और आवश्यक गोदाम मान्यता दस्तावेजों का उपयोग करके पंजीकरण करें।",
    "login.signInBtn": "साइन इन करें",
    "login.newUserBtn": "नया उपयोगकर्ता",
    "login.accCreds": "खाता क्रेडेंशियल",
    "login.phonePlaceholder": "फोन नंबर (उदा. 9823012345)",
    "login.password": "पासवर्ड",
    "login.registerNewUser": "नया उपयोगकर्ता खाता पंजीकृत करें",
    "login.registerNewUserDesc": "मोबाइल फोन नंबर, पासवर्ड, भूमिका और सत्यापन दस्तावेजों के साथ अपना खाता बनाएं।",
    "login.selectAccRole": "खाता भूमिका चुनें",
    "login.iAmFarmer": "मैं एक किसान हूँ",
    "login.iAmOperator": "मैं एक गोदाम मालिक हूँ",
    "login.fullName": "पूरा नाम",
    "login.namePlaceholder": "उदा. ज्ञानेश्वर शिंदे",
    "login.phoneNumber": "फ़ोन नंबर",
    "farmer.bookStorage": "भंडारण बुक करें",
    "farmer.activeLots": "सक्रिय लॉट",
    "farmer.inStorage": "भंडारण में",
    "farmer.yardsOpen": "यार्ड खुले हैं",
    "farmer.myHarvestLots": "मेरे फसल लॉट",
    "farmer.harvestLotsDesc": "अपनी संग्रहीत फसलों और सक्रिय भंडारण बुकिंग का प्रबंधन करें।",
    "farmer.addNewLot": "नया लॉट जोड़ें",
    "operator.warehouseSections": "गोदाम अनुभाग",
    "operator.warehouseSectionsDesc": "अपने कोल्ड रूम, ड्राई यार्ड और पैकहाउस का प्रबंधन करें।",
    "operator.storedLots": "संग्रहीत फसल लॉट",
    "operator.openStorage": "सूचीबद्ध करने के लिए तैयार खुला भंडारण",
    "operator.incomingRequests": "आने वाली बुकिंग"
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
    "error.404": "४०४ - पृष्ठ आढळले नाही",
    "error.404desc": "विनंती केलेली URL आढळली नाही किंवा लॉग इन असताना प्रतिबंधित आहे.",
    "error.returnFarmer": "शेतकरी डेस्कवर परत जा",
    "error.returnOperator": "गोदाम डेस्कवर परत जा",
    "home.badge": "नाशिक आणि निफाड पीक बेल्ट साठवण नेटवर्क",
    "home.heroDesc": "ग्रॅनरी हे रिअल-टाइम डिजिटल कृषी साठवण नेटवर्क आहे. हे नाशिकमधील द्राक्ष, कांदा आणि नाशवंत पीक उत्पादकांना सत्यापित कोल्ड रूम, ड्राय यार्ड आणि पॅकहाऊस सुविधांशी जोडते.",
    "home.accessPortal": "पोर्टलमध्ये प्रवेश करा / साइन আসতে करा",
    "home.registerUser": "नवीन वापरकर्ता नोंदणी करा",
    "home.registeredYards": "नोंदणीकृत यार्ड",
    "home.peakCapacity": "कमाल क्षमता",
    "home.liveMapSync": "लाइव्ह मॅप सिंक",
    "home.whatItDoes": "ग्रॅनरी काय करते",
    "home.whatItDoesDesc": "विशेषतः कृषी साठवण व्यवस्थापनासाठी डिझाइन केलेली एंड-टू-एंड डिजिटल पायाभूत सुविधा.",
    "home.forFarmers": "शेतकरी आणि उत्पादकांसाठी",
    "home.forFarmersDesc": "शेत सोडण्यापूर्वी नाशिकच्या आसपास उपलब्ध साठवण जागा शोधा. पीक, टन आणि दिवसांनुसार कोल्ड रूम किंवा ड्राय यार्ड बुक करा आणि बाजारातील किंमती सुधारेपर्यंत थेट परस्परसंवादी नकाशावर साठवलेल्या लॉटचा मागोवा घ्या.",
    "home.farmerFeature1": "रिकामे, भरलेले आणि राखीव बे दर्शविणारे लाइव्ह कलर-कोडेड मॅप पिन.",
    "home.farmerFeature2": "लाइव्ह उर्वरित क्षमतेवर त्वरित ऑनलाइन बुकिंग.",
    "home.farmerFeature3": "विक्री करताना एका क्लिकवर साठवलेले पीक लॉट सोडा.",
    "home.forOperators": "गोदाम मालक आणि ऑपरेटरसाठी",
    "home.forOperatorsDesc": "सानुकूल दैनिक भाडे दर (₹/टन/दिवस) आणि स्थान तपशीलांसह खुली साठवण जागा सूचीबद्ध करून यार्डचा वापर जास्तीत जास्त करा. तुमच्या सर्व गोदाम युनिट्समध्ये नेटवर्क भरणे आणि सक्रिय येणारे लॉट निरीक्षण करा.",
    "home.operatorFeature1": "दर, स्थान आणि जागा निर्दिष्ट करून उपलब्ध साठवण जागा प्रकाशित करा.",
    "home.operatorFeature2": "यार्ड, वहिवाट आणि भरणे % साठी हिरव्या-सावलीची डॅशबोर्ड पदानुक्रम.",
    "home.operatorFeature3": "गोदाम व्यवस्थापनासाठी भूमिका-प्रतिबंधित सुरक्षित प्रवेश.",
    "home.activeYards": "बेल्टवरील सक्रिय साठवण यार्ड",
    "home.activeYardsDesc": "सध्या ग्रॅनरी नेटवर्कवर सूचीबद्ध केलेले सत्यापित कोल्ड स्टोरेज, ड्राय यार्ड आणि पॅकहाऊस एक्सप्लोर करा.",
    "home.ready": "तुम्ही तुमच्या पिकाचे साठवण व्यवस्थापित करण्यास तयार आहात का?",
    "home.readyDesc": "तुमच्या डॅशबोर्डमध्ये प्रवेश करण्यासाठी शेतकरी किंवा गोदाम मालक म्हणून साइन इन करा किंवा नवीन वापरकर्ता खात्याची नोंदणी करा.",
    "home.goToLogin": "लॉगिन आणि नोंदणी पोर्टलवर जा",
    "common.cap": "क्षमता",
    "login.loginTitle": "तुमच्या डेस्कवर लॉग इन करा",
    "login.registerTitle": "नवीन खाते तयार करा",
    "login.loginDesc": "तुमचा पीक साठा किंवा गोदाम क्षमता व्यवस्थापित करण्यासाठी तुमचे प्रोफाइल निवडा.",
    "login.registerDesc": "तुमचा फोन नंबर, पासवर्ड आणि आवश्यक गोदाम मान्यता कागदपत्रे वापरून नोंदणी करा.",
    "login.signInBtn": "साइन इन करा",
    "login.newUserBtn": "नवीन वापरकर्ता",
    "login.accCreds": "खाते प्रमाणपत्रे",
    "login.phonePlaceholder": "फोन नंबर (उदा. 9823012345)",
    "login.password": "पासवर्ड",
    "login.registerNewUser": "नवीन वापरकर्ता खाते नोंदणी करा",
    "login.registerNewUserDesc": "मोबाइल फोन नंबर, पासवर्ड, भूमिका आणि पडताळणी कागदपत्रांसह तुमचे खाते तयार करा.",
    "login.selectAccRole": "खात्याची भूमिका निवडा",
    "login.iAmFarmer": "मी एक शेतकरी आहे",
    "login.iAmOperator": "मी गोदाम मालक आहे",
    "login.fullName": "पूर्ण नाव",
    "login.namePlaceholder": "उदा. ज्ञानेश्वर शिंदे",
    "login.phoneNumber": "फोन नंबर",
    "farmer.bookStorage": "साठा बुक करा",
    "farmer.activeLots": "सक्रिय लॉट",
    "farmer.inStorage": "साठवणीत",
    "farmer.yardsOpen": "यार्ड खुले आहेत",
    "farmer.myHarvestLots": "माझे पीक लॉट",
    "farmer.harvestLotsDesc": "तुमची साठवलेली पिके आणि सक्रिय साठवण बुकिंग व्यवस्थापित करा.",
    "farmer.addNewLot": "नवीन लॉट जोडा",
    "operator.warehouseSections": "गोदाम विभाग",
    "operator.warehouseSectionsDesc": "तुमच्या कोल्ड रूम, ड्राय यार्ड आणि पॅकहाऊस व्यवस्थापित करा.",
    "operator.storedLots": "साठवलेले पीक लॉट",
    "operator.openStorage": "सूचीबद्ध करण्यासाठी तयार खुले साठवण",
    "operator.incomingRequests": "येणारे बुकिंग"
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
