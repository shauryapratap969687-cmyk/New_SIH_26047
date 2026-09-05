import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Save,
  FileCheck,
  RotateCcw,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Sparkles,
  HeartPulse,
  Brain,
  Layers,
  FileText,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  Activity,
  PlusCircle,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type {
  AyushSystem,
  CaseRecord,
  Patient,
  PresentingComplaints,
  GeneralHistory,
  VitalsAndExam,
  AyushAssessment,
  NotesAndPlan,
} from '../types';
import { VoiceDictationButton } from '../components/VoiceDictationButton';

const AYUSH_SYSTEMS: AyushSystem[] = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homoeopathy',
];

export const CaseTakingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: editCaseId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId');

  const [patients] = useState<Patient[]>(() => storageService.getPatients());

  // Existing case if editing
  const existingCase = editCaseId ? storageService.getCaseById(editCaseId) : null;

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    if (existingCase) return existingCase.patientId;
    if (preselectedPatientId) return preselectedPatientId;
    const initialPatients = storageService.getPatients();
    return initialPatients.length > 0 ? initialPatients[0].id : '';
  });

  const [caseDate, setCaseDate] = useState<string>(() => {
    if (existingCase) return existingCase.caseDate;
    return new Date().toISOString().split('T')[0];
  });

  const [ayushSystem, setAyushSystem] = useState<AyushSystem>(() => {
    if (existingCase) return existingCase.ayushSystem;
    return 'Ayurveda';
  });

  const [activeTab, setActiveTab] = useState<
    'patient' | 'complaints' | 'history' | 'vitals' | 'assessment' | 'plan'
  >('patient');

  // Form State
  const [complaints, setComplaints] = useState<PresentingComplaints>(() => {
    if (existingCase) return existingCase.presentingComplaints;
    return {
      chiefComplaints: '',
      duration: '',
      onsetProgression: '',
      associatedSymptoms: '',
      previousTreatment: '',
    };
  });

  const [history, setHistory] = useState<GeneralHistory>(() => {
    if (existingCase) return existingCase.generalHistory;
    return {
      pastMedicalHistory: '',
      familyHistory: '',
      personalHistory: '',
      dietAppetite: '',
      sleep: '',
      bowelHabits: '',
      bladderHabits: '',
      lifestyleRoutine: '',
      mentalEmotionalState: '',
      menstrualReproductiveHistory: '',
    };
  });

  const [vitals, setVitals] = useState<VitalsAndExam>(() => {
    if (existingCase) return existingCase.vitals;
    return {
      height: '',
      weight: '',
      bmi: '',
      bp: '',
      pulse: '',
      temperature: '98.4',
      respiratoryRate: '16',
      generalExamination: '',
      localSystemicExamination: '',
    };
  });

  const [assessment, setAssessment] = useState<AyushAssessment>(() => {
    if (existingCase) return existingCase.ayushAssessment;
    return {
      prakritiNotes: '',
      agni: '',
      bala: 'Madhyama (Medium)',
      satva: 'Madhyama (Medium)',
      nidraQuality: '',
      aharaPattern: '',
      viharaPattern: '',
      rogiBala: '',
      rogaBala: '',
      nidana: '',
      samprapti: '',
      provisionalAssessment: '',
      ayurveda: {
        dominantDosha: 'Vata',
        prakriti: 'Vata-Pitta',
        vikriti: '',
        agni: 'Vishama',
        koshta: 'Madhyama',
        ashtavidha: {
          nadi: '',
          mutra: '',
          mala: '',
          jihva: '',
          shabda: '',
          sparsha: '',
          drik: '',
          akriti: '',
        },
        dashavidha: {
          prakriti: '',
          vikriti: '',
          sara: '',
          samhanana: '',
          pramana: '',
          satmya: '',
          satva: '',
          aharaShakti: '',
          vyayamaShakti: '',
          vaya: '',
        },
      },
      homoeopathy: {
        mentalGenerals: '',
        physicalGenerals: '',
        thermalState: 'Ambi-thermal',
        thirstPattern: 'Thirsty',
        foodCravings: '',
        foodAversions: '',
        modalities: '',
        concomitantSymptoms: '',
        miasmaticImpression: 'Psora',
        repertoryRubrics: '',
      },
      unani: {
        mizaj: 'Damwi (Sanguine)',
        akhlatImbalance: '',
        nabz: '',
        asbabESitta: {
          airEnvironment: '',
          foodDrink: '',
          movementRest: '',
          sleepWakefulness: '',
          evacuationRetention: '',
          emotions: '',
        },
        sueMizaj: '',
        unaniAssessmentNotes: '',
      },
      siddha: {
        udalThathu: '',
        envagaiThervu: {
          naa: '',
          niram: '',
          mozhi: '',
          vizhi: '',
          sparisam: '',
          malam: '',
          neer: '',
          naadi: '',
        },
        valiAzhalIyamBalance: 'Balanced',
        neerkuriNeikuri: '',
        siddhaAssessmentNotes: '',
      },
      yogaNaturopathy: {
        dietPattern: '',
        dailyRoutine: '',
        stressLevel: 'Moderate',
        physicalActivityLevel: 'Lightly Active',
        yogaExperience: '',
        flexibilityLimitations: '',
        contraindications: '',
        natureCureAssessment: '',
      },
    };
  });

  const [notesAndPlan, setNotesAndPlan] = useState<NotesAndPlan>(() => {
    if (existingCase) return existingCase.notesAndPlan;
    return {
      doctorObservations: '',
      provisionalDiagnosis: '',
      recommendedInvestigations: '',
      advicePlan: '',
      followUpDate: '',
    };
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Helper to update vitals and compute BMI
  const handleVitalsChange = (field: keyof VitalsAndExam, value: string) => {
    setVitals((prev) => {
      const next = { ...prev, [field]: value };
      const h = parseFloat(field === 'height' ? value : next.height);
      const w = parseFloat(field === 'weight' ? value : next.weight);
      if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        next.bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
      }
      return next;
    });
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const handleSave = (status: 'Draft' | 'Saved') => {
    if (!selectedPatientId) {
      setNotification({
        type: 'error',
        message: 'Please select a patient before saving the case.',
      });
      setActiveTab('patient');
      return;
    }

    if (status === 'Saved' && !complaints.chiefComplaints.trim()) {
      setNotification({
        type: 'error',
        message: 'Please record Chief Presenting Complaints before finalizing the case.',
      });
      setActiveTab('complaints');
      return;
    }

    const patient = patients.find((p) => p.id === selectedPatientId);
    const caseId = editCaseId || storageService.generateCaseId();

    const newRecord: CaseRecord = {
      id: caseId,
      patientId: selectedPatientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      caseDate,
      ayushSystem,
      status,
      presentingComplaints: complaints,
      generalHistory: history,
      vitals,
      ayushAssessment: assessment,
      notesAndPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCase(newRecord);

    setNotification({
      type: 'success',
      message: `Case record ${caseId} successfully ${
        status === 'Draft' ? 'saved as Draft' : 'finalized and saved'
      }!`,
    });

    setTimeout(() => {
      navigate(`/cases/${caseId}`);
    }, 900);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      setComplaints({
        chiefComplaints: '',
        duration: '',
        onsetProgression: '',
        associatedSymptoms: '',
        previousTreatment: '',
      });
      setHistory({
        pastMedicalHistory: '',
        familyHistory: '',
        personalHistory: '',
        dietAppetite: '',
        sleep: '',
        bowelHabits: '',
        bladderHabits: '',
        lifestyleRoutine: '',
        mentalEmotionalState: '',
        menstrualReproductiveHistory: '',
      });
      setVitals({
        height: '',
        weight: '',
        bmi: '',
        bp: '',
        pulse: '',
        temperature: '98.4',
        respiratoryRate: '16',
        generalExamination: '',
        localSystemicExamination: '',
      });
      setNotesAndPlan({
        doctorObservations: '',
        provisionalDiagnosis: '',
        recommendedInvestigations: '',
        advicePlan: '',
        followUpDate: '',
      });
      setNotification({ type: 'info', message: 'Form fields have been reset.' });
    }
  };

  const tabs = [
    { id: 'patient', label: '1. Patient & System', icon: UserCheck },
    { id: 'complaints', label: '2. Chief Complaints', icon: HeartPulse },
    { id: 'history', label: '3. General History', icon: Layers },
    { id: 'vitals', label: '4. Vitals & Exam', icon: Activity },
    { id: 'assessment', label: `5. ${ayushSystem} Assessment`, icon: Brain },
    { id: 'plan', label: '6. Doctor Notes & Plan', icon: FileText },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {editCaseId ? `Edit Case (${editCaseId})` : 'New AYUSH Clinical Case-Taking'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                Smart Case Sheet
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Discipline-specific structured case sheet with live voice dictation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('Draft')}
            className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-amber-700" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('Saved')}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Finalize & Save Case</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 bg-white p-2 rounded-xl shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        {/* SECTION A: PATIENT SELECTION & AYUSH SYSTEM */}
        {activeTab === 'patient' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 1: Patient Selection & AYUSH Discipline
                </h2>
                <p className="text-xs text-slate-500">
                  Link this case record to an existing patient and set the primary AYUSH system.
                </p>
              </div>
              <Link
                to="/patients/new"
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add New Patient</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Select Patient */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Patient <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white font-medium text-slate-800"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.registrationNo} • {p.gender}, {p.age}y)
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Case Taking Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={caseDate}
                    onChange={(e) => setCaseDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Primary AYUSH System */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary AYUSH Discipline <span className="text-red-500">*</span>
                </label>
                <select
                  value={ayushSystem}
                  onChange={(e) => setAyushSystem(e.target.value as AyushSystem)}
                  className="w-full px-3.5 py-2.5 text-sm border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 bg-teal-50/50 font-bold text-teal-950"
                >
                  {AYUSH_SYSTEMS.map((sys) => (
                    <option key={sys} value={sys}>
                      {sys}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Patient Summary Card */}
            {selectedPatient ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/30 border border-teal-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      Patient Demographic Summary
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-900 border border-teal-300">
                      {selectedPatient.registrationNo}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Consent Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Full Name:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {selectedPatient.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Age & Gender:</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                      {selectedPatient.age} Years • {selectedPatient.gender}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                      {selectedPatient.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Known Allergies:</span>
                    <p className="font-bold text-amber-700 text-sm mt-0.5">
                      {selectedPatient.allergies || 'None reported'}
                    </p>
                  </div>
                </div>

                {selectedPatient.address && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Address: </span>
                    {selectedPatient.address}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50">
                <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Please select a registered patient above to proceed.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Proceed to Chief Complaints</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: PRESENTING COMPLAINTS (VOICE ENABLED) */}
        {activeTab === 'complaints' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Presenting Complaints & History of Illness
                </h2>
                <p className="text-xs text-slate-500">
                  Record chief presenting symptoms, onset, progression, and previous therapies.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Voice Dictation Enabled</span>
              </div>
            </div>

            {/* Chief Complaints with Voice */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Chief Presenting Complaints (Pradhana Vedana) <span className="text-red-500">*</span>
                </label>
                <VoiceDictationButton
                  targetLabel="Chief Complaints"
                  onAppendText={(text) =>
                    setComplaints((prev) => ({
                      ...prev,
                      chiefComplaints: prev.chiefComplaints
                        ? `${prev.chiefComplaints} ${text}`
                        : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={4}
                required
                placeholder="e.g. Pain and swelling in right knee joint since 6 months, aggravated in cold weather and upon climbing stairs..."
                value={complaints.chiefComplaints}
                onChange={(e) =>
                  setComplaints({ ...complaints, chiefComplaints: e.target.value })
                }
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration of Complaints (Kala)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Months, 2 Weeks, 1 Year"
                  value={complaints.duration}
                  onChange={(e) =>
                    setComplaints({ ...complaints, duration: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Onset & Progression */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Onset & Progression
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sudden / Gradual, progressively worsening"
                  value={complaints.onsetProgression}
                  onChange={(e) =>
                    setComplaints({ ...complaints, onsetProgression: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Associated Symptoms */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Associated Symptoms (Anubandha Lakshana)
                </label>
                <VoiceDictationButton
                  targetLabel="Associated Symptoms"
                  onAppendText={(text) =>
                    setComplaints((prev) => ({
                      ...prev,
                      associatedSymptoms: prev.associatedSymptoms
                        ? `${prev.associatedSymptoms} ${text}`
                        : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Early morning stiffness, burning sensation in soles, indigestion, headache..."
                value={complaints.associatedSymptoms}
                onChange={(e) =>
                  setComplaints({ ...complaints, associatedSymptoms: e.target.value })
                }
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Previous Treatment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Previous Treatment Taken & Response
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Allopathic analgesics for 2 weeks with transient relief; Ayurvedic Kashayam taken 1 year ago..."
                value={complaints.previousTreatment}
                onChange={(e) =>
                  setComplaints({ ...complaints, previousTreatment: e.target.value })
                }
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('patient')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Proceed to General History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION C: GENERAL CASE HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Step 3: General Case History & Systemic Inquiry
              </h2>
              <p className="text-xs text-slate-500">
                Past medical, family, dietary, psychological, and physiological history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Past Medical History */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Past Medical / Surgical History
                  </label>
                  <VoiceDictationButton
                    targetLabel="Past History"
                    onAppendText={(text) =>
                      setHistory((prev) => ({
                        ...prev,
                        pastMedicalHistory: prev.pastMedicalHistory
                          ? `${prev.pastMedicalHistory} ${text}`
                          : text,
                      }))
                    }
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="e.g. HTN / DM / Jaundice / Surgery history / Childhood illness"
                  value={history.pastMedicalHistory}
                  onChange={(e) =>
                    setHistory({ ...history, pastMedicalHistory: e.target.value })
                  }
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Family History */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Family History (Kula Vrittanta)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hereditary arthritis, diabetes, hypertension, bronchial asthma in parents"
                  value={history.familyHistory}
                  onChange={(e) =>
                    setHistory({ ...history, familyHistory: e.target.value })
                  }
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Physiological Functions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diet & Appetite (Ahara / Agni)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular / Irregular, vegetarian, heavy appetite"
                  value={history.dietAppetite}
                  onChange={(e) =>
                    setHistory({ ...history, dietAppetite: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sleep Quality (Nidra)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sound (7-8 hrs), Insomnia, Disturbed by pain"
                  value={history.sleep}
                  onChange={(e) =>
                    setHistory({ ...history, sleep: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bowel Habits (Mala Pravritti)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular / Constipated (Vibandha) / Loose"
                  value={history.bowelHabits}
                  onChange={(e) =>
                    setHistory({ ...history, bowelHabits: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bladder Habits (Mutra Pravritti)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clear, normal frequency (4-5x), Nocturia"
                  value={history.bladderHabits}
                  onChange={(e) =>
                    setHistory({ ...history, bladderHabits: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lifestyle & Routine (Vihara)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sedentary desk job, late night work, high physical labor"
                  value={history.lifestyleRoutine}
                  onChange={(e) =>
                    setHistory({ ...history, lifestyleRoutine: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mental / Emotional State (Manasika)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anxious, irritable, calm, stressed due to workload"
                  value={history.mentalEmotionalState}
                  onChange={(e) =>
                    setHistory({ ...history, mentalEmotionalState: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Menstrual / Reproductive & Personal History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Menstrual / Reproductive History (Artava Vrittanta)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular 28-day cycle / Dysmenorrhea / Menopause / N/A"
                  value={history.menstrualReproductiveHistory}
                  onChange={(e) =>
                    setHistory({
                      ...history,
                      menstrualReproductiveHistory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personal Habits / Addiction
                </label>
                <input
                  type="text"
                  placeholder="e.g. Non-smoker, non-alcoholic, tea/coffee twice daily"
                  value={history.personalHistory}
                  onChange={(e) =>
                    setHistory({ ...history, personalHistory: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vitals')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Proceed to Vitals & Exam</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: VITALS & PHYSICAL EXAMINATION */}
        {activeTab === 'vitals' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Step 4: Examination & Clinical Vitals
              </h2>
              <p className="text-xs text-slate-500">
                Quantitative clinical parameters, BMI computation, and physical examination findings.
              </p>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="170"
                  value={vitals.height}
                  onChange={(e) => handleVitalsChange('height', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="70"
                  value={vitals.weight}
                  onChange={(e) => handleVitalsChange('weight', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  BMI (kg/m²)
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="Auto"
                  value={vitals.bmi ? `${vitals.bmi}` : ''}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 bg-slate-50 rounded-lg font-bold text-teal-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  BP (mmHg)
                </label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={vitals.bp}
                  onChange={(e) => handleVitalsChange('bp', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  placeholder="72"
                  value={vitals.pulse}
                  onChange={(e) => handleVitalsChange('pulse', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Temp (°F)
                </label>
                <input
                  type="text"
                  placeholder="98.4"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Resp Rate (/min)
                </label>
                <input
                  type="number"
                  placeholder="16"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalsChange('respiratoryRate', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* General Examination Notes with Voice */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  General Physical Examination Findings
                </label>
                <VoiceDictationButton
                  targetLabel="General Examination"
                  onAppendText={(text) =>
                    setVitals((prev) => ({
                      ...prev,
                      generalExamination: prev.generalExamination
                        ? `${prev.generalExamination} ${text}`
                        : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Conscious, oriented, no pallor, icterus, cyanosis, clubbing, lymphadenopathy, or pedal edema..."
                value={vitals.generalExamination}
                onChange={(e) =>
                  setVitals({ ...vitals, generalExamination: e.target.value })
                }
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Local / Systemic Examination with Voice */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Local / Systemic Clinical Examination (CVS, RS, GIT, CNS, Musculoskeletal)
                </label>
                <VoiceDictationButton
                  targetLabel="Systemic Examination"
                  onAppendText={(text) =>
                    setVitals((prev) => ({
                      ...prev,
                      localSystemicExamination: prev.localSystemicExamination
                        ? `${prev.localSystemicExamination} ${text}`
                        : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Musculoskeletal: Right knee joint tenderness on medial joint line (+), crepitus present, flexion restricted to 110 deg. CVS: S1 S2 normal..."
                value={vitals.localSystemicExamination}
                onChange={(e) =>
                  setVitals({
                    ...vitals,
                    localSystemicExamination: e.target.value,
                  })
                }
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assessment')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Proceed to {ayushSystem} Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION E: AYUSH-SPECIFIC ASSESSMENT (STAR FEATURE) */}
        {activeTab === 'assessment' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Step 5: AYUSH Assessment — {ayushSystem}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-900 border border-teal-300">
                    Discipline Specific
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Standardized AYUSH clinical diagnostic criteria, holistic balance, and etiology.
                </p>
              </div>

              {/* System Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Switch System:</span>
                <select
                  value={ayushSystem}
                  onChange={(e) => setAyushSystem(e.target.value as AyushSystem)}
                  className="px-2.5 py-1 text-xs border border-teal-300 rounded-md bg-teal-50 text-teal-900 font-bold"
                >
                  {AYUSH_SYSTEMS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Common AYUSH Assessment Grid */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-teal-700" />
                <span>Common AYUSH Holistic Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bala (Patient Vital Strength)
                  </label>
                  <select
                    value={assessment.bala}
                    onChange={(e) =>
                      setAssessment({ ...assessment, bala: e.target.value as any })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Pravara (Superior)">Pravara (Superior / उत्तम)</option>
                    <option value="Madhyama (Medium)">Madhyama (Medium / मध्यम)</option>
                    <option value="Avara (Inferior)">Avara (Inferior / हीन)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Satva (Mental Resilience)
                  </label>
                  <select
                    value={assessment.satva}
                    onChange={(e) =>
                      setAssessment({ ...assessment, satva: e.target.value as any })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Pravara (High)">Pravara (High / प्रवर)</option>
                    <option value="Madhyama (Medium)">Madhyama (Medium / मध्यम)</option>
                    <option value="Avara (Low)">Avara (Low / अवर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Agni / Digestive Power
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sama / Vishama / Tikshna / Manda"
                    value={assessment.agni}
                    onChange={(e) =>
                      setAssessment({ ...assessment, agni: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nidra / Sleep Quality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prakrita / Alpa Nidra / Ati Nidra"
                    value={assessment.nidraQuality}
                    onChange={(e) =>
                      setAssessment({ ...assessment, nidraQuality: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Nidana & Samprapti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nidana (Causative & Trigger Factors)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Consumption of dry/cold foods, irregular routine, stress"
                    value={assessment.nidana}
                    onChange={(e) =>
                      setAssessment({ ...assessment, nidana: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Samprapti (Pathogenesis / Disease Mechanism)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dosha Dushya Sammurchana in Sandhi sthana..."
                    value={assessment.samprapti}
                    onChange={(e) =>
                      setAssessment({ ...assessment, samprapti: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 1. AYURVEDA SPECIFIC */}
            {ayushSystem === 'Ayurveda' && assessment.ayurveda && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-5">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🕉️ Ayurveda Pariksha (Ashtavidha & Dashavidha)</span>
                  </h3>
                  <span className="text-[11px] text-amber-800 font-semibold">
                    Classical Ayurvedic Framework
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Dominant Dosha
                    </label>
                    <select
                      value={assessment.ayurveda.dominantDosha}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          ayurveda: {
                            ...assessment.ayurveda!,
                            dominantDosha: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                    >
                      <option value="Vata">Vata (वात)</option>
                      <option value="Pitta">Pitta (पित्त)</option>
                      <option value="Kapha">Kapha (कफ)</option>
                      <option value="Vata-Pitta">Vata-Pitta (द्वन्द्वज)</option>
                      <option value="Pitta-Kapha">Pitta-Kapha (द्वन्द्वज)</option>
                      <option value="Vata-Kapha">Vata-Kapha (द्वन्द्वज)</option>
                      <option value="Tridoshic">Tridoshic / Sannipata (सन्निपात)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Prakriti (Constitution)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vata-Pitta"
                      value={assessment.ayurveda.prakriti}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          ayurveda: {
                            ...assessment.ayurveda!,
                            prakriti: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Agni (Digestive Fire)
                    </label>
                    <select
                      value={assessment.ayurveda.agni}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          ayurveda: {
                            ...assessment.ayurveda!,
                            agni: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                    >
                      <option value="Sama">Sama (Balanced / समाग्नि)</option>
                      <option value="Vishama">Vishama (Irregular / विषम)</option>
                      <option value="Tikshna">Tikshna (Intense / तीक्ष्ण)</option>
                      <option value="Manda">Manda (Sluggish / मन्द)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Koshta (Bowel Habit)
                    </label>
                    <select
                      value={assessment.ayurveda.koshta}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          ayurveda: {
                            ...assessment.ayurveda!,
                            koshta: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                    >
                      <option value="Mridu">Mridu (Soft / मृदु)</option>
                      <option value="Madhyama">Madhyama (Medium / मध्यम)</option>
                      <option value="Krura">Krura (Hard/Constipated / क्रूर)</option>
                    </select>
                  </div>
                </div>

                {/* Ashtavidha Pariksha 8-fold examination */}
                <div className="space-y-2 pt-2 border-t border-amber-200">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Ashtavidha Pariksha (अष्टविध परीक्षा)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        1. Nadi (Pulse)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vata gati, 74 bpm"
                        value={assessment.ayurveda.ashtavidha.nadi}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                nadi: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        2. Mutra (Urine)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Prakrita / Avila"
                        value={assessment.ayurveda.ashtavidha.mutra}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                mutra: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        3. Mala (Stool)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Krura / Vibaddha"
                        value={assessment.ayurveda.ashtavidha.mala}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                mala: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        4. Jihva (Tongue)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sama (Coated) / Nirama"
                        value={assessment.ayurveda.ashtavidha.jihva}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                jihva: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        5. Shabda (Voice)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Prakrita / Spashta"
                        value={assessment.ayurveda.ashtavidha.shabda}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                shabda: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        6. Sparsha (Touch)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sheeta / Ushna / Ruksha"
                        value={assessment.ayurveda.ashtavidha.sparsha}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                sparsha: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        7. Drik (Eyes/Vision)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Prakrita / Peeta"
                        value={assessment.ayurveda.ashtavidha.drik}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                drik: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        8. Akriti (Appearance)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madhyama Sharira"
                        value={assessment.ayurveda.ashtavidha.akriti}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              ashtavidha: {
                                ...assessment.ayurveda!.ashtavidha,
                                akriti: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Dashavidha Pariksha Summary */}
                <div className="space-y-2 pt-2 border-t border-amber-200">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Dashavidha Pariksha Notes (दशविध परीक्षा)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        Sara, Samhanana & Pramana
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madhyama Asthi Sara, Sushlishta Sandhi"
                        value={assessment.ayurveda.dashavidha.sara}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              dashavidha: {
                                ...assessment.ayurveda!.dashavidha,
                                sara: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                        Ahara Shakti & Vyayama Shakti
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Abhyavaharana Shakti Madhyama, Vyayama Avara"
                        value={assessment.ayurveda.dashavidha.aharaShakti}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            ayurveda: {
                              ...assessment.ayurveda!,
                              dashavidha: {
                                ...assessment.ayurveda!.dashavidha,
                                aharaShakti: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. HOMOEOPATHY SPECIFIC */}
            {ayushSystem === 'Homoeopathy' && assessment.homoeopathy && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-5">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h3 className="text-sm font-bold text-blue-950">
                    🌿 Homoeopathic Totality & Miasmatic Assessment
                  </h3>
                  <span className="text-[11px] text-blue-800 font-semibold">
                    Constitutional Totality
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Thermal State
                    </label>
                    <select
                      value={assessment.homoeopathy.thermalState}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          homoeopathy: {
                            ...assessment.homoeopathy!,
                            thermalState: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                    >
                      <option value="Chilly">Chilly (Intolerant to cold)</option>
                      <option value="Hot">Hot (Intolerant to heat)</option>
                      <option value="Ambi-thermal">Ambi-thermal (Sensitive to both)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Thirst Pattern
                    </label>
                    <select
                      value={assessment.homoeopathy.thirstPattern}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          homoeopathy: {
                            ...assessment.homoeopathy!,
                            thirstPattern: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                    >
                      <option value="Thirsty">Thirsty (Large quantities)</option>
                      <option value="Thirstless">Thirstless</option>
                      <option value="Thirst for small quantities">
                        Thirst for small quantities frequently
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Miasmatic Impression
                    </label>
                    <select
                      value={assessment.homoeopathy.miasmaticImpression}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          homoeopathy: {
                            ...assessment.homoeopathy!,
                            miasmaticImpression: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                    >
                      <option value="Psora">Psora</option>
                      <option value="Sycosis">Sycosis</option>
                      <option value="Syphilis">Syphilis</option>
                      <option value="Tubercular">Tubercular</option>
                      <option value="Mixed Miasmatic">Mixed Miasmatic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Mental Generals
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Introverted, conscientious, consolation aggravates, weepiness..."
                      value={assessment.homoeopathy.mentalGenerals}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          homoeopathy: {
                            ...assessment.homoeopathy!,
                            mentalGenerals: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 text-xs border border-blue-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Physical Generals & Cravings/Aversions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Craving for salt/sweets, aversion to fats, perspiration pattern..."
                      value={assessment.homoeopathy.physicalGenerals}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          homoeopathy: {
                            ...assessment.homoeopathy!,
                            physicalGenerals: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 text-xs border border-blue-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">
                    Modalities (Aggravation & Amelioration Factors)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Worse (<): morning 10am, sun heat. Better (>): dark quiet room, pressure."
                    value={assessment.homoeopathy.modalities}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        homoeopathy: {
                          ...assessment.homoeopathy!,
                          modalities: e.target.value,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">
                    Repertory Rubrics / Keynotes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HEAD - PAIN - right sided - sun < | MIND - CONSOLATION - agg"
                    value={assessment.homoeopathy.repertoryRubrics}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        homoeopathy: {
                          ...assessment.homoeopathy!,
                          repertoryRubrics: e.target.value,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            )}

            {/* 3. UNANI SPECIFIC */}
            {ayushSystem === 'Unani' && assessment.unani && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-5">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h3 className="text-sm font-bold text-emerald-950">
                    📜 Unani Tibb Assessment (Mizaj & Asbab-e-Sitta)
                  </h3>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Humoral Temperament
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Mizaj (Temperament)
                    </label>
                    <select
                      value={assessment.unani.mizaj}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          unani: {
                            ...assessment.unani!,
                            mizaj: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                    >
                      <option value="Damwi (Sanguine)">Damwi (Sanguine / Hot & Moist)</option>
                      <option value="Safrawi (Choleric)">Safrawi (Choleric / Hot & Dry)</option>
                      <option value="Balghami (Phlegmatic)">Balghami (Phlegmatic / Cold & Moist)</option>
                      <option value="Sawdawi (Melancholic)">Sawdawi (Melancholic / Cold & Dry)</option>
                      <option value="Motadil (Equable)">Motadil (Equable / Balanced)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Akhlat (Humor Imbalance)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ghalba-e-Balgham / Ghalba-e-Safra"
                      value={assessment.unani.akhlatImbalance}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          unani: {
                            ...assessment.unani!,
                            akhlatImbalance: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Nabz (Pulse Characteristics)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nabz-e-Batee wa Layyin (Slow & Soft)"
                      value={assessment.unani.nabz}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          unani: {
                            ...assessment.unani!,
                            nabz: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Asbab-e-Sitta Zarooriya (6 Essentials) */}
                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Asbab-e-Sitta Zarooriya (6 Essential Factors)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">1. Air / Climate:</span>
                      <input
                        type="text"
                        placeholder="Hawa-e-Muheet notes"
                        value={assessment.unani.asbabESitta.airEnvironment}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                airEnvironment: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">2. Food & Drink:</span>
                      <input
                        type="text"
                        placeholder="Makool wa Mashroob"
                        value={assessment.unani.asbabESitta.foodDrink}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                foodDrink: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">3. Movement & Rest:</span>
                      <input
                        type="text"
                        placeholder="Harakat wa Sukoon-e-Badani"
                        value={assessment.unani.asbabESitta.movementRest}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                movementRest: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">4. Sleep & Wakefulness:</span>
                      <input
                        type="text"
                        placeholder="Nom wa Yaqzah"
                        value={assessment.unani.asbabESitta.sleepWakefulness}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                sleepWakefulness: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">5. Evacuation / Retention:</span>
                      <input
                        type="text"
                        placeholder="Istifragh wa Ihtibas"
                        value={assessment.unani.asbabESitta.evacuationRetention}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                evacuationRetention: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-800">6. Psychic / Emotions:</span>
                      <input
                        type="text"
                        placeholder="Infe\'alat-e-Nafsaniyah"
                        value={assessment.unani.asbabESitta.emotions}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            unani: {
                              ...assessment.unani!,
                              asbabESitta: {
                                ...assessment.unani!.asbabESitta,
                                emotions: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white mt-0.5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Sue Mizaj & Unani Clinical Assessment Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sue Mizaj Barid Ratab requiring Tanqiya and Tadeel"
                    value={assessment.unani.sueMizaj}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        unani: {
                          ...assessment.unani!,
                          sueMizaj: e.target.value,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            )}

            {/* 4. SIDDHA SPECIFIC */}
            {ayushSystem === 'Siddha' && assessment.siddha && (
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-5">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <h3 className="text-sm font-bold text-purple-950">
                    🪔 Siddha Maruthuvam (Envagai Thervu & Udal Thathu)
                  </h3>
                  <span className="text-[11px] text-purple-800 font-semibold">
                    Mukkuttram Balance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">
                      Mukkuttram Balance (Vali/Azhal/Iyam)
                    </label>
                    <select
                      value={assessment.siddha.valiAzhalIyamBalance}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          siddha: {
                            ...assessment.siddha!,
                            valiAzhalIyamBalance: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-purple-300 rounded-lg bg-white"
                    >
                      <option value="Vali Predominant">Vali Predominant (Vatham)</option>
                      <option value="Azhal Predominant">Azhal Predominant (Pitham)</option>
                      <option value="Iyam Predominant">Iyam Predominant (Kabam)</option>
                      <option value="Balanced">Balanced (Sama Mukkuttram)</option>
                      <option value="Mixed Derangement">Mixed Derangement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">
                      Udal Thathu Assessment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Saaram, Senneer, Oon, Kozhuppu, Enbu, Moolai, Sukkilam"
                      value={assessment.siddha.udalThathu}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          siddha: {
                            ...assessment.siddha!,
                            udalThathu: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-purple-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">
                      Neerkuri / Neikuri Oil Drop Test
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ring spread (Vali), Sieve shape (Azhal)"
                      value={assessment.siddha.neerkuriNeikuri}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          siddha: {
                            ...assessment.siddha!,
                            neerkuriNeikuri: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-purple-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Envagai Thervu (8 Siddha Diagnostic Tools) */}
                <div className="space-y-2 pt-2 border-t border-purple-200">
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    Envagai Thervu (எண்வகைத் தேர்வு - 8 Diagnostic Methods)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-purple-800">1. Naa (Tongue):</span>
                      <input
                        type="text"
                        placeholder="Colour, dryness, taste"
                        value={assessment.siddha.envagaiThervu.naa}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                naa: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">2. Niram (Skin Color):</span>
                      <input
                        type="text"
                        placeholder="Pallor, redness, dark"
                        value={assessment.siddha.envagaiThervu.niram}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                niram: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">3. Mozhi (Voice):</span>
                      <input
                        type="text"
                        placeholder="Normal, hoarse, feeble"
                        value={assessment.siddha.envagaiThervu.mozhi}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                mozhi: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">4. Vizhi (Eyes):</span>
                      <input
                        type="text"
                        placeholder="Clear, congested, yellow"
                        value={assessment.siddha.envagaiThervu.vizhi}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                vizhi: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">5. Sparisam (Touch):</span>
                      <input
                        type="text"
                        placeholder="Warm, cold, rough"
                        value={assessment.siddha.envagaiThervu.sparisam}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                sparisam: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">6. Malam (Stool):</span>
                      <input
                        type="text"
                        placeholder="Hard, loose, dry"
                        value={assessment.siddha.envagaiThervu.malam}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                malam: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">7. Neer (Urine):</span>
                      <input
                        type="text"
                        placeholder="Straw, reddish, cloudy"
                        value={assessment.siddha.envagaiThervu.neer}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                neer: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-800">8. Naadi (Pulse):</span>
                      <input
                        type="text"
                        placeholder="Vali/Azhal/Iyam Naadi"
                        value={assessment.siddha.envagaiThervu.naadi}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            siddha: {
                              ...assessment.siddha!,
                              envagaiThervu: {
                                ...assessment.siddha!.envagaiThervu,
                                naadi: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-purple-300 rounded bg-white mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. YOGA & NATUROPATHY SPECIFIC */}
            {ayushSystem === 'Yoga & Naturopathy' && assessment.yogaNaturopathy && (
              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-5">
                <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                  <h3 className="text-sm font-bold text-teal-950">
                    🧘 Yoga & Naturopathy Holistic Evaluation
                  </h3>
                  <span className="text-[11px] text-teal-800 font-semibold">
                    Nature Cure & Lifestyle
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Stress Level
                    </label>
                    <select
                      value={assessment.yogaNaturopathy.stressLevel}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            stressLevel: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Physical Activity Level
                    </label>
                    <select
                      value={assessment.yogaNaturopathy.physicalActivityLevel}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            physicalActivityLevel: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    >
                      <option value="Sedentary">Sedentary (&lt;30 min walk/week)</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Prior Yoga Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Beginner, 2 years Pranayama practice"
                      value={assessment.yogaNaturopathy.yogaExperience}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            yogaExperience: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Flexibility / Limitations
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumbar spine stiffness, knee flexion limitation"
                      value={assessment.yogaNaturopathy.flexibilityLimitations}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            flexibilityLimitations: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Yoga Contraindications / Postural Cautions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Avoid inverted asanas due to high BP, avoid forward bends for disc bulge"
                      value={assessment.yogaNaturopathy.contraindications}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            contraindications: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">
                      Naturopathy / Hydrotherapy / Mud Therapy Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cold hip bath, steam bath, fasting therapy indicated"
                      value={assessment.yogaNaturopathy.natureCureAssessment}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          yogaNaturopathy: {
                            ...assessment.yogaNaturopathy!,
                            natureCureAssessment: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('vitals')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Proceed to Doctor Notes & Plan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION F: DOCTOR NOTES & MANAGEMENT PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 6: Doctor Observations, Diagnosis & Care Plan
                </h2>
                <p className="text-xs text-slate-500">
                  Finalize clinical assessment, recommended diagnostic investigations, and treatment plan.
                </p>
              </div>
              <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
                Prototype Record Only • No Automated AI Advice
              </div>
            </div>

            {/* Doctor Clinical Observations with Voice */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Doctor Clinical Observations & Key Impressions
                </label>
                <VoiceDictationButton
                  targetLabel="Doctor Observations"
                  onAppendText={(text) =>
                    setNotesAndPlan((prev) => ({
                      ...prev,
                      doctorObservations: prev.doctorObservations
                        ? `${prev.doctorObservations} ${text}`
                        : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Patient presents with characteristic features of Vata-dominant joint degeneration. Responds well to warm therapies..."
                value={notesAndPlan.doctorObservations}
                onChange={(e) =>
                  setNotesAndPlan({
                    ...notesAndPlan,
                    doctorObservations: e.target.value,
                  })
                }
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Provisional Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Provisional AYUSH / Clinical Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Janu Sandhigata Vata (Bilateral Knee Osteoarthritis)"
                  value={notesAndPlan.provisionalDiagnosis}
                  onChange={(e) =>
                    setNotesAndPlan({
                      ...notesAndPlan,
                      provisionalDiagnosis: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 font-semibold text-slate-800"
                />
              </div>

              {/* Recommended Investigations */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recommended Investigations / Lab Referrals
                </label>
                <input
                  type="text"
                  placeholder="e.g. Digital X-Ray Both Knees (AP & Lat), RA Factor, Serum Uric Acid"
                  value={notesAndPlan.recommendedInvestigations}
                  onChange={(e) =>
                    setNotesAndPlan({
                      ...notesAndPlan,
                      recommendedInvestigations: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Advice & Plan Notes with Voice */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Prescription / Diet / Lifestyle Advice & Therapeutic Plan
                </label>
                <VoiceDictationButton
                  targetLabel="Advice Plan"
                  onAppendText={(text) =>
                    setNotesAndPlan((prev) => ({
                      ...prev,
                      advicePlan: prev.advicePlan ? `${prev.advicePlan}\n${text}` : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={4}
                placeholder="1. Classical formulations / remedies prescribed
2. Pathya & Apathya (Dietary regimen and restrictions)
3. Dinacharya & Lifestyle modifications
4. Special instructions..."
                value={notesAndPlan.advicePlan}
                onChange={(e) =>
                  setNotesAndPlan({ ...notesAndPlan, advicePlan: e.target.value })
                }
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Follow-up Date */}
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Suggested Follow-up Review Date
              </label>
              <input
                type="date"
                value={notesAndPlan.followUpDate || ''}
                onChange={(e) =>
                  setNotesAndPlan({ ...notesAndPlan, followUpDate: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Save Buttons Strip */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('assessment')}
                className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Previous Step
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Draft')}
                  className="px-5 py-2.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-800" />
                  <span>Save as Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('Saved')}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
                >
                  <FileCheck className="w-4 h-4 text-amber-300" />
                  <span>Save & Complete Case</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
