// MediKiosk AI — Post-Visit Discharge Card
// Auto-generated patient-friendly summary after OPD token is issued
// Shows AYUSH-system-specific advice, shareable via WhatsApp, printable

import React, { useState } from 'react';
import { useA11y } from './AccessibilityProvider';
import type { PreConsultationIntake } from '../types';

interface DischargeCardProps {
  intake: PreConsultationIntake;
  onClose?: () => void;
}

// AYUSH-system-specific general advice
const AYUSH_ADVICE: Record<string, {
  diet: { en: string; hi: string; ta: string; bn: string };
  lifestyle: { en: string; hi: string; ta: string; bn: string };
  avoid: { en: string; hi: string; ta: string; bn: string };
  emoji: string;
}> = {
  'Ayurveda': {
    emoji: '🌿',
    diet: {
      en: 'Eat warm, freshly cooked meals. Include ginger, turmeric, and seasonal vegetables. Avoid cold, stale, or processed food.',
      hi: 'गर्म, ताजा पकाया हुआ भोजन करें। अदरक, हल्दी और मौसमी सब्जियां शामिल करें। ठंडा, बासी या प्रसंस्कृत भोजन से बचें।',
      ta: 'சூடான, புதிதாக சமைத்த உணவு சாப்பிடவும். இஞ்சி, மஞ்சள் மற்றும் பருவகால காய்கறிகள் சேர்க்கவும். குளிர், பழைய உணவு தவிர்க்கவும்.',
      bn: 'উষ্ণ, তাজা রান্না করা খাবার খান। আদা, হলুদ এবং মৌসুমি সবজি অন্তর্ভুক্ত করুন। ঠান্ডা, বাসি বা প্রক্রিয়াজাত খাবার এড়িয়ে চলুন।',
    },
    lifestyle: {
      en: 'Wake before sunrise. Practice Surya Namaskar or gentle yoga. Sleep before 10 PM. Oil massage (Abhyanga) weekly.',
      hi: 'सूर्योदय से पहले उठें। सूर्य नमस्कार या हल्का योग करें। रात 10 बजे से पहले सोएं। साप्ताहिक तेल मालिश (अभ्यंग) करें।',
      ta: 'சூரிய உதயத்திற்கு முன் எழுங்கள். சூர்ய நமஸ்காரம் அல்லது மெதுவான யோகா செய்யுங்கள். இரவு 10 மணிக்கு முன் தூங்குங்கள்.',
      bn: 'সূর্যোদয়ের আগে উঠুন। সূর্য নমস্কার বা হালকা যোগা করুন। রাত ১০টার আগে ঘুমান।',
    },
    avoid: {
      en: 'Avoid incompatible foods (e.g., milk with fish). Avoid sleeping after meals. Avoid suppressing natural urges.',
      hi: 'विरुद्ध आहार (जैसे दूध के साथ मछली) से बचें। भोजन के बाद सोने से बचें।',
      ta: 'பொருந்தாத உணவுகளை (பால் மற்றும் மீன்) தவிர்க்கவும். உணவிற்கு பிறகு தூங்க வேண்டாம்.',
      bn: 'অসামঞ্জস্যপূর্ণ খাবার (যেমন দুধের সাথে মাছ) এড়িয়ে চলুন। খাবার পরে ঘুমাবেন না।',
    },
  },
  'Homoeopathy': {
    emoji: '💊',
    diet: {
      en: 'Avoid coffee, mint, strong spices, and camphor — these can antidote homoeopathic medicines. Eat simple, light meals.',
      hi: 'कॉफी, पुदीना, तीखे मसाले और कपूर से बचें — ये होम्योपैथिक दवाओं को निष्क्रिय कर सकते हैं। सरल, हल्का भोजन लें।',
      ta: 'காபி, புதினா, கடுமையான மசாலாகள், கற்பூரம் தவிர்க்கவும் — இவை ஹோமியோபதி மருந்துகளை நடுநிலையாக்கும். எளிய, இலகுவான உணவு சாப்பிடவும்.',
      bn: 'কফি, পুদিনা, তীব্র মশলা এবং কর্পূর এড়িয়ে চলুন — এগুলো হোমিওপ্যাথি ওষুধকে নিষ্ক্রিয় করতে পারে।',
    },
    lifestyle: {
      en: 'Take medicines 15 minutes before or after eating. Keep medicines away from strong smells. Maintain a calm, stress-free routine.',
      hi: 'खाने से 15 मिनट पहले या बाद में दवाएं लें। तेज गंध से दूर रखें। शांत, तनाव-मुक्त दिनचर्या बनाए रखें।',
      ta: 'சாப்பிடுவதற்கு 15 நிமிடங்கள் முன் அல்லது பின் மருந்துகள் எடுக்கவும். வலுவான வாசனைகளிலிருந்து மருந்துகளை விலக்கி வையுங்கள்.',
      bn: 'খাওয়ার ১৫ মিনিট আগে বা পরে ওষুধ নিন। তীব্র গন্ধ থেকে দূরে রাখুন।',
    },
    avoid: {
      en: 'Avoid self-medication. Never crush homoeopathic pills. Do not handle pills with metal spoons.',
      hi: 'स्व-दवाई से बचें। होम्योपैथिक गोलियों को कभी न कुचलें। धातु के चम्मच से न छुएं।',
      ta: 'சுய மருத்துவம் தவிர்க்கவும். ஹோமியோபதி மாத்திரைகளை ஒருபோதும் நொறுக்காதீர்கள்.',
      bn: 'স্ব-ওষুধ এড়িয়ে চলুন। হোমিওপ্যাথি বড়ি কখনো চূর্ণ করবেন না।',
    },
  },
  'Unani': {
    emoji: '⚗️',
    diet: {
      en: 'Eat according to your Mizaj (temperament). Warm-natured foods for cold Mizaj; cool foods for hot Mizaj. Stay hydrated.',
      hi: 'अपने मिज़ाज के अनुसार खाएं। ठंडे मिज़ाज के लिए गर्म भोजन; गर्म मिज़ाज के लिए ठंडा भोजन।',
      ta: 'உங்கள் மிஜாஜ் (குணம்) படி சாப்பிடவும். குளிர் மிஜாஜுக்கு சூடான உணவு; சூடான மிஜாஜுக்கு குளிர் உணவு.',
      bn: 'আপনার মিজাজ অনুযায়ী খান। ঠান্ডা মিজাজের জন্য উষ্ণ খাবার; উষ্ণ মিজাজের জন্য ঠান্ডা খাবার।',
    },
    lifestyle: {
      en: 'Regular exercise (Riyazat) appropriate to constitution. Adequate sleep. Fresh air. Avoid excessive stress.',
      hi: 'प्रकृति के अनुसार नियमित व्यायाम (रियाज़त)। पर्याप्त नींद। ताजी हवा।',
      ta: 'உடலமைப்பிற்கு ஏற்ற வழக்கமான உடற்பயிற்சி (ரியாஜத்). போதுமான தூக்கம். புதிய காற்று.',
      bn: 'সংবিধান অনুযায়ী নিয়মিত ব্যায়াম (রিয়াযাত)। পর্যাপ্ত ঘুম। তাজা বাতাস।',
    },
    avoid: {
      en: 'Avoid foods opposite to your Mizaj. Avoid Mudirr (diuretics) without prescription. Excessive cold water.',
      hi: 'अपने मिज़ाज के विपरीत भोजन से बचें। बिना पर्चे के मूत्रवर्धक से बचें।',
      ta: 'உங்கள் மிஜாஜுக்கு எதிரான உணவுகளை தவிர்க்கவும்.',
      bn: 'আপনার মিজাজের বিপরীত খাবার এড়িয়ে চলুন।',
    },
  },
  'Siddha': {
    emoji: '🔮',
    diet: {
      en: 'Follow Pathiyam (dietary regimen) as advised. Avoid incompatible foods. Include Agathiyar-recommended herbs.',
      hi: 'निर्देशानुसार Pathiyam (आहार नियम) का पालन करें।',
      ta: 'அறிவுறுத்தப்பட்டபடி பதியம் (உணவு முறை) பின்பற்றவும். ஆகத்தியர் பரிந்துரைத்த மூலிகைகள் சேர்க்கவும்.',
      bn: 'নির্দেশ অনুযায়ী Pathiyam অনুসরণ করুন।',
    },
    lifestyle: {
      en: 'Practice Varmam-based exercises. Maintain body temperature balance. Avoid extreme hot/cold environments.',
      hi: 'वर्मम-आधारित व्यायाम करें। शरीर तापमान संतुलन बनाए रखें।',
      ta: 'வர்மம் அடிப்படையிலான உடற்பயிற்சிகள் செய்யுங்கள். உடல் வெப்பநிலை சமநிலை பராமரிக்கவும்.',
      bn: 'Varmam-ভিত্তিক ব্যায়াম করুন। শরীরের তাপমাত্রার ভারসাম্য বজায় রাখুন।',
    },
    avoid: {
      en: 'Avoid spicy, oily foods during treatment. Avoid heavy physical activity immediately after treatment.',
      hi: 'उपचार के दौरान मसालेदार, तैलीय भोजन से बचें।',
      ta: 'சிகிச்சையின் போது காரமான, எண்ணெய் நிறைந்த உணவுகளை தவிர்க்கவும்.',
      bn: 'চিকিৎসার সময় মসলাদার, তেলযুক্ত খাবার এড়িয়ে চলুন।',
    },
  },
  'Yoga & Naturopathy': {
    emoji: '🧘',
    diet: {
      en: 'Eat sattvic (pure, light) foods — fresh fruits, vegetables, whole grains, nuts. Avoid non-vegetarian, processed, and refined food.',
      hi: 'सात्विक (शुद्ध, हल्का) भोजन करें — ताजे फल, सब्जियां, साबुत अनाज, मेवे। मांसाहारी, प्रसंस्कृत भोजन से बचें।',
      ta: 'சாத்விக் (தூய்மையான, இலகுவான) உணவுகள் சாப்பிடவும் — புதிய பழங்கள், காய்கறிகள், முழு தானியங்கள்.',
      bn: 'সাত্ত্বিক (বিশুদ্ধ, হালকা) খাবার খান — তাজা ফল, সবজি, গোটা শস্য।',
    },
    lifestyle: {
      en: 'Daily 30-min yoga practice. 10-min Pranayama morning & evening. Nature walks. Hydrotherapy as advised. Early to bed, early to rise.',
      hi: 'दैनिक 30 मिनट योगाभ्यास। सुबह और शाम 10 मिनट प्राणायाम। प्रकृति में सैर।',
      ta: 'தினமும் 30 நிமிட யோகா. காலை மாலை 10 நிமிட பிராணாயாமம். இயற்கை நடைப்பயிற்சி.',
      bn: 'প্রতিদিন ৩০ মিনিট যোগাভ্যাস। সকাল ও সন্ধ্যায় ১০ মিনিট প্রাণায়াম।',
    },
    avoid: {
      en: 'Avoid stimulants (tea, coffee, alcohol). Avoid negative thinking and stress. No screen time before sleep.',
      hi: 'उत्तेजक (चाय, कॉफी, शराब) से बचें। नकारात्मक सोच और तनाव से बचें।',
      ta: 'தேநீர், காபி, மது தவிர்க்கவும். எதிர்மறை சிந்தனை மற்றும் மன அழுத்தம் தவிர்க்கவும்.',
      bn: 'উদ্দীপক (চা, কফি, মদ) এড়িয়ে চলুন। নেতিবাচক চিন্তা ও মানসিক চাপ এড়িয়ে চলুন।',
    },
  },
};

export const DischargeCard: React.FC<DischargeCardProps> = ({ intake, onClose }) => {
  const { lang, speak } = useA11y();
  const [isSharing, setIsSharing] = useState(false);

  const advice = AYUSH_ADVICE[intake.preferredAyushSystem] ?? AYUSH_ADVICE['Ayurveda'];
  const today = new Date();
  const nextVisit = new Date(today);
  nextVisit.setDate(nextVisit.getDate() + 7);

  const readCardAloud = () => {
    const txt = [
      `Discharge card for ${intake.patientName}.`,
      `Token number ${intake.tokenNumber}.`,
      `${intake.preferredAyushSystem} OPD.`,
      `Chief complaint: ${intake.chiefComplaints}.`,
      `Diet advice: ${advice.diet[lang] ?? advice.diet.en}`,
      `Lifestyle advice: ${advice.lifestyle[lang] ?? advice.lifestyle.en}`,
      `Please avoid: ${advice.avoid[lang] ?? advice.avoid.en}`,
      `Your next appointment is recommended in 7 days.`,
    ].join(' ');
    speak(txt);
  };

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    const text = [
      `🏥 *MediKiosk AI — Discharge Card*`,
      `Patient: ${intake.patientName}`,
      `Token: ${intake.tokenNumber}`,
      `System: ${intake.preferredAyushSystem}`,
      `Chief Complaint: ${intake.chiefComplaints}`,
      ``,
      `🌿 *Diet:* ${advice.diet.en}`,
      `🧘 *Lifestyle:* ${advice.lifestyle.en}`,
      `❌ *Avoid:* ${advice.avoid.en}`,
      ``,
      `📅 Next visit recommended: ${nextVisit.toLocaleDateString('en-IN')}`,
      ``,
      `_Generated by MediKiosk AI — SIH-26047_`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Discharge Card', text });
      } catch { /* user cancelled */ }
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
    setIsSharing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="w-full bg-white rounded-3xl border-2 border-teal-200 overflow-hidden shadow-xl print-card"
      role="region"
      aria-label="Discharge card"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl" aria-hidden="true">📋</span>
            <div>
              <p className="text-white font-black text-lg leading-tight">
                {lang === 'hi' ? 'छुट्टी कार्ड' : lang === 'ta' ? 'வெளியேற்ற அட்டை' : lang === 'bn' ? 'ডিসচার্জ কার্ড' : 'Discharge Card'}
              </p>
              <p className="text-teal-200 text-sm">MediKiosk AI · {today.toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Read card aloud"
            onClick={readCardAloud}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
          >
            🔊
          </button>
          {onClose && (
            <button
              type="button"
              aria-label="Close discharge card"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Patient info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3">
            <p className="text-xs text-slate-500 font-medium">Patient</p>
            <p className="font-bold text-slate-800">{intake.patientName}</p>
            <p className="text-sm text-slate-500">{intake.age} yrs · {intake.gender}</p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-3">
            <p className="text-xs text-teal-600 font-medium">OPD Token</p>
            <p className="font-black text-teal-800 text-xl">{intake.tokenNumber}</p>
            <p className="text-sm text-teal-600">{intake.preferredAyushSystem}</p>
          </div>
        </div>

        {/* Chief complaint */}
        {intake.chiefComplaints && (
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs text-blue-600 font-semibold mb-1">
              {lang === 'hi' ? 'मुख्य शिकायत' : lang === 'ta' ? 'முதன்மை புகார்' : lang === 'bn' ? 'প্রধান অভিযোগ' : 'Chief Complaint'}
            </p>
            <p className="text-slate-700 font-medium">{intake.chiefComplaints}</p>
          </div>
        )}

        {/* Red flag warning */}
        {intake.isRedFlagEmergency && (
          <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-3xl" aria-hidden="true">🚨</span>
            <div>
              <p className="font-bold text-red-700">Priority Patient</p>
              <p className="text-red-600 text-sm">Emergency symptoms detected. Please inform a staff member immediately.</p>
            </div>
          </div>
        )}

        {/* AYUSH system advice */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span aria-hidden="true">{advice.emoji}</span>
            {intake.preferredAyushSystem} — {lang === 'hi' ? 'उपचार सलाह' : lang === 'ta' ? 'சிகிச்சை ஆலோசனை' : lang === 'bn' ? 'চিকিৎসা পরামর্শ' : 'Care Instructions'}
          </p>

          {/* Diet */}
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" aria-hidden="true">🥗</span>
              <p className="font-semibold text-green-800">
                {lang === 'hi' ? 'आहार' : lang === 'ta' ? 'உணவு' : lang === 'bn' ? 'খাদ্য' : 'Diet'}
              </p>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              {advice.diet[lang] ?? advice.diet.en}
            </p>
          </div>

          {/* Medicine timing (pictographic) */}
          <div className="bg-amber-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">💊</span>
              <p className="font-semibold text-amber-800">
                {lang === 'hi' ? 'दवा समय' : lang === 'ta' ? 'மருந்து நேரம்' : lang === 'bn' ? 'ওষুধের সময়' : 'Medicine Timings'}
              </p>
            </div>
            <p className="text-xs text-amber-700 mb-3">
              {lang === 'hi' ? 'डॉक्टर द्वारा दी गई दवाएं इस समय लें:' : 'Take medicines prescribed by your doctor at these times:'}
            </p>
            {/* Pictographic timing */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🌅', time: '7–8 AM', label: { en: 'Morning', hi: 'सुबह', ta: 'காலை', bn: 'সকাল' }, instruction: { en: 'Before/After breakfast', hi: 'नाश्ते से पहले/बाद', ta: 'காலை உணவுக்கு முன்/பின்', bn: 'সকালের খাবারের আগে/পরে' } },
                { icon: '☀️', time: '1–2 PM', label: { en: 'Afternoon', hi: 'दोपहर', ta: 'மதியம்', bn: 'দুপুর' }, instruction: { en: 'After lunch', hi: 'खाने के बाद', ta: 'மதிய உணவிற்கு பின்', bn: 'দুপুরের খাবারের পরে' } },
                { icon: '🌙', time: '9–10 PM', label: { en: 'Night', hi: 'रात', ta: 'இரவு', bn: 'রাত' }, instruction: { en: 'Before sleep', hi: 'सोने से पहले', ta: 'தூக்கத்திற்கு முன்', bn: 'ঘুমানোর আগে' } },
              ].map(slot => (
                <div key={slot.time} className="bg-white rounded-xl p-2 text-center border border-amber-200">
                  <span className="text-3xl block mb-1" aria-hidden="true">{slot.icon}</span>
                  <p className="text-xs font-bold text-amber-800">{slot.label[lang] ?? slot.label.en}</p>
                  <p className="text-xs text-amber-600 mt-0.5">{slot.time}</p>
                  <p className="text-[10px] text-amber-500 mt-1 leading-tight">{slot.instruction[lang] ?? slot.instruction.en}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-2 font-medium">
              ⚠️ {lang === 'hi' ? 'डॉक्टर की सलाह के बिना दवा न बदलें' : lang === 'ta' ? 'மருத்துவரின் ஆலோசனை இல்லாமல் மருந்து மாற்றாதீர்கள்' : lang === 'bn' ? 'ডাক্তারের পরামর্শ ছাড়া ওষুধ পরিবর্তন করবেন না' : "Don't change medicines without doctor's advice"}
            </p>
          </div>

          {/* Lifestyle */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" aria-hidden="true">🌅</span>
              <p className="font-semibold text-blue-800">
                {lang === 'hi' ? 'जीवनशैली' : lang === 'ta' ? 'வாழ்க்கை முறை' : lang === 'bn' ? 'জীবনধারা' : 'Lifestyle'}
              </p>
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              {advice.lifestyle[lang] ?? advice.lifestyle.en}
            </p>
          </div>

          {/* Avoid */}
          <div className="bg-red-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" aria-hidden="true">❌</span>
              <p className="font-semibold text-red-800">
                {lang === 'hi' ? 'इनसे बचें' : lang === 'ta' ? 'தவிர்க்க வேண்டியவை' : lang === 'bn' ? 'এড়িয়ে চলুন' : 'Avoid'}
              </p>
            </div>
            <p className="text-red-700 text-sm leading-relaxed">
              {advice.avoid[lang] ?? advice.avoid.en}
            </p>
          </div>
        </div>

        {/* Next visit */}
        <div className="bg-purple-50 rounded-2xl p-4 flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">📅</span>
          <div>
            <p className="font-bold text-purple-800">
              {lang === 'hi' ? 'अगली मुलाकात' : lang === 'ta' ? 'அடுத்த வருகை' : lang === 'bn' ? 'পরবর্তী পরিদর্শন' : 'Next Visit'}
            </p>
            <p className="text-purple-600 text-sm">
              {lang === 'hi'
                ? `अनुशंसित: ${nextVisit.toLocaleDateString('hi-IN')}`
                : `Recommended: ${nextVisit.toLocaleDateString('en-IN')}`}
            </p>
            <p className="text-purple-500 text-xs mt-0.5">
              {lang === 'hi' ? '(या डॉक्टर के निर्देशानुसार)' : '(or as directed by your doctor)'}
            </p>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">📞</span>
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium">Emergency</p>
            <p className="font-bold text-slate-700">112 · Ambulance: 108</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Hospital</p>
            <p className="font-bold text-slate-700">1800-XXX-XXXX</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 no-print">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={isSharing}
            aria-label="Share on WhatsApp"
            className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-2xl font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 transition-all active:scale-95"
          >
            <span className="text-2xl" aria-hidden="true">📱</span>
            WhatsApp
          </button>
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print discharge card"
            className="flex items-center justify-center gap-2 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-2xl font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 transition-all active:scale-95"
          >
            <span className="text-2xl" aria-hidden="true">🖨️</span>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
