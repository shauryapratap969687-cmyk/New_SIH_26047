import { HOSPITAL_CONFIG, deptLocation, SYSTEM_WAIT_ESTIMATE } from '../config/hospitalConfig';

export type ChatCategory =
  | 'navigation'
  | 'terms'
  | 'process'
  | 'documents'
  | 'wellness'
  | 'emergency'
  | 'appointment'
  | 'diet'
  | 'greeting'
  | 'unknown';

export interface ChatEntry {
  id: string;
  category: ChatCategory;
  keywords: string[];          // English keywords to match
  hindiKeywords?: string[];    // Hindi keywords
  response: {
    en: string;
    hi: string;
    ta: string;
    bn: string;
  };
  followUpChips?: string[];    // Suggested follow-up questions (English)
  icon?: string;
}

export interface QuickChip {
  label: string;
  query: string;
  icon: string;
  category: ChatCategory;
}

// ─────────────────────────────────────────────
// KNOWLEDGE BASE
// ─────────────────────────────────────────────
export const KNOWLEDGE_BASE: ChatEntry[] = [
  // ── GREETINGS ──
  {
    id: 'greet',
    category: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'namaste', 'help', 'start', 'assist'],
    hindiKeywords: ['namaste', 'help chahiye', 'madad'],
    response: {
      en: `Hello! I'm your ${HOSPITAL_CONFIG.shortName} Help Assistant 🤖\n\nI can help you with:\n• 🗺️ Finding rooms & departments\n• 📖 Explaining medical terms\n• 📄 What documents to bring\n• 🌿 AYUSH wellness questions\n• ⏱️ Process & wait time\n• 🚨 Emergency contacts\n\nWhat would you like to know?`,
      hi: `नमस्ते! मैं आपका ${HOSPITAL_CONFIG.shortName} सहायक हूँ 🤖\n\nमैं इनमें मदद कर सकता हूँ:\n• 🗺️ कमरे और विभाग ढूंढना\n• 📖 चिकित्सा शब्द समझाना\n• 📄 कौन से दस्तावेज़ लाने हैं\n• 🌿 AYUSH स्वास्थ्य प्रश्न\n• ⏱️ प्रक्रिया और प्रतीक्षा समय\n• 🚨 आपातकालीन संपर्क\n\nआप क्या जानना चाहते हैं?`,
      ta: `வணக்கம்! நான் உங்கள் ${HOSPITAL_CONFIG.shortName} உதவியாளர் 🤖\n\nநான் உதவக்கூடியவை:\n• 🗺️ அறைகள் & துறைகள்\n• 📖 மருத்துவ சொற்கள்\n• 📄 தேவையான ஆவணங்கள்\n• 🌿 AYUSH கேள்விகள்\n• ⏱️ காத்திருப்பு நேரம்\n• 🚨 அவசர தொடர்பு\n\nநீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`,
      bn: `নমস্কার! আমি আপনার ${HOSPITAL_CONFIG.shortName} সহায়ক 🤖\n\nআমি সাহায্য করতে পারি:\n• 🗺️ কক্ষ ও বিভাগ খুঁজে পেতে\n• 📖 চিকিৎসা শব্দ বোঝাতে\n• 📄 কী কাগজপত্র আনতে হবে\n• 🌿 AYUSH স্বাস্থ্য প্রশ্ন\n• ⏱️ অপেক্ষার সময়\n• 🚨 জরুরি যোগাযোগ\n\nআপনি কী জানতে চান?`,
    },
    followUpChips: ['Where is the lab?', 'What is HPI?', 'Documents needed', 'Wait time'],
  },

  // ── NAVIGATION ──
  {
    id: 'nav_lab',
    category: 'navigation',
    keywords: ['lab', 'laboratory', 'blood test', 'urine test', 'sample', 'pathology', 'test room', 'lab room'],
    hindiKeywords: ['lab', 'laboratory', 'blood test', 'khoon jaanch', 'peshab jaanch'],
    response: {
      en: `🔬 ${HOSPITAL_CONFIG.departments.lab.name}\n\nLocation: ${deptLocation(HOSPITAL_CONFIG.departments.lab)}\n\nTiming: ${HOSPITAL_CONFIG.departments.lab.timings}\n\nPhone: ${HOSPITAL_CONFIG.departments.lab.phone || 'N/A'}\n\n💡 Tip: ${HOSPITAL_CONFIG.departments.lab.notes || 'Bring your doctor\'s slip.'}`,
      hi: `🔬 ${HOSPITAL_CONFIG.departments.lab.name}\n\nस्थान: ${deptLocation(HOSPITAL_CONFIG.departments.lab)}\n\nसमय: ${HOSPITAL_CONFIG.departments.lab.timings}\n\nफ़ोन: ${HOSPITAL_CONFIG.departments.lab.phone || 'N/A'}\n\n💡 टिप: डॉक्टर का पर्चा लेकर जाएं। फास्टिंग टेस्ट के लिए 8–10 घंटे खाली पेट रहें।`,
      ta: `🔬 ஆய்வகம்\n\nஇடம்: ${deptLocation(HOSPITAL_CONFIG.departments.lab)}\n\nநேரம்: ${HOSPITAL_CONFIG.departments.lab.timings}\n\n💡 குறிப்பு: மருத்துவரின் தேவைப்பத்திரம் கொண்டு வரவும்.`,
      bn: `🔬 ল্যাব\n\nঅবস্থান: ${deptLocation(HOSPITAL_CONFIG.departments.lab)}\n\nসময়: ${HOSPITAL_CONFIG.departments.lab.timings}\n\n💡 টিপস: ডাক্তারের প্রেসক্রিপশন আনুন।`,
    },
    followUpChips: ['Pharmacy location', 'X-Ray room', 'What documents needed?'],
  },
  {
    id: 'nav_pharmacy',
    category: 'navigation',
    keywords: ['pharmacy', 'medicine', 'medical store', 'dawai', 'dawa', 'drug store'],
    hindiKeywords: ['pharmacy', 'dawai', 'dawa', 'medical store'],
    response: {
      en: `💊 ${HOSPITAL_CONFIG.departments.pharmacy.name}\n\nLocation: ${deptLocation(HOSPITAL_CONFIG.departments.pharmacy)}\n\nHours: ${HOSPITAL_CONFIG.departments.pharmacy.timings}\n\nPhone: ${HOSPITAL_CONFIG.departments.pharmacy.phone || 'N/A'}${HOSPITAL_CONFIG.departments.ayushPharmacy ? `\n\n🌿 ${HOSPITAL_CONFIG.departments.ayushPharmacy.name}:\nLocation: ${deptLocation(HOSPITAL_CONFIG.departments.ayushPharmacy)}\nHours: ${HOSPITAL_CONFIG.departments.ayushPharmacy.timings}` : ''}`,
      hi: `💊 फार्मेसी\n\nस्थान: ${deptLocation(HOSPITAL_CONFIG.departments.pharmacy)}\n\nसमय: ${HOSPITAL_CONFIG.departments.pharmacy.timings}${HOSPITAL_CONFIG.departments.ayushPharmacy ? `\n\n🌿 AYUSH दवाएं:\nस्थान: ${deptLocation(HOSPITAL_CONFIG.departments.ayushPharmacy)}\nसमय: ${HOSPITAL_CONFIG.departments.ayushPharmacy.timings}` : ''}`,
      ta: `💊 மருந்தகம்\n\nஇடம்: ${deptLocation(HOSPITAL_CONFIG.departments.pharmacy)}\n\nநேரம்: ${HOSPITAL_CONFIG.departments.pharmacy.timings}`,
      bn: `💊 ফার্মেসি\n\nঅবস্থান: ${deptLocation(HOSPITAL_CONFIG.departments.pharmacy)}\n\nসময়: ${HOSPITAL_CONFIG.departments.pharmacy.timings}`,
    },
    followUpChips: ['Where is the lab?', 'Wait time', 'What is Ayurveda?'],
  },
  {
    id: 'nav_xray',
    category: 'navigation',
    keywords: ['xray', 'x-ray', 'x ray', 'radiology', 'scan', 'mri', 'ultrasound', 'sonography', 'ct scan'],
    response: {
      en: `🩻 ${HOSPITAL_CONFIG.departments.xray.name}\n\nX-Ray Location: ${deptLocation(HOSPITAL_CONFIG.departments.xray)}\nTimings: ${HOSPITAL_CONFIG.departments.xray.timings}\n\n💡 Note: ${HOSPITAL_CONFIG.departments.xray.notes || 'Please carry your doctor\'s slip.'}`,
      hi: `🩻 Radiology / इमेजिंग\n\nX-Ray स्थान: ${deptLocation(HOSPITAL_CONFIG.departments.xray)}\nसमय: ${HOSPITAL_CONFIG.departments.xray.timings}\n\n💡 ध्यान दें: ${HOSPITAL_CONFIG.departments.xray.notes || 'डॉक्टर का पर्चा लाएं।'}`,
      ta: `🩻 Radiology\n\nX-Ray: ${deptLocation(HOSPITAL_CONFIG.departments.xray)}\nநேரம்: ${HOSPITAL_CONFIG.departments.xray.timings}`,
      bn: `🩻 Radiology\n\nX-Ray: ${deptLocation(HOSPITAL_CONFIG.departments.xray)}\nসময়: ${HOSPITAL_CONFIG.departments.xray.timings}`,
    },
    followUpChips: ['Where is the lab?', 'What documents needed?'],
  },
  {
    id: 'nav_toilet',
    category: 'navigation',
    keywords: ['toilet', 'washroom', 'bathroom', 'restroom', 'wc', 'sukhalaya'],
    hindiKeywords: ['toilet', 'bathroom', 'shauchalaya'],
    response: {
      en: `🚻 Toilets / Restrooms\n\nGround Floor: ${HOSPITAL_CONFIG.departments.toilets?.groundFloor || 'Ask at reception'}\nFirst Floor: ${HOSPITAL_CONFIG.departments.toilets?.firstFloor || 'Ask at reception'}\n\nSeparate facilities for Men 🚹, Women 🚺, and Persons with Disability ♿\n\nAll toilets are wheelchair accessible.`,
      hi: `🚻 शौचालय\n\nग्राउंड फ्लोर: ${HOSPITAL_CONFIG.departments.toilets?.groundFloor || 'रिसेप्शन पर पूछें'}\nपहली मंज़िल: ${HOSPITAL_CONFIG.departments.toilets?.firstFloor || 'रिसेप्शन पर पूछें'}\n\nपुरुष 🚹, महिला 🚺, और दिव्यांगजन ♿ के लिए अलग सुविधाएं।`,
      ta: `🚻 கழிவறைகள்\n\nGround Floor: ${HOSPITAL_CONFIG.departments.toilets?.groundFloor || 'விசாரிக்கவும்'}\n\nஆண் 🚹, பெண் 🚺, மற்றும் மாற்றுத்திறனாளிகளுக்கு ♿ தனி வசதிகள்`,
      bn: `🚻 টয়লেট\n\nগ্রাউন্ড ফ্লোর: ${HOSPITAL_CONFIG.departments.toilets?.groundFloor || 'জিজ্ঞেস করুন'}\n\nপুরুষ 🚹, মহিলা 🚺, প্রতিবন্ধী ♿ আলাদা সুবিধা`,
    },
  },
  {
    id: 'nav_opd',
    category: 'navigation',
    keywords: ['opd', 'outpatient', 'registration', 'reception', 'counter', 'token', 'queue', 'number'],
    response: {
      en: `🏥 ${HOSPITAL_CONFIG.departments.opd.name}\n\nLocation: ${deptLocation(HOSPITAL_CONFIG.departments.opd)}\nTiming: ${HOSPITAL_CONFIG.departments.opd.timings}\n\nYour OPD token is automatically generated by this kiosk after you finish. Please wait in the seating area — your token number will be called on the display board and announced over the speaker.\n\n📢 For token updates, watch the screens on the walls.`,
      hi: `🏥 OPD Registration\n\nस्थान: ${deptLocation(HOSPITAL_CONFIG.departments.opd)}\nसमय: ${HOSPITAL_CONFIG.departments.opd.timings}\n\nआपका OPD टोकन इस kiosk द्वारा स्वचालित रूप से जनरेट किया जाएगा। प्रतीक्षा क्षेत्र में बैठें — आपका नंबर डिस्प्ले बोर्ड पर दिखेगा।`,
      ta: `🏥 OPD Registration\n\nஇடம்: ${deptLocation(HOSPITAL_CONFIG.departments.opd)}\nநேரம்: ${HOSPITAL_CONFIG.departments.opd.timings}\n\nஉங்கள் OPD token இந்த kiosk மூலம் தானாக உருவாகும். காத்திருப்பு பகுதியில் இருங்கள்.`,
      bn: `🏥 OPD Registration\n\nঅবস্থান: ${deptLocation(HOSPITAL_CONFIG.departments.opd)}\nসময়: ${HOSPITAL_CONFIG.departments.opd.timings}\n\nআপনার OPD টোকন এই kiosk দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হবে।`,
    },
    followUpChips: ['How long is the wait?', 'What documents needed?'],
  },
  {
    id: 'wait_time',
    category: 'navigation',
    keywords: ['wait', 'waiting', 'how long', 'time', 'duration', 'queue long', 'kitna time'],
    hindiKeywords: ['wait', 'kitna time', 'intezaar', 'der'],
    response: {
      en: `⏱️ Estimated Wait Times (today at ${HOSPITAL_CONFIG.shortName})\n\nAyurveda OPD: ~${SYSTEM_WAIT_ESTIMATE['Ayurveda']} minutes\nHomoeopathy OPD: ~${SYSTEM_WAIT_ESTIMATE['Homoeopathy']} minutes\nUnani OPD: ~${SYSTEM_WAIT_ESTIMATE['Unani']} minutes\nSiddha OPD: ~${SYSTEM_WAIT_ESTIMATE['Siddha']} minutes\nYoga & Naturopathy: ~${SYSTEM_WAIT_ESTIMATE['Yoga & Naturopathy']} minutes\n\n📢 Your token will be announced on the speaker system and shown on the wall display.\n\n💡 Tip: You can use this waiting time to upload your old prescriptions and reports on the kiosk — it saves time with the doctor!`,
      hi: `⏱️ अनुमानित प्रतीक्षा समय (आज)\n\nAyurveda OPD: ~${SYSTEM_WAIT_ESTIMATE['Ayurveda']} मिनट\nHomoeopathy OPD: ~${SYSTEM_WAIT_ESTIMATE['Homoeopathy']} मिनट\nUnani OPD: ~${SYSTEM_WAIT_ESTIMATE['Unani']} मिनट\nSiddha OPD: ~${SYSTEM_WAIT_ESTIMATE['Siddha']} मिनट\nYoga & Naturopathy: ~${SYSTEM_WAIT_ESTIMATE['Yoga & Naturopathy']} मिनट\n\n📢 आपका टोकन स्पीकर और डिस्प्ले बोर्ड पर दिखेगा।\n\n💡 टिप: प्रतीक्षा के दौरान kiosk पर पुराने नुस्खे और रिपोर्ट अपलोड करें!`,
      ta: `⏱️ தோராயமான காத்திருப்பு நேரம்\n\nAyurveda OPD: ~${SYSTEM_WAIT_ESTIMATE['Ayurveda']} நிமிடங்கள்\nHomoeopathy: ~${SYSTEM_WAIT_ESTIMATE['Homoeopathy']} நிமிடங்கள்\nUnani: ~${SYSTEM_WAIT_ESTIMATE['Unani']} நிமிடங்கள்\n\n📢 உங்கள் token speaker மூலம் அறிவிக்கப்படும்.`,
      bn: `⏱️ আনুমানিক অপেক্ষার সময়\n\nAyurveda OPD: ~${SYSTEM_WAIT_ESTIMATE['Ayurveda']} মিনিট\nHomoeopathy: ~${SYSTEM_WAIT_ESTIMATE['Homoeopathy']} মিনিট\nUnani: ~${SYSTEM_WAIT_ESTIMATE['Unani']} মিনিট\n\n📢 আপনার টোকন স্পিকারে ঘোষণা করা হবে।`,
    },
    followUpChips: ['Where is the waiting area?', 'What can I do while waiting?'],
  },


  // ── MEDICAL TERMS ──
  {
    id: 'term_hpi',
    category: 'terms',
    keywords: ['hpi', 'history of present illness', 'present illness', 'present history'],
    response: {
      en: "📖 HPI — History of Present Illness\n\nHPI simply means: the story of your current health problem.\n\nThe doctor wants to know:\n• When did it start?\n• What does it feel like?\n• Has it gotten better or worse?\n• What makes it better or worse?\n\nDon't worry about medical words — just describe your problem in your own words. The kiosk will guide you through it.",
      hi: "📖 HPI — वर्तमान बीमारी का इतिहास\n\nHPI का मतलब है: आपकी मौजूदा स्वास्थ्य समस्या की कहानी।\n\nडॉक्टर जानना चाहते हैं:\n• यह कब शुरू हुआ?\n• यह कैसा लगता है?\n• यह बेहतर या बदतर हुआ है?\n• इसे क्या बेहतर या बदतर बनाता है?\n\nचिकित्सीय शब्दों की चिंता न करें — बस अपनी समस्या अपने शब्दों में बताएं।",
      ta: "📖 HPI — தற்போதைய நோய் வரலாறு\n\nHPI என்பது: உங்கள் தற்போதைய உடல்நல பிரச்சனையின் கதை.\n\nமருத்துவர் அறிய விரும்புவது:\n• எப்போது தொடங்கியது?\n• எப்படி உணர்கிறீர்கள்?\n• என்ன மோசமாக்குகிறது?\n\nமருத்துவ சொற்கள் பற்றி கவலைப்படாதீர்கள் — உங்கள் சொந்த மொழியில் விவரிக்கவும்.",
      bn: "📖 HPI — বর্তমান অসুস্থতার ইতিহাস\n\nHPI মানে: আপনার বর্তমান স্বাস্থ্য সমস্যার গল্প।\n\nডাক্তার জানতে চান:\n• কখন শুরু হয়েছে?\n• কেমন লাগছে?\n• কী খারাপ করে বা ভালো করে?\n\nচিকিৎসা শব্দ নিয়ে চিন্তা করবেন না — নিজের ভাষায় বলুন।",
    },
    followUpChips: ['What is SOCRATES?', 'What is Prakriti?', 'What is HbA1c?'],
  },
  {
    id: 'term_socrates',
    category: 'terms',
    keywords: ['socrates', 'site onset character', 'clinical framework', 'assessment framework'],
    response: {
      en: "📖 SOCRATES — Clinical Assessment Framework\n\nSOCRATES is a simple way doctors describe pain/symptoms:\n\n🔵 S — Site: WHERE is the problem?\n🟢 O — Onset: WHEN did it start? Sudden or gradual?\n🟡 C — Character: WHAT does it feel like? (burning, dull, sharp…)\n🟠 R — Radiation: Does it SPREAD anywhere?\n🔴 A — Associations: Any OTHER symptoms at the same time?\n⚪ T — Time: Is it ALWAYS there, or comes and goes?\n🟣 E — Exacerbating: What makes it WORSE? What makes it BETTER?\n🟤 S — Severity: How BAD is it? (1–10)\n\nThe kiosk will ask you each of these — one at a time, in simple language.",
      hi: "📖 SOCRATES — लक्षण मूल्यांकन ढांचा\n\nSOCRATES डॉक्टरों द्वारा दर्द/लक्षण वर्णित करने का एक सरल तरीका है:\n\n🔵 S — स्थान: समस्या कहाँ है?\n🟢 O — शुरुआत: कब शुरू हुआ?\n🟡 C — स्वभाव: कैसा महसूस होता है?\n🟠 R — फैलाव: क्या कहीं फैलता है?\n🔴 A — संबंधित लक्षण: और क्या है?\n⚪ T — समय: हमेशा है या आता-जाता?\n🟣 E — बढ़ाने/घटाने वाला: क्या बुरा या अच्छा लगता है?\n🟤 S — गंभीरता: 1–10 में कितना?\n\nkiosk एक-एक करके ये सब पूछेगा — सरल भाषा में।",
      ta: "📖 SOCRATES — அறிகுறி மதிப்பீட்டு கட்டமைப்பு\n\nS — இடம் (Site): பிரச்சனை எங்கே?\nO — தொடக்கம் (Onset): எப்போது தொடங்கியது?\nC — தன்மை (Character): எப்படி உணர்கிறீர்கள்?\nR — பரவல் (Radiation): வேறெங்கும் பரவுகிறதா?\nA — தொடர்பு (Associations): வேறு என்ன இருக்கிறது?\nT — நேரம் (Time): எப்போதும் உள்ளதா?\nE — மோசமாக்குவது (Exacerbating): என்ன மோசமாக்குகிறது?\nS — தீவிரம் (Severity): 1–10?",
      bn: "📖 SOCRATES — উপসর্গ মূল্যায়ন কাঠামো\n\nS — স্থান (Site): সমস্যা কোথায়?\nO — শুরু (Onset): কখন শুরু হয়েছে?\nC — চরিত্র (Character): কেমন লাগছে?\nR — বিস্তার (Radiation): কোথাও ছড়িয়ে পড়ছে?\nA — সংযোগ (Associations): আর কী আছে?\nT — সময় (Time): সবসময় থাকে নাকি আসে-যায়?\nE — বাড়ায়/কমায় (Exacerbating): কী খারাপ করে?\nS — তীব্রতা (Severity): ১–১০?",
    },
    followUpChips: ['What is Prakriti?', 'What is HPI?'],
  },
  {
    id: 'term_prakriti',
    category: 'terms',
    keywords: ['prakriti', 'prakruti', 'body type', 'constitution', 'dosha', 'vata', 'pitta', 'kapha'],
    response: {
      en: "🌿 Prakriti — Your Ayurvedic Body Constitution\n\nIn Ayurveda, every person has a unique Prakriti (body type) determined at birth. It's made of three Doshas:\n\n💨 Vata (Air + Space): Thin frame, creative, tends toward anxiety and dryness\n🔥 Pitta (Fire + Water): Medium build, sharp mind, tends toward inflammation and anger\n🌊 Kapha (Earth + Water): Strong build, calm, tends toward weight gain and lethargy\n\nMost people are a combination of two Doshas. Your Prakriti helps the doctor personalise your Ayurvedic treatment — the same herb may be ideal for one Prakriti and harmful for another!\n\nThe kiosk will ask simple questions to help identify your Prakriti.",
      hi: "🌿 प्रकृति — आपका आयुर्वेदिक शरीर प्रकार\n\nआयुर्वेद में, हर व्यक्ति की एक अनूठी प्रकृति होती है। यह तीन दोषों से बनी है:\n\n💨 वात (वायु + आकाश): पतला शरीर, रचनात्मक, चिंता की प्रवृत्ति\n🔥 पित्त (अग्नि + जल): मध्यम शरीर, तीव्र मन, सूजन की प्रवृत्ति\n🌊 कफ (पृथ्वी + जल): मजबूत शरीर, शांत, वजन बढ़ने की प्रवृत्ति\n\nअधिकांश लोग दो दोषों का संयोजन होते हैं। आपकी प्रकृति डॉक्टर को आपका आयुर्वेदिक उपचार व्यक्तिगत बनाने में मदद करती है।",
      ta: "🌿 பிரகிருதி — ஆயுர்வேத உடல் அமைப்பு\n\nஆயுர்வேதத்தில், ஒவ்வொரு நபரும் பிறக்கும்போதே ஒரு தனித்துவமான பிரகிருதி கொண்டிருக்கிறார்:\n\n💨 வாத (காற்று): மெல்லிய உடல், படைப்பாற்றல்\n🔥 பித்த (நெருப்பு): மத்திய உடல், கூர்மையான மனம்\n🌊 கப (பூமி): வலிமையான உடல், அமைதியான மனம்\n\nகியோஸ்க் எளிய கேள்விகள் மூலம் உங்கள் பிரகிருதியை அடையாளம் காண உதவும்.",
      bn: "🌿 প্রকৃতি — আয়ুর্বেদিক শরীরের গঠন\n\nআয়ুর্বেদে, প্রতিটি মানুষের একটি অনন্য প্রকৃতি থাকে:\n\n💨 বাত (বায়ু): পাতলা শরীর, সৃজনশীল\n🔥 পিত্ত (আগুন): মধ্যম শরীর, তীক্ষ্ণ মন\n🌊 কফ (মাটি): শক্তিশালী শরীর, শান্ত\n\nকিওস্ক সহজ প্রশ্নের মাধ্যমে আপনার প্রকৃতি সনাক্ত করতে সাহায্য করবে।",
    },
    followUpChips: ['What is Dashavidha Pariksha?', 'What is Ayurveda?'],
  },
  {
    id: 'term_hba1c',
    category: 'terms',
    keywords: ['hba1c', 'hemoglobin a1c', 'glycated', 'diabetes test', 'sugar test', 'blood sugar', 'glucose'],
    response: {
      en: "📖 HbA1c — Blood Sugar (3-Month Average)\n\nHbA1c measures your average blood sugar over the last 2–3 months.\n\n✅ Normal: Below 5.7%\n⚠️ Prediabetes: 5.7% – 6.4%\n🔴 Diabetes: 6.5% or above\n\nUnlike a fasting sugar test (which shows one moment), HbA1c shows the big picture — like your annual exam report card for blood sugar.\n\nIf your old report shows HbA1c, please upload it in the Document Scan step — our AI will read it for the doctor.",
      hi: "📖 HbA1c — रक्त शर्करा (3 महीने का औसत)\n\nHbA1c पिछले 2–3 महीनों में आपके औसत रक्त शर्करा को मापता है।\n\n✅ सामान्य: 5.7% से कम\n⚠️ प्रीडायबिटीज: 5.7% – 6.4%\n🔴 मधुमेह: 6.5% या अधिक\n\nयदि आपकी पुरानी रिपोर्ट में HbA1c है, तो इसे Document Scan में अपलोड करें।",
      ta: "📖 HbA1c — இரத்த சர்க்கரை (3 மாத சராசரி)\n\n✅ சாதாரண: 5.7% க்கும் கீழ்\n⚠️ Pre-diabetes: 5.7% – 6.4%\n🔴 நீரிழிவு நோய்: 6.5% அல்லது அதிகம்\n\nபழைய அறிக்கையில் HbA1c இருந்தால் Document Scan-ல் பதிவேற்றவும்.",
      bn: "📖 HbA1c — রক্তে শর্করা (৩ মাসের গড়)\n\n✅ স্বাভাবিক: 5.7% এর নিচে\n⚠️ প্রিডায়াবেটিস: 5.7% – 6.4%\n🔴 ডায়াবেটিস: 6.5% বা তার উপরে\n\nপুরানো রিপোর্টে HbA1c থাকলে Document Scan-এ আপলোড করুন।",
    },
    followUpChips: ['What is a blood pressure?', 'What documents needed?'],
  },
  {
    id: 'term_ayurveda',
    category: 'terms',
    keywords: ['ayurveda', 'ayurvedic', 'what is ayurveda', 'ayurveda kya hai'],
    response: {
      en: "🌿 Ayurveda\n\nAyurveda (आयुर्वेद) is the world's oldest system of medicine, originating in India over 5,000 years ago. The name means 'Science of Life'.\n\nKey principles:\n• Disease comes from imbalance of Vata, Pitta, and Kapha doshas\n• Treatment aims to restore balance — not just suppress symptoms\n• Uses herbs, diet, lifestyle, Panchakarma (body purification), yoga\n• Personalised to your Prakriti (body type)\n\nAyurveda treats the whole person — body, mind, and spirit — not just the disease.",
      hi: "🌿 आयुर्वेद\n\nआयुर्वेद विश्व की सबसे पुरानी चिकित्सा प्रणाली है, जो 5,000 वर्ष पूर्व भारत में उत्पन्न हुई। नाम का अर्थ है 'जीवन का विज्ञान'।\n\nमुख्य सिद्धांत:\n• रोग वात, पित्त और कफ दोषों के असंतुलन से आता है\n• उपचार संतुलन बहाल करने का प्रयास करता है\n• जड़ी-बूटियां, आहार, जीवनशैली, पंचकर्म\n• आपकी प्रकृति के अनुसार व्यक्तिगत उपचार",
      ta: "🌿 ஆயுர்வேதம்\n\nஆயுர்வேதம் 5,000 ஆண்டுகளுக்கும் மேலான இந்தியாவில் தோன்றிய உலகின் மிக பழமையான மருத்துவ முறை.\n\nமுக்கிய கொள்கைகள்:\n• நோய் வாத, பித்த, கப சீர்கேட்டால் வருகிறது\n• மூலிகைகள், உணவு, வாழ்க்கை முறை மூலம் சிகிச்சை\n• உங்கள் பிரகிருதிக்கு ஏற்ப தனிப்பயனாக்கப்பட்ட சிகிச்சை",
      bn: "🌿 আয়ুর্বেদ\n\nআয়ুর্বেদ ৫,০০০ বছরের পুরানো ভারতের চিকিৎসা পদ্ধতি। নামের অর্থ 'জীবনের বিজ্ঞান'।\n\nমূল নীতি:\n• রোগ বাত, পিত্ত এবং কফের ভারসাম্যহীনতা থেকে আসে\n• ভেষজ, খাদ্য, জীবনধারা, পঞ্চকর্ম দিয়ে চিকিৎসা\n• আপনার প্রকৃতি অনুযায়ী ব্যক্তিগত চিকিৎসা",
    },
    followUpChips: ['What is Prakriti?', 'What is Homoeopathy?'],
  },
  {
    id: 'term_homoeopathy',
    category: 'terms',
    keywords: ['homoeopathy', 'homeopathy', 'homeopathic', 'homeopathic medicine'],
    response: {
      en: "💊 Homoeopathy\n\nHomoeopathy is a system of medicine based on the principle: 'Like cures Like' — a substance that causes symptoms in a healthy person can cure similar symptoms in a sick person.\n\nKey features:\n• Highly diluted natural substances (plant, animal, mineral)\n• Treats the whole person — mental, emotional, physical\n• No side effects (due to high dilution)\n• Personalised: two people with 'fever' may get different medicines!\n\nThe doctor will assess your constitutional type (Miasm) and select the single most similar remedy.",
      hi: "💊 होम्योपैथी\n\nहोम्योपैथी 'समान समान को ठीक करता है' के सिद्धांत पर आधारित है।\n\nमुख्य विशेषताएं:\n• अत्यधिक पतला प्राकृतिक पदार्थ (पौधे, जानवर, खनिज)\n• पूरे व्यक्ति का उपचार — मानसिक, भावनात्मक, शारीरिक\n• कोई दुष्प्रभाव नहीं\n• व्यक्तिगत: दो लोगों को 'बुखार' के लिए अलग-अलग दवा मिल सकती है!",
      ta: "💊 ஹோமியோபதி\n\n'ஒத்தது ஒத்ததை குணமாக்கும்' என்ற கொள்கையில் இயங்கும் மருத்துவ முறை.\n\nமுக்கிய அம்சங்கள்:\n• இயற்கை பொருட்களின் மிகவும் நீர்த்த கரைசல்\n• முழு நபரையும் சிகிச்சை செய்கிறது\n• பக்க விளைவுகள் இல்லை",
      bn: "💊 হোমিওপ্যাথি\n\n'সদৃশ সদৃশকে নিরাময় করে' নীতির উপর ভিত্তি করে।\n\nমূল বৈশিষ্ট্য:\n• অত্যন্ত পাতলা প্রাকৃতিক পদার্থ\n• পুরো মানুষের চিকিৎসা — মানসিক, আবেগময়, শারীরিক\n• কোনো পার্শ্বপ্রতিক্রিয়া নেই",
    },
    followUpChips: ['What is Ayurveda?', 'What is Unani?'],
  },

  // ── DOCUMENTS ──
  {
    id: 'docs_needed',
    category: 'documents',
    keywords: ['document', 'papers', 'bring', 'carry', 'what to bring', 'report', 'prescription', 'id proof'],
    hindiKeywords: ['document', 'kaagaz', 'kya lana', 'report', 'purana nuskha'],
    response: {
      en: "📄 Documents to Bring — Checklist\n\n✅ MUST bring:\n• ABHA Health ID card (or Aadhaar card for lookup)\n• Any old prescriptions from the last 6 months\n• Recent lab reports (blood, urine, X-ray)\n• Discharge summary (if you were admitted to hospital)\n\n📸 Can upload on the kiosk:\n• Photos of old prescriptions\n• Photos of lab reports\n• Discharge summaries\n• X-rays / scans\n\n💡 Tip: You can photograph these at home and upload them on the kiosk in the waiting area — the AI will read and structure them for the doctor.",
      hi: "📄 लाने वाले दस्तावेज़ — चेकलिस्ट\n\n✅ जरूरी:\n• ABHA Health ID कार्ड (या आधार कार्ड)\n• पिछले 6 महीनों के पुराने नुस्खे\n• हाल की Lab रिपोर्ट\n• अस्पताल छुट्टी का सारांश (अगर भर्ती थे)\n\n📸 Kiosk पर अपलोड करें:\n• पुराने नुस्खों की फोटो\n• Lab रिपोर्ट की फोटो\n• X-Ray / Scan\n\n💡 टिप: घर पर फोटो खींचें और यहाँ अपलोड करें!",
      ta: "📄 கொண்டுவர வேண்டிய ஆவணங்கள்\n\n✅ அவசியம்:\n• ABHA Health ID அட்டை அல்லது ஆதார்\n• கடந்த 6 மாத பழைய மருந்துச் சீட்டுகள்\n• சமீபத்திய Lab reports\n• மருத்துவமனை Discharge சுருக்கம்\n\n📸 Kiosk-ல் பதிவேற்றலாம்:\n• பழைய மருந்துச் சீட்டுகளின் புகைப்படங்கள்\n• Lab reports\n• X-Ray / Scan",
      bn: "📄 আনতে হবে যা — চেকলিস্ট\n\n✅ অবশ্যই:\n• ABHA Health ID কার্ড বা আধার কার্ড\n• গত ৬ মাসের পুরানো প্রেসক্রিপশন\n• সাম্প্রতিক Lab রিপোর্ট\n• হাসপাতাল Discharge সারসংক্ষেপ\n\n📸 Kiosk-এ আপলোড করুন:\n• পুরানো প্রেসক্রিপশনের ছবি\n• Lab রিপোর্ট\n• X-Ray / Scan",
    },
    followUpChips: ['Where is the lab?', 'What is ABHA ID?'],
  },
  {
    id: 'docs_abha',
    category: 'documents',
    keywords: ['abha', 'health id', 'abha id', 'health card', 'digital health id', 'abdm'],
    response: {
      en: "🪪 ABHA — Ayushman Bharat Health Account\n\nABHA is your unique digital health ID from the Government of India (National Health Authority).\n\nFormat: 14-digit number (91-XXXX-XXXX-XXXX) or handle (name@abdm)\n\nBenefits:\n• Single ID for all your health records across all hospitals\n• Doctors can see your history with your consent\n• Linked to Ayushman Bharat health scheme\n\nHow to create an ABHA ID (free):\n1. Visit https://healthid.ndhm.gov.in\n2. Or use the ABHA app (available on Play Store / App Store)\n3. Or ask our Registration Counter (Ground Floor, Room 1)\n\nYou can also use your Aadhaar number to look up your profile on this kiosk.",
      hi: "🪪 ABHA — आयुष्मान भारत स्वास्थ्य खाता\n\nABHA भारत सरकार (NHA) का आपका अनूठा डिजिटल स्वास्थ्य ID है।\n\nफॉर्मेट: 14-अंकीय नंबर या handle (name@abdm)\n\nफायदे:\n• सभी अस्पतालों में एक ही ID\n• आपकी सहमति से डॉक्टर इतिहास देख सकते हैं\n\nABHA ID बनाने के लिए:\n1. https://healthid.ndhm.gov.in पर जाएं\n2. ABHA ऐप डाउनलोड करें\n3. हमारे Registration काउंटर पर पूछें (Room 1)",
      ta: "🪪 ABHA — ஆயுஷ்மான் பாரத் ஆரோக்கிய கணக்கு\n\nABHA என்பது இந்திய அரசாங்கத்தின் உங்கள் தனித்துவமான டிஜிட்டல் சுகாதார ID.\n\nவடிவம்: 14-இலக்க எண் அல்லது name@abdm\n\nABHA ID உருவாக்க:\n1. https://healthid.ndhm.gov.in\n2. ABHA app (Play Store / App Store)\n3. Registration Counter கேளுங்கள் (Room 1)",
      bn: "🪪 ABHA — আয়ুষ্মান ভারত স্বাস্থ্য অ্যাকাউন্ট\n\nABHA হল ভারত সরকারের আপনার অনন্য ডিজিটাল স্বাস্থ্য ID।\n\nফরম্যাট: ১৪-সংখ্যার নম্বর বা name@abdm\n\nABHA ID তৈরি করতে:\n1. https://healthid.ndhm.gov.in\n2. ABHA অ্যাপ (Play Store / App Store)\n3. Registration কাউন্টার (Room 1)",
    },
    followUpChips: ['Documents to bring', 'Where is registration?'],
  },

  // ── WELLNESS / AYUSH TIPS ──
  {
    id: 'wellness_diet',
    category: 'diet',
    keywords: ['diet', 'food', 'eat', 'khana', 'nutrition', 'what to eat', 'avoid food', 'healthy food'],
    hindiKeywords: ['diet', 'khana', 'kya khana chahiye', 'poshan'],
    response: {
      en: "🌿 AYUSH Dietary Guidance (General)\n\nAyurvedic principles for daily diet:\n\n🌅 Morning:\n• Warm water with lemon on empty stomach\n• Light, easily digestible breakfast\n• Best time: sunrise to 2 hours after\n\n☀️ Afternoon (Lunch — biggest meal):\n• Eat when you're actually hungry\n• Sit calmly, chew slowly\n• Include all 6 tastes: sweet, sour, salty, bitter, pungent, astringent\n\n🌙 Evening/Dinner:\n• Light meal, 2–3 hours before sleep\n• Avoid raw, cold, or heavy foods at night\n\n❌ Generally avoid:\n• Cold drinks with meals\n• Eating when stressed or not hungry\n• Leftovers more than 12 hours old\n\n💡 Your doctor will give personalised advice based on your Prakriti.",
      hi: "🌿 AYUSH आहार मार्गदर्शन (सामान्य)\n\n🌅 सुबह: खाली पेट गुनगुना पानी + नींबू\n☀️ दोपहर: सबसे बड़ा भोजन, शांति से खाएं\n🌙 शाम: हल्का भोजन, सोने से 2–3 घंटे पहले\n\n❌ आमतौर पर बचें:\n• खाने के साथ ठंडे पेय\n• तनाव में खाना\n• 12 घंटे पुरानी बची हुई खाना\n\n💡 डॉक्टर आपकी प्रकृति के अनुसार व्यक्तिगत सलाह देंगे।",
      ta: "🌿 AYUSH உணவு வழிகாட்டுதல்\n\n🌅 காலை: வெறும் வயிற்றில் வெதுவெதுப்பான நீர் + எலுமிச்சை\n☀️ மதியம்: மிகவும் பெரிய உணவு\n🌙 இரவு: இலகுவான உணவு, தூக்கத்திற்கு 2–3 மணி முன்பு\n\n💡 உங்கள் மருத்துவர் பிரகிருதி அடிப்படையில் தனிப்பட்ட ஆலோசனை தருவார்.",
      bn: "🌿 AYUSH খাদ্য নির্দেশিকা\n\n🌅 সকাল: খালি পেটে উষ্ণ জল + লেবু\n☀️ দুপুর: সবচেয়ে বড় খাবার\n🌙 রাত: হালকা খাবার, ঘুমানোর ২–৩ ঘন্টা আগে\n\n💡 আপনার ডাক্তার প্রকৃতি অনুযায়ী ব্যক্তিগত পরামর্শ দেবেন।",
    },
    followUpChips: ['What is Prakriti?', 'Yoga tips', 'What is Ayurveda?'],
  },
  {
    id: 'wellness_yoga',
    category: 'wellness',
    keywords: ['yoga', 'exercise', 'breathing', 'pranayama', 'meditation', 'vyayama', 'asana'],
    response: {
      en: "🧘 Yoga & Wellness Tips (General)\n\nSimple daily practices from Yoga & Naturopathy:\n\n🌬️ Pranayama (Breathing Exercises — 10 min/day):\n• Anulom Vilom (alternate nostril): Calms mind, balances energy\n• Bhramari (humming bee): Reduces stress, helps sleep\n• Kapalbhati: Energises, aids digestion (avoid in hypertension)\n\n🤸 Simple Asanas for beginners:\n• Tadasana (Mountain Pose): Posture correction\n• Balasana (Child's Pose): Back pain, stress relief\n• Shavasana (Corpse Pose): Deep relaxation — always end with this\n\n⏰ Best time: Early morning, empty stomach\n\n⚠️ Always inform your doctor before starting if you have any health conditions.",
      hi: "🧘 योग और स्वास्थ्य सुझाव\n\n🌬️ प्राणायाम (10 मिनट/दिन):\n• अनुलोम विलोम: मन को शांत करता है\n• भ्रामरी: तनाव कम करता है, नींद में मदद करता है\n• कपालभाति: ऊर्जा देता है (उच्च रक्तचाप में न करें)\n\n🤸 सरल आसन:\n• ताड़ासन: मुद्रा सुधार\n• बालासन: पीठ दर्द में राहत\n• शवासन: गहरी विश्राम\n\n⏰ सर्वोत्तम समय: सुबह, खाली पेट\n\n⚠️ स्वास्थ्य समस्या होने पर पहले डॉक्टर से बताएं।",
      ta: "🧘 யோகா மற்றும் ஆரோக்கிய குறிப்புகள்\n\n🌬️ பிராணாயாமம் (10 நிமிடம்/நாள்):\n• அனுலோம் விலோம்: மனதை அமைதிப்படுத்துகிறது\n• பீமரி: மன அழுத்தம் குறைக்கிறது\n• கபாலபாதி: ஆற்றல் அளிக்கிறது\n\n🤸 எளிய ஆசனங்கள்:\n• தாடாசனம்: தோரணை சரிசெய்தல்\n• பாலாசனம்: முதுகுவலி நிவாரணம்\n• சவாசனம்: ஆழ்ந்த ஓய்வு",
      bn: "🧘 যোগ ও সুস্থতার টিপস\n\n🌬️ প্রাণায়াম (১০ মিনিট/দিন):\n• অনুলোম বিলোম: মন শান্ত করে\n• ভ্রামরী: স্ট্রেস কমায়\n• কপালভাতি: শক্তি দেয়\n\n🤸 সহজ আসন:\n• তাড়াসন: ভঙ্গি সংশোধন\n• বালাসন: পিঠের ব্যথায় স্বস্তি\n• শবাসন: গভীর বিশ্রাম",
    },
    followUpChips: ['What is Prakriti?', 'Diet tips', 'What is Naturopathy?'],
  },

  // ── EMERGENCY ──
  {
    id: 'emergency',
    category: 'emergency',
    keywords: ['emergency', 'urgent', 'serious', 'ambulance', 'faint', 'unconscious', 'chest pain', 'breathless', 'serious problem', 'aapat'],
    hindiKeywords: ['emergency', 'aapatkaal', 'bahut dard', 'behosh', 'seene mein dard', 'saans nahi'],
    response: {
      en: "🚨 EMERGENCY — Act Immediately\n\nIf you or someone near you has:\n• Chest pain + breathlessness\n• Sudden severe headache\n• Difficulty speaking or one-sided weakness\n• Unconsciousness or seizure\n\nDO THIS NOW:\n1. 📢 Shout for help — call any staff member immediately\n2. 🆘 Press the red HELP button on this kiosk\n3. 📞 Call hospital emergency: 1800-XXX-XXXX (toll free)\n4. 🏥 Emergency Room: Ground Floor, Gate 2 — 24×7\n\n⚡ Do NOT wait in queue. Go to the Emergency Room directly.\n\n📞 National Emergency: 112\n🚑 Ambulance: 108",
      hi: "🚨 आपातकाल — तुरंत कार्रवाई करें\n\nयदि आपको या आस-पास किसी को:\n• सीने में दर्द + सांस लेने में कठिनाई\n• अचानक तेज सिरदर्द\n• बोलने में कठिनाई या एक तरफ कमजोरी\n• बेहोशी\n\nअभी करें:\n1. 📢 मदद के लिए चिल्लाएं — किसी भी स्टाफ को बुलाएं\n2. 🆘 Kiosk पर लाल HELP बटन दबाएं\n3. 📞 अस्पताल आपातकाल: 1800-XXX-XXXX\n4. 🏥 Emergency Room: ग्राउंड फ्लोर, Gate 2\n\n📞 राष्ट्रीय आपातकाल: 112\n🚑 एम्बुलेंस: 108",
      ta: "🚨 அவசர நிலை — உடனடியாக செயல்படவும்\n\nஒருவருக்கு:\n• மார்பு வலி + மூச்சு திணறல்\n• திடீர் கடுமையான தலைவலி\n• பேச முடியாமை\n• மயக்கம்\n\nஒடனே:\n1. 📢 உதவிக்கு கூக்குரலிடவும்\n2. 🆘 Kiosk-ல் HELP பொத்தானை அழுத்தவும்\n3. 📞 தொலைபேசி: 112\n🚑 Ambulance: 108",
      bn: "🚨 জরুরি অবস্থা — এখনই পদক্ষেপ নিন\n\nকারও যদি থাকে:\n• বুকে ব্যথা + শ্বাসকষ্ট\n• হঠাৎ তীব্র মাথাব্যথা\n• কথা বলতে না পারা\n• অজ্ঞান হয়ে যাওয়া\n\nএখনই করুন:\n1. 📢 সাহায্যের জন্য চিৎকার করুন\n2. 🆘 Kiosk-এ HELP বোতাম চাপুন\n3. 📞 জাতীয় জরুরি: 112\n🚑 অ্যাম্বুলেন্স: 108",
    },
    followUpChips: ['Call staff', 'Where is emergency room?'],
  },

  // ── PROCESS GUIDE ──
  {
    id: 'process_steps',
    category: 'process',
    keywords: ['process', 'steps', 'how does this work', 'what happens next', 'kya hoga', 'procedure', 'kiosk step'],
    response: {
      en: "📋 How MediKiosk Works — Step by Step\n\n1️⃣ IDENTIFY (you are here)\n   • Choose your language\n   • Login with ABHA ID or Aadhaar\n   • Give privacy consent\n\n2️⃣ TELL US YOUR PROBLEM\n   • Answer questions about your symptoms (by voice or tap)\n   • Takes about 3–5 minutes\n   • The AI watches for serious symptoms\n\n3️⃣ SCAN YOUR DOCUMENTS\n   • Upload old prescriptions & lab reports (optional)\n   • AI reads and structures them\n\n4️⃣ SUMMARY\n   • Review your health summary\n   • Confirm and send to the doctor's screen\n\n5️⃣ GET YOUR TOKEN\n   • Receive your OPD queue token\n   • Wait to be called — doctor already has your history!",
      hi: "📋 MediKiosk कैसे काम करता है\n\n1️⃣ पहचान: भाषा, Login, सहमति\n2️⃣ समस्या बताएं: लक्षणों के बारे में सवाल (3–5 मिनट)\n3️⃣ दस्तावेज़ स्कैन: पुराने नुस्खे और रिपोर्ट अपलोड करें\n4️⃣ सारांश: अपना स्वास्थ्य सारांश देखें\n5️⃣ टोकन प्राप्त करें: OPD लाइन में प्रतीक्षा करें\n\nडॉक्टर के पास आपसे मिलने से पहले ही आपका इतिहास होगा!",
      ta: "📋 MediKiosk எப்படி இயங்குகிறது\n\n1️⃣ அடையாளம்: மொழி, Login, சம்மதம்\n2️⃣ உங்கள் பிரச்சனை சொல்லுங்கள்: 3–5 நிமிடம்\n3️⃣ ஆவணங்கள் ஸ்கேன்: பழைய மருந்துச் சீட்டுகள்\n4️⃣ சுருக்கம்: உங்கள் சுகாதார சுருக்கம் பார்க்கவும்\n5️⃣ Token பெறுங்கள்: OPD வரிசையில் காத்திருங்கள்",
      bn: "📋 MediKiosk কীভাবে কাজ করে\n\n1️⃣ পরিচয়: ভাষা, Login, সম্মতি\n2️⃣ সমস্যা বলুন: ৩–৫ মিনিট\n3️⃣ নথি স্ক্যান: পুরানো প্রেসক্রিপশন\n4️⃣ সারসংক্ষেপ: স্বাস্থ্য সারসংক্ষেপ দেখুন\n5️⃣ টোকন পান: OPD লাইনে অপেক্ষা করুন",
    },
    followUpChips: ['How long is the wait?', 'What documents needed?'],
  },
];

// ─────────────────────────────────────────────
// QUICK CHIPS — shown on chatbot open
// ─────────────────────────────────────────────
export const QUICK_CHIPS: QuickChip[] = [
  { label: 'Where is the lab?', query: 'lab', icon: '🔬', category: 'navigation' },
  { label: 'Wait time', query: 'wait time', icon: '⏱️', category: 'navigation' },
  { label: 'Documents needed', query: 'what documents', icon: '📄', category: 'documents' },
  { label: 'What is HPI?', query: 'what is HPI', icon: '📖', category: 'terms' },
  { label: 'What is Prakriti?', query: 'what is prakriti', icon: '🌿', category: 'terms' },
  { label: 'Diet tips', query: 'diet food', icon: '🥗', category: 'diet' },
  { label: 'Emergency!', query: 'emergency', icon: '🚨', category: 'emergency' },
  { label: 'How does this work?', query: 'how does this work', icon: '❓', category: 'process' },
];

// ─────────────────────────────────────────────
// SEARCH / MATCH ENGINE
// ─────────────────────────────────────────────
export function findBestMatch(query: string, lang: string): ChatEntry | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  let bestMatch: ChatEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    // Check English keywords
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.length; // longer keyword match = higher score
      }
    }

    // Check Hindi keywords if Hindi selected
    if ((lang === 'hi' || lang === 'en') && entry.hindiKeywords) {
      for (const kw of entry.hindiKeywords) {
        if (q.includes(kw.toLowerCase())) {
          score += kw.length;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require at least a minimal match score
  return bestScore >= 2 ? bestMatch : null;
}

export const UNKNOWN_RESPONSE = {
  en: "I'm not sure about that one 🤔\n\nI'm best at helping with:\n• 🗺️ Room & department directions\n• 📖 Medical terms (HPI, SOCRATES, Prakriti…)\n• 📄 Documents to bring\n• ⏱️ Wait times\n• 🌿 AYUSH & wellness questions\n• 🚨 Emergencies\n\nOr tap one of the suggestions below, or 🆘 Call Staff for personal help!",
  hi: "मुझे यकीन नहीं है 🤔\n\nमैं इनमें मदद कर सकता हूँ:\n• 🗺️ कमरे की दिशा\n• 📖 चिकित्सा शब्द\n• 📄 लाने वाले दस्तावेज़\n• ⏱️ प्रतीक्षा समय\n• 🌿 AYUSH प्रश्न\n• 🚨 आपातकाल\n\nया 🆘 Call Staff दबाएं!",
  ta: "என்னால் சரியாக சொல்ல முடியவில்லை 🤔\n\nநான் உதவக்கூடியவை:\n• 🗺️ அறை திசைகள்\n• 📖 மருத்துவ சொற்கள்\n• 📄 தேவையான ஆவணங்கள்\n• ⏱️ காத்திருப்பு நேரம்\n• 🌿 AYUSH கேள்விகள்",
  bn: "আমি নিশ্চিত নই 🤔\n\nআমি সাহায্য করতে পারি:\n• 🗺️ কক্ষের দিকনির্দেশনা\n• 📖 চিকিৎসা শব্দ\n• 📄 আনতে হবে যা\n• ⏱️ অপেক্ষার সময়\n• 🌿 AYUSH প্রশ্ন",
};
