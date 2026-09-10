// MediKiosk AI — ABHA / Aadhaar Authentication & FHIR Bundle Service (Mocked)
// Simulates ABDM (Ayushman Bharat Digital Mission) integration
// In production: replace with real ABDM Gateway API calls

import type { PreConsultationIntake } from '../types';

export interface AbhaPatientProfile {
  abhaId: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  bloodGroup?: string;
  linkedRecords: number;
}

export interface HisPushResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
  fhirBundleId: string;
  message: string;
}

// ==========================================
// 1. MOCK PATIENT DATABASE
// ==========================================
const MOCK_ABHA_PATIENTS: Record<string, AbhaPatientProfile> = {
  '91-4829-1029-4821': {
    abhaId: '91-4829-1029-4821',
    name: 'Ramesh Kumar Sharma',
    age: '54',
    gender: 'Male',
    phone: '9876543210',
    address: 'House No. 12, Sector 4, Rohini, New Delhi - 110085',
    bloodGroup: 'B+',
    linkedRecords: 3,
  },
  'ramesh@abdm': {
    abhaId: '91-4829-1029-4821',
    name: 'Ramesh Kumar Sharma',
    age: '54',
    gender: 'Male',
    phone: '9876543210',
    address: 'House No. 12, Sector 4, Rohini, New Delhi - 110085',
    bloodGroup: 'B+',
    linkedRecords: 3,
  },
  '91-1234-5678-9012': {
    abhaId: '91-1234-5678-9012',
    name: 'Priya Devi',
    age: '32',
    gender: 'Female',
    phone: '9123456789',
    address: 'Flat 3B, Shivaji Nagar, Pune - 411005',
    bloodGroup: 'O+',
    linkedRecords: 1,
  },
  'priya@abdm': {
    abhaId: '91-1234-5678-9012',
    name: 'Priya Devi',
    age: '32',
    gender: 'Female',
    phone: '9123456789',
    address: 'Flat 3B, Shivaji Nagar, Pune - 411005',
    bloodGroup: 'O+',
    linkedRecords: 1,
  },
};

// Aadhaar number → ABHA mapping
const MOCK_AADHAAR_MAP: Record<string, string> = {
  '234567890123': '91-4829-1029-4821',
  '987654321098': '91-1234-5678-9012',
};

// ==========================================
// 2. AUTH FUNCTIONS
// ==========================================

export const loginWithAbha = async (abhaId: string): Promise<{ success: boolean; profile?: AbhaPatientProfile; error?: string }> => {
  await new Promise(r => setTimeout(r, 800)); // Simulate API latency
  const normalized = abhaId.trim().toLowerCase();
  const profile = MOCK_ABHA_PATIENTS[normalized] || MOCK_ABHA_PATIENTS[abhaId.trim()];
  if (profile) {
    return { success: true, profile };
  }
  return { success: false, error: 'ABHA ID not found. Please check your ID or register as a new patient.' };
};

export const loginWithAadhaar = async (aadhaarNumber: string): Promise<{ success: boolean; profile?: AbhaPatientProfile; error?: string }> => {
  await new Promise(r => setTimeout(r, 1200)); // Simulate Aadhaar auth latency
  const cleaned = aadhaarNumber.replace(/\s/g, '');
  const abhaId = MOCK_AADHAAR_MAP[cleaned];
  if (abhaId) {
    const profile = MOCK_ABHA_PATIENTS[abhaId];
    return { success: true, profile };
  }
  return { success: false, error: 'Aadhaar verification failed. Try ABHA ID login or register as a new patient.' };
};

export const registerNewPatient = async (data: {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
}): Promise<{ success: boolean; profile: AbhaPatientProfile }> => {
  await new Promise(r => setTimeout(r, 600));
  // Generate a mock ABHA ID
  const rand = () => String(Math.floor(1000 + Math.random() * 9000));
  const newAbhaId = `91-${rand()}-${rand()}-${rand()}`;
  const profile: AbhaPatientProfile = {
    abhaId: newAbhaId,
    name: data.name,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    address: '',
    linkedRecords: 0,
  };
  return { success: true, profile };
};

// ==========================================
// 3. FHIR R4 BUNDLE GENERATOR (Mocked)
// ==========================================

export const generateFhirBundle = (intake: PreConsultationIntake): object => {
  const now = new Date().toISOString();
  const bundleId = `bundle-medikiosk-${intake.id}`;

  return {
    resourceType: 'Bundle',
    id: bundleId,
    meta: {
      lastUpdated: now,
      profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle'],
    },
    identifier: {
      system: 'https://abdm.gov.in/medikiosk',
      value: bundleId,
    },
    type: 'document',
    timestamp: now,
    entry: [
      {
        fullUrl: `urn:uuid:patient-${intake.id}`,
        resource: {
          resourceType: 'Patient',
          id: `patient-${intake.id}`,
          identifier: [
            {
              type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'ABHA' }] },
              system: 'https://abdm.gov.in/abha',
              value: intake.abhaId || 'UNKNOWN',
            },
          ],
          name: [{ text: intake.patientName }],
          gender: intake.gender.toLowerCase(),
          telecom: [{ system: 'phone', value: intake.phone }],
        },
      },
      {
        fullUrl: `urn:uuid:composition-${intake.id}`,
        resource: {
          resourceType: 'Composition',
          id: `composition-${intake.id}`,
          status: 'final',
          type: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '371530004',
                display: 'Clinical consultation report',
              },
            ],
          },
          subject: { reference: `urn:uuid:patient-${intake.id}` },
          date: now,
          title: 'MediKiosk Pre-Consultation History — AYUSH',
          section: [
            {
              title: 'Chief Complaint',
              text: { status: 'generated', div: `<div>${intake.chiefComplaints}</div>` },
            },
            {
              title: 'History of Present Illness (SOCRATES)',
              text: {
                status: 'generated',
                div: `<div>${JSON.stringify(intake.socratesHpi || {}, null, 2)}</div>`,
              },
            },
            {
              title: 'Consent Record',
              text: {
                status: 'generated',
                div: `<div>DPDP Act 2023 consent: ${intake.dpdpConsentGranted ? 'GRANTED' : 'DENIED'} — Language: ${intake.consentLanguage} — Timestamp: ${intake.submittedAt}</div>`,
              },
            },
            {
              title: 'AYUSH System',
              text: { status: 'generated', div: `<div>${intake.preferredAyushSystem}</div>` },
            },
            {
              title: 'Red Flag Status',
              text: {
                status: 'generated',
                div: `<div>Emergency: ${intake.isRedFlagEmergency} — Category: ${intake.redFlagDetails?.category || 'None'}</div>`,
              },
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:consent-${intake.id}`,
        resource: {
          resourceType: 'Consent',
          id: `consent-${intake.id}`,
          status: intake.dpdpConsentGranted ? 'active' : 'rejected',
          scope: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }],
          },
          category: [
            { coding: [{ system: 'http://loinc.org', code: '59284-0', display: 'Patient Consent' }] },
          ],
          patient: { reference: `urn:uuid:patient-${intake.id}` },
          dateTime: intake.submittedAt,
          policyRule: {
            coding: [
              {
                system: 'https://digitalindia.gov.in/dpdp-act-2023',
                code: 'DPDP-2023',
                display: 'Digital Personal Data Protection Act 2023',
              },
            ],
          },
        },
      },
    ],
  };
};

// ==========================================
// 4. HIS PUSH STUB
// ==========================================

export const pushToHis = async (intake: PreConsultationIntake): Promise<HisPushResult> => {
  await new Promise(r => setTimeout(r, 1000));

  const fhirBundle = generateFhirBundle(intake);
  const referenceId = `HIS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const fhirBundleId = `bundle-medikiosk-${intake.id}`;

  // Persist to localStorage as the HIS stub
  const existingPushes = JSON.parse(localStorage.getItem('his_pushes') || '[]') as object[];
  existingPushes.push({
    referenceId,
    pushedAt: new Date().toISOString(),
    patientName: intake.patientName,
    abhaId: intake.abhaId,
    fhirBundle,
  });
  localStorage.setItem('his_pushes', JSON.stringify(existingPushes));

  console.info('[MediKiosk HIS Push] FHIR Bundle generated and pushed (mock):', fhirBundle);

  return {
    success: true,
    referenceId,
    timestamp: new Date().toISOString(),
    fhirBundleId,
    message: `Pre-consultation history for ${intake.patientName} successfully submitted to HIS. Reference: ${referenceId}`,
  };
};
