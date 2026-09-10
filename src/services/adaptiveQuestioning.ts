// MediKiosk AI — Adaptive Branching Question Engine
// Implements SOCRATES framework with intelligent branching based on prior answers
// Pure TypeScript — no API calls required — works fully offline

import type { SupportedLang } from '../i18n/strings';

export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'voice_text'
  | 'slider'
  | 'yes_no'
  | 'free_voice';

export interface AnswerOption {
  id: string;
  label: string; // English label
  labelHi?: string;
  labelTa?: string;
  labelBn?: string;
  icon?: string; // emoji or icon name
  isRedFlagTrigger?: boolean; // if selected, immediately run red-flag check
}

export interface AdaptiveQuestion {
  id: string;
  phase: 'chief_complaint' | 'socrates' | 'past_history' | 'ayush_dashavidha' | 'lifestyle' | 'ros';
  socratesKey?: 'site' | 'onset' | 'character' | 'radiation' | 'associatedSymptoms' | 'timingDuration' | 'exacerbatingFactors' | 'relievingFactors' | 'severity';
  type: QuestionType;
  audioKey: string; // key into STRINGS[lang]
  labelKey: string;
  options?: AnswerOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required: boolean;
  branchCondition?: (answers: AdaptiveAnswers) => boolean; // if false, skip this question
  nextQuestionId?: string;
  redFlagOnSelect?: boolean;
}

export interface AdaptiveAnswers {
  chiefComplaint?: string;
  chiefComplaintTags?: string[];
  duration?: string;
  site?: string;
  onset?: string;
  character?: string;
  radiation?: string;
  associatedSymptoms?: string[];
  timing?: string;
  exacerbatingFactors?: string;
  relievingFactors?: string;
  severity?: number;
  pastMedical?: string;
  pastSurgical?: string;
  drugAllergy?: string;
  familyHistory?: string;
  personalHistory?: string;
  ros?: string[];
  // AYUSH Dashavidha
  prakriti?: string;
  vikriti?: string;
  sara?: string;
  samhanana?: string;
  pramana?: string;
  satmya?: string;
  satva?: string;
  aharaShakti?: string;
  vyayamaShakti?: string;
  vaya?: string;
  aharaPattern?: string;
  viharaRoutine?: string;
  sleepPattern?: string;
  appetiteState?: string;
  bowelHabit?: string;
}

// ==========================================
// ANSWER OPTIONS LIBRARY
// ==========================================

const CHIEF_COMPLAINT_OPTIONS: AnswerOption[] = [
  { id: 'joint_pain', label: 'Joint Pain / Arthritis', labelHi: 'जोड़ों का दर्द', labelTa: 'மூட்டு வலி', labelBn: 'জয়েন্টে ব্যথা', icon: '🦵' },
  { id: 'acidity', label: 'Acidity / Bloating / Indigestion', labelHi: 'अम्लपित्त / पेट फूलना', labelTa: 'அமிலம் / வீக்கம்', labelBn: 'অ্যাসিডিটি / বদহজম', icon: '🔥' },
  { id: 'headache', label: 'Headache / Migraine', labelHi: 'सिरदर्द / माइग्रेन', labelTa: 'தலைவலி / மைக்ரேன்', labelBn: 'মাথাব্যথা / মাইগ্রেন', icon: '🤕' },
  { id: 'back_pain', label: 'Back Pain / Spine Problem', labelHi: 'पीठ / कमर दर्द', labelTa: 'முதுகுவலி', labelBn: 'পিঠে ব্যথা', icon: '🔙' },
  { id: 'cough', label: 'Cough / Cold / Breathing Issue', labelHi: 'खांसी / सांस की तकलीफ', labelTa: 'இருமல் / சுவாசப் பிரச்னை', labelBn: 'কাশি / শ্বাসের সমস্যা', icon: '😷', isRedFlagTrigger: true },
  { id: 'chest', label: 'Chest Pain / Heart Problem', labelHi: 'सीने में दर्द', labelTa: 'மார்பு வலி', labelBn: 'বুকে ব্যথা', icon: '❤️', isRedFlagTrigger: true },
  { id: 'skin', label: 'Skin Problem / Rash / Itching', labelHi: 'त्वचा समस्या / खुजली', labelTa: 'தோல் பிரச்னை / அரிப்பு', labelBn: 'ত্বকের সমস্যা / চুলকানি', icon: '🩹' },
  { id: 'stress', label: 'Stress / Anxiety / Sleep Problem', labelHi: 'तनाव / चिंता / नींद', labelTa: 'மன அழுத்தம் / தூக்கமின்மை', labelBn: 'মানসিক চাপ / ঘুমের সমস্যা', icon: '😰' },
  { id: 'digestion', label: 'Digestion / Stomach Problem', labelHi: 'पाचन / पेट की समस्या', labelTa: 'செரிமான பிரச்னை', labelBn: 'হজমের সমস্যা', icon: '🤢' },
  { id: 'fever', label: 'Fever / Body Ache / Weakness', labelHi: 'बुखार / कमजोरी', labelTa: 'காய்ச்சல் / உடல் வலி', labelBn: 'জ্বর / শরীর ব্যথা', icon: '🌡️' },
  { id: 'other', label: 'Other Problem', labelHi: 'अन्य समस्या', labelTa: 'மற்ற பிரச்னை', labelBn: 'অন্য সমস্যা', icon: '🏥' },
];

const SITE_OPTIONS: AnswerOption[] = [
  { id: 'head', label: 'Head / Temple / Face', labelHi: 'सिर / कनपटी / चेहरा', labelTa: 'தலை / முகம்', labelBn: 'মাথা / মুখ', icon: '🧠' },
  { id: 'neck', label: 'Neck & Shoulders', labelHi: 'गर्दन और कंधे', labelTa: 'கழுத்து மற்றும் தோள்கள்', labelBn: 'ঘাড় ও কাঁধ', icon: '🦴' },
  { id: 'chest', label: 'Chest (Front / Breast)', labelHi: 'छाती (आगे)', labelTa: 'மார்பு', labelBn: 'বুক', icon: '❤️', isRedFlagTrigger: true },
  { id: 'upper_abdomen', label: 'Upper Abdomen / Stomach', labelHi: 'ऊपरी पेट', labelTa: 'மேல் வயிறு', labelBn: 'উপরের পেট', icon: '🔴' },
  { id: 'lower_abdomen', label: 'Lower Abdomen / Pelvis', labelHi: 'निचला पेट', labelTa: 'கீழ் வயிறு', labelBn: 'নিচের পেট', icon: '🔵' },
  { id: 'back', label: 'Upper / Lower Back (Spine)', labelHi: 'पीठ / रीढ़ की हड्डी', labelTa: 'முதுகு', labelBn: 'পিঠ', icon: '🔙' },
  { id: 'arms', label: 'Arms / Hands / Wrists', labelHi: 'हाथ / कलाई', labelTa: 'கைகள் / மணிக்கட்டு', labelBn: 'হাত / কব্জি', icon: '💪' },
  { id: 'legs', label: 'Legs / Knees / Feet', labelHi: 'पैर / घुटने', labelTa: 'கால்கள் / முழங்கால்', labelBn: 'পা / হাঁটু', icon: '🦵' },
  { id: 'whole_body', label: 'Whole Body / Generalised', labelHi: 'पूरा शरीर', labelTa: 'முழு உடல்', labelBn: 'সারা শরীর', icon: '🧍' },
  { id: 'skin', label: 'Skin / Surface', labelHi: 'त्वचा', labelTa: 'தோல்', labelBn: 'ত্বক', icon: '🩹' },
];

const ONSET_OPTIONS: AnswerOption[] = [
  { id: 'sudden', label: 'Sudden — came on quickly', labelHi: 'अचानक आया', labelTa: 'திடீரென்று', labelBn: 'হঠাৎ এসেছে', icon: '⚡', isRedFlagTrigger: true },
  { id: 'gradual', label: 'Gradual — slowly got worse over time', labelHi: 'धीरे-धीरे बढ़ा', labelTa: 'மெதுவாக வளர்ந்தது', labelBn: 'ধীরে ধীরে খারাপ হয়েছে', icon: '📈' },
  { id: 'intermittent', label: 'Comes and goes in attacks / episodes', labelHi: 'दौरे में आता है', labelTa: 'மாறி மாறி வருகிறது', labelBn: 'আসে-যায়', icon: '🔄' },
  { id: 'seasonal', label: 'Worse in a particular season / weather', labelHi: 'मौसम में बढ़ता है', labelTa: 'ஒரு குறிப்பிட்ட பருவத்தில் அதிகமாகிறது', labelBn: 'নির্দিষ্ট মৌসুমে বাড়ে', icon: '🌦️' },
];

const CHARACTER_OPTIONS: AnswerOption[] = [
  { id: 'dull', label: 'Dull / Aching', labelHi: 'मीठा दर्द / दुखन', labelTa: 'மந்தமான வலி', labelBn: 'মন্থর ব্যথা', icon: '😐' },
  { id: 'throbbing', label: 'Throbbing / Pulsating', labelHi: 'धड़कन जैसा दर्द', labelTa: 'துடிக்கும் வலி', labelBn: 'ধড়ফড়ানো ব্যথা', icon: '💓' },
  { id: 'burning', label: 'Burning / Hot sensation', labelHi: 'जलन / दाह', labelTa: 'எரிவு', labelBn: 'জ্বলুনি / গরম অনুভব', icon: '🔥' },
  { id: 'sharp', label: 'Sharp / Stabbing / Cutting', labelHi: 'तेज / चुभने वाला दर्द', labelTa: 'கூர்மையான வலி', labelBn: 'তীক্ষ্ণ / ছুরিকাঘাতের মতো', icon: '🔪' },
  { id: 'stiffness', label: 'Stiffness / Tightness / Heaviness', labelHi: 'जकड़न / भारीपन', labelTa: 'விறைப்பு / கனம்', labelBn: 'শক্ত অনুভব / ভার', icon: '🪨' },
  { id: 'pressure', label: 'Pressure / Squeezing', labelHi: 'दबाव / दबन जैसा', labelTa: 'அழுத்தம்', labelBn: 'চাপ অনুভব', icon: '🤜', isRedFlagTrigger: true },
  { id: 'tingling', label: 'Tingling / Numbness / Pins & Needles', labelHi: 'झुनझुनाहट / सुन्नता', labelTa: 'கூச்சம் / உணர்விழப்பு', labelBn: 'ঝিনঝিনানি / অসাড়তা', icon: '⚡' },
];

const RADIATION_OPTIONS: AnswerOption[] = [
  { id: 'localized', label: 'Stays in one place — does not spread', labelHi: 'एक ही जगह रहता है', labelTa: 'ஒரே இடத்தில் இருக்கிறது', labelBn: 'এক জায়গায় থাকে', icon: '📍' },
  { id: 'left_arm_jaw', label: 'Spreads to left arm or jaw (🚨 Emergency sign)', labelHi: 'बाएं हाथ या जबड़े में जाता है (🚨)', labelTa: 'இடது கை அல்லது தாடைக்கு பரவுகிறது (🚨)', labelBn: 'বাম হাত বা চোয়ালে ছড়ায় (🚨)', icon: '🚨', isRedFlagTrigger: true },
  { id: 'down_leg', label: 'Goes down one leg (sciatica-like)', labelHi: 'एक पैर में नीचे जाता है', labelTa: 'ஒரு காலில் கீழ்நோக்கி பரவுகிறது', labelBn: 'একটি পায়ে নিচে যায়', icon: '🦵' },
  { id: 'neck_back', label: 'Spreads to neck or back', labelHi: 'गर्दन या पीठ में जाता है', labelTa: 'கழுத்து அல்லது முதுகுக்கு பரவுகிறது', labelBn: 'ঘাড় বা পিঠে ছড়ায়', icon: '🔙' },
  { id: 'whole', label: 'Spreads all over / generalised', labelHi: 'पूरे शरीर में', labelTa: 'முழு உடலிலும்', labelBn: 'সারা শরীরে', icon: '🧍' },
];

const ASSOCIATED_OPTIONS: AnswerOption[] = [
  { id: 'nausea', label: 'Nausea / Vomiting', labelHi: 'मतली / उल्टी', labelTa: 'குமட்டல் / வாந்தி', labelBn: 'বমি বমি ভাব / বমি', icon: '🤢' },
  { id: 'breathless', label: 'Breathlessness / Difficulty breathing', labelHi: 'सांस लेने में तकलीफ', labelTa: 'மூச்சு திணறல்', labelBn: 'শ্বাসকষ্ট', icon: '😮‍💨', isRedFlagTrigger: true },
  { id: 'fever', label: 'Fever', labelHi: 'बुखार', labelTa: 'காய்ச்சல்', labelBn: 'জ্বর', icon: '🌡️' },
  { id: 'sweat', label: 'Sweating / Chills', labelHi: 'पसीना / ठंड लगना', labelTa: 'வியர்வை / குளிரோடிக்கல்', labelBn: 'ঘাম / ঠান্ডা লাগা', icon: '💧', isRedFlagTrigger: true },
  { id: 'fatigue', label: 'Fatigue / Weakness', labelHi: 'थकान / कमजोरी', labelTa: 'சோர்வு / பலவீனம்', labelBn: 'ক্লান্তি / দুর্বলতা', icon: '😴' },
  { id: 'swelling', label: 'Swelling', labelHi: 'सूजन', labelTa: 'வீக்கம்', labelBn: 'ফোলা', icon: '🦶' },
  { id: 'dizziness', label: 'Dizziness / Giddiness', labelHi: 'चक्कर', labelTa: 'தலைசுற்றல்', labelBn: 'মাথাঘোরা', icon: '🌀', isRedFlagTrigger: true },
  { id: 'loss_appetite', label: 'Loss of appetite / Weight loss', labelHi: 'भूख न लगना / वजन घटना', labelTa: 'பசியின்மை / எடை குறைப்பு', labelBn: 'খিদে কমে যাওয়া / ওজন কমা', icon: '⚖️' },
  { id: 'none', label: 'None of the above', labelHi: 'इनमें से कोई नहीं', labelTa: 'மேற்கண்டவை ஏதுமில்லை', labelBn: 'উপরের কোনোটি নয়', icon: '✅' },
];

const TIMING_OPTIONS: AnswerOption[] = [
  { id: 'constant', label: 'Constant — always there', labelHi: 'हमेशा रहता है', labelTa: 'எப்போதும் இருக்கிறது', labelBn: 'সবসময় থাকে', icon: '⏳' },
  { id: 'intermittent', label: 'Comes and goes', labelHi: 'आता-जाता है', labelTa: 'வந்து போகிறது', labelBn: 'আসে-যায়', icon: '🔄' },
  { id: 'morning', label: 'Worse in the morning', labelHi: 'सुबह में ज्यादा', labelTa: 'காலையில் அதிகம்', labelBn: 'সকালে বেশি', icon: '🌅' },
  { id: 'night', label: 'Worse at night', labelHi: 'रात में ज्यादा', labelTa: 'இரவில் அதிகம்', labelBn: 'রাতে বেশি', icon: '🌙' },
  { id: 'after_eating', label: 'After eating', labelHi: 'खाने के बाद', labelTa: 'சாப்பிட்ட பிறகு', labelBn: 'খাওয়ার পরে', icon: '🍽️' },
  { id: 'with_activity', label: 'With physical activity / exertion', labelHi: 'काम करने पर', labelTa: 'உடல் உழைப்பில்', labelBn: 'শারীরিক পরিশ্রমে', icon: '🏃', isRedFlagTrigger: true },
];

const DURATION_OPTIONS: AnswerOption[] = [
  { id: 'today', label: 'Started today', labelHi: 'आज शुरू हुआ', labelTa: 'இன்று தொடங்கியது', labelBn: 'আজ শুরু হয়েছে', icon: '📅' },
  { id: 'few_days', label: 'A few days (2–7 days)', labelHi: '2-7 दिन', labelTa: '2-7 நாட்கள்', labelBn: '২-৭ দিন', icon: '📆' },
  { id: 'weeks', label: 'A few weeks (1–4 weeks)', labelHi: '1-4 हफ्ते', labelTa: '1-4 வாரங்கள்', labelBn: '১-৪ সপ্তাহ', icon: '🗓️' },
  { id: 'months', label: '1–6 months', labelHi: '1-6 महीने', labelTa: '1-6 மாதங்கள்', labelBn: '১-৬ মাস', icon: '📊' },
  { id: 'year_plus', label: 'More than 6 months / years', labelHi: '6 महीने से ज्यादा', labelTa: '6 மாதங்களுக்கும் மேல்', labelBn: '৬ মাসের বেশি', icon: '📈' },
];

const PRAKRITI_OPTIONS: AnswerOption[] = [
  { id: 'vata', label: 'Thin build, dry skin, talks a lot, light sleeper, anxious', labelHi: 'पतला शरीर, रूखी त्वचा, बहुत बोलते हैं, नींद कम, चिंता', labelTa: 'மெல்லிய உடல், வறண்ட தோல், அதிகமாக பேசுவீர்கள்', labelBn: 'চিকন, শুষ্ক ত্বক, বেশি কথা বলেন, অস্থির', icon: '💨' },
  { id: 'pitta', label: 'Medium build, warm body, sharp mind, easily irritated', labelHi: 'मध्यम शरीर, गर्म स्वभाव, तेज दिमाग, जल्दी गुस्सा आना', labelTa: 'நடுத்தர உடல், வெப்பமான உடல், கூர்மையான மனம்', labelBn: 'মাঝারি গড়ন, উষ্ণ শরীর, তীক্ষ্ণ মন', icon: '🔥' },
  { id: 'kapha', label: 'Heavier build, calm, slow digestion, loves sleep, loyal', labelHi: 'भारी शरीर, शांत स्वभाव, धीमा पाचन, ज्यादा नींद', labelTa: 'கனமான உடல், அமைதியான குணம், மெதுவான செரிமானம்', labelBn: 'ভারী গড়ন, শান্ত, ধীর হজম, ঘুম বেশি', icon: '🌊' },
  { id: 'mixed', label: 'A mix — I am not sure which type', labelHi: 'मिश्रित — मुझे नहीं पता', labelTa: 'கலவை — எனக்கு தெரியவில்லை', labelBn: 'মিশ্র — আমি নিশ্চিত নই', icon: '🔀' },
];

const ROS_OPTIONS: AnswerOption[] = [
  { id: 'eye', label: 'Eye / Vision problems', labelHi: 'आंखें / दृष्टि', labelTa: 'கண் பிரச்னை', labelBn: 'চোখ / দৃষ্টির সমস্যা', icon: '👁️' },
  { id: 'ear', label: 'Ear / Hearing / Tinnitus', labelHi: 'कान / सुनाई देना', labelTa: 'காது பிரச்னை', labelBn: 'কানের সমস্যা', icon: '👂' },
  { id: 'throat', label: 'Throat / Swallowing difficulty', labelHi: 'गला / निगलने में तकलीफ', labelTa: 'தொண்டை பிரச்னை', labelBn: 'গলার সমস্যা', icon: '🗣️' },
  { id: 'heart', label: 'Heart / Palpitations', labelHi: 'दिल / धड़कन', labelTa: 'இதய பிரச்னை', labelBn: 'হৃদয় / ধড়ফড়ানি', icon: '❤️', isRedFlagTrigger: true },
  { id: 'kidney', label: 'Kidney / Urinary problems', labelHi: 'गुर्दे / पेशाब की समस्या', labelTa: 'சிறுநீரகம் / சிறுநீர் பிரச்னை', labelBn: 'কিডনি / মূত্রের সমস্যা', icon: '🫘' },
  { id: 'bowel', label: 'Bowel / Digestion problems', labelHi: 'आंतें / पाचन', labelTa: 'குடல் / செரிமான பிரச்னை', labelBn: 'অন্ত্র / হজম সমস্যা', icon: '🔄' },
  { id: 'mental', label: 'Mental health / Mood / Memory', labelHi: 'मानसिक स्वास्थ्य / मूड / याददाश्त', labelTa: 'மன நலம் / மனநிலை', labelBn: 'মানসিক স্বাস্থ্য / মেজাজ', icon: '🧠' },
  { id: 'none', label: 'No other system problems', labelHi: 'कोई अन्य समस्या नहीं', labelTa: 'வேறு பிரச்னைகள் இல்லை', labelBn: 'অন্য কোনো সমস্যা নেই', icon: '✅' },
];

// ==========================================
// MASTER QUESTION SEQUENCE
// ==========================================

export const QUESTION_SEQUENCE: AdaptiveQuestion[] = [
  // ---- CHIEF COMPLAINT ----
  {
    id: 'chief_complaint',
    phase: 'chief_complaint',
    type: 'multi_select',
    labelKey: 'chiefComplaintQ',
    audioKey: 'chiefComplaintAudio',
    options: CHIEF_COMPLAINT_OPTIONS,
    required: true,
  },
  {
    id: 'duration',
    phase: 'chief_complaint',
    type: 'single_select',
    labelKey: 'durationQ',
    audioKey: 'durationQ',
    options: DURATION_OPTIONS,
    required: true,
  },
  // ---- SOCRATES ----
  {
    id: 'site',
    phase: 'socrates',
    socratesKey: 'site',
    type: 'single_select',
    labelKey: 'siteQ',
    audioKey: 'siteAudio',
    options: SITE_OPTIONS,
    required: true,
  },
  {
    id: 'onset',
    phase: 'socrates',
    socratesKey: 'onset',
    type: 'single_select',
    labelKey: 'onsetQ',
    audioKey: 'onsetAudio',
    options: ONSET_OPTIONS,
    required: true,
  },
  {
    id: 'character',
    phase: 'socrates',
    socratesKey: 'character',
    type: 'single_select',
    labelKey: 'characterQ',
    audioKey: 'characterAudio',
    options: CHARACTER_OPTIONS,
    required: true,
  },
  {
    id: 'radiation',
    phase: 'socrates',
    socratesKey: 'radiation',
    type: 'single_select',
    labelKey: 'radiationQ',
    audioKey: 'radiationAudio',
    options: RADIATION_OPTIONS,
    required: true,
    // Only ask radiation if the site is chest/arm/neck
    branchCondition: (ans) => ['chest', 'neck', 'arms', 'head', 'back'].includes(ans.site || ''),
  },
  {
    id: 'associated',
    phase: 'socrates',
    socratesKey: 'associatedSymptoms',
    type: 'multi_select',
    labelKey: 'associatedQ',
    audioKey: 'associatedAudio',
    options: ASSOCIATED_OPTIONS,
    required: false,
  },
  {
    id: 'timing',
    phase: 'socrates',
    socratesKey: 'timingDuration',
    type: 'single_select',
    labelKey: 'timingQ',
    audioKey: 'timingAudio',
    options: TIMING_OPTIONS,
    required: true,
  },
  {
    id: 'exacerbating',
    phase: 'socrates',
    socratesKey: 'exacerbatingFactors',
    type: 'free_voice',
    labelKey: 'exacerbatingQ',
    audioKey: 'exacerbatingAudio',
    placeholder: 'e.g. Walking, Cold weather, Spicy food, Stress',
    required: false,
  },
  {
    id: 'relieving',
    phase: 'socrates',
    socratesKey: 'relievingFactors',
    type: 'free_voice',
    labelKey: 'relievingQ',
    audioKey: 'relievingAudio',
    placeholder: 'e.g. Rest, Warm water, Medicines, Lying down',
    required: false,
  },
  {
    id: 'severity',
    phase: 'socrates',
    socratesKey: 'severity',
    type: 'slider',
    labelKey: 'severityQ',
    audioKey: 'severityAudio',
    min: 1,
    max: 10,
    step: 1,
    required: true,
  },
  // ---- PAST HISTORY ----
  {
    id: 'past_medical',
    phase: 'past_history',
    type: 'free_voice',
    labelKey: 'pastMedicalQ',
    audioKey: 'pastMedicalQ',
    placeholder: 'e.g. Diabetes, Hypertension, Thyroid, Asthma…',
    required: false,
  },
  {
    id: 'past_surgical',
    phase: 'past_history',
    type: 'yes_no',
    labelKey: 'pastSurgicalQ',
    audioKey: 'pastSurgicalQ',
    required: false,
  },
  {
    id: 'drug_allergy',
    phase: 'past_history',
    type: 'yes_no',
    labelKey: 'drugAllergyQ',
    audioKey: 'drugAllergyQ',
    required: false,
  },
  {
    id: 'family_history',
    phase: 'past_history',
    type: 'free_voice',
    labelKey: 'familyHistoryQ',
    audioKey: 'familyHistoryQ',
    placeholder: 'e.g. Diabetes in father, Cancer in mother…',
    required: false,
  },
  {
    id: 'personal_history',
    phase: 'past_history',
    type: 'free_voice',
    labelKey: 'personalHistoryQ',
    audioKey: 'personalHistoryQ',
    placeholder: 'e.g. Non-smoker, vegetarian, office job, stress…',
    required: false,
  },
  {
    id: 'ros',
    phase: 'past_history',
    type: 'multi_select',
    labelKey: 'rosQ',
    audioKey: 'rosQ',
    options: ROS_OPTIONS,
    required: false,
  },
  // ---- AYUSH DASHAVIDHA ----
  {
    id: 'prakriti',
    phase: 'ayush_dashavidha',
    type: 'single_select',
    labelKey: 'prakritiQ',
    audioKey: 'prakritiQ',
    options: PRAKRITI_OPTIONS,
    required: false,
  },
  {
    id: 'ahara_shakti',
    phase: 'ayush_dashavidha',
    type: 'single_select',
    labelKey: 'aharaShaktiQ',
    audioKey: 'aharaShaktiQ',
    options: [
      { id: 'good', label: 'Good — feel hungry regularly', labelHi: 'अच्छी — नियमित भूख', labelTa: 'நல்லது', labelBn: 'ভালো', icon: '😋' },
      { id: 'low', label: 'Low — rarely feel hungry', labelHi: 'कम — कम भूख लगती है', labelTa: 'குறைவு', labelBn: 'কম', icon: '😐' },
      { id: 'variable', label: 'Variable — sometimes good, sometimes not', labelHi: 'बदलती रहती है', labelTa: 'மாறுபடுகிறது', labelBn: 'পরিবর্তনশীল', icon: '🔄' },
      { id: 'excessive', label: 'Excessive — always hungry', labelHi: 'बहुत ज्यादा — हमेशा भूख', labelTa: 'அதிகமான பசி', labelBn: 'অত্যধিক', icon: '🍽️' },
    ],
    required: false,
  },
  {
    id: 'ahara_pattern',
    phase: 'lifestyle',
    type: 'free_voice',
    labelKey: 'aharaPatternQ',
    audioKey: 'aharaPatternQ',
    placeholder: 'e.g. Vegetarian, 3 meals a day, spicy food, tea drinker…',
    required: false,
  },
  {
    id: 'vihara_routine',
    phase: 'lifestyle',
    type: 'free_voice',
    labelKey: 'viharaRoutineQ',
    audioKey: 'viharaRoutineQ',
    placeholder: 'e.g. Sleeps 7 hours, wakes at 6am, light walk daily…',
    required: false,
  },
];

// ==========================================
// ENGINE FUNCTIONS
// ==========================================

/** Returns the questions that should be shown given current answers */
export const getActiveQuestions = (answers: AdaptiveAnswers): AdaptiveQuestion[] => {
  return QUESTION_SEQUENCE.filter((q) => {
    if (!q.branchCondition) return true;
    return q.branchCondition(answers);
  });
};

/** Returns the next unanswered question index */
export const getNextQuestionIndex = (answers: AdaptiveAnswers, currentIdx: number): number => {
  const active = getActiveQuestions(answers);
  return Math.min(currentIdx + 1, active.length - 1);
};

/** Get option label in given language */
export const getOptionLabel = (option: AnswerOption, lang: SupportedLang): string => {
  if (lang === 'hi' && option.labelHi) return option.labelHi;
  if (lang === 'ta' && option.labelTa) return option.labelTa;
  if (lang === 'bn' && option.labelBn) return option.labelBn;
  return option.label;
};

/** Check if any selected option in a question is a red-flag trigger */
export const checkAnswerForRedFlag = (question: AdaptiveQuestion, selectedIds: string[]): boolean => {
  if (!question.options) return false;
  return question.options.some((opt) => opt.isRedFlagTrigger && selectedIds.includes(opt.id));
};

/** Convert adaptive answers to SocratesHPI object */
export const answersToSocratesHpi = (answers: AdaptiveAnswers) => ({
  site: answers.site || '',
  onset: answers.onset || '',
  character: answers.character || '',
  radiation: answers.radiation || '',
  associatedSymptoms: answers.associatedSymptoms || [],
  timingDuration: answers.timing || '',
  exacerbatingFactors: answers.exacerbatingFactors || '',
  relievingFactors: answers.relievingFactors || '',
  severity: answers.severity || 5,
});
