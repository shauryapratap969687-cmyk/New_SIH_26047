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
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  occupation: string;
  emergencyContact: string;
  allergies: string;
  consent: boolean;
  createdAt: string;
}

export interface PresentingComplaints {
  chiefComplaints: string;
  duration: string;
  onsetProgression: string;
  associatedSymptoms: string;
  previousTreatment: string;
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
  caseDate: string;
  ayushSystem: AyushSystem;
  status: 'Draft' | 'Saved';
  presentingComplaints: PresentingComplaints;
  generalHistory: GeneralHistory;
  vitals: VitalsAndExam;
  ayushAssessment: AyushAssessment;
  notesAndPlan: NotesAndPlan;
  createdAt: string;
  updatedAt: string;
}
