import type { Patient, CaseRecord, DoctorSession } from '../types';

const STORAGE_KEYS = {
  SESSION: 'ayush_session',
  PATIENTS: 'ayush_patients',
  CASES: 'ayush_cases',
} as const;

export const DEMO_DOCTOR: DoctorSession = {
  email: 'doctor@ayush.demo',
  name: 'Dr. Rajeshwari Sharma',
  role: 'Senior AYUSH Medical Officer',
  registrationNumber: 'AYU-DEL-2024-8842',
  institution: 'National Institute of AYUSH, New Delhi',
  loginTime: new Date().toISOString(),
};

const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    registrationNo: 'PAT-2026-1042',
    name: 'Rajesh Kumar',
    age: '46',
    gender: 'Male',
    phone: '+91 98765 43210',
    address: 'B-42, Sector 14, Rohini, New Delhi 110085',
    occupation: 'Civil Engineer',
    emergencyContact: 'Sunita Kumar (Wife) - +91 98765 43211',
    allergies: 'Dust, Penicillin (mild rash)',
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'pat-2',
    registrationNo: 'PAT-2026-1088',
    name: 'Meera Nambiar',
    age: '34',
    gender: 'Female',
    phone: '+91 98451 23456',
    address: '4th Cross, Indiranagar, Bengaluru, Karnataka 560038',
    occupation: 'High School Teacher',
    emergencyContact: 'Suresh Nambiar (Brother) - +91 98451 23457',
    allergies: 'None reported',
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'pat-3',
    registrationNo: 'PAT-2026-1135',
    name: 'Mohammad Tariq',
    age: '52',
    gender: 'Male',
    phone: '+91 97112 34890',
    address: '12/4, Aminabad Road, Lucknow, Uttar Pradesh 226018',
    occupation: 'Textile Merchant',
    emergencyContact: 'Fatima Begum (Spouse) - +91 97112 34891',
    allergies: 'Sulfa drugs',
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

const SAMPLE_CASES: CaseRecord[] = [
  {
    id: 'CASE-2026-0901',
    patientId: 'pat-1',
    patientName: 'Rajesh Kumar',
    caseDate: new Date().toISOString().split('T')[0],
    ayushSystem: 'Ayurveda',
    status: 'Saved',
    presentingComplaints: {
      chiefComplaints: 'Severe pain and crackling sound (Crepitus) in bilateral knee joints for past 8 months. Aggravated in cold mornings and during stairs ascent/descent.',
      duration: '8 Months',
      onsetProgression: 'Gradual onset, progressively worsening during winter season and after continuous site inspection walks.',
      associatedSymptoms: 'Early morning joint stiffness lasting ~25 mins, mild swelling on right knee joint, fatigue after moderate exertion.',
      previousTreatment: 'Took Allopathic NSAIDs (Ibuprofen) intermittently with temporary relief; discontinued due to mild epigastric discomfort.',
    },
    generalHistory: {
      pastMedicalHistory: 'No history of Hypertension, Diabetes Mellitus, or Tuberculosis.',
      familyHistory: 'Father had chronic joint pains (Vata Rog); Mother had Hypertension.',
      personalHistory: 'Non-smoker, non-alcoholic, tea 3 times/day.',
      dietAppetite: 'Irregular meal timings due to field site visits, preference for dry & cold food items, moderate appetite with mild bloating.',
      sleep: 'Disturbed due to joint stiffness and dull aching knee pain (5-6 hours/night).',
      bowelHabits: 'Tendency towards constipation (hard stools once every 2 days).',
      bladderHabits: 'Normal frequency (4-5 times/day), clear.',
      lifestyleRoutine: 'Frequent travelling, prolonged standing at construction sites, irregular bedtime.',
      mentalEmotionalState: 'Mild anxiety regarding mobility limitations at workplace.',
      menstrualReproductiveHistory: 'Not applicable',
    },
    vitals: {
      height: '172',
      weight: '78',
      bmi: '26.4',
      bp: '126/82',
      pulse: '74',
      temperature: '98.4',
      respiratoryRate: '16',
      generalExamination: 'Moderately built male, conscious, oriented, mild pallor negative, icterus negative.',
      localSystemicExamination: 'Bilateral knee joints: Tenderness on medial joint line (+), crepitus present on passive flexion, mild effusion on right knee. Range of motion limited to 110 degrees flexion.',
    },
    ayushAssessment: {
      prakritiNotes: 'Vata-Pitta dominant constitution with evident Vata dry traits.',
      agni: 'Vishama Agni (Irregular digestive fire)',
      bala: 'Madhyama (Medium)',
      satva: 'Madhyama (Medium)',
      nidraQuality: 'Alpa Nidra (Disturbed & insufficient)',
      aharaPattern: 'Ruksha & Sheeta Ahara dominant',
      viharaPattern: 'Ati-Vyayama & Ati-Adhva (Excessive walking & standing)',
      rogiBala: 'Madhyama',
      rogaBala: 'Pravara (Strong localized Vata accumulation)',
      nidana: 'Consumption of dry/cold diet, excessive travel on uneven terrain, irregular routine causing Vata Vitiation.',
      samprapti: 'Vitiated Vata lodged in Sandhi Sthana (Janu Sandhi) leading to Dhatu Kshaya, Sandhi Shotha, and Shoola.',
      provisionalAssessment: 'Sandhigata Vata (Janu Sandhi) - Osteoarthritis of Bilateral Knee Joints.',
      ayurveda: {
        dominantDosha: 'Vata',
        prakriti: 'Vata-Pitta',
        vikriti: 'Vata-Kapha Anubandha',
        agni: 'Vishama',
        koshta: 'Krura',
        ashtavidha: {
          nadi: 'Vata-pradhana, Manda gati (74 bpm, irregular amplitude)',
          mutra: 'Prakrita (Clear, normal output)',
          mala: 'Vibandha (Hard stools, Krura)',
          jihva: 'Alpa Sama (Mild coating at the base)',
          shabda: 'Prakrita (Clear voice)',
          sparsha: 'Sheeta / Ruksha on knee surface',
          drik: 'Prakrita (Normal vision and sclera)',
          akriti: 'Madhyama Sharira (Slightly heavy upper body)',
        },
        dashavidha: {
          prakriti: 'Vata-Pitta',
          vikriti: 'Vata dominant in Asthi-Majja Vaha Srotas',
          sara: 'Madhyama Asthi Sara',
          samhanana: 'Madhyama',
          pramana: 'Anurupa (Proportionate)',
          satmya: 'Katu-Tikta Satmya',
          satva: 'Madhyama',
          aharaShakti: 'Avara-Madhyama',
          vyayamaShakti: 'Avara due to joint pain',
          vaya: 'Madhyama (46 yrs)',
        },
      },
    },
    notesAndPlan: {
      doctorObservations: 'Classic presentation of Janu Sandhigata Vata with Vata-aggravating dietary and occupational triggers. Responds well to Snehana and Swedana protocol.',
      provisionalDiagnosis: 'Janu Sandhigata Vata (Bilateral Knee Osteoarthritis)',
      recommendedInvestigations: 'Digital X-Ray Bilateral Knee (AP and Lateral weight-bearing views), Serum Uric Acid, ESR, RA Factor.',
      advicePlan: '1. Snehana (External application of Mahanarayana Taila followed by mild hot fomentation).\n2. Yogaraja Guggulu 2 tabs BD after meals with lukewarm water.\n3. Dashamoola Kwatha 20ml BD with equal water.\n4. Avoid dry/cold foodstuffs, curd at night, and prolonged standing.\n5. Follow-up review after 14 days.',
      followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'CASE-2026-0902',
    patientId: 'pat-2',
    patientName: 'Meera Nambiar',
    caseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString().split('T')[0],
    ayushSystem: 'Homoeopathy',
    status: 'Saved',
    presentingComplaints: {
      chiefComplaints: 'Throbbing right-sided headache (migraine) beginning over right temple and spreading to occiput. Comes 2-3 times per month, especially after school examination periods.',
      duration: '1.5 Years',
      onsetProgression: 'Began after promotion to administrative teaching role; frequency increased from once every 2 months to weekly episodes.',
      associatedSymptoms: 'Photophobia, nausea, visual aura (zigzag flickering lights 15 mins prior), sensation of hammer beating in head.',
      previousTreatment: 'Paracetamol and Sumatriptan prescribed by local physician, provides temporary abortive relief but headaches recur regularly.',
    },
    generalHistory: {
      pastMedicalHistory: 'Childhood history of allergic rhinitis; otherwise healthy.',
      familyHistory: 'Mother had classical migraine; Father has mild osteoarthritis.',
      personalHistory: 'Non-smoker, vegetarian, high mental workload.',
      dietAppetite: 'Strong craving for salty foods and sour chutneys; aversion to fatty meats or greasy snacks. Adequate thirst (2.5L/day).',
      sleep: 'Sleep is light; wakes up thinking about pending lesson plans and tasks.',
      bowelHabits: 'Regular, normal consistency.',
      bladderHabits: 'Normal.',
      lifestyleRoutine: 'Wakes at 5:30 AM, manages school classes and grading until late evening, sedentary work with high screen time.',
      mentalEmotionalState: 'Introverted, highly conscientious, keeps grief and stress to herself, weeps only when alone. Consolation aggravates her mood.',
      menstrualReproductiveHistory: 'Regular 28-day cycle, flow normal, headache occasionally precedes menses by 1 day.',
    },
    vitals: {
      height: '161',
      weight: '54',
      bmi: '20.8',
      bp: '118/76',
      pulse: '76',
      temperature: '98.6',
      respiratoryRate: '15',
      generalExamination: 'Pleasant, well-oriented, slight pallor, normal pupil reflexes.',
      localSystemicExamination: 'Cranial nerve exam normal, no focal neurological deficits, mild tenderness over right temporal and suboccipital muscles.',
    },
    ayushAssessment: {
      prakritiNotes: 'Conscientious, reserved intellectual constitution.',
      agni: 'Normal digestive power',
      bala: 'Madhyama (Medium)',
      satva: 'Pravara (High)',
      nidraQuality: 'Superficial, disturbed by mental exertion',
      aharaPattern: 'Craves salt and light food',
      viharaPattern: 'Sedentary, prolonged computer screen exposure',
      rogiBala: 'Good',
      rogaBala: 'Moderate periodic paroxysms',
      nidana: 'Mental stress, sunlight exposure, skipped meal intervals.',
      samprapti: 'Neurovascular hypersensitivity with Psora-Sycosis constitutional dyscrasia.',
      provisionalAssessment: 'Hemicrania / Classical Migraine without aura complication.',
      homoeopathy: {
        mentalGenerals: 'Reserved, introverted, conscientious about duties, dwells on past grievances, consolation aggravates (< consolation).',
        physicalGenerals: 'Heat intolerant (< sun heat, warm rooms), craving for salt (+3), mapped tongue tendency, emaciation tendency around neck.',
        thermalState: 'Hot',
        thirstPattern: 'Thirsty',
        foodCravings: 'Extra salt on salads, lemons, bitter/sour tastes',
        foodAversions: 'Fat, slimy food, rich gravies',
        modalities: 'Worse (<): 10 AM to 3 PM, bright sunlight, mental strain, noise. Better (>): lying in dark quiet room, hard pressure on forehead, cold compresses.',
        concomitantSymptoms: 'Zigzag visual scotoma, tingling around lips during peak attack.',
        miasmaticImpression: 'Psora',
        repertoryRubrics: 'HEAD - PAIN - right sided - sun < | MIND - CONSOLATION - agg | GENERALS - FOOD AND DRINKS - salt - desire',
      },
    },
    notesAndPlan: {
      doctorObservations: 'Totality of symptoms clearly points towards constitutional Natrum Muriaticum picture. High characteristic match on mental rubrics, craving for salt, and sun aggravation.',
      provisionalDiagnosis: 'Classical Right Hemicrania (Migraine)',
      recommendedInvestigations: 'Refraction & Fundoscopy examination, Serum Ferritin, Vitamin D3.',
      advicePlan: '1. Natrum Muriaticum 200CH (Single dose 4 pills on empty stomach).\n2. Placebo (Sac Lac) BD for 14 days.\n3. Maintain headache trigger diary.\n4. Wear UV polarized sunglasses outdoors.\n5. Follow-up after 15 days.',
      followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString().split('T')[0],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'CASE-2026-0903',
    patientId: 'pat-3',
    patientName: 'Mohammad Tariq',
    caseDate: new Date().toISOString().split('T')[0],
    ayushSystem: 'Unani',
    status: 'Draft',
    presentingComplaints: {
      chiefComplaints: 'Heaviness in stomach, post-prandial bloating, and dull pain in lumbar region for the last 3 weeks.',
      duration: '3 Weeks',
      onsetProgression: 'Insidious onset after heavy winter weddings diet; gradually increasing feeling of lethargy.',
      associatedSymptoms: 'White coated tongue, sour eructations, cold extremities, general lassitude (Kasal).',
      previousTreatment: 'Took antacid syrups with short-lived relief.',
    },
    generalHistory: {
      pastMedicalHistory: 'Borderline Dyslipidemia 2 years ago; no overt diabetes.',
      familyHistory: 'Father had dyspepsia and gout.',
      personalHistory: 'Non-smoker, high intake of rich Mughlai cuisine (red meat, rice, ghee).',
      dietAppetite: 'Heavy appetite, irregular timings, late night dinners.',
      sleep: 'Excessive sleepiness during daytime (Nom-e-Mufrit), sluggish wakefulness.',
      bowelHabits: 'Sluggish bowel clearance, once daily.',
      bladderHabits: 'Pale, copious urine.',
      lifestyleRoutine: 'Sedentary business lifestyle, sitting in shop 8-10 hours daily.',
      mentalEmotionalState: 'Calm, phlegmatic temperament, mild sluggishness in response.',
      menstrualReproductiveHistory: 'Not applicable',
    },
    vitals: {
      height: '168',
      weight: '84',
      bmi: '29.8',
      bp: '130/84',
      pulse: '68',
      temperature: '97.9',
      respiratoryRate: '16',
      generalExamination: 'Plump, pale complexion, moist cold palms, clear sclera.',
      localSystemicExamination: 'Abdomen soft, diffuse mild tenderness in epigastrium, no organomegaly detected.',
    },
    ayushAssessment: {
      prakritiNotes: 'Balghami (Phlegmatic) Mizaj with cold-moist tendency.',
      agni: 'Dha\'f-e-Mida (Weak gastric tone)',
      bala: 'Madhyama (Medium)',
      satva: 'Madhyama (Medium)',
      nidraQuality: 'Kashrat-e-Nom (Excessive sleep)',
      aharaPattern: 'Ghaliz & Barid Ahara (Heavy, cold-producing meals)',
      viharaPattern: 'Qillat-e-Harakat (Lack of physical activity)',
      rogiBala: 'Medium',
      rogaBala: 'Mild to Moderate',
      nidana: 'Excessive intake of greasy cold food and lack of physical exercise.',
      samprapti: 'Accumulation of Balgham-e-Fasid (abnormal phlegm) in stomach lining leading to Sue Mizaj Barid.',
      provisionalAssessment: 'Sue Mizaj Mida Barid (Cold Dyspepsia of Stomach)',
      unani: {
        mizaj: 'Balghami (Phlegmatic)',
        akhlatImbalance: 'Ghalba-e-Balgham (Excess of Phlegm humor)',
        nabz: 'Nabz-e-Batee wa Layyin (Slow and soft pulse, 68 bpm)',
        asbabESitta: {
          airEnvironment: 'Cold moist winter weather aggravation',
          foodDrink: 'Heavy meat, milk sweets, cold water after meals',
          movementRest: 'Sedentary shop routine, no morning walk',
          sleepWakefulness: 'Excessive post-lunch nap (Qailulah > 1.5 hrs)',
          evacuationRetention: 'Incomplete gastric emptying, sluggish peristalsis',
          emotions: 'Equable, calm, occasional mental fatigue',
        },
        sueMizaj: 'Sue Mizaj Mida Barid Ratab (Cold & Wet gastric dystemperament)',
        unaniAssessmentNotes: 'Patient needs Tanqiya (Evacuation of morbid phlegm) followed by Ta\'deel (Humoral balance restoration).',
      },
    },
    notesAndPlan: {
      doctorObservations: 'Draft record - pending lipid profile results and formulation selection.',
      provisionalDiagnosis: 'Dhaf-e-Hazm / Sue Mizaj Barid',
      recommendedInvestigations: 'Complete Lipid Profile, LFT, Ultrasound Whole Abdomen.',
      advicePlan: '1. Jawarish Kamuni 5g BD after meals.\n2. Arq Badiyan 30ml with warm water.\n3. Daily 30 min brisk walk.\n4. Avoid iced beverages and fatty mutton curries.',
      followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  // Session
  getSession(): DoctorSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(session: DoctorSession): void {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // Patients
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (!data) {
        this.savePatients(SAMPLE_PATIENTS);
        return SAMPLE_PATIENTS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_PATIENTS;
    }
  },

  savePatients(patients: Patient[]): void {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  },

  getPatientById(id: string): Patient | undefined {
    const patients = this.getPatients();
    return patients.find((p) => p.id === id);
  },

  addPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Patient {
    const patients = this.getPatients();
    const newId = 'pat-' + Date.now();
    const newPatient: Patient = {
      ...patient,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    patients.unshift(newPatient);
    this.savePatients(patients);
    return newPatient;
  },

  generateRegistrationNo(): string {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PAT-2026-${rand}`;
  },

  // Cases
  getCases(): CaseRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      if (!data) {
        this.saveCases(SAMPLE_CASES);
        return SAMPLE_CASES;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_CASES;
    }
  },

  saveCases(cases: CaseRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  },

  getCaseById(id: string): CaseRecord | undefined {
    const cases = this.getCases();
    return cases.find((c) => c.id === id);
  },

  saveCase(caseData: CaseRecord): CaseRecord {
    const cases = this.getCases();
    const existingIndex = cases.findIndex((c) => c.id === caseData.id);
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      cases[existingIndex] = {
        ...caseData,
        updatedAt: now,
      };
    } else {
      cases.unshift({
        ...caseData,
        createdAt: now,
        updatedAt: now,
      });
    }
    this.saveCases(cases);
    return caseData;
  },

  deleteCase(id: string): boolean {
    const cases = this.getCases();
    const filtered = cases.filter((c) => c.id !== id);
    if (filtered.length !== cases.length) {
      this.saveCases(filtered);
      return true;
    }
    return false;
  },

  generateCaseId(): string {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CASE-2026-${rand}`;
  },

  // First time initial seeding
  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      this.savePatients(SAMPLE_PATIENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
      this.saveCases(SAMPLE_CASES);
    }
  },
};
