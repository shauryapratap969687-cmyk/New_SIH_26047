// MediKiosk AI — Hospital Configuration
// ═══════════════════════════════════════════════════════════════
// Edit THIS file to configure the chatbot for your specific hospital.
// All chatbot navigation responses pull from this single config.
// ═══════════════════════════════════════════════════════════════

export interface HospitalDepartment {
  name: string;
  floor: string;
  wing?: string;
  roomNumber?: string;
  timings: string;
  phone?: string;
  notes?: string;
}

export interface HospitalConfig {
  // ── Identity ──────────────────────────────────────────────────
  name: string;               // e.g. "AYUSH District Hospital, Jaipur"
  shortName: string;          // e.g. "AYUSH Jaipur"
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Government' | 'Private' | 'Trust' | 'NGO';

  // ── Contact ───────────────────────────────────────────────────
  mainPhone: string;          // OPD / general enquiry
  emergencyPhone: string;     // Emergency / casualty
  ambulancePhone: string;     // Local ambulance (use 108 if none)
  tollfree?: string;          // Toll-free if available

  // ── Departments ───────────────────────────────────────────────
  departments: {
    lab: HospitalDepartment;
    pharmacy: HospitalDepartment;
    ayushPharmacy?: HospitalDepartment;
    xray: HospitalDepartment;
    opd: HospitalDepartment;
    emergency: HospitalDepartment;
    ultrasound?: HospitalDepartment;
    toilets?: {
      groundFloor: string;
      firstFloor?: string;
    };
  };

  // ── OPD Schedule ─────────────────────────────────────────────
  opdSchedule: {
    system: string;
    room?: string;
    days: string;
    timing: string;
    doctorName?: string;
  }[];

  // ── General Timings ──────────────────────────────────────────
  generalTimings: {
    opdRegistration: string;
    pharmacy: string;
    emergencyOpen: boolean;   // true = 24x7
  };
}

// ═══════════════════════════════════════════════════════════════
// 🏥 CONFIGURE YOUR HOSPITAL BELOW
// Replace all values with your hospital's actual information.
// ═══════════════════════════════════════════════════════════════
export const HOSPITAL_CONFIG: HospitalConfig = {
  name: 'National AYUSH Institute & Hospital',
  shortName: 'NAIH',
  address: '14, Institutional Area, Janakpuri',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110058',
  type: 'Government',

  mainPhone: '011-2855-1234',
  emergencyPhone: '011-2855-9999',
  ambulancePhone: '108',
  tollfree: '1800-11-AYUSH',

  departments: {
    lab: {
      name: 'Pathology & Laboratory',
      floor: 'Ground Floor',
      wing: 'Wing B',
      roomNumber: 'B-04',
      timings: '7:00 AM – 1:00 PM (Mon–Sat). Fasting samples preferred before 10 AM.',
      phone: '011-2855-1240',
      notes: 'Emergency lab at Gate 2 — open 24×7. Carry doctor\'s requisition slip. Fasting tests require 8–10 hours empty stomach.',
    },
    pharmacy: {
      name: 'Main Pharmacy',
      floor: 'Ground Floor',
      wing: 'Main Corridor',
      roomNumber: 'near OPD Registration',
      timings: '8:00 AM – 8:00 PM (Mon–Sat), 9:00 AM – 2:00 PM (Sunday)',
      phone: '011-2855-1260',
    },
    ayushPharmacy: {
      name: 'AYUSH Medicines Dispensary',
      floor: 'First Floor',
      roomNumber: 'Room 12',
      timings: '9:00 AM – 5:00 PM (Mon–Sat)',
      notes: 'Stocks Ayurvedic, Unani, Siddha, and Homoeopathic medicines.',
    },
    xray: {
      name: 'Radiology & Imaging',
      floor: 'Ground Floor',
      wing: 'Wing C',
      timings: 'X-Ray: 8:00 AM – 4:00 PM | Ultrasound (Room 8, First Floor): 9:00 AM – 3:00 PM (by appointment)',
      phone: '011-2855-1250',
      notes: 'MRI / CT Scan: Referral to AIIMS / Lady Hardinge. Staff will assist.',
    },
    opd: {
      name: 'OPD Registration',
      floor: 'Ground Floor',
      roomNumber: 'Room 1 (main entrance, right side)',
      timings: '8:00 AM – 1:00 PM (new patients, Mon–Sat)',
      phone: '011-2855-1200',
    },
    emergency: {
      name: 'Emergency / Casualty',
      floor: 'Ground Floor',
      wing: 'Gate 2',
      timings: 'Open 24×7',
      phone: '011-2855-9999',
    },
    ultrasound: {
      name: 'Ultrasound / Sonography',
      floor: 'First Floor',
      roomNumber: 'Room 8',
      timings: '9:00 AM – 3:00 PM (by appointment)',
      phone: '011-2855-1255',
    },
    toilets: {
      groundFloor: 'Near main entrance (left side) and near OPD waiting area',
      firstFloor: 'Both ends of the corridor',
    },
  },

  opdSchedule: [
    { system: 'Ayurveda',           room: 'OPD Room 3', days: 'Mon–Sat', timing: '9:00 AM – 1:00 PM', doctorName: 'Dr. Ramesh Tiwari (MD Ayurveda)' },
    { system: 'Homoeopathy',        room: 'OPD Room 5', days: 'Mon–Sat', timing: '9:00 AM – 1:00 PM', doctorName: 'Dr. Priya Sharma (MD Homoeopathy)' },
    { system: 'Unani',              room: 'OPD Room 6', days: 'Mon–Fri', timing: '9:00 AM – 12:00 PM', doctorName: 'Dr. Mohammed Iqbal (MD Unani)' },
    { system: 'Siddha',             room: 'OPD Room 7', days: 'Mon, Wed, Fri', timing: '9:00 AM – 12:00 PM', doctorName: 'Dr. Karthik Murugan (MD Siddha)' },
    { system: 'Yoga & Naturopathy', room: 'Yoga Hall, First Floor', days: 'Mon–Sat', timing: '7:00 AM – 9:00 AM (sessions)', doctorName: 'Dr. Anita Joshi (ND)' },
  ],

  generalTimings: {
    opdRegistration: '8:00 AM – 1:00 PM (Mon–Sat)',
    pharmacy: '8:00 AM – 8:00 PM',
    emergencyOpen: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// Helper — build a standard location string from a department
// ═══════════════════════════════════════════════════════════════
export function deptLocation(dept: HospitalDepartment): string {
  const parts = [dept.floor];
  if (dept.wing) parts.push(dept.wing);
  if (dept.roomNumber) parts.push(dept.roomNumber);
  return parts.join(', ');
}

// Helper — wait-time estimate per system (minutes)
export const SYSTEM_WAIT_ESTIMATE: Record<string, number> = {
  'Ayurveda':           30,
  'Homoeopathy':        18,
  'Unani':              25,
  'Siddha':             22,
  'Yoga & Naturopathy': 12,
};
