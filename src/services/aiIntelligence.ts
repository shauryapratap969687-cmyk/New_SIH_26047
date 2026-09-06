import type { DigitizedDocument, SocratesHPI } from '../types';

// ==========================================
// 1. RED-FLAG EMERGENCY SYMPTOM DETECTOR
// ==========================================
export interface RedFlagCheckResult {
  isEmergency: boolean;
  category: 'Cardiovascular' | 'Neurological' | 'Respiratory' | 'Acute Abdomen' | 'Severe Infection' | 'None';
  symptomsTriggered: string[];
  actionTaken: string;
}

export const detectRedFlags = (
  complaints: string,
  socrates?: Partial<SocratesHPI>,
  associatedSymptoms: string[] = []
): RedFlagCheckResult => {
  const text = `${complaints} ${socrates?.site || ''} ${socrates?.character || ''} ${socrates?.radiation || ''} ${associatedSymptoms.join(' ')}`.toLowerCase();

  // 1. Cardiovascular Red-Flags
  if (
    (text.includes('chest pain') || text.includes('seene me dard') || text.includes('chaati')) &&
    (text.includes('breath') || text.includes('saas') || text.includes('sweat') || text.includes('pasina') || text.includes('arm') || text.includes('left arm') || text.includes('jaw') || text.includes('radiat') || text.includes('choking'))
  ) {
    return {
      isEmergency: true,
      category: 'Cardiovascular',
      symptomsTriggered: ['Acute Chest Pain', 'Dyspnoea / Shortness of Breath', 'Radiation / Diaphoresis'],
      actionTaken: 'IMMEDIATE PRIORITY TRIAGE: Transfer to Emergency Casualty / ECG Room without OPD queueing.',
    };
  }

  // 2. Neurological (Stroke / FAST)
  if (
    text.includes('slurr') ||
    text.includes('speech') ||
    text.includes('face droop') ||
    text.includes('paralysis') ||
    text.includes('ek taraf kamzori') ||
    text.includes('loss of consciousness') ||
    text.includes('behosh') ||
    (text.includes('headache') && (text.includes('thunderclap') || text.includes('sudden severe') || text.includes('worst headache')))
  ) {
    return {
      isEmergency: true,
      category: 'Neurological',
      symptomsTriggered: ['Focal Neurological Deficit', 'Altered Sensorium / Slurred Speech', 'Suspected Acute Stroke'],
      actionTaken: 'IMMEDIATE PRIORITY TRIAGE: Code Stroke / Urgent CT Neuro referral.',
    };
  }

  // 3. Severe Respiratory Distress
  if (
    (text.includes('severe breathlessness') || text.includes('stridor') || text.includes('unable to speak in full sentences') || text.includes('gasping'))
  ) {
    return {
      isEmergency: true,
      category: 'Respiratory',
      symptomsTriggered: ['Acute Respiratory Failure', 'Stridor / Severe Dyspnoea'],
      actionTaken: 'IMMEDIATE PRIORITY TRIAGE: Nebulization & Oxygen Support Triage.',
    };
  }

  // 4. Acute Abdomen
  if (
    (text.includes('rigid abdomen') || text.includes('rebound') || text.includes('vomiting blood') || text.includes('khoon ki ulti') || text.includes('black stool') || (text.includes('severe stomach') && text.includes('collapse')))
  ) {
    return {
      isEmergency: true,
      category: 'Acute Abdomen',
      symptomsTriggered: ['Severe Acute Abdomen', 'Suspected Hemorrhage / Perforation'],
      actionTaken: 'IMMEDIATE PRIORITY TRIAGE: Surgical On-Call Casualty.',
    };
  }

  return {
    isEmergency: false,
    category: 'None',
    symptomsTriggered: [],
    actionTaken: 'Routine OPD Queueing',
  };
};

// ==========================================
// 2. AUDIO GUIDANCE & SPEECH SYNTHESIS (TTS)
// ==========================================
export const speakAudioPrompt = (text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN'): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('TTS error:', err);
  }
};

export const stopAudioPrompt = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// ==========================================
// 3. SAMPLE DIGITIZED MEDICAL DOCUMENTS FOR OCR PIPELINE
// ==========================================
export const SAMPLE_PRESET_DOCUMENTS: DigitizedDocument[] = [
  {
    id: 'doc-1',
    documentType: 'Prescription',
    fileName: 'Cardiology_OPD_Prescription_2025.pdf',
    documentDate: '2025-11-14',
    doctorOrLabName: 'Dr. V. K. Mehta (MD Cardiology), AIIMS New Delhi',
    extractedDiagnoses: ['Essential Hypertension (Grade 1)', 'Mild Dyslipidemia'],
    extractedMedications: [
      {
        medicineName: 'Telmisartan',
        dosage: '40 mg',
        frequency: 'Once daily (OD morning)',
        duration: 'Ongoing',
        category: 'Allopathic',
      },
      {
        medicineName: 'Atorvastatin',
        dosage: '10 mg',
        frequency: 'Once daily (HS night)',
        duration: 'Ongoing',
        category: 'Allopathic',
      },
    ],
    extractedLabResults: [],
    extractedProcedures: ['Echocardiogram (EF: 62% - Normal LV Function)'],
    potentialDrugInteractions: [
      'Potential Interaction Alert: Avoid high-dose Licorice (Yashtimadhu) concurrently with Telmisartan as it may alter BP balance.',
    ],
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'doc-2',
    documentType: 'Lab Report',
    fileName: 'Metabolic_Lipid_Panel_Report.pdf',
    documentDate: '2026-01-20',
    doctorOrLabName: 'Dr. Lal PathLabs, Central Reference Lab',
    extractedDiagnoses: ['Hypercholesterolemia', 'Borderline Fasting Hyperglycemia'],
    extractedMedications: [],
    extractedLabResults: [
      {
        testName: 'Fasting Blood Sugar (FBS)',
        value: '118',
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        isAbnormal: true,
        flagType: 'High',
      },
      {
        testName: 'HbA1c (Glycated Hemoglobin)',
        value: '6.4',
        unit: '%',
        referenceRange: '< 5.7 (Normal), 5.7-6.4 (Prediabetes)',
        isAbnormal: true,
        flagType: 'High',
      },
      {
        testName: 'Total Cholesterol',
        value: '232',
        unit: 'mg/dL',
        referenceRange: '< 200',
        isAbnormal: true,
        flagType: 'High',
      },
      {
        testName: 'Serum Triglycerides',
        value: '194',
        unit: 'mg/dL',
        referenceRange: '< 150',
        isAbnormal: true,
        flagType: 'High',
      },
      {
        testName: 'Serum Creatinine',
        value: '0.9',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.2',
        isAbnormal: false,
        flagType: 'Normal',
      },
      {
        testName: 'Serum Uric Acid',
        value: '7.8',
        unit: 'mg/dL',
        referenceRange: '3.5 - 7.2',
        isAbnormal: true,
        flagType: 'High',
      },
    ],
    extractedProcedures: [],
    potentialDrugInteractions: [],
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

// Document OCR Pipeline simulator
export const processDocumentOCR = async (file: File): Promise<DigitizedDocument> => {
  // Simulate OCR extraction time (500ms)
  await new Promise((res) => setTimeout(res, 500));

  const fileName = file.name;
  const isLab = fileName.toLowerCase().includes('lab') || fileName.toLowerCase().includes('blood') || fileName.toLowerCase().includes('report');
  const isPrescription = fileName.toLowerCase().includes('rx') || fileName.toLowerCase().includes('presc') || fileName.toLowerCase().includes('doctor');

  if (isLab) {
    return {
      id: 'doc-' + Date.now(),
      documentType: 'Lab Report',
      fileName,
      documentDate: new Date().toISOString().split('T')[0],
      doctorOrLabName: 'Scanned Pathology Laboratory Report',
      extractedDiagnoses: ['Lab Screen Completed'],
      extractedMedications: [],
      extractedLabResults: [
        {
          testName: 'Hemoglobin (Hb)',
          value: '13.2',
          unit: 'g/dL',
          referenceRange: '13.0 - 17.0',
          isAbnormal: false,
          flagType: 'Normal',
        },
        {
          testName: 'Erythrocyte Sedimentation Rate (ESR)',
          value: '34',
          unit: 'mm/1st hr',
          referenceRange: '0 - 15',
          isAbnormal: true,
          flagType: 'High',
        },
        {
          testName: 'C-Reactive Protein (CRP)',
          value: '8.4',
          unit: 'mg/L',
          referenceRange: '< 5.0',
          isAbnormal: true,
          flagType: 'High',
        },
      ],
      extractedProcedures: [],
      potentialDrugInteractions: [],
      uploadedAt: new Date().toISOString(),
    };
  }

  return {
    id: 'doc-' + Date.now(),
    documentType: isPrescription ? 'Prescription' : 'Discharge Summary',
    fileName,
    documentDate: new Date().toISOString().split('T')[0],
    doctorOrLabName: 'Attending Hospital Clinical Slip',
    extractedDiagnoses: ['Chronic Joint Pain & Musculoskeletal Strain', 'Acid Peptic Disease (mild)'],
    extractedMedications: [
      {
        medicineName: 'Paracetamol',
        dosage: '650 mg',
        frequency: 'SOS for pain',
        duration: '5 days',
        category: 'Allopathic',
      },
      {
        medicineName: 'Pantoprazole',
        dosage: '40 mg',
        frequency: 'OD before breakfast',
        duration: '14 days',
        category: 'Allopathic',
      },
    ],
    extractedLabResults: [],
    extractedProcedures: ['Physical Therapy / Local Fomentation'],
    potentialDrugInteractions: [
      'Note: Review timing of herbal decoctions (Kwatha) at least 1 hour apart from antacids for optimal bio-absorption.',
    ],
    uploadedAt: new Date().toISOString(),
  };
};
