export type AyushSystem = 
  | 'Ayurveda'
  | 'Yoga & Naturopathy'
  | 'Unani'
  | 'Siddha'
  | 'Homoeopathy';

export interface DoctorSession {
  email: string;
  name: string;
  role: string;
  registrationNumber: string;
  institution: string;
  loginTime: string;
}

export interface Patient {
  id: string;
  registrationNo: string;
  abhaId?: string; // ABHA Health ID e.g. 91-4829-1029-4821 or name@abdm
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  occupation: string;
  emergencyContact: string;
  allergies: string;
  consent: boolean;
  consentTimestamp?: string;
  createdAt: string;
}

// Socrates Clinical Framework for Adaptive HPI
export interface SocratesHPI {
  site: string; // S - Where is the pain/problem?
  onset: string; // O - When & how did it start? (Sudden / Gradual)
  character: string; // C - What is it like? (Aching, throbbing, burning, sharp, dull)
  radiation: string; // R - Does it spread anywhere?
  associatedSymptoms: string[]; // A - Associated symptoms
  timingDuration: string; // T - How long, constant or comes in waves?
  exacerbatingFactors: string; // E - What makes it worse?
  relievingFactors: string; // E - What makes it better?
  severity: number; // S - Pain/Discomfort scale (1 to 10)
}

// Module B: Medical Document Digitization & OCR Intelligence
export interface DigitizedLabResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  flagType?: 'High' | 'Low' | 'Critical' | 'Normal';
}

export interface DigitizedMedication {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  category: 'Allopathic' | 'Ayurvedic' | 'Unani' | 'Homoeopathic' | 'Other';
}

export interface DigitizedDocument {
  id: string;
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Scan/X-Ray';
  fileName: string;
  documentDate: string;
  doctorOrLabName: string;
  extractedDiagnoses: string[];
  extractedMedications: DigitizedMedication[];
  extractedLabResults: DigitizedLabResult[];
  extractedProcedures: string[];
  potentialDrugInteractions?: string[];
  uploadedAt: string;
}

// Pre-Consultation Intake with Full Multimodal & Red-Flag Triage
export interface PreConsultationIntake {
  id: string;
  tokenNumber: string;
  abhaId?: string;
  patientName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  city?: string;
  preferredAyushSystem: AyushSystem;
  
  // Chief complaint & Socrates
  chiefComplaints: string;
  duration: string;
  socratesHpi?: SocratesHPI;
  
  // AYUSH Dashavidha & Lifestyle
  dashavidhaSelfAssessment?: {
    prakritiSelf?: string;
    aharaPattern?: string;
    viharaRoutine?: string;
    sleepPattern?: string;
    appetiteState?: string;
    bowelHabit?: string;
  };
  
  // Medical history & Allergies
  pastMedicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  previousTreatment?: string;
  
  // Digitized Documents
  digitizedDocuments?: DigitizedDocument[];

  // Red-Flag Emergency Detection
  isRedFlagEmergency: boolean;
  redFlagDetails?: {
    category: 'Cardiovascular' | 'Neurological' | 'Respiratory' | 'Acute Abdomen' | 'Severe Infection' | 'None';
    symptomsTriggered: string[];
    actionTaken: string;
  };
  
  // Consent & DPDP Act 2023
  dpdpConsentGranted: boolean;
  consentLanguage: 'en' | 'hi';
  
  submittedAt: string;
  status: 'Waiting' | 'Priority Triage (Red Flag)' | 'In Consultation' | 'Completed';
}

export interface PresentingComplaints {
  chiefComplaints: string;
  duration: string;
  onsetProgression: string;
  associatedSymptoms: string;
  previousTreatment: string;
  socratesHpi?: SocratesHPI;
}

export interface GeneralHistory {
  pastMedicalHistory: string;
  familyHistory: string;
  personalHistory: string;
  dietAppetite: string;
  sleep: string;
  bowelHabits: string;
  bladderHabits: string;
  lifestyleRoutine: string;
  mentalEmotionalState: string;
  menstrualReproductiveHistory: string;
}

export interface VitalsAndExam {
  height: string; // cm
  weight: string; // kg
  bmi: string;
  bp: string; // mmHg
  pulse: string; // bpm
  temperature: string; // °F
  respiratoryRate: string; // /min
  generalExamination: string;
  localSystemicExamination: string;
}

export interface AshtavidhaPariksha {
  nadi: string; // Pulse
  mutra: string; // Urine
  mala: string; // Stool
  jihva: string; // Tongue
  shabda: string; // Speech/Voice
  sparsha: string; // Touch/Skin
  drik: string; // Eyes/Vision
  akriti: string; // Posture/General appearance
}

export interface DashavidhaPariksha {
  prakriti: string;
  vikriti: string;
  sara: string;
  samhanana: string;
  pramana: string;
  satmya: string;
  satva: string;
  aharaShakti: string;
  vyayamaShakti: string;
  vaya: string;
}

export interface AyurvedaAssessment {
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic' | '';
  prakriti: string;
  vikriti: string;
  agni: 'Sama' | 'Vishama' | 'Tikshna' | 'Manda' | '';
  koshta: 'Mridu' | 'Madhyama' | 'Krura' | '';
  ashtavidha: AshtavidhaPariksha;
  dashavidha: DashavidhaPariksha;
}

export interface HomoeopathyAssessment {
  mentalGenerals: string;
  physicalGenerals: string;
  thermalState: 'Chilly' | 'Hot' | 'Ambi-thermal' | '';
  thirstPattern: 'Thirsty' | 'Thirstless' | 'Thirst for small quantities' | 'Thirst for large quantities' | '';
  foodCravings: string;
  foodAversions: string;
  modalities: string;
  concomitantSymptoms: string;
  miasmaticImpression: 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Mixed Miasmatic' | '';
  repertoryRubrics: string;
}

export interface AsbabESittaZarooriya {
  airEnvironment: string;
  foodDrink: string;
  movementRest: string;
  sleepWakefulness: string;
  evacuationRetention: string;
  emotions: string;
}

export interface UnaniAssessment {
  mizaj: 'Damwi (Sanguine)' | 'Safrawi (Choleric)' | 'Balghami (Phlegmatic)' | 'Sawdawi (Melancholic)' | 'Motadil (Equable)' | '';
  akhlatImbalance: string;
  nabz: string;
  asbabESitta: AsbabESittaZarooriya;
  sueMizaj: string;
  unaniAssessmentNotes: string;
}

export interface EnvagaiThervu {
  naa: string; // Tongue
  niram: string; // Color/Complexion
  mozhi: string; // Voice
  vizhi: string; // Eyes
  sparisam: string; // Touch
  malam: string; // Stools
  neer: string; // Urine
  naadi: string; // Pulse
}

export interface SiddhaAssessment {
  udalThathu: string;
  envagaiThervu: EnvagaiThervu;
  valiAzhalIyamBalance: 'Vali Predominant' | 'Azhal Predominant' | 'Iyam Predominant' | 'Balanced' | 'Mixed Derangement' | '';
  neerkuriNeikuri: string;
  siddhaAssessmentNotes: string;
}

export interface YogaNaturopathyAssessment {
  dietPattern: string;
  dailyRoutine: string;
  stressLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | '';
  physicalActivityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | '';
  yogaExperience: string;
  flexibilityLimitations: string;
  contraindications: string;
  natureCureAssessment: string;
}

export interface AyushAssessment {
  // Common AYUSH fields
  prakritiNotes: string;
  agni: string;
  bala: 'Pravara (Superior)' | 'Madhyama (Medium)' | 'Avara (Inferior)' | '';
  satva: 'Pravara (High)' | 'Madhyama (Medium)' | 'Avara (Low)' | '';
  nidraQuality: string;
  aharaPattern: string;
  viharaPattern: string;
  rogiBala: string;
  rogaBala: string;
  nidana: string;
  samprapti: string;
  provisionalAssessment: string;
  
  // Discipline specifics
  ayurveda?: AyurvedaAssessment;
  homoeopathy?: HomoeopathyAssessment;
  unani?: UnaniAssessment;
  siddha?: SiddhaAssessment;
  yogaNaturopathy?: YogaNaturopathyAssessment;
}

export interface NotesAndPlan {
  doctorObservations: string;
  provisionalDiagnosis: string;
  recommendedInvestigations: string;
  advicePlan: string;
  followUpDate?: string;
}

export interface CaseRecord {
  id: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  caseDate: string;
  ayushSystem: AyushSystem;
  status: 'Draft' | 'Saved';
  presentingComplaints: PresentingComplaints;
  generalHistory: GeneralHistory;
  vitals: VitalsAndExam;
  ayushAssessment: AyushAssessment;
  digitizedDocuments?: DigitizedDocument[];
  notesAndPlan: NotesAndPlan;
  createdAt: string;
  updatedAt: string;
}
