import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  FileEdit,
  User,
  HeartPulse,
  Activity,
  Brain,
  FileText,
  Stethoscope,
  Layers,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { CaseRecord, Patient, AyushSystem } from '../types';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [caseRecord] = useState<CaseRecord | null>(() => {
    return id ? storageService.getCaseById(id) || null : null;
  });

  const [patient] = useState<Patient | null>(() => {
    if (caseRecord) {
      return storageService.getPatientById(caseRecord.patientId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (searchParams.get('print') === 'true' && caseRecord) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, caseRecord]);

  if (!caseRecord) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Case Record Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested case ID "{id}" could not be located in the AYUSH CaseFlow repository.
        </p>
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Saved Cases</span>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getSystemBadgeColor = (sys: AyushSystem) => {
    switch (sys) {
      case 'Ayurveda':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Homoeopathy':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Unani':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Siddha':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Yoga & Naturopathy':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const { presentingComplaints, generalHistory, vitals, ayushAssessment, notesAndPlan } =
    caseRecord;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Case Record #{caseRecord.id}</h1>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getSystemBadgeColor(
                  caseRecord.ayushSystem
                )}`}
              >
                {caseRecord.ayushSystem}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Recorded on {caseRecord.caseDate} • Status:{' '}
              <strong className={caseRecord.status === 'Saved' ? 'text-emerald-700' : 'text-amber-700'}>
                {caseRecord.status}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {caseRecord.status === 'Draft' && (
            <Link
              to={`/cases/edit/${caseRecord.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Continue Editing Draft</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Case Summary</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PRINTABLE CLINICAL CASE SHEET REPORT */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 print-card">
        {/* Official Header for Print & Web */}
        <div className="border-b-2 border-slate-900 pb-4 print-header flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  AYUSH CLINICAL CASE SUMMARY
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Ministry of Ayush • Government of India Standard Case Sheet
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900">{caseRecord.id}</div>
            <div className="text-slate-500 text-[11px]">Date: {caseRecord.caseDate}</div>
            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px] uppercase border border-slate-300">
                Discipline: {caseRecord.ayushSystem}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Patient Demographics Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
            <User className="w-3.5 h-3.5 text-teal-700" />
            <span>Patient Demographic Details</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Patient Name:</span>
              <p className="font-bold text-slate-900 mt-0.5">{caseRecord.patientName}</p>
            </div>
            <div>
              <span className="text-slate-400">UHID / Reg No:</span>
              <p className="font-mono font-bold text-slate-800 mt-0.5">
                {patient ? patient.registrationNo : caseRecord.patientId}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Age / Gender:</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {patient ? `${patient.age} Yrs • ${patient.gender}` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Phone Contact:</span>
              <p className="font-bold text-slate-800 mt-0.5">{patient ? patient.phone : 'N/A'}</p>
            </div>
          </div>

          {patient && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3 pt-3 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400">Occupation:</span>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {patient.occupation || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Emergency Contact:</span>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {patient.emergencyContact || 'None listed'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Known Allergies:</span>
                <p className="font-bold text-amber-700 mt-0.5">
                  {patient.allergies || 'None reported'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Clinical Vitals & Physical Exam */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-700" />
            <span>Clinical Vitals & Physical Findings</span>
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">BP</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {vitals.bp || '120/80'} <span className="text-[10px] font-normal">mmHg</span>
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Pulse</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {vitals.pulse || '72'} <span className="text-[10px] font-normal">bpm</span>
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Temp</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {vitals.temperature || '98.4'} <span className="text-[10px] font-normal">°F</span>
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Resp Rate</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {vitals.respiratoryRate || '16'} <span className="text-[10px] font-normal">/min</span>
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Height / Wt</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {vitals.height || '-'}cm / {vitals.weight || '-'}kg
              </p>
            </div>

            <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-center">
              <span className="text-[10px] text-teal-800 uppercase font-bold">BMI</span>
              <p className="font-mono font-extrabold text-teal-900 mt-0.5">
                {vitals.bmi || '-'} <span className="text-[10px] font-normal">kg/m²</span>
              </p>
            </div>
          </div>

          {(vitals.generalExamination || vitals.localSystemicExamination) && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              {vitals.generalExamination && (
                <div>
                  <span className="font-bold text-slate-700">General Examination: </span>
                  <span className="text-slate-800">{vitals.generalExamination}</span>
                </div>
              )}
              {vitals.localSystemicExamination && (
                <div>
                  <span className="font-bold text-slate-700">Local / Systemic Exam: </span>
                  <span className="text-slate-800">{vitals.localSystemicExamination}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Presenting Complaints & General History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complaints */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
              <span>Presenting Complaints</span>
            </h3>

            <div className="text-xs space-y-1.5">
              <div>
                <span className="font-bold text-slate-700">Chief Complaints:</span>
                <p className="text-slate-900 mt-0.5 font-medium whitespace-pre-line">
                  {presentingComplaints.chiefComplaints || 'None recorded'}
                </p>
              </div>

              {presentingComplaints.duration && (
                <div>
                  <span className="font-bold text-slate-700">Duration: </span>
                  <span className="text-slate-800">{presentingComplaints.duration}</span>
                </div>
              )}

              {presentingComplaints.onsetProgression && (
                <div>
                  <span className="font-bold text-slate-700">Onset & Progression: </span>
                  <span className="text-slate-800">{presentingComplaints.onsetProgression}</span>
                </div>
              )}

              {presentingComplaints.associatedSymptoms && (
                <div>
                  <span className="font-bold text-slate-700">Associated Symptoms: </span>
                  <span className="text-slate-800">{presentingComplaints.associatedSymptoms}</span>
                </div>
              )}

              {presentingComplaints.previousTreatment && (
                <div>
                  <span className="font-bold text-slate-700">Previous Treatment: </span>
                  <span className="text-slate-800">{presentingComplaints.previousTreatment}</span>
                </div>
              )}
            </div>
          </div>

          {/* General History */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>General & Physiological History</span>
            </h3>

            <div className="text-xs space-y-1">
              {generalHistory.pastMedicalHistory && (
                <div>
                  <span className="font-bold text-slate-700">Past Medical: </span>
                  <span className="text-slate-800">{generalHistory.pastMedicalHistory}</span>
                </div>
              )}

              {generalHistory.familyHistory && (
                <div>
                  <span className="font-bold text-slate-700">Family History: </span>
                  <span className="text-slate-800">{generalHistory.familyHistory}</span>
                </div>
              )}

              {generalHistory.dietAppetite && (
                <div>
                  <span className="font-bold text-slate-700">Diet & Appetite: </span>
                  <span className="text-slate-800">{generalHistory.dietAppetite}</span>
                </div>
              )}

              {generalHistory.sleep && (
                <div>
                  <span className="font-bold text-slate-700">Sleep: </span>
                  <span className="text-slate-800">{generalHistory.sleep}</span>
                </div>
              )}

              {generalHistory.bowelHabits && (
                <div>
                  <span className="font-bold text-slate-700">Bowel: </span>
                  <span className="text-slate-800">{generalHistory.bowelHabits}</span>
                </div>
              )}

              {generalHistory.mentalEmotionalState && (
                <div>
                  <span className="font-bold text-slate-700">Mind / Emotions: </span>
                  <span className="text-slate-800">{generalHistory.mentalEmotionalState}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: AYUSH System Specific Clinical Assessment */}
        <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200 space-y-3">
          <div className="flex items-center justify-between border-b border-teal-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-teal-700" />
              <span>{caseRecord.ayushSystem} Clinical Assessment Findings</span>
            </h3>
            <span className="text-[11px] font-bold text-teal-900">
              Bala: {ayushAssessment.bala || 'Medium'} • Satva: {ayushAssessment.satva || 'Medium'}
            </span>
          </div>

          {/* Classical Common AYUSH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {ayushAssessment.nidana && (
              <div>
                <span className="font-bold text-teal-900">Nidana (Causative Factors): </span>
                <span className="text-slate-800">{ayushAssessment.nidana}</span>
              </div>
            )}
            {ayushAssessment.samprapti && (
              <div>
                <span className="font-bold text-teal-900">Samprapti (Pathogenesis): </span>
                <span className="text-slate-800">{ayushAssessment.samprapti}</span>
              </div>
            )}
          </div>

          {/* Ayurveda Specific Details */}
          {caseRecord.ayushSystem === 'Ayurveda' && ayushAssessment.ayurveda && (
            <div className="mt-3 pt-3 border-t border-teal-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500">Dominant Dosha:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.ayurveda.dominantDosha || 'Vata'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Prakriti:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.ayurveda.prakriti || 'Vata-Pitta'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Agni:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.ayurveda.agni || 'Vishama'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Koshta:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.ayurveda.koshta || 'Madhyama'}
                  </p>
                </div>
              </div>

              {ayushAssessment.ayurveda.ashtavidha && (
                <div className="bg-white p-2.5 rounded-lg border border-amber-200 mt-2">
                  <span className="font-bold text-amber-900 block mb-1 text-[11px]">
                    Ashtavidha Pariksha:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>Nadi: {ayushAssessment.ayurveda.ashtavidha.nadi || '-'}</div>
                    <div>Mutra: {ayushAssessment.ayurveda.ashtavidha.mutra || '-'}</div>
                    <div>Mala: {ayushAssessment.ayurveda.ashtavidha.mala || '-'}</div>
                    <div>Jihva: {ayushAssessment.ayurveda.ashtavidha.jihva || '-'}</div>
                    <div>Shabda: {ayushAssessment.ayurveda.ashtavidha.shabda || '-'}</div>
                    <div>Sparsha: {ayushAssessment.ayurveda.ashtavidha.sparsha || '-'}</div>
                    <div>Drik: {ayushAssessment.ayurveda.ashtavidha.drik || '-'}</div>
                    <div>Akriti: {ayushAssessment.ayurveda.ashtavidha.akriti || '-'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Homoeopathy Specific Details */}
          {caseRecord.ayushSystem === 'Homoeopathy' && ayushAssessment.homoeopathy && (
            <div className="mt-3 pt-3 border-t border-teal-200 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500">Thermal State:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.homoeopathy.thermalState}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Thirst:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.homoeopathy.thirstPattern}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Miasm:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.homoeopathy.miasmaticImpression}
                  </p>
                </div>
              </div>

              {ayushAssessment.homoeopathy.mentalGenerals && (
                <div>
                  <span className="font-bold text-slate-700">Mental Generals: </span>
                  <span>{ayushAssessment.homoeopathy.mentalGenerals}</span>
                </div>
              )}

              {ayushAssessment.homoeopathy.modalities && (
                <div>
                  <span className="font-bold text-slate-700">Modalities: </span>
                  <span>{ayushAssessment.homoeopathy.modalities}</span>
                </div>
              )}

              {ayushAssessment.homoeopathy.repertoryRubrics && (
                <div>
                  <span className="font-bold text-slate-700">Rubrics: </span>
                  <span className="font-mono text-[11px] text-blue-900">
                    {ayushAssessment.homoeopathy.repertoryRubrics}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Unani Specific Details */}
          {caseRecord.ayushSystem === 'Unani' && ayushAssessment.unani && (
            <div className="mt-3 pt-3 border-t border-teal-200 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500">Mizaj:</span>
                  <p className="font-bold text-slate-900">{ayushAssessment.unani.mizaj}</p>
                </div>
                <div>
                  <span className="text-slate-500">Akhlat:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.unani.akhlatImbalance || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Nabz:</span>
                  <p className="font-bold text-slate-900">{ayushAssessment.unani.nabz || '-'}</p>
                </div>
              </div>
              {ayushAssessment.unani.sueMizaj && (
                <div>
                  <span className="font-bold text-slate-700">Sue Mizaj: </span>
                  <span>{ayushAssessment.unani.sueMizaj}</span>
                </div>
              )}
            </div>
          )}

          {/* Siddha Specific Details */}
          {caseRecord.ayushSystem === 'Siddha' && ayushAssessment.siddha && (
            <div className="mt-3 pt-3 border-t border-teal-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Mukkuttram Balance:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.siddha.valiAzhalIyamBalance}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Udal Thathu:</span>
                  <p className="font-bold text-slate-900">
                    {ayushAssessment.siddha.udalThathu || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Yoga & Naturopathy Specific Details */}
          {caseRecord.ayushSystem === 'Yoga & Naturopathy' &&
            ayushAssessment.yogaNaturopathy && (
              <div className="mt-3 pt-3 border-t border-teal-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500">Stress Level:</span>
                    <p className="font-bold text-slate-900">
                      {ayushAssessment.yogaNaturopathy.stressLevel}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Activity Level:</span>
                    <p className="font-bold text-slate-900">
                      {ayushAssessment.yogaNaturopathy.physicalActivityLevel}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Contraindications:</span>
                    <p className="font-bold text-amber-700">
                      {ayushAssessment.yogaNaturopathy.contraindications || 'None'}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Section 5: Doctor Observations, Diagnosis & Care Plan */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4 print-card">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Doctor Assessment & Management Plan</span>
            </h3>
            {notesAndPlan.followUpDate && (
              <span className="text-[11px] text-teal-300 font-semibold">
                Follow-up Review: {notesAndPlan.followUpDate}
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">
                Provisional AYUSH Diagnosis:
              </span>
              <p className="text-base font-extrabold text-white mt-0.5">
                {notesAndPlan.provisionalDiagnosis || 'Clinical Assessment Completed'}
              </p>
            </div>

            {notesAndPlan.doctorObservations && (
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Clinical Observations:
                </span>
                <p className="text-slate-200 mt-0.5 whitespace-pre-line leading-relaxed">
                  {notesAndPlan.doctorObservations}
                </p>
              </div>
            )}

            {notesAndPlan.recommendedInvestigations && (
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Recommended Diagnostic Investigations / Referrals:
                </span>
                <p className="text-teal-200 mt-0.5">{notesAndPlan.recommendedInvestigations}</p>
              </div>
            )}

            {notesAndPlan.advicePlan && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Therapeutic Prescription & Lifestyle Advice:
                </span>
                <p className="text-amber-200 mt-1 whitespace-pre-line leading-relaxed font-mono text-[11px] bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {notesAndPlan.advicePlan}
                </p>
              </div>
            )}
          </div>

          {/* Doctor Sign-off */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="text-slate-300 font-bold">Attending Medical Officer</span>
              <div className="text-[11px]">AYUSH CaseFlow System Digital Record</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-emerald-400 font-semibold">
                ✓ Digitally Authenticated
              </div>
              <div className="text-[10px] text-slate-500">Record Timestamp: {caseRecord.createdAt}</div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer on Sheet */}
        <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
          Ministry of Ayush • SIH26047 Patient Case-Taking Software Prototype • Generated for Hackathon Demonstration
        </div>
      </div>
    </div>
  );
};
