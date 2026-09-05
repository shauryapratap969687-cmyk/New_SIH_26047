import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  RefreshCw,
  Phone,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { Patient } from '../types';

export const AddPatientPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as Patient['gender'],
    phone: '',
    address: '',
    occupation: '',
    registrationNo: storageService.generateRegistrationNo(),
    emergencyContact: '',
    allergies: '',
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);

  const handleRegenRegNo = () => {
    setFormData((prev) => ({
      ...prev,
      registrationNo: storageService.generateRegistrationNo(),
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient full name is required';
    if (!formData.age.trim()) errs.age = 'Age is required';
    else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 125) {
      errs.age = 'Please enter a valid age (1-125)';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.consent) errs.consent = 'Patient digital record consent is mandatory';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newPatient = storageService.addPatient({
      name: formData.name.trim(),
      age: formData.age.trim(),
      gender: formData.gender,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      occupation: formData.occupation.trim(),
      registrationNo: formData.registrationNo.trim() || storageService.generateRegistrationNo(),
      emergencyContact: formData.emergencyContact.trim(),
      allergies: formData.allergies.trim(),
      consent: formData.consent,
    });

    setCreatedPatient(newPatient);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Register New Patient
            </h1>
            <p className="text-xs text-slate-500">
              Create a digital registration record for clinical case-taking
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>NABH / AYUSH Digital Format</span>
        </div>
      </div>

      {isSuccess && createdPatient ? (
        /* Success State Screen */
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Patient Successfully Registered!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Digital health record created for{' '}
              <strong className="text-slate-900">{createdPatient.name}</strong> with Registration
              ID <span className="font-mono font-bold text-teal-800">{createdPatient.registrationNo}</span>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 max-w-lg mx-auto border border-slate-200 text-left text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500">Full Name:</span>
              <div className="font-bold text-slate-800">{createdPatient.name}</div>
            </div>
            <div>
              <span className="text-slate-500">Age / Gender:</span>
              <div className="font-bold text-slate-800">
                {createdPatient.age} yrs • {createdPatient.gender}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Phone:</span>
              <div className="font-bold text-slate-800">{createdPatient.phone}</div>
            </div>
            <div>
              <span className="text-slate-500">Allergies:</span>
              <div className="font-bold text-amber-700">
                {createdPatient.allergies || 'None reported'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/cases/new?patientId=${createdPatient.id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
            >
              <Stethoscope className="w-4 h-4 text-amber-300" />
              <span>Start Case Taking for this Patient</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setCreatedPatient(null);
                setFormData({
                  name: '',
                  age: '',
                  gender: 'Male',
                  phone: '',
                  address: '',
                  occupation: '',
                  registrationNo: storageService.generateRegistrationNo(),
                  emergencyContact: '',
                  allergies: '',
                  consent: true,
                });
              }}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
            >
              Register Another Patient
            </button>
          </div>
        </div>
      ) : (
        /* Patient Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                <User className="w-5 h-5 text-teal-700" />
                <span>Basic Demographics & Identity</span>
              </div>
              <span className="text-xs text-red-500 font-medium">* Required fields</span>
            </div>

            {/* Registration Number Auto Generation */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Patient Registration / UHID Number
                </label>
                <p className="text-xs text-slate-500">Auto-generated standardized ID</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationNo: e.target.value.toUpperCase() })
                  }
                  className="font-mono text-sm font-bold text-teal-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg w-full sm:w-48 text-center"
                />
                <button
                  type="button"
                  onClick={handleRegenRegNo}
                  title="Generate new ID"
                  className="p-2 text-slate-600 hover:text-teal-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid 1: Name, Age, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  required
                  placeholder="e.g. 42"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 transition-all ${
                    errors.age ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-red-600 mt-1">{errors.age}</p>}
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as Patient['gender'] })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (स्त्री)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Phone, Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Teacher, Civil Engineer, Farmer, Desk Job"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="House / Street, Area, City, State, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Emergency Contact & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Contact Name & Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunita Sharma (Spouse) - 9876543211"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Known Drug / Food Allergies
                </label>
                <div className="relative">
                  <AlertTriangle className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa drugs, Peanuts (or 'None')"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Patient Consent Checkbox */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 w-4 h-4 text-teal-700 border-slate-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Patient consent taken for digital case record <span className="text-red-500">*</span>
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    The patient / guardian has provided voluntary verbal and informed consent for
                    their clinical history and physical examination to be recorded in this
                    system.
                  </p>
                </div>
              </label>
              {errors.consent && (
                <p className="text-xs text-red-600 font-semibold mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Patient Profile</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
