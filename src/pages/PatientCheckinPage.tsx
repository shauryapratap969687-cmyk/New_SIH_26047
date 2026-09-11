import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import {
  loginWithAbha,
  loginWithAadhaar,
  registerNewPatient,
  pushToHis,
  generateFhirBundle,
} from '../services/abhaService';
import type { AbhaPatientProfile } from '../services/abhaService';
import {
  getActiveQuestions,
  getOptionLabel,
  checkAnswerForRedFlag,
  answersToSocratesHpi,
} from '../services/adaptiveQuestioning';
import type { AdaptiveAnswers, AdaptiveQuestion, AnswerOption } from '../services/adaptiveQuestioning';
import { detectRedFlags, processDocumentOCR, SAMPLE_PRESET_DOCUMENTS } from '../services/aiIntelligence';
import type { DigitizedDocument } from '../types';
import type { AyushSystem, PreConsultationIntake } from '../types';
import { useA11y } from '../components/AccessibilityProvider';
import { AudioProgressBar } from '../components/AudioProgressBar';
import type { ProgressStep } from '../components/AudioProgressBar';
import { RepeatBackButton } from '../components/RepeatBackButton';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';
import { useAutoSpeak } from '../hooks/useAutoSpeak';
import { STRINGS, LANG_META } from '../i18n/strings';
import type { SupportedLang } from '../i18n/strings';
import { HelpChatbot } from '../components/HelpChatbot';
import { BodyMap, REGION_TO_OPTION } from '../components/BodyMap';
import { FacesPainScale } from '../components/FacesPainScale';
import { QueueTracker } from '../components/QueueTracker';
import { DischargeCard } from '../components/DischargeCard';

// ---- Constants ----
const KIOSK_STEPS: ProgressStep[] = [
  { id: 1, icon: '🪪', label: 'Identify', labelKey: 'stepIdentify' },
  { id: 2, icon: '🗣️', label: 'Tell Us', labelKey: 'stepConverse' },
  { id: 3, icon: '📄', label: 'Scan', labelKey: 'stepScan' },
  { id: 4, icon: '📋', label: 'Summary', labelKey: 'stepSummarize' },
  { id: 5, icon: '✅', label: 'Done', labelKey: 'stepDone' },
];

const AYUSH_SYSTEMS: AyushSystem[] = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homoeopathy',
];

const AYUSH_ICONS: Record<AyushSystem, string> = {
  'Ayurveda': '🌿',
  'Yoga & Naturopathy': '🧘',
  'Unani': '⚗️',
  'Siddha': '🔮',
  'Homoeopathy': '💊',
};

type KioskStep = 1 | 2 | 3 | 4 | 5;
type AuthMethod = 'abha' | 'aadhaar' | 'register';

// ============================================================
// MAIN COMPONENT
// ============================================================
export const PatientCheckinPage: React.FC = () => {
  const { lang, setLang, t, speak, playTone } = useA11y();

  // ---- Session state (persisted to sessionStorage for resume) ----
  const [kioskStep, setKioskStep] = useState<KioskStep>(1);

  // ---- Step 1: Identify ----
  const [langChosen, setLangChosen] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('abha');
  const [abhaInput, setAbhaInput] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regPhone, setRegPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [patientProfile, setPatientProfile] = useState<AbhaPatientProfile | null>(null);
  const [consentStep, setConsentStep] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [consentParagraph, setConsentParagraph] = useState(0);
  const [preferredSystem, setPreferredSystem] = useState<AyushSystem>('Ayurveda');

  // ---- Step 2: Converse ----
  const [answers, setAnswers] = useState<AdaptiveAnswers>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [currentFreeText, setCurrentFreeText] = useState('');
  const [yesNoAnswer, setYesNoAnswer] = useState<boolean | null>(null);
  const [sliderValue, setSliderValue] = useState(5);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [emergencyDismissed, setEmergencyDismissed] = useState(false);
  const [redFlagResult, setRedFlagResult] = useState<ReturnType<typeof detectRedFlags> | null>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  // ---- Step 3: Scan ----
  const [documents, setDocuments] = useState<DigitizedDocument[]>([]);
  const [scanLoading, setScanLoading] = useState(false);

  // ---- Step 4: Summary ----
  const [hisPushed, setHisPushed] = useState(false);
  const [hisPushResult, setHisPushResult] = useState<{ referenceId: string; message: string } | null>(null);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirBundle, setFhirBundle] = useState<object | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ---- Step 5: Token ----
  const [tokenNumber, setTokenNumber] = useState('');
  const [submittedIntake, setSubmittedIntake] = useState<PreConsultationIntake | null>(null);

  // ============================================================
  // SESSION AUTO-SAVE & RESTORE
  // ============================================================
  useEffect(() => {
    const saved = sessionStorage.getItem('medikiosk_session');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.kioskStep) setKioskStep(s.kioskStep);
        if (s.patientProfile) setPatientProfile(s.patientProfile);
        if (s.answers) setAnswers(s.answers);
        if (s.preferredSystem) setPreferredSystem(s.preferredSystem);
        if (s.consentGranted) setConsentGranted(s.consentGranted);
        if (s.langChosen) setLangChosen(s.langChosen);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const session = {
      kioskStep,
      patientProfile,
      answers,
      preferredSystem,
      consentGranted,
      langChosen,
    };
    sessionStorage.setItem('medikiosk_session', JSON.stringify(session));
  }, [kioskStep, patientProfile, answers, preferredSystem, consentGranted, langChosen]);

  // ============================================================
  // ACTIVE QUESTIONS
  // ============================================================
  const activeQuestions = useMemo(() => getActiveQuestions(answers), [answers]);
  const currentQuestion: AdaptiveQuestion | undefined = activeQuestions[questionIdx];

  // ============================================================
  // AUTO-SPEAK on step change
  // ============================================================
  useAutoSpeak(() => {
    if (kioskStep === 1 && !langChosen) return t('langSelectAudio');
    if (kioskStep === 1 && !consentStep) return t('authSubtitle');
    if (kioskStep === 1 && consentStep) return t('consentAudioIntro');
    if (kioskStep === 2 && currentQuestion) return t(currentQuestion.audioKey);
    if (kioskStep === 3) return t('scanAudioGuide');
    if (kioskStep === 4) return t('summaryAudioConfirm');
    if (kioskStep === 5 && tokenNumber) return t('tokenAudio').replace('{token}', tokenNumber);
    return '';
  }, [kioskStep, langChosen, consentStep, questionIdx, tokenNumber]);

  // ============================================================
  // VOICE RECOGNITION
  // ============================================================
  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak(t('errorNoMic'));
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const rec = new SpeechRecognition();
    rec.lang = LANG_META[lang].ttsLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      setIsListeningVoice(true);
      playTone('listening');
    };
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      playTone('done');
      setIsListeningVoice(false);
      onResult(transcript);
    };
    rec.onerror = () => {
      setIsListeningVoice(false);
      playTone('error');
    };
    rec.onend = () => setIsListeningVoice(false);
    rec.start();
    recognitionRef.current = rec;
  }, [lang, speak, t, playTone]);

  // ============================================================
  // CONSENT VOICE INPUT
  // ============================================================
  const listenForConsent = () => {
    startListening((text) => {
      const lower = text.toLowerCase();
      if (['yes', 'हां', 'haan', 'ha', 'ஆம்', 'aam', 'হ্যাঁ', 'hayn', 'agree', 'ok', 'okay'].some(w => lower.includes(w))) {
        handleConsentGrant();
      }
    });
  };

  // ============================================================
  // STEP NAVIGATION
  // ============================================================
  const goToStep = useCallback((step: KioskStep) => {
    setKioskStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = () => {
    if (kioskStep === 2 && questionIdx > 0) {
      setQuestionIdx(q => q - 1);
    } else if (kioskStep > 1) {
      goToStep((kioskStep - 1) as KioskStep);
    }
  };

  // ============================================================
  // STEP 1 — AUTH
  // ============================================================
  const handleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    playTone('processing');

    let result: { success: boolean; profile?: AbhaPatientProfile; error?: string };
    if (authMethod === 'abha') {
      result = await loginWithAbha(abhaInput);
    } else if (authMethod === 'aadhaar') {
      result = await loginWithAadhaar(aadhaarInput);
    } else {
      result = await registerNewPatient({ name: regName, age: regAge, gender: regGender, phone: regPhone });
    }

    setAuthLoading(false);
    if (result.success && result.profile) {
      playTone('done');
      setPatientProfile(result.profile);
      setConsentStep(true);
      speak(`Welcome, ${result.profile.name}. Please listen to our privacy notice.`);
    } else {
      playTone('error');
      setAuthError(result.error || t('errorGeneral'));
      speak(result.error || t('errorGeneral'));
    }
  };

  const handleConsentGrant = () => {
    setConsentGranted(true);
    playTone('done');
    speak(t('selectAyushSystem'));
    setTimeout(() => goToStep(2), 500);
  };

  // ============================================================
  // STEP 2 — ADAPTIVE QUESTIONING
  // ============================================================
  const handleSingleSelect = (optionId: string, question: AdaptiveQuestion) => {
    const option = question.options?.find(o => o.id === optionId);
    const isRedFlag = checkAnswerForRedFlag(question, [optionId]) || option?.isRedFlagTrigger;

    const newAnswers = { ...answers };
    if (question.socratesKey === 'site') newAnswers.site = optionId;
    else if (question.socratesKey === 'onset') newAnswers.onset = optionId;
    else if (question.socratesKey === 'character') newAnswers.character = optionId;
    else if (question.socratesKey === 'radiation') newAnswers.radiation = optionId;
    else if (question.socratesKey === 'timingDuration') newAnswers.timing = optionId;
    else if (question.id === 'duration') newAnswers.duration = optionId;
    else if (question.id === 'ahara_shakti') newAnswers.aharaShakti = optionId;
    else if (question.id === 'prakriti') newAnswers.prakriti = optionId;

    setAnswers(newAnswers);
    playTone('done');

    if (isRedFlag) {
      runRedFlagCheck(newAnswers);
    }
    advanceQuestion(newAnswers);
  };

  const handleMultiSelect = (optionId: string, question: AdaptiveQuestion) => {
    const newAnswers = { ...answers };
    if (question.socratesKey === 'associatedSymptoms') {
      const current = newAnswers.associatedSymptoms || [];
      if (current.includes(optionId)) {
        newAnswers.associatedSymptoms = current.filter(id => id !== optionId);
      } else {
        newAnswers.associatedSymptoms = [...current, optionId];
        if (checkAnswerForRedFlag(question, [optionId])) {
          runRedFlagCheck(newAnswers);
        }
      }
    } else if (question.id === 'chief_complaint') {
      const current = newAnswers.chiefComplaintTags || [];
      if (current.includes(optionId)) {
        newAnswers.chiefComplaintTags = current.filter(id => id !== optionId);
      } else {
        newAnswers.chiefComplaintTags = [...current, optionId];
      }
    } else if (question.id === 'ros') {
      const current = newAnswers.ros || [];
      newAnswers.ros = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
    }
    setAnswers(newAnswers);
  };

  const handleFreeText = (text: string, question: AdaptiveQuestion) => {
    const newAnswers = { ...answers };
    if (question.socratesKey === 'exacerbatingFactors') newAnswers.exacerbatingFactors = text;
    else if (question.socratesKey === 'relievingFactors') newAnswers.relievingFactors = text;
    else if (question.id === 'past_medical') newAnswers.pastMedical = text;
    else if (question.id === 'past_surgical') newAnswers.pastSurgical = text;
    else if (question.id === 'drug_allergy') newAnswers.drugAllergy = text;
    else if (question.id === 'family_history') newAnswers.familyHistory = text;
    else if (question.id === 'personal_history') newAnswers.personalHistory = text;
    else if (question.id === 'ahara_pattern') newAnswers.aharaPattern = text;
    else if (question.id === 'vihara_routine') newAnswers.viharaRoutine = text;
    setAnswers(newAnswers);
  };

  const advanceQuestion = (updatedAnswers: AdaptiveAnswers) => {
    const nextActive = getActiveQuestions(updatedAnswers);
    if (questionIdx < nextActive.length - 1) {
      setQuestionIdx(q => q + 1);
      setCurrentFreeText('');
      setYesNoAnswer(null);
      setSliderValue(5);
    } else {
      // All questions done → go to scan
      goToStep(3);
    }
  };

  const runRedFlagCheck = (updatedAnswers: AdaptiveAnswers) => {
    const chiefText = (updatedAnswers.chiefComplaintTags || []).join(' ') + ' ' + (updatedAnswers.chiefComplaint || '');
    const result = detectRedFlags(
      chiefText,
      answersToSocratesHpi(updatedAnswers),
      updatedAnswers.associatedSymptoms || [],
    );
    if (result.isEmergency) {
      setRedFlagResult(result);
      setEmergencyDetected(true);
      playTone('emergency');
      speak(t('redFlagBody'));
    }
  };

  // ============================================================
  // STEP 3 — DOCUMENT SCAN
  // ============================================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setScanLoading(true);
    speak(t('scanCaptured'));
    playTone('processing');
    const newDocs: DigitizedDocument[] = [];
    for (const file of Array.from(files)) {
      const doc = await processDocumentOCR(file);
      newDocs.push(doc);
    }
    setDocuments(prev => [...prev, ...newDocs]);
    setScanLoading(false);
    playTone('done');
    speak(`${newDocs.length} document${newDocs.length > 1 ? 's' : ''} scanned and read successfully.`);
  };

  const handleUseSampleDocs = () => {
    setDocuments(SAMPLE_PRESET_DOCUMENTS);
    playTone('done');
    speak('Sample medical records loaded. You can review them below.');
  };

  // ============================================================
  // STEP 4 — SUMMARY & HIS PUSH
  // ============================================================
  const buildIntake = useCallback((): PreConsultationIntake => {
    const socrates = answersToSocratesHpi(answers);
    const chiefText = (answers.chiefComplaintTags || []).map(id => {
      // map tag id back to label
      return id.replace(/_/g, ' ');
    }).join(', ');

    const rfResult = redFlagResult || detectRedFlags(chiefText, socrates, answers.associatedSymptoms || []);
    const token = `OPD-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      id: `intake-${Date.now()}`,
      tokenNumber: token,
      abhaId: patientProfile?.abhaId,
      patientName: patientProfile?.name || regName,
      age: patientProfile?.age || regAge,
      gender: (patientProfile?.gender || regGender) as 'Male' | 'Female' | 'Other',
      phone: patientProfile?.phone || regPhone,
      preferredAyushSystem: preferredSystem,
      chiefComplaints: chiefText,
      duration: answers.duration || '',
      socratesHpi: socrates,
      dashavidhaSelfAssessment: {
        prakritiSelf: answers.prakriti,
        aharaPattern: answers.aharaPattern,
        viharaRoutine: answers.viharaRoutine,
        sleepPattern: answers.viharaRoutine,
        appetiteState: answers.aharaShakti,
        bowelHabit: answers.bowelHabit,
      },
      pastMedicalHistory: answers.pastMedical,
      familyHistory: answers.familyHistory,
      allergies: answers.drugAllergy,
      previousTreatment: answers.personalHistory,
      digitizedDocuments: documents.length > 0 ? documents : undefined,
      isRedFlagEmergency: rfResult.isEmergency,
      redFlagDetails: rfResult.isEmergency ? {
        category: rfResult.category as Exclude<PreConsultationIntake['redFlagDetails'], undefined>['category'],
        symptomsTriggered: rfResult.symptomsTriggered,
        actionTaken: rfResult.actionTaken,
      } : undefined,
      dpdpConsentGranted: consentGranted,
      consentLanguage: (lang === 'hi' ? 'hi' : 'en') as 'en' | 'hi',
      submittedAt: new Date().toISOString(),
      status: rfResult.isEmergency ? 'Priority Triage (Red Flag)' : 'Waiting',
    };
  }, [answers, patientProfile, regName, regAge, regGender, regPhone, preferredSystem, documents, redFlagResult, consentGranted, lang]);

  const handlePushToHis = async () => {
    setSummaryLoading(true);
    playTone('processing');
    speak(t('pushToHisBtn'));
    const intake = buildIntake();
    const result = await pushToHis(intake);
    const bundle = generateFhirBundle(intake);
    setFhirBundle(bundle);
    setHisPushed(true);
    setHisPushResult({ referenceId: result.referenceId, message: result.message });
    setSummaryLoading(false);
    playTone('done');
    speak(t('pushSuccess'));
  };

  const handleFinalSubmit = () => {
    const intake = buildIntake();
    storageService.addPreIntake(intake);
    setTokenNumber(intake.tokenNumber);
    setSubmittedIntake(intake);
    speak(t('tokenAudio').replace('{token}', intake.tokenNumber));
    // Clear session
    sessionStorage.removeItem('medikiosk_session');
    goToStep(5);
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const renderOptionGrid = (
    question: AdaptiveQuestion,
    selectedIds: string[],
    onSelect: (id: string) => void,
  ) => {
    const isMulti = question.type === 'multi_select';
    return (
      <div
        role={isMulti ? 'group' : 'radiogroup'}
        aria-label={t(question.labelKey)}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {question.options?.map((opt: AnswerOption) => {
          const label = getOptionLabel(opt, lang);
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role={isMulti ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              aria-label={label}
              onClick={() => {
                onSelect(opt.id);
                speak(label);
              }}
              className={`
                relative flex flex-col items-center justify-center gap-2
                min-h-[80px] p-3 rounded-2xl border-2 text-center
                transition-all duration-150 cursor-pointer
                focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
                active:scale-95
                ${isSelected
                  ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'}
                ${opt.isRedFlagTrigger && isSelected ? 'bg-red-600 border-red-600' : ''}
              `}
            >
              {opt.icon && (
                <span className="text-3xl leading-none" aria-hidden="true">{opt.icon}</span>
              )}
              <span className="text-sm font-medium leading-tight">{label}</span>
              {isSelected && (
                <span className="absolute top-2 right-2 text-lg" aria-hidden="true">✓</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderConsentParagraphs = () => {
    const body = t('consentBody');
    const sentences = body.split('. ').filter(Boolean);
    return (
      <div className="space-y-3">
        {sentences.map((sentence, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border transition-all ${
              idx === consentParagraph
                ? 'border-teal-400 bg-teal-50'
                : idx < consentParagraph
                ? 'border-green-200 bg-green-50 opacity-70'
                : 'border-slate-200 bg-slate-50 opacity-40'
            }`}
          >
            <p className="text-slate-700 text-sm leading-relaxed">{sentence}.</p>
            {idx === consentParagraph && (
              <button
                type="button"
                aria-label="Read this aloud"
                onClick={() => { speak(sentence); }}
                className="mt-2 text-teal-600 text-xs font-medium underline focus:outline-none"
              >
                🔊 Read aloud
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          {consentParagraph > 0 && (
            <button type="button" onClick={() => setConsentParagraph(p => p - 1)}
              className="px-3 py-1 text-xs rounded-lg border border-slate-300 text-slate-600">
              ← Previous
            </button>
          )}
          {consentParagraph < sentences.length - 1 && (
            <button type="button" onClick={() => { setConsentParagraph(p => p + 1); speak(sentences[consentParagraph + 1]); }}
              className="px-3 py-1 text-xs rounded-lg bg-teal-600 text-white">
              Next → Read more
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSummarySection = (intake: PreConsultationIntake) => {
    const socrates = intake.socratesHpi;
    return (
      <div className="space-y-4 text-sm" aria-live="polite">
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <h3 className="font-bold text-teal-800 mb-2">Chief Complaint</h3>
          <p className="text-slate-700">{intake.chiefComplaints || '—'}</p>
          {intake.duration && <p className="text-slate-500 mt-1">Duration: {intake.duration}</p>}
        </div>
        {socrates && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">History of Present Illness (SOCRATES)</h3>
            <dl className="grid grid-cols-2 gap-2">
              {[
                ['Site', socrates.site],
                ['Onset', socrates.onset],
                ['Character', socrates.character],
                ['Radiation', socrates.radiation],
                ['Timing', socrates.timingDuration],
                ['Severity', `${socrates.severity}/10`],
                ['Worsened by', socrates.exacerbatingFactors],
                ['Relieved by', socrates.relievingFactors],
              ].map(([k, v]) => v ? (
                <div key={k as string}>
                  <dt className="text-xs text-blue-600 font-semibold">{k as string}</dt>
                  <dd className="text-slate-700">{v as string}</dd>
                </div>
              ) : null)}
            </dl>
            {socrates.associatedSymptoms.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-blue-600 font-semibold">Associated Symptoms</p>
                <p className="text-slate-700">{socrates.associatedSymptoms.join(', ')}</p>
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Past Medical', intake.pastMedicalHistory],
            ['Allergies', intake.allergies],
            ['Family History', intake.familyHistory],
            ['Personal History', intake.previousTreatment],
          ].map(([k, v]) => (
            <div key={k as string} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-500">{k as string}</p>
              <p className="text-slate-700 mt-1">{v || 'Not reported'}</p>
            </div>
          ))}
        </div>
        {intake.digitizedDocuments && intake.digitizedDocuments.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="font-bold text-amber-800 mb-2">📄 Digitized Documents ({intake.digitizedDocuments.length})</h3>
            {intake.digitizedDocuments.map(doc => (
              <div key={doc.id} className="mb-3 pb-3 border-b border-amber-100 last:border-0">
                <p className="font-semibold text-slate-700">{doc.documentType} — {doc.fileName}</p>
                <p className="text-xs text-slate-500">{doc.doctorOrLabName} · {doc.documentDate}</p>
                {doc.extractedLabResults.filter(l => l.isAbnormal).map(lr => (
                  <div key={lr.testName} className="mt-1 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                    <span>⚠️</span>
                    <span>{lr.testName}: {lr.value} {lr.unit} (ref: {lr.referenceRange}) — {lr.flagType}</span>
                  </div>
                ))}
                {(doc.potentialDrugInteractions || []).map((di, i) => (
                  <div key={i} className="mt-1 flex items-center gap-2 text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                    <span>💊</span><span>{di}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50"
      role="main"
    >
      {/* Skip link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-teal-700 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Accessibility toolbar */}
      <AccessibilityToolbar />

      {/* App header */}
      <header className="bg-white border-b border-teal-100 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🏥</span>
          <div>
            <p className="font-bold text-teal-800 text-base leading-tight">{t('appName')}</p>
            <p className="text-xs text-slate-500">{t('tagline')}</p>
          </div>
        </div>
        {kioskStep > 1 && patientProfile && (
          <div className="ml-auto text-right">
            <p className="font-semibold text-slate-700 text-sm">{patientProfile.name}</p>
            <p className="text-xs text-teal-600">{patientProfile.abhaId}</p>
          </div>
        )}
      </header>

      {/* Progress bar */}
      {kioskStep >= 1 && (
        <div className="px-4 py-4 bg-white border-b border-slate-100">
          <AudioProgressBar steps={KIOSK_STEPS} currentStep={kioskStep - 1} />
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-6 pb-32">

        {/* ====================================================
            STEP 1 — LANGUAGE SELECTION
        ==================================================== */}
        {kioskStep === 1 && !langChosen && (
          <section aria-labelledby="lang-select-title">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4" aria-hidden="true">👋</div>
              <h1 id="lang-select-title" className="text-2xl font-bold text-slate-800 mb-2">
                {t('langSelectPrompt')}
              </h1>
              {/* Show prompt in all 4 languages */}
              <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500 mt-2">
                <span>Please tap your language</span>
                <span>·</span>
                <span>कृपया अपनी भाषा चुनें</span>
                <span>·</span>
                <span>மொழி தேர்க</span>
                <span>·</span>
                <span>ভাষা বেছে নিন</span>
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-4"
              role="radiogroup"
              aria-label="Language selection"
            >
              {(Object.entries(LANG_META) as [SupportedLang, typeof LANG_META[SupportedLang]][]).map(([code, meta]) => (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={lang === code}
                  aria-label={`${meta.label} — ${meta.script}`}
                  onClick={() => {
                    setLang(code);
                    speak(STRINGS[code].langSelectAudio, code);
                  }}
                  className={`
                    flex flex-col items-center gap-3 p-6 rounded-3xl border-3 min-h-[120px]
                    transition-all duration-200 cursor-pointer
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
                    active:scale-95
                    ${lang === code
                      ? 'border-teal-500 bg-teal-600 text-white shadow-xl'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'}
                  `}
                >
                  <span className="text-4xl" aria-hidden="true">{meta.flag}</span>
                  <span className="text-xl font-bold">{meta.label}</span>
                  <span className="text-xs opacity-75">{meta.script}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                aria-label={`Continue with ${LANG_META[lang].label}`}
                onClick={() => {
                  setLangChosen(true);
                  speak(t('authSubtitle'));
                }}
                className="
                  w-full max-w-xs py-4 bg-teal-600 hover:bg-teal-700 text-white
                  rounded-2xl font-bold text-lg shadow-lg
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300
                  transition-all active:scale-95
                "
              >
                {t('next')} →
              </button>
            </div>
          </section>
        )}

        {/* ====================================================
            STEP 1 — AUTH (after language chosen)
        ==================================================== */}
        {kioskStep === 1 && langChosen && !consentStep && (
          <section aria-labelledby="auth-title">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3" aria-hidden="true">🪪</div>
              <h1 id="auth-title" className="text-2xl font-bold text-slate-800">{t('authTitle')}</h1>
              <p className="text-slate-500 mt-1">{t('authSubtitle')}</p>
            </div>

            {/* Auth method selector */}
            <div
              className="flex gap-2 mb-6"
              role="radiogroup"
              aria-label="Login method"
            >
              {([
                { id: 'abha', icon: '🏥', label: t('abhaLogin') },
                { id: 'aadhaar', icon: '🪪', label: t('aadhaarLogin') },
                { id: 'register', icon: '➕', label: t('registerNew') },
              ] as { id: AuthMethod; icon: string; label: string }[]).map(method => (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={authMethod === method.id}
                  aria-label={method.label}
                  onClick={() => { setAuthMethod(method.id); speak(method.label); }}
                  className={`
                    flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-xs font-semibold
                    transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
                    ${authMethod === method.id
                      ? 'border-teal-500 bg-teal-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'}
                  `}
                >
                  <span className="text-2xl" aria-hidden="true">{method.icon}</span>
                  <span className="text-center leading-tight">{method.label}</span>
                </button>
              ))}
            </div>

            {/* ABHA login */}
            {authMethod === 'abha' && (
              <div className="space-y-3">
                <label htmlFor="abha-input" className="block text-sm font-semibold text-slate-700">
                  {t('abhaLogin')}
                </label>
                <p className="text-xs text-slate-500">{t('abhaHint')}</p>
                <input
                  id="abha-input"
                  type="text"
                  value={abhaInput}
                  onChange={e => setAbhaInput(e.target.value)}
                  placeholder={t('abhaPlaceholder')}
                  aria-label={t('abhaLogin')}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => startListening(setAbhaInput)}
                  aria-label="Speak your ABHA ID"
                  className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold ${isListeningVoice ? 'animate-listening' : ''}`}
                >
                  <span className="text-2xl" aria-hidden="true">🎤</span>
                  {isListeningVoice ? t('listeningLabel') : 'Speak your ABHA ID'}
                </button>
                <p className="text-xs text-teal-700 bg-teal-50 rounded-xl px-3 py-2">
                  💡 Try: <code>91-4829-1029-4821</code> or <code>ramesh@abdm</code>
                </p>
              </div>
            )}

            {/* Aadhaar login */}
            {authMethod === 'aadhaar' && (
              <div className="space-y-3">
                <label htmlFor="aadhaar-input" className="block text-sm font-semibold text-slate-700">
                  {t('aadhaarLogin')}
                </label>
                <input
                  id="aadhaar-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  value={aadhaarInput}
                  onChange={e => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('aadhaarPlaceholder')}
                  aria-label={t('aadhaarLogin')}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base tracking-widest focus:border-teal-500 focus:outline-none"
                />
                <p className="text-xs text-teal-700 bg-teal-50 rounded-xl px-3 py-2">
                  💡 Try: <code>234567890123</code>
                </p>
              </div>
            )}

            {/* Register new */}
            {authMethod === 'register' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input id="reg-name" type="text" value={regName} onChange={e => setRegName(e.target.value)}
                    placeholder="Your full name" aria-label="Full name"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-teal-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-age" className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                    <input id="reg-age" type="number" value={regAge} onChange={e => setRegAge(e.target.value)}
                      placeholder="e.g. 45" aria-label="Age"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-teal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                    <input id="reg-phone" type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      placeholder="10-digit number" aria-label="Phone number"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-teal-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <p className="block text-sm font-semibold text-slate-700 mb-2">{t('genderLabel')}</p>
                  <div className="flex gap-3" role="radiogroup" aria-label="Gender">
                    {(['Male', 'Female', 'Other'] as const).map(g => (
                      <button key={g} type="button" role="radio" aria-checked={regGender === g}
                        onClick={() => setRegGender(g)} aria-label={g}
                        className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 ${regGender === g ? 'border-teal-500 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>
                        {g === 'Male' ? '👨 ' + t('genderMale') : g === 'Female' ? '👩 ' + t('genderFemale') : '🧑 ' + t('genderOther')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {authError && (
              <div role="alert" aria-live="assertive" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-sm">
                <span aria-hidden="true">⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleAuth}
              disabled={authLoading}
              aria-label={authLoading ? t('processingLabel') : t('loginBtn')}
              className="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-2xl font-bold text-lg shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
            >
              {authLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin text-xl" aria-hidden="true">⏳</span>
                  {t('processingLabel')}
                </span>
              ) : (
                <>{t('loginBtn')} →</>
              )}
            </button>

            {/* Doctor login link */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-teal-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded">
                Doctor / Staff Login →
              </Link>
            </div>
          </section>
        )}

        {/* ====================================================
            STEP 1 — CONSENT
        ==================================================== */}
        {kioskStep === 1 && langChosen && consentStep && !consentGranted && (
          <section aria-labelledby="consent-title">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3" aria-hidden="true">🔒</div>
              <h1 id="consent-title" className="text-2xl font-bold text-slate-800">{t('consentTitle')}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {t('consentVerbalPrompt')}
              </p>
            </div>

            {/* Paragraph-by-paragraph consent with audio */}
            {renderConsentParagraphs()}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                aria-label={t('consentDisagree')}
                onClick={() => {
                  speak(t('consentDisagree'));
                  setConsentStep(false);
                }}
                className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg border-2 border-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 transition-all"
              >
                ❌ {t('consentDisagree')}
              </button>
              <button
                type="button"
                aria-label={t('consentAgree')}
                onClick={handleConsentGrant}
                className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 transition-all active:scale-95"
              >
                ✅ {t('consentAgree')}
              </button>
            </div>

            {/* Verbal consent button */}
            <button
              type="button"
              onClick={listenForConsent}
              aria-label='Say "yes" to agree'
              className={`mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold text-base ${isListeningVoice ? 'animate-listening' : ''}`}
            >
              <span className="text-2xl" aria-hidden="true">🎤</span>
              {isListeningVoice ? t('listeningLabel') : `Say "${t('yes')}" to agree verbally`}
            </button>

            {/* AYUSH system selection (on same consent screen after agreement intent) */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-700 mb-3">{t('selectAyushSystem')}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t('selectAyushSystem')}>
                {AYUSH_SYSTEMS.map(system => (
                  <button
                    key={system}
                    type="button"
                    role="radio"
                    aria-checked={preferredSystem === system}
                    aria-label={system}
                    onClick={() => { setPreferredSystem(system); speak(system); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 min-h-[80px] text-sm font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 active:scale-95 ${preferredSystem === system ? 'border-teal-500 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`}
                  >
                    <span className="text-3xl" aria-hidden="true">{AYUSH_ICONS[system]}</span>
                    <span className="text-center leading-tight">{system}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            STEP 2 — ADAPTIVE QUESTIONING
        ==================================================== */}
        {kioskStep === 2 && currentQuestion && (
          <section aria-labelledby="question-title">
            {/* Question counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500 font-medium">
                Question {questionIdx + 1} of {activeQuestions.length}
              </span>
              <div className="flex items-center gap-1">
                {activeQuestions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < questionIdx ? 'bg-teal-500' : i === questionIdx ? 'bg-teal-700' : 'bg-slate-200'}`} aria-hidden="true" />
                ))}
              </div>
            </div>

            {/* Phase label */}
            <div className="mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                currentQuestion.phase === 'chief_complaint' ? 'bg-amber-100 text-amber-700' :
                currentQuestion.phase === 'socrates' ? 'bg-blue-100 text-blue-700' :
                currentQuestion.phase === 'past_history' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}>
                {currentQuestion.phase.replace('_', ' ')}
              </span>
            </div>

            {/* Question */}
            <h2 id="question-title" className="text-2xl font-bold text-slate-800 mb-2 leading-snug">
              {t(currentQuestion.labelKey)}
            </h2>

            {/* Read aloud button */}
            <button
              type="button"
              aria-label="Read question aloud"
              onClick={() => speak(t(currentQuestion.audioKey))}
              className="mb-5 flex items-center gap-2 text-teal-600 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
            >
              <span aria-hidden="true">🔊</span> {t('repeat')}
            </button>

            {/* Single select */}
            {currentQuestion.type === 'single_select' && currentQuestion.options && (
              renderOptionGrid(
                currentQuestion,
                answers.site ? [
                  currentQuestion.socratesKey === 'site' ? (answers.site || '') :
                  currentQuestion.socratesKey === 'onset' ? (answers.onset || '') :
                  currentQuestion.socratesKey === 'character' ? (answers.character || '') :
                  currentQuestion.socratesKey === 'radiation' ? (answers.radiation || '') :
                  currentQuestion.socratesKey === 'timingDuration' ? (answers.timing || '') :
                  currentQuestion.id === 'duration' ? (answers.duration || '') :
                  currentQuestion.id === 'prakriti' ? (answers.prakriti || '') :
                  currentQuestion.id === 'ahara_shakti' ? (answers.aharaShakti || '') : ''
                ].filter(Boolean) : [],
                (id) => handleSingleSelect(id, currentQuestion),
              )
            )}

            {/* Multi select — SITE question uses interactive BodyMap */}
            {currentQuestion.type === 'multi_select' && currentQuestion.options && (
              <>
                {currentQuestion.socratesKey === 'site' ? (
                  /* ── Body Map for pain location ── */
                  <div className="space-y-4">
                    <BodyMap
                      selectedIds={answers.site ? [answers.site] : []}
                      onSelect={(regionId) => {
                        const optionId = REGION_TO_OPTION[regionId] ?? regionId;
                        const newAnswers = { ...answers, site: optionId };
                        setAnswers(newAnswers);
                        playTone('done');
                        setTimeout(() => advanceQuestion(newAnswers), 400);
                      }}
                      multi={false}
                    />
                  </div>
                ) : (
                  /* ── Regular multi-select grid ── */
                  <>
                    {renderOptionGrid(
                      currentQuestion,
                      currentQuestion.id === 'chief_complaint' ? (answers.chiefComplaintTags || []) :
                      currentQuestion.socratesKey === 'associatedSymptoms' ? (answers.associatedSymptoms || []) :
                      (answers.ros || []),
                      (id) => handleMultiSelect(id, currentQuestion),
                    )}
                    <button
                      type="button"
                      onClick={() => advanceQuestion(answers)}
                      className="mt-4 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-base shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
                    >
                      {t('next')} →
                    </button>
                  </>
                )}
              </>
            )}

            {/* Yes/No */}
            {currentQuestion.type === 'yes_no' && (
              <div className="flex gap-4">
                <button
                  type="button"
                  role="radio"
                  aria-checked={yesNoAnswer === true}
                  aria-label={t('yes')}
                  onClick={() => {
                    setYesNoAnswer(true);
                    handleFreeText('Yes', currentQuestion);
                    setTimeout(() => advanceQuestion({ ...answers }), 300);
                  }}
                  className={`flex-1 py-6 text-2xl font-bold rounded-2xl border-3 flex flex-col items-center gap-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 active:scale-95 ${yesNoAnswer === true ? 'bg-green-600 border-green-600 text-white' : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'}`}
                >
                  <span aria-hidden="true">✅</span>
                  {t('yes')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={yesNoAnswer === false}
                  aria-label={t('no')}
                  onClick={() => {
                    setYesNoAnswer(false);
                    handleFreeText('No', currentQuestion);
                    setTimeout(() => advanceQuestion({ ...answers }), 300);
                  }}
                  className={`flex-1 py-6 text-2xl font-bold rounded-2xl border-3 flex flex-col items-center gap-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400 active:scale-95 ${yesNoAnswer === false ? 'bg-red-600 border-red-600 text-white' : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'}`}
                >
                  <span aria-hidden="true">❌</span>
                  {t('no')}
                </button>
              </div>
            )}

            {/* Slider (severity) — enhanced with FACES Pain Scale */}
            {currentQuestion.type === 'slider' && (
              <div className="space-y-6">
                {/* FACES Pain Scale — primary input for low-literacy patients */}
                <FacesPainScale
                  value={sliderValue % 2 === 0 ? sliderValue : null}
                  onChange={(score) => {
                    setSliderValue(score);
                    speak(`${score} out of 10`);
                  }}
                />
                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or use number scale</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {/* Original numeric slider kept as secondary */}
                <div>
                  <div className="text-center mb-3">
                    <div
                      className={`text-5xl font-black transition-all ${sliderValue <= 3 ? 'text-green-500' : sliderValue <= 6 ? 'text-amber-500' : 'text-red-600'}`}
                      aria-live="polite"
                      aria-label={`Severity: ${sliderValue} out of 10`}
                    >
                      {sliderValue}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={currentQuestion.min ?? 1}
                    max={currentQuestion.max ?? 10}
                    step={currentQuestion.step ?? 1}
                    value={sliderValue}
                    onChange={e => { setSliderValue(Number(e.target.value)); speak(`${e.target.value} out of 10`); }}
                    aria-label={t(currentQuestion.labelKey)}
                    className="w-full h-3 rounded-full accent-teal-600 cursor-pointer"
                  />
                  {/* Large tap targets */}
                  <div className="flex justify-between gap-1 mt-3" role="group" aria-label="Pain scale tap buttons">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} out of 10`}
                        aria-pressed={sliderValue === n}
                        onClick={() => { setSliderValue(n); speak(`${n} out of 10`); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${sliderValue === n ? 'bg-teal-600 border-teal-600 text-white' : n <= 3 ? 'bg-green-50 border-green-200 text-green-700' : n <= 6 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newAnswers = { ...answers, severity: sliderValue };
                    setAnswers(newAnswers);
                    playTone('done');
                    advanceQuestion(newAnswers);
                  }}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
                >
                  {t('next')} →
                </button>
              </div>
            )}

            {/* Free voice / text */}
            {(currentQuestion.type === 'free_voice' || currentQuestion.type === 'voice_text') && (
              <div className="space-y-3">
                {/* Voice input */}
                <button
                  type="button"
                  aria-label={isListeningVoice ? t('listeningLabel') : 'Tap to speak your answer'}
                  onClick={() => startListening((text) => {
                    setCurrentFreeText(text);
                    handleFreeText(text, currentQuestion);
                    speak(`I heard: ${text}`);
                  })}
                  className={`
                    w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-3
                    font-bold text-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300
                    ${isListeningVoice
                      ? 'border-teal-500 bg-teal-600 text-white animate-listening'
                      : 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100'}
                  `}
                >
                  <span className="text-5xl" aria-hidden="true">{isListeningVoice ? '🔴' : '🎤'}</span>
                  <span>{isListeningVoice ? t('listeningLabel') : 'Tap to Speak'}</span>
                  {currentFreeText && !isListeningVoice && (
                    <span className="text-sm font-normal text-teal-900 bg-teal-100 px-3 py-1 rounded-xl mt-1">
                      "{currentFreeText}"
                    </span>
                  )}
                </button>

                {/* Text fallback */}
                <div className="relative">
                  <input
                    type="text"
                    value={currentFreeText}
                    onChange={e => {
                      setCurrentFreeText(e.target.value);
                      handleFreeText(e.target.value, currentQuestion);
                    }}
                    placeholder={currentQuestion.placeholder || 'Or type here…'}
                    aria-label={`Type your answer: ${t(currentQuestion.labelKey)}`}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-teal-500 focus:outline-none pr-12"
                  />
                </div>

                <div className="flex gap-3">
                  {!currentQuestion.required && (
                    <button
                      type="button"
                      onClick={() => advanceQuestion(answers)}
                      aria-label={t('skip')}
                      className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 transition-all"
                    >
                      {t('skip')} →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => advanceQuestion(answers)}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
                  >
                    {t('next')} →
                  </button>
                </div>
              </div>
            )}

            {/* Emergency modal */}
            {emergencyDetected && !emergencyDismissed && redFlagResult?.isEmergency && (
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="rf-title"
                aria-describedby="rf-desc"
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
              >
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-red-500">
                  <div className="text-7xl mb-4 animate-bounce" aria-hidden="true">🚨</div>
                  <h2 id="rf-title" className="text-2xl font-black text-red-700 mb-3">{t('redFlagTitle')}</h2>
                  <p id="rf-desc" className="text-slate-700 leading-relaxed mb-2">{t('redFlagBody')}</p>
                  <p className="text-red-700 font-semibold mb-2 text-sm">{redFlagResult.actionTaken}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {redFlagResult.symptomsTriggered.map(s => (
                      <span key={s} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label={t('redFlagAction')}
                    onClick={() => setEmergencyDismissed(true)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 transition-all"
                  >
                    {t('redFlagAction')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmergencyDismissed(true)}
                    className="mt-3 w-full py-3 text-slate-600 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                  >
                    I understand — continue
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ====================================================
            STEP 3 — DOCUMENT SCAN
        ==================================================== */}
        {kioskStep === 3 && (
          <section aria-labelledby="scan-title">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3" aria-hidden="true">📄</div>
              <h1 id="scan-title" className="text-2xl font-bold text-slate-800">{t('scanTitle')}</h1>
              <p className="text-slate-500 mt-1 text-sm leading-relaxed">{t('scanInstruction')}</p>
            </div>

            {/* Audio instruction */}
            <button
              type="button"
              onClick={() => speak(t('scanAudioGuide'))}
              aria-label="Hear scanning instructions"
              className="w-full flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-700 font-medium mb-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <span className="text-3xl" aria-hidden="true">🔊</span>
              <span className="text-left text-sm">Tap to hear scanning instructions aloud</span>
            </button>

            {/* Upload area */}
            <label
              htmlFor="doc-upload"
              aria-label="Upload or take photo of medical document"
              className="
                block w-full border-3 border-dashed border-teal-300 rounded-3xl
                p-8 text-center cursor-pointer hover:bg-teal-50 transition-all
                focus-within:ring-4 focus-within:ring-teal-400
              "
            >
              <span className="text-5xl" aria-hidden="true">📸</span>
              <p className="mt-3 text-teal-700 font-bold text-lg">Upload or Take Photo</p>
              <p className="text-slate-500 text-sm mt-1">Lab report · Prescription · Discharge summary</p>
              <input
                id="doc-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                capture="environment"
                onChange={handleFileUpload}
                className="sr-only"
                aria-label="Select medical document files"
              />
            </label>

            {scanLoading && (
              <div role="status" aria-live="polite" className="mt-4 flex items-center gap-3 text-teal-700 font-semibold">
                <span className="animate-spin text-2xl" aria-hidden="true">⏳</span>
                {t('processingLabel')} — Reading your document…
              </div>
            )}

            {/* Sample docs button */}
            {documents.length === 0 && (
              <button
                type="button"
                onClick={handleUseSampleDocs}
                className="mt-4 w-full py-3 border-2 border-amber-300 bg-amber-50 text-amber-700 rounded-2xl font-semibold hover:bg-amber-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 transition-all"
              >
                📋 Load Sample Medical Records (Demo)
              </button>
            )}

            {/* Scanned documents timeline */}
            {documents.length > 0 && (
              <div className="mt-6 space-y-4" aria-label="Scanned documents" aria-live="polite">
                <h2 className="font-bold text-slate-700 flex items-center gap-2">
                  <span aria-hidden="true">📑</span>
                  {documents.length} Document{documents.length > 1 ? 's' : ''} Scanned
                </h2>
                {documents.sort((a, b) => a.documentDate.localeCompare(b.documentDate)).map(doc => (
                  <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-800">{doc.documentType}</p>
                        <p className="text-sm text-slate-500">{doc.doctorOrLabName}</p>
                        <p className="text-xs text-slate-400">{doc.documentDate}</p>
                      </div>
                      <span className="text-2xl" aria-hidden="true">
                        {doc.documentType === 'Lab Report' ? '🔬' : doc.documentType === 'Prescription' ? '💊' : '📋'}
                      </span>
                    </div>
                    {doc.extractedLabResults.filter(l => l.isAbnormal).length > 0 && (
                      <div className="mt-3 space-y-1" role="list" aria-label="Abnormal results">
                        {doc.extractedLabResults.filter(l => l.isAbnormal).map(lr => (
                          <div
                            key={lr.testName}
                            role="listitem"
                            className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg"
                          >
                            <span aria-label="Abnormal" aria-hidden="true">⚠️</span>
                            <span><strong>{lr.testName}</strong>: {lr.value} {lr.unit} (ref: {lr.referenceRange}) — <em>{lr.flagType}</em></span>
                          </div>
                        ))}
                      </div>
                    )}
                    {(doc.potentialDrugInteractions || []).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {(doc.potentialDrugInteractions || []).map((di, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                            <span aria-label="Drug interaction alert" aria-hidden="true">💊</span>
                            <span>{di}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { speak(t('skip')); goToStep(4); }}
                aria-label={t('skipScan')}
                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 transition-all"
              >
                {documents.length > 0 ? t('next') : t('skipScan')} →
              </button>
              {documents.length > 0 && (
                <button
                  type="button"
                  onClick={() => { speak('Moving to summary'); goToStep(4); }}
                  className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
                >
                  Continue → Summary
                </button>
              )}
            </div>
          </section>
        )}

        {/* ====================================================
            STEP 4 — SUMMARY & HIS PUSH
        ==================================================== */}
        {kioskStep === 4 && (
          <section aria-labelledby="summary-title">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3" aria-hidden="true">📋</div>
              <h1 id="summary-title" className="text-2xl font-bold text-slate-800">{t('summaryTitle')}</h1>
              <p className="text-slate-500 text-sm mt-1">{t('summaryAudioConfirm')}</p>
              <button
                type="button"
                onClick={() => speak(t('summaryAudioConfirm'))}
                aria-label="Hear summary aloud"
                className="mt-2 text-teal-600 text-sm font-medium underline focus:outline-none"
              >
                🔊 Read summary aloud
              </button>
            </div>

            {/* AI note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">🤖</span>
              <p className="text-amber-800 text-sm font-medium">
                {t('aiPopulatedNote')} Your doctor will review and confirm all details.
              </p>
            </div>

            {/* Summary content */}
            {renderSummarySection(buildIntake())}

            {/* FHIR / HIS actions */}
            <div className="mt-6 space-y-3">
              {!hisPushed ? (
                <button
                  type="button"
                  onClick={handlePushToHis}
                  disabled={summaryLoading}
                  aria-label={summaryLoading ? t('processingLabel') : t('pushToHisBtn')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-bold shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 transition-all active:scale-95"
                >
                  {summaryLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin" aria-hidden="true">⏳</span> {t('processingLabel')}
                    </span>
                  ) : (
                    <>🏥 {t('pushToHisBtn')}</>
                  )}
                </button>
              ) : (
                <div role="status" aria-live="polite" className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">✅</span>
                  <div>
                    <p className="font-bold text-green-700">{t('pushSuccess')}</p>
                    {hisPushResult && (
                      <p className="text-green-600 text-xs mt-1">Reference: {hisPushResult.referenceId}</p>
                    )}
                  </div>
                </div>
              )}

              {fhirBundle && (
                <button
                  type="button"
                  onClick={() => setShowFhirModal(true)}
                  aria-label="View FHIR health record bundle"
                  className="w-full py-3 border-2 border-blue-300 text-blue-700 rounded-2xl font-semibold hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 transition-all"
                >
                  🔍 {t('fhirViewBtn')}
                </button>
              )}

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xl shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 transition-all active:scale-95"
              >
                ✅ {t('confirm')} & Get Token
              </button>
            </div>
          </section>
        )}

        {/* ====================================================
            STEP 5 — TOKEN / DONE
        ==================================================== */}
        {kioskStep === 5 && submittedIntake && (
          <section aria-labelledby="token-title" className="space-y-6 pb-8">
            {/* Celebration */}
            <div className="text-center py-4">
              <div className="text-7xl mb-3" aria-hidden="true">🎉</div>
              <h1 id="token-title" className="text-3xl font-black text-teal-800 mb-2">{t('tokenTitle')}</h1>
              <p className="text-slate-600">{t('waitMessage')}</p>
            </div>

            {/* Red flag priority alert */}
            {submittedIntake.isRedFlagEmergency && (
              <div role="alert" aria-live="assertive" className="p-4 bg-red-50 border-2 border-red-400 rounded-2xl flex items-start gap-3">
                <span className="text-3xl" aria-hidden="true">🚨</span>
                <div>
                  <p className="font-bold text-red-700">Priority Triage Patient</p>
                  <p className="text-red-600 text-sm">Emergency symptoms detected. Please alert a staff member immediately — do NOT wait in queue.</p>
                </div>
              </div>
            )}

            {/* ── Live Queue Tracker ── */}
            <QueueTracker
              tokenNumber={tokenNumber}
              ayushSystem={submittedIntake.preferredAyushSystem}
              isRedFlag={submittedIntake.isRedFlagEmergency}
            />

            {/* Audio confirmation */}
            <button
              type="button"
              onClick={() => speak(t('tokenAudio').replace('{token}', tokenNumber))}
              aria-label="Hear your token number again"
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 transition-all"
            >
              🔊 Hear my token number again
            </button>

            {/* ── Discharge Card ── */}
            <DischargeCard intake={submittedIntake} />

            <Link
              to="/login"
              className="block py-3 border-2 border-slate-200 rounded-2xl text-slate-600 font-semibold text-center hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 transition-all"
            >
              {t('returnToDashboard')}
            </Link>
          </section>
        )}
      </main>

      {/* Persistent Repeat/Back/Help cluster */}
      <RepeatBackButton
        onBack={handleBack}
        showBack={kioskStep > 1 || (kioskStep === 2 && questionIdx > 0)}
        repeatText={(() => {
          if (kioskStep === 1 && !langChosen) return t('langSelectAudio');
          if (kioskStep === 2 && currentQuestion) return t(currentQuestion.audioKey);
          if (kioskStep === 3) return t('scanAudioGuide');
          if (kioskStep === 4) return t('summaryAudioConfirm');
          return '';
        })()}
      />

      {/* FHIR modal */}
      {showFhirModal && fhirBundle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fhir-title"
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="fhir-title" className="font-bold text-slate-800">FHIR R4 Bundle (Mocked)</h2>
              <button type="button" onClick={() => setShowFhirModal(false)} aria-label="Close FHIR viewer" className="text-2xl text-slate-500 hover:text-slate-800 focus:outline-none">✕</button>
            </div>
            <pre className="overflow-auto p-4 text-xs text-slate-700 font-mono bg-slate-50 flex-1">
              {JSON.stringify(fhirBundle, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ── Help Assistant Chatbot (bottom-left, always present) ── */}
      <HelpChatbot
        currentStep={kioskStep}
        currentQuestionText={currentQuestion ? t(currentQuestion.audioKey) : undefined}
        currentQuestionLabel={currentQuestion ? t(currentQuestion.labelKey) : undefined}
      />
    </div>
  );
};
