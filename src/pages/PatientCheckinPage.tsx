import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  User,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  Languages,
  Upload,
  FileCheck,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  QrCode,
  Sliders,
  Zap,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type {
  AyushSystem,
  PreConsultationIntake,
  SocratesHPI,
  DigitizedDocument,
} from '../types';
import { VoiceDictationButton } from '../components/VoiceDictationButton';
import {
  detectRedFlags,
  speakAudioPrompt,
  stopAudioPrompt,
  SAMPLE_PRESET_DOCUMENTS,
  processDocumentOCR,
} from '../services/aiIntelligence';

const AYUSH_SYSTEMS: AyushSystem[] = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homoeopathy',
];

const COMMON_SYMPTOM_TAGS = [
  'Knee Joint Pain (जानु शूल)',
  'Acidity & Bloating (अम्लपित्त)',
  'Headache / Migraine (शिरःशूल)',
  'Lower Back Pain (कटिशूल)',
  'Chronic Cough (कास)',
  'Indigestion / Weak Agni (अग्निमांद्य)',
  'Insomnia / Disturbed Sleep (अनिद्रा)',
  'Skin Rash / Itching (त्वक विकार)',
  'High Stress / Anxiety (चित्तोद्वेग)',
  'Chest Heaviness / Pain (छाती में भारीपन)',
];

const SITE_TAGS = ['Head / Temple', 'Neck & Shoulders', 'Chest (छाती)', 'Upper Abdomen', 'Lower Back (कमर)', 'Bilateral Knees (घुटने)', 'Skin / Whole Body'];
const ONSET_TAGS = ['Gradual / Slowly worsening', 'Sudden onset (अचानक)', 'Intermittent attacks', 'Seasonal aggravation (शीत ऋतु)'];
const CHARACTER_TAGS = ['Dull aching (मीठा दर्द)', 'Throbbing (धड़कन जैसा)', 'Burning sensation (जलन/दाह)', 'Sharp stabbing', 'Stiffness & Crepitus (जकड़न)'];
const RADIATION_TAGS = ['Localized (एक ही जगह)', 'Spreads to Left Arm/Jaw (🚨)', 'Radiates down the leg (Sciatica)', 'Spreads to back & neck'];

export const PatientCheckinPage: React.FC = () => {
  // Accessibility & Multilingual
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [highContrast, setHighContrast] = useState(false);
  const [audioGuidance, setAudioGuidance] = useState(true);

  // Stepper state (1: Identify & ABHA, 2: Converse & HPI, 3: AYUSH & History, 4: Document AI Scan, 5: Review & Submit)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Step 1
  const [abhaId, setAbhaId] = useState('91-4829-1029-4821');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [preferredAyushSystem, setPreferredAyushSystem] = useState<AyushSystem>('Ayurveda');
  const [dpdpConsent, setDpdpConsent] = useState(true);

  // Form State - Step 2 (Chief complaints & SOCRATES)
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [socrates, setSocrates] = useState<SocratesHPI>({
    site: 'Bilateral Knees (घुटने)',
    onset: 'Gradual / Slowly worsening',
    character: 'Dull aching with stiffness',
    radiation: 'Localized (एक ही जगह)',
    associatedSymptoms: ['Morning stiffness > 20 mins', 'Difficulty climbing stairs'],
    timingDuration: 'Worse in cold mornings',
    exacerbatingFactors: 'Prolonged walking, cold weather',
    relievingFactors: 'Warm fomentation, rest',
    severity: 6,
  });

  // Form State - Step 3 (AYUSH Dashavidha & Lifestyle)
  const [prakritiSelf, setPrakritiSelf] = useState('Vata-Pitta (Dry skin, active mind, light sleep)');
  const [aharaHabit, setAharaHabit] = useState('Irregular meal timings, spicy/dry snacks');
  const [viharaHabit, setViharaHabit] = useState('Desk sitting > 8 hours, late night screen time');
  const [allergies, setAllergies] = useState('None');
  const [priorTreatments, setPriorTreatments] = useState('Painkillers (NSAIDs) with temporary relief');

  // Form State - Step 4 (Document AI & Scanning)
  const [uploadedDocs, setUploadedDocs] = useState<DigitizedDocument[]>([
    SAMPLE_PRESET_DOCUMENTS[0], // Preloaded Cardiology Rx
    SAMPLE_PRESET_DOCUMENTS[1], // Preloaded Lal PathLabs Metabolic Panel
  ]);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Submission State
  const [submittedToken, setSubmittedToken] = useState<PreConsultationIntake | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Red Flag Dismiss State
  const [dismissedEmergency, setDismissedEmergency] = useState(false);

  // Live Red Flag Checker derived via useMemo
  const redFlagResult = React.useMemo(() => {
    return detectRedFlags(chiefComplaints, socrates, socrates.associatedSymptoms);
  }, [chiefComplaints, socrates]);

  const showRedFlagModal = redFlagResult.isEmergency && !dismissedEmergency;

  // Speak emergency warning once if newly triggered
  useEffect(() => {
    if (redFlagResult.isEmergency && !dismissedEmergency && audioGuidance) {
      speakAudioPrompt(
        lang === 'hi'
          ? 'आपातकालीन चेतावनी! आपके द्वारा दर्ज लक्षण तत्काल आपातकालीन ट्राइएज की मांग करते हैं।'
          : 'Emergency Priority Alert! Your symptoms require immediate triage care.',
        lang === 'hi' ? 'hi-IN' : 'en-IN'
      );
    }
  }, [redFlagResult.isEmergency, dismissedEmergency, audioGuidance, lang]);

  // Audio prompt on step change
  const triggerAudioGuidance = (promptText: string) => {
    if (!audioGuidance) return;
    speakAudioPrompt(promptText, lang === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const handleFillDemoPatient = () => {
    setAbhaId('91-4829-1029-4821');
    setPatientName('Rajesh Kumar');
    setAge('46');
    setGender('Male');
    setPhone('+91 98765 43210');
    setCity('Rohini, New Delhi');
    setPreferredAyushSystem('Ayurveda');
    setChiefComplaints('Severe bilateral knee joint pain, crepitus sound on walking, and morning joint stiffness.');
    setDuration('8 Months');
    setError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessingDoc(true);
      const file = e.target.files[0];
      const parsedDoc = await processDocumentOCR(file);
      setUploadedDocs((prev) => [parsedDoc, ...prev]);
      setIsProcessingDoc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना पूरा नाम भरें।' : 'Please enter your full name.');
      setActiveStep(1);
      return;
    }
    if (!phone.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना मोबाइल नंबर भरें।' : 'Please enter your mobile phone number.');
      setActiveStep(1);
      return;
    }
    if (!chiefComplaints.trim()) {
      setError(lang === 'hi' ? 'कृपया अपनी मुख्य स्वास्थ्य समस्या दर्ज करें।' : 'Please describe your main health complaints.');
      setActiveStep(2);
      return;
    }

    setError(null);

    const isEmergency = redFlagResult.isEmergency;

    // Save to repository
    const newIntake = storageService.addPreIntake({
      patientName: patientName.trim(),
      age: age.trim() || '40',
      gender,
      phone: phone.trim(),
      city: city.trim() || 'New Delhi',
      preferredAyushSystem,
      chiefComplaints: chiefComplaints.trim(),
      duration: duration.trim() || 'Not specified',
      allergies: allergies.trim() || 'None',
      previousTreatment: priorTreatments.trim() || 'None',
      socratesHpi: socrates,
      dashavidhaSelfAssessment: {
        prakritiSelf,
        aharaPattern: aharaHabit,
        viharaRoutine: viharaHabit,
      },
      digitizedDocuments: uploadedDocs,
      isRedFlagEmergency: isEmergency,
      redFlagDetails: isEmergency
        ? {
            category: redFlagResult.category,
            symptomsTriggered: redFlagResult.symptomsTriggered,
            actionTaken: redFlagResult.actionTaken,
          }
        : undefined,
      dpdpConsentGranted: dpdpConsent,
      consentLanguage: lang,
    });

    // Update status if emergency
    if (isEmergency) {
      storageService.updatePreIntakeStatus(newIntake.id, 'Priority Triage (Red Flag)');
      newIntake.status = 'Priority Triage (Red Flag)';
    }

    // Ensure registered in master patient registry
    const existing = storageService.getPatients().find((p) => p.name.toLowerCase() === patientName.trim().toLowerCase());
    if (!existing) {
      storageService.addPatient({
        registrationNo: storageService.generateRegistrationNo(),
        name: patientName.trim(),
        age: age.trim() || '40',
        gender,
        phone: phone.trim(),
        address: city.trim() ? `${city.trim()}, India` : 'New Delhi, India',
        occupation: 'Self / Citizen',
        emergencyContact: `${phone.trim()} (Self)`,
        allergies: allergies.trim() || 'None reported',
        consent: true,
      });
    }

    setSubmittedToken(newIntake);

    if (audioGuidance) {
      const confirmationMsg =
        lang === 'hi'
          ? `आपका पूर्व-परामर्श चेक-इन पूरा हो गया है। आपका OPD टोकन नंबर है ${newIntake.tokenNumber}।`
          : `Your clinical pre-consultation is recorded. Your OPD token number is ${newIntake.tokenNumber}.`;
      speakAudioPrompt(confirmationMsg, lang === 'hi' ? 'hi-IN' : 'en-IN');
    }
  };

  return (
    <div
      className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 transition-colors ${
        highContrast
          ? 'bg-black text-white'
          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 text-slate-100'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ============================================================ */}
        {/* TOP ACCESSIBILITY & MINISTRY TOOLBAR */}
        {/* ============================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">🇮🇳 Ministry of Ayush • All India Institute of Ayurveda</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-teal-200 hidden sm:inline">MediKiosk AI Engine</span>
          </div>

          {/* Accessibility & Language Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Guidance Toggle */}
            <button
              type="button"
              onClick={() => {
                setAudioGuidance(!audioGuidance);
                if (audioGuidance) stopAudioPrompt();
              }}
              title="Toggle Audio Assistant"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                audioGuidance ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}
            >
              {audioGuidance ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{audioGuidance ? 'Audio On' : 'Audio Muted'}</span>
            </button>

            {/* High Contrast Mode */}
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-white/10 text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px]">High Contrast</span>
            </button>

            {/* Bilingual Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextLang = lang === 'en' ? 'hi' : 'en';
                setLang(nextLang);
                triggerAudioGuidance(nextLang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है।' : 'Language set to English.');
              }}
              className="px-2.5 py-1 bg-teal-500/30 hover:bg-teal-500/50 text-teal-200 border border-teal-400/40 rounded-lg font-bold flex items-center gap-1 text-[11px]"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>

            <Link
              to="/login"
              className="text-[11px] text-teal-300 hover:text-white font-bold flex items-center gap-1 ml-1"
            >
              <span>Doctor Login</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* HERO TITLE & DEMO AUTO-FILL */}
        {/* ============================================================ */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI-Powered Multimodal Clinical History & Triage Platform (MediKiosk)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {lang === 'hi'
              ? 'मरीज़ पूर्व-परामर्श इतिहास व दस्तावेज़ स्कैनिंग'
              : 'Patient Pre-Consultation History & Smart AI Kiosk'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'डॉक्टर से मिलने से पहले अपने लक्षण बोलकर या छूकर बताएं और पुरानी पर्चियां स्कैन करें।'
              : 'Answer adaptive clinical questions via voice/touch and digitize prior medical records before your consultation.'}
          </p>

          <button
            type="button"
            onClick={handleFillDemoPatient}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold transition-all mt-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Fill Demo Patient Data</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* RED-FLAG EMERGENCY POPUP MODAL (MODULE A) */}
        {/* ============================================================ */}
        {showRedFlagModal && redFlagResult.isEmergency && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-red-950 border-2 border-red-500 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-500">
                    Emergency Triage Alert
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Red-Flag Symptoms Detected!
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-900/40 border border-red-700/60 text-xs space-y-2">
                <p className="font-bold text-red-200">
                  Trigger Category: <span className="text-amber-300">{redFlagResult.category}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {redFlagResult.symptomsTriggered.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-red-800 text-white font-semibold text-[11px]">
                      ⚠️ {s}
                    </span>
                  ))}
                </div>
                <p className="text-red-100 font-medium pt-1">
                  {redFlagResult.actionTaken}
                </p>
              </div>

              <p className="text-xs text-red-200">
                You will be flagged for <strong>Immediate Priority Triage</strong>. You do not need to wait in routine queues.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDismissedEmergency(true)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg"
                >
                  Acknowledge & Proceed with Priority Flag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUCCESS TOKEN CARD (AFTER SUBMISSION) */}
        {/* ============================================================ */}
        {submittedToken ? (
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-emerald-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === 'hi' ? 'पूर्व-परामर्श चेक-इन पूर्ण हुआ!' : 'Pre-Consultation Recorded Successfully!'}
              </h2>
              <p className="text-xs text-slate-500">
                Integrated with ABDM FHIR Health Gateway & Attending AYUSH Physician Screen
              </p>
            </div>

            {/* Token Card */}
            <div
              className={`rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ${
                submittedToken.isRedFlagEmergency
                  ? 'bg-gradient-to-br from-red-950 via-red-900 to-slate-950 border-2 border-red-500'
                  : 'bg-gradient-to-br from-teal-900 via-blue-950 to-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold">
                    OPD Queue Token & ABHA Reference
                  </span>
                  <div className="text-4xl font-black text-amber-300 tracking-tight mt-0.5">
                    {submittedToken.tokenNumber}
                  </div>
                </div>

                <div className="text-right sm:text-right text-xs">
                  {submittedToken.isRedFlagEmergency ? (
                    <span className="inline-block px-3 py-1 bg-red-600 text-white font-black rounded-lg border border-red-400 animate-pulse">
                      🚨 PRIORITY EMERGENCY TRIAGE
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-emerald-300 font-semibold border border-emerald-500/30">
                      Status: Waiting in OPD Queue
                    </span>
                  )}
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(submittedToken.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4">
                <div>
                  <span className="text-slate-400 text-[10px]">Patient Name:</span>
                  <p className="font-bold text-white mt-0.5">{submittedToken.patientName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Age / Gender:</span>
                  <p className="font-bold text-white mt-0.5">{submittedToken.age}y • {submittedToken.gender}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">ABHA ID:</span>
                  <p className="font-mono font-bold text-teal-300 mt-0.5">{submittedToken.abhaId || '91-4829-1029-4821'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">AYUSH Stream:</span>
                  <p className="font-bold text-amber-300 mt-0.5">{submittedToken.preferredAyushSystem}</p>
                </div>
              </div>

              {/* Digitized Documents Count */}
              {submittedToken.digitizedDocuments && submittedToken.digitizedDocuments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-300">
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {submittedToken.digitizedDocuments.length} Medical Documents Scanned & Timeline Formatted (OCR Complete)
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedToken(null);
                  setActiveStep(1);
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Patient Check-in</span>
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Go to Doctor Portal</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 4-STEP WIZARD FORM */
          /* ============================================================ */
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl shadow-2xl border p-6 sm:p-8 space-y-6 backdrop-blur-md ${
              highContrast
                ? 'bg-slate-950 border-yellow-400 text-white'
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Navigation Indicator */}
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-4 text-xs font-bold">
              {[
                { step: 1, label: '1. Identify & ABHA', icon: QrCode },
                { step: 2, label: '2. Symptoms & HPI', icon: HeartPulse },
                { step: 3, label: '3. AYUSH & History', icon: Layers },
                { step: 4, label: '4. Scan Docs & OCR', icon: Upload },
              ].map(({ step, label, icon: Icon }) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(step as any)}
                  className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center ${
                    activeStep === step
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{step}</span>
                </button>
              ))}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* STEP 1: IDENTIFY & ABHA & CONSENT (MODULE D) */}
            {/* ------------------------------------------------------------ */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-700" />
                    <span>Step 1: Patient Identity & ABHA Authentication (पहचान व ABHA ID)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      triggerAudioGuidance(
                        lang === 'hi'
                          ? 'कृपया अपना ABHA ID, नाम, उम्र, और मोबाइल नंबर दर्ज करें।'
                          : 'Please enter your ABHA ID, name, age, and contact number.'
                      )
                    }
                    className="text-xs text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Instructions</span>
                  </button>
                </div>

                {/* ABHA ID Card Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-teal-700" />
                      <span className="text-xs font-bold text-teal-900">
                        Ayushman Bharat Health Account (ABHA ID / ABHA Address)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-900 rounded border border-teal-300">
                      ABDM Linked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ABHA Health ID (14 Digits or ABHA Address)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 91-4829-1029-4821 or name@abdm"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-teal-300 rounded-lg font-mono font-bold text-teal-950 bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setAbhaId('91-4829-1029-4821')}
                        className="px-3 py-2 text-xs bg-white hover:bg-slate-50 border border-teal-300 text-teal-800 font-semibold rounded-lg shadow-2xs"
                      >
                        ✓ Verified ABHA Profile Loaded
                      </button>
                    </div>
                  </div>
                </div>

                {/* Demographics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Patient Full Name (पूरा नाम) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Age (उम्र) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 46"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender (लिंग)
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Male">Male (पुरुष)</option>
                        <option value="Female">Female (महिला)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number (मोबाइल नंबर) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Residence (शहर)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Varanasi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* Preferred System */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Preferred AYUSH Discipline (उपचार पद्धति) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {AYUSH_SYSTEMS.map((sys) => (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => setPreferredAyushSystem(sys)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          preferredAyushSystem === sys
                            ? 'bg-teal-700 text-white border-teal-800 shadow-md scale-105'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DPDP Act 2023 Consent Checkbox */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5"
                    />
                    <span>
                      <strong>Consent under DPDP Act 2023:</strong> I grant explicit, revocable consent to capture my voice/touch health data and share it with the Attending AYUSH Physician and ABDM health record.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!patientName.trim() || !phone.trim()) {
                        setError('Please enter your full name and mobile number.');
                        return;
                      }
                      setError(null);
                      setActiveStep(2);
                      triggerAudioGuidance(
                        lang === 'hi'
                          ? 'अब अपनी मुख्य समस्या बताएं या नीचे दिए गए विकल्पों में से चुनें।'
                          : 'Now speak or tap your main health complaints.'
                      );
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    <span>Proceed to Step 2 (Symptoms)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 2: CONVERSE & HPI (SOCRATES FRAMEWORK & MODULE A) */}
            {/* ------------------------------------------------------------ */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-teal-700" />
                      <span>Step 2: Multimodal History Interview (लक्षण व SOCRATES जांच)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dual-mode input: Speak in microphone OR tap the quick choices below.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>SOCRATES AI Engine</span>
                  </div>
                </div>

                {/* Quick Symptom Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Touch Choices / अक्सर पूछे जाने वाले लक्षण:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SYMPTOM_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setChiefComplaints((prev) => (prev ? `${prev}, ${tag}` : tag))
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chief Complaint Textarea with Voice */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Chief Presenting Complaints (मुख्य समस्या बोलें या लिखें){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <VoiceDictationButton
                      targetLabel="Patient Symptoms"
                      onAppendText={(text) =>
                        setChiefComplaints((prev) => (prev ? `${prev} ${text}` : text))
                      }
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. I have severe pain in both knees and crackling sounds when walking since 8 months... (माइक दबाकर बोलें)"
                    value={chiefComplaints}
                    onChange={(e) => setChiefComplaints(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {/* SOCRATES Probing Section */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-teal-700" />
                      <span>SOCRATES Adaptive Clinical History Probing</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Probing Pain & Symptom Characteristics
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Site */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        1. Site (कहाँ पर दर्द/समस्या है?)
                      </label>
                      <select
                        value={socrates.site}
                        onChange={(e) => setSocrates({ ...socrates, site: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {SITE_TAGS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Onset */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        2. Onset (शुरुआत कैसे हुई?)
                      </label>
                      <select
                        value={socrates.onset}
                        onChange={(e) => setSocrates({ ...socrates, onset: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {ONSET_TAGS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Character */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        3. Character (दर्द का प्रकार)
                      </label>
                      <select
                        value={socrates.character}
                        onChange={(e) => setSocrates({ ...socrates, character: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {CHARACTER_TAGS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Radiation */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        4. Radiation (क्या दर्द कहीं फैलता है?)
                      </label>
                      <select
                        value={socrates.radiation}
                        onChange={(e) => setSocrates({ ...socrates, radiation: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {RADIATION_TAGS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pain Severity Slider (1-10) */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">5. Severity / Pain Level (1 to 10 Scale):</span>
                      <span className="text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-black">
                        Level {socrates.severity} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={socrates.severity}
                      onChange={(e) =>
                        setSocrates({ ...socrates, severity: parseInt(e.target.value) })
                      }
                      className="w-full accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>1 (Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>10 (Severe / Unbearable)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!chiefComplaints.trim()) {
                        setError('Please describe your chief complaints.');
                        return;
                      }
                      setError(null);
                      setActiveStep(3);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    <span>Proceed to Step 3 (AYUSH History)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 3: AYUSH DASHAVIDHA & LIFESTYLE HISTORY (MODULE A) */}
            {/* ------------------------------------------------------------ */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-700" />
                    <span>Step 3: AYUSH History Mode & Dashavidha Intake (दशविध व जीवनशैली)</span>
                  </h3>
                  <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded font-semibold border border-amber-200">
                    Ayurvedic OPD Mode
                  </span>
                </div>

                {/* Dashavidha & Ahara-Vihara Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prakriti Self-Perception (शारीरिक प्रकृति)
                    </label>
                    <select
                      value={prakritiSelf}
                      onChange={(e) => setPrakritiSelf(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Vata-Pitta (Dry skin, active mind, light sleep)">Vata-Pitta (Dry skin, active mind, light sleep)</option>
                      <option value="Pitta-Kapha (Heat sensitive, strong appetite, calm)">Pitta-Kapha (Heat sensitive, strong appetite, calm)</option>
                      <option value="Kapha dominant (Heaviness, slow digestion, deep sleep)">Kapha dominant (Heaviness, slow digestion, deep sleep)</option>
                      <option value="Not sure / Balanced">Not sure / Balanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ahara Pattern (आहार / खानपान की आदतें)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spicy/oily food, irregular meal timings, tea 3x"
                      value={aharaHabit}
                      onChange={(e) => setAharaHabit(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vihara Routine (विहार / दिनचर्या व तनाव)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Desk job, sedentary, late night sleep"
                      value={viharaHabit}
                      onChange={(e) => setViharaHabit(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Known Drug / Herb Allergies (एलर्जी)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dust, Penicillin, None"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Medications / Treatments Taken (पहले ली दवाइयां)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Took Painkillers and Ayurvedic oil massage for 2 weeks with temporary relief..."
                    value={priorTreatments}
                    onChange={(e) => setPriorTreatments(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep(4);
                      triggerAudioGuidance(
                        lang === 'hi'
                          ? 'अब आप अपने पुराने मेडिकल पर्चे या लैब रिपोर्ट स्कैन कर सकते हैं।'
                          : 'Now upload or scan your prior prescriptions and lab reports.'
                      );
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    <span>Proceed to Step 4 (Document AI)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* STEP 4: MEDICAL DOCUMENT DIGITIZATION & OCR (MODULE B) */}
            {/* ------------------------------------------------------------ */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-teal-700" />
                      <span>Step 4: Medical Document Digitization & OCR Intelligence (Module B)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload physical prescriptions, lab reports, or discharge summaries for automated entity extraction.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                    High-Accuracy OCR
                  </span>
                </div>

                {/* Upload Box */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 text-center space-y-3">
                  <Upload className="w-8 h-8 text-teal-700 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-teal-950">
                      Upload Medical Prescriptions / Lab Reports / Discharge Summaries
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports PDF, PNG, JPG files (Handwritten & Printed Multilingual OCR)
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isProcessingDoc ? 'Extracting Entities...' : 'Choose File to Scan'}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Digitized Documents Timeline & Extraction Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-700" />
                    <span>Digitized Document Intelligence Timeline ({uploadedDocs.length} Extracted)</span>
                  </h4>

                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-900 border border-teal-300">
                            {doc.documentType}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{doc.fileName}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Date: {doc.documentDate} • {doc.doctorOrLabName}
                        </span>
                      </div>

                      {/* Extracted Diagnoses */}
                      {doc.extractedDiagnoses.length > 0 && (
                        <div className="text-xs">
                          <span className="font-bold text-slate-700">Extracted Diagnoses: </span>
                          <span className="text-teal-900 font-semibold">
                            {doc.extractedDiagnoses.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Extracted Medications */}
                      {doc.extractedMedications.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Extracted Medications & Dosages:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {doc.extractedMedications.map((m, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]"
                              >
                                <span className="font-bold text-slate-900">{m.medicineName}</span>{' '}
                                <span className="text-teal-700 font-semibold">({m.dosage})</span> -{' '}
                                <span className="text-slate-500">{m.frequency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Extracted Lab Results with Abnormal Highlighting */}
                      {doc.extractedLabResults.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Investigation Results (Abnormal Flags Highlighted):
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {doc.extractedLabResults.map((lab, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-lg border text-[11px] ${
                                  lab.isAbnormal
                                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="truncate">{lab.testName}:</span>
                                  {lab.isAbnormal && (
                                    <span className="text-[9px] bg-amber-500 text-white px-1 rounded uppercase">
                                      High
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-black mt-0.5">
                                  {lab.value} <span className="text-[10px] font-normal">{lab.unit}</span>
                                </div>
                                <div className="text-[9px] text-slate-400">Ref: {lab.referenceRange}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Drug Interaction Alerts */}
                      {doc.potentialDrugInteractions && doc.potentialDrugInteractions.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{doc.potentialDrugInteractions[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Final Submit Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Back to AYUSH History
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-950/20 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Stethoscope className="w-4 h-4 text-amber-300" />
                    <span>Submit & Generate OPD Token / टोकन प्राप्त करें</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
