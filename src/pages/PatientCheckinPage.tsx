import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  User,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { AyushSystem, PreConsultationIntake } from '../types';
import { VoiceDictationButton } from '../components/VoiceDictationButton';

const AYUSH_SYSTEMS: AyushSystem[] = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homoeopathy',
];

export const PatientCheckinPage: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [preferredAyushSystem, setPreferredAyushSystem] = useState<AyushSystem>('Ayurveda');
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [duration, setDuration] = useState('');
  const [allergies, setAllergies] = useState('');
  const [previousTreatment, setPreviousTreatment] = useState('');
  const [submittedToken, setSubmittedToken] = useState<PreConsultationIntake | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!age || parseInt(age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!chiefComplaints.trim()) {
      setError('Please describe your main health complaints / problem.');
      return;
    }

    setError(null);

    // Save to Pre-Intake repository
    const newIntake = storageService.addPreIntake({
      patientName: patientName.trim(),
      age: age.trim(),
      gender,
      phone: phone.trim(),
      city: city.trim() || 'New Delhi',
      preferredAyushSystem,
      chiefComplaints: chiefComplaints.trim(),
      duration: duration.trim() || 'Not specified',
      allergies: allergies.trim() || 'None',
      previousTreatment: previousTreatment.trim() || 'None',
    });

    // Also ensure patient exists in master list for seamless doctor lookup
    const existingPatients = storageService.getPatients();
    const alreadyExists = existingPatients.some(
      (p) => p.name.toLowerCase() === patientName.trim().toLowerCase() && p.phone === phone.trim()
    );

    if (!alreadyExists) {
      storageService.addPatient({
        registrationNo: storageService.generateRegistrationNo(),
        name: patientName.trim(),
        age: age.trim(),
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
  };

  const handleReset = () => {
    setPatientName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setCity('');
    setPreferredAyushSystem('Ayurveda');
    setChiefComplaints('');
    setDuration('');
    setAllergies('');
    setPreviousTreatment('');
    setSubmittedToken(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Ministry Banner */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">🇮🇳 Ministry of Ayush</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200">Patient Pre-Consultation Self-Intake</span>
          </div>
          <Link
            to="/login"
            className="text-[11px] text-teal-300 hover:text-white font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Doctor Portal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-2 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>OPD Waiting Room Self-Check-in • मरीज़ पूर्व-परामर्श चेक-इन</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tell the Doctor Your Symptoms in Advance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Fill out or speak your health complaints below while waiting. Your attending AYUSH
            Doctor will receive your details instantly.
          </p>
        </div>

        {/* SUCCESS TOKEN CARD (After Submission) */}
        {submittedToken ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Pre-Consultation Check-in Successful!
              </h2>
              <p className="text-xs text-slate-500">
                Your symptom details have been securely sent to the Attending AYUSH Doctor.
              </p>
            </div>

            {/* OPD Token Card */}
            <div className="bg-gradient-to-br from-teal-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold">
                    Your OPD Queue Token Number
                  </span>
                  <div className="text-4xl font-black text-amber-300 tracking-tight mt-0.5">
                    {submittedToken.tokenNumber}
                  </div>
                </div>
                <div className="text-right sm:text-right text-xs">
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-emerald-300 font-semibold border border-emerald-500/30">
                    Status: Waiting in OPD
                  </span>
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
                  <p className="font-bold text-white mt-0.5">
                    {submittedToken.age}y • {submittedToken.gender}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">AYUSH Stream:</span>
                  <p className="font-bold text-teal-300 mt-0.5">
                    {submittedToken.preferredAyushSystem}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Contact:</span>
                  <p className="font-bold text-white mt-0.5">{submittedToken.phone}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300">
                <span className="font-semibold text-amber-300">Recorded Problem: </span>
                <span className="line-clamp-2">{submittedToken.chiefComplaints}</span>
              </div>
            </div>

            {/* Instruction note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Next Step: </span>
                Please have a seat in the waiting lounge. When your token (
                <strong>{submittedToken.tokenNumber}</strong>) is called, enter the consultation
                room. The Doctor will already have your pre-filled problem sheet on screen!
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Patient Check-in</span>
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Doctor Portal Login</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        ) : (
          /* PRE-INTAKE FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Demographics */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-teal-700" />
                <span>1. Patient Basic Details / मरीज़ की जानकारी</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name (पूरा नाम) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (उम्र) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      placeholder="e.g. 38"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender (लिंग) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white"
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
                    Mobile Phone Number (मोबाइल नंबर) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town (शहर / पता)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, Jaipur, Varanasi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Preferred AYUSH Discipline */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Preferred AYUSH System / किस चिकित्सा पद्धति में दिखाना चाहते हैं?{' '}
                <span className="text-red-500">*</span>
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

            {/* Section 3: Health Problems & Symptoms (Voice enabled) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-teal-700" />
                  <span>2. Describe Your Problem / अपनी समस्या बताएं</span>
                </h3>
                <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  🎙️ Speak into Mic
                </span>
              </div>

              {/* Chief complaints with Voice button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Main Health Complaints (मुख्य लक्षण व तकलीफ){' '}
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
                  rows={4}
                  required
                  placeholder="e.g. I have severe lower back pain and stiffness since 3 months, worsening after long desk sitting. (आप माइक बटन दबाकर हिंदी या अंग्रेजी में बोल भी सकते हैं)"
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (कब से है?)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Weeks, 6 Months, 1 Year"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Known Allergies (एलर्जी)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dust, Specific medicine, None"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prior Treatment (पहले ली दवा)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Painkillers, Ayurvedic kadha, None"
                    value={previousTreatment}
                    onChange={(e) => setPreviousTreatment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer & Submit */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <FileText className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  By submitting, you agree to share these preliminary details with the attending
                  AYUSH Medical Officer for clinical case assessment. (Prototype OPD System)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-950/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Stethoscope className="w-4 h-4 text-amber-300" />
                <span>Submit Symptoms & Get OPD Token / टोकन प्राप्त करें</span>
              </button>
            </div>
          </form>
        )}

        {/* Back to Login Footer */}
        <div className="text-center text-xs text-slate-400">
          <span>Are you an AYUSH Doctor? </span>
          <Link to="/login" className="text-teal-300 font-bold hover:underline">
            Doctor Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
