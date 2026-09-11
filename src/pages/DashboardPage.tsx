import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileEdit,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Eye,
  Clock,
  Sparkles,
  ChevronRight,
  Printer,
  Search,
  HeartPulse,
  Stethoscope,
  Trash2,
  FileCheck,
  Flame,
  Activity,
  TrendingUp,
  Bell,
  Zap,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { storageService } from '../services/storage';
import type { CaseRecord, Patient, AyushSystem, PreConsultationIntake } from '../types';

// ─── Animated Counter Hook ──────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animFrame = useRef(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    startTime.current = null;
    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) { animFrame.current = requestAnimationFrame(step); }
    };
    animFrame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame.current);
  }, [target, duration]);

  return count;
}

// ─── Live Clock Component ───────────────────────────────────────
const LiveClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="text-right">
      <div className="text-lg font-mono font-bold text-white/90 tabular-nums tracking-wide">{timeStr}</div>
      <div className="text-xs text-slate-400">{dateStr}</div>
    </div>
  );
};

// ─── AYUSH System Icons ─────────────────────────────────────────
const AYUSH_ICONS: Record<string, string> = {
  Ayurveda: '🌿',
  Homoeopathy: '💊',
  Unani: '⚗️',
  Siddha: '🔮',
  'Yoga & Naturopathy': '🧘',
};

const AYUSH_GRADIENTS: Record<string, string> = {
  Ayurveda: 'from-amber-500 to-orange-600',
  Homoeopathy: 'from-blue-500 to-indigo-600',
  Unani: 'from-emerald-500 to-green-700',
  Siddha: 'from-purple-500 to-violet-700',
  'Yoga & Naturopathy': 'from-teal-500 to-cyan-600',
};

export const DashboardPage: React.FC = () => {
  const { doctor } = useAuth();
  const navigate = useNavigate();
  const [patients] = useState<Patient[]>(() => storageService.getPatients());
  const [cases] = useState<CaseRecord[]>(() => storageService.getCases());
  const [preIntakes, setPreIntakes] = useState<PreConsultationIntake[]>(() =>
    storageService.getPreIntakes()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const casesTodayCount = cases.filter((c) => c.caseDate === todayStr).length;
  const draftCasesCount = cases.filter((c) => c.status === 'Draft').length;
  const waitingPatientsCount = preIntakes.filter((p) => p.status.includes('Waiting') || p.status.includes('Priority')).length;
  const emergencyCount = preIntakes.filter((p) => p.isRedFlagEmergency && p.status !== 'Completed').length;

  // Animated counters
  const animWaiting = useAnimatedCounter(waitingPatientsCount);
  const animPatients = useAnimatedCounter(patients.length);
  const animToday = useAnimatedCounter(casesTodayCount);
  const animDrafts = useAnimatedCounter(draftCasesCount);

  const systemCounts: Record<AyushSystem, number> = {
    Ayurveda: cases.filter((c) => c.ayushSystem === 'Ayurveda').length,
    Homoeopathy: cases.filter((c) => c.ayushSystem === 'Homoeopathy').length,
    Unani: cases.filter((c) => c.ayushSystem === 'Unani').length,
    Siddha: cases.filter((c) => c.ayushSystem === 'Siddha').length,
    'Yoga & Naturopathy': cases.filter((c) => c.ayushSystem === 'Yoga & Naturopathy').length,
  };

  const filteredCases = cases.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query) ||
      c.ayushSystem.toLowerCase().includes(query) ||
      c.presentingComplaints.chiefComplaints.toLowerCase().includes(query)
    );
  });

  const getSystemBadgeColor = useCallback((sys: AyushSystem) => {
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
  }, []);

  const handleStartConsultation = (intake: PreConsultationIntake) => {
    storageService.updatePreIntakeStatus(intake.id, 'In Consultation');
    navigate(`/cases/new?preIntakeId=${intake.id}`);
  };

  const handleDeletePreIntake = (id: string) => {
    storageService.deletePreIntake(id);
    setPreIntakes(storageService.getPreIntakes());
  };

  // Staggered animation delay helper
  const stagger = (idx: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms`,
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <div className="space-y-6 pb-12">
      {/* ═══════════════════════════════════════════════════════════
          WELCOME BANNER — hero gradient with particles effect
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
        style={stagger(0)}
      >
        {/* Animated background orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -left-12 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-reverse pointer-events-none" />
        <div className="absolute right-1/3 top-1/4 w-32 h-32 bg-amber-400/8 rounded-full blur-2xl animate-float-medium pointer-events-none" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Ministry badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md border border-white/10 animate-shimmer">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Ministry of Ayush • All India Institute of Ayurveda EMR</span>
            </div>

            {/* Greeting */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="text-slate-300 font-normal">{greeting}, </span>
              <span className="bg-gradient-to-r from-white via-teal-100 to-amber-200 bg-clip-text text-transparent">
                {doctor?.name || 'Doctor'}
              </span>
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              {doctor?.role} • {doctor?.institution}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            {/* Live Clock */}
            <LiveClock />

            {/* Quick Action Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/cases/new"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-950/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/30 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
                <span>Start Case Taking</span>
              </Link>
              <Link
                to="/patient-checkin"
                target="_blank"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/30 hover:border-emerald-400/60 rounded-xl text-sm font-semibold backdrop-blur-md transition-all duration-300"
              >
                <HeartPulse className="w-4 h-4 text-emerald-300 animate-pulse group-hover:scale-125 transition-transform duration-300" />
                <span>Open MediKiosk</span>
              </Link>
              <Link
                to="/patients/new"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/15 text-white border border-white/15 hover:border-white/30 rounded-xl text-sm font-semibold backdrop-blur-md transition-all duration-300"
              >
                <Users className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform duration-300" />
                <span>Add Patient</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STATS CARDS — animated counters with hover lift
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Waiting Room / Emergency */}
        <div
          className={`group p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden cursor-default ${
            emergencyCount > 0
              ? 'bg-red-50 border-red-300'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200'
          }`}
          style={stagger(1)}
        >
          {/* Hover glow effect */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${emergencyCount > 0 ? 'bg-gradient-to-br from-red-100/40 to-transparent' : 'bg-gradient-to-br from-emerald-100/40 to-transparent'}`} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  emergencyCount > 0 ? 'text-red-800' : 'text-emerald-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    emergencyCount > 0 ? 'bg-red-600 animate-ping' : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                Waiting in OPD
              </p>
              <h3
                className={`text-3xl font-black mt-1 tabular-nums transition-all duration-300 group-hover:scale-110 origin-left ${
                  emergencyCount > 0 ? 'text-red-950' : 'text-emerald-950'
                }`}
              >
                {animWaiting}
              </h3>
              {emergencyCount > 0 ? (
                <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  <span>{emergencyCount} Red-Flag Emergency Triage</span>
                </p>
              ) : (
                <p className="text-xs text-emerald-700 font-medium mt-1">Pre-Check-in submissions</p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                emergencyCount > 0
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <HeartPulse className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Patients */}
        <div
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden cursor-default"
          style={stagger(2)}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/60 to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Patients
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tabular-nums transition-all duration-300 group-hover:scale-110 origin-left">{animPatients}</h3>
              <p className="text-xs text-slate-500 mt-1">ABDM registered profiles</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Cases Today */}
        <div
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden cursor-default"
          style={stagger(3)}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-50/60 to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Cases Today
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tabular-nums transition-all duration-300 group-hover:scale-110 origin-left">{animToday}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-500" />
                Recorded on {todayStr}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Draft Cases */}
        <div
          className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden cursor-default"
          style={stagger(4)}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-50/60 to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Draft Cases
              </p>
              <h3 className="text-3xl font-black text-amber-600 mt-1 tabular-nums transition-all duration-300 group-hover:scale-110 origin-left">{animDrafts}</h3>
              <p className="text-xs text-slate-500 mt-1">Pending doctor sign-off</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <FileEdit className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          OPD WAITING ROOM QUEUE
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="bg-white rounded-2xl border border-teal-200/80 shadow-sm overflow-hidden"
        style={stagger(5)}
      >
        <div className="p-5 bg-gradient-to-r from-teal-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">OPD Waiting Room: MediKiosk Queue</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-300 text-slate-950 animate-pulse">
                  {waitingPatientsCount} Queued
                </span>
                {emergencyCount > 0 && (
                  <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-red-500 text-white flex items-center gap-1 animate-bounce">
                    <Zap className="w-2.5 h-2.5" />
                    {emergencyCount} Emergency
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Automated clinical history intake, SOCRATES probing, OCR intelligence & Red-Flag triage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreIntakes(storageService.getPreIntakes())}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-all hover:rotate-180 duration-500"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/patient-checkin"
              target="_blank"
              className="text-xs font-semibold text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Open MediKiosk</span>
            </Link>
          </div>
        </div>

        {preIntakes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-400 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Bell className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No patients in queue</p>
            <p className="text-xs text-slate-400 mt-1">
              Open the <strong>MediKiosk</strong> on a patient kiosk to begin pre-consultation intake
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {preIntakes.map((intake, idx) => (
              <div
                key={intake.id}
                className={`group/row p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  intake.isRedFlagEmergency
                    ? 'bg-red-50/70 border-l-4 border-l-red-600 hover:bg-red-100/60'
                    : 'hover:bg-slate-50/80'
                }`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${600 + idx * 100}ms`,
                }}
              >
                <div className="flex items-start gap-3.5">
                  {/* Token badge */}
                  <div
                    className={`px-3 py-2 rounded-xl text-white font-mono font-black text-sm text-center shadow-xs shrink-0 transition-transform duration-300 group-hover/row:scale-110 ${
                      intake.isRedFlagEmergency
                        ? 'bg-red-600 border border-red-400 animate-pulse'
                        : 'bg-gradient-to-br from-teal-700 to-blue-900'
                    }`}
                  >
                    <span className="text-[9px] uppercase block text-teal-200 font-semibold">
                      Token
                    </span>
                    {intake.tokenNumber}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{intake.patientName}</h4>
                      <span className="text-xs text-slate-500 font-medium">
                        ({intake.age}y • {intake.gender} • {intake.city || 'Delhi'})
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getSystemBadgeColor(
                          intake.preferredAyushSystem
                        )}`}
                      >
                        {AYUSH_ICONS[intake.preferredAyushSystem] || ''} {intake.preferredAyushSystem}
                      </span>

                      {intake.isRedFlagEmergency && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-900 bg-red-100 border border-red-400 px-2 py-0.5 rounded-full animate-pulse">
                          <Flame className="w-3 h-3 text-red-600" />
                          🚨 RED-FLAG PRIORITY
                        </span>
                      )}

                      {intake.status === 'Waiting' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                          Waiting
                        </span>
                      )}
                    </div>

                    {/* SOCRATES HPI */}
                    <div className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1 transition-all duration-300 group-hover/row:border-teal-200">
                      <p>
                        <strong className="text-slate-900 font-bold">Chief Complaint: </strong>
                        &ldquo;{intake.chiefComplaints}&rdquo;
                        {intake.duration && (
                          <span className="text-slate-500 font-normal"> (Duration: {intake.duration})</span>
                        )}
                      </p>
                      {intake.socratesHpi && (
                        <div className="text-[11px] text-teal-900 bg-teal-50/70 p-1.5 rounded-lg border border-teal-200/60 flex flex-wrap gap-x-3 gap-y-1">
                          <span><strong>Site:</strong> {intake.socratesHpi.site}</span>
                          <span><strong>Character:</strong> {intake.socratesHpi.character}</span>
                          <span><strong>Severity:</strong> {intake.socratesHpi.severity}/10</span>
                          <span><strong>Relief:</strong> {intake.socratesHpi.relievingFactors}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Submitted: {new Date(intake.submittedAt).toLocaleTimeString()}
                      </span>
                      <span>Phone: {intake.phone}</span>
                      {intake.digitizedDocuments && intake.digitizedDocuments.length > 0 && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <FileCheck className="w-3 h-3" />
                          {intake.digitizedDocuments.length} Scanned Docs
                        </span>
                      )}
                      {intake.allergies && intake.allergies !== 'None' && (
                        <span className="text-amber-700 font-semibold">
                          Allergy: {intake.allergies}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartConsultation(intake)}
                    className={`group/btn inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${
                      intake.isRedFlagEmergency
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-950/30'
                        : 'bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 shadow-teal-950/20'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-amber-300" />
                    <span>Take Case</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePreIntake(intake.id)}
                    title="Dismiss patient from queue"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          AYUSH DISCIPLINE CARDS — visual with gradients & icons
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
        style={stagger(6)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Cases by AYUSH Discipline
            </h3>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Integrated coverage
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.keys(systemCounts) as AyushSystem[]).map((sys, idx) => (
            <div
              key={sys}
              className="group relative p-4 rounded-xl border border-slate-200/80 hover:border-transparent hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-default overflow-hidden"
              style={stagger(7 + idx)}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${AYUSH_GRADIENTS[sys]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{AYUSH_ICONS[sys]}</span>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors duration-300">{sys}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-teal-800 tabular-nums transition-all duration-300 group-hover:scale-110 origin-left">{systemCounts[sys]}</span>
                  <span className="text-[10px] text-slate-400 font-medium">cases</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RECENT CASES TABLE
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        style={stagger(12)}
      >
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-teal-600" />
              Recent Patient Case Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live case history recorded in the AYUSH CaseFlow repository
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, complaint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300"
              />
            </div>
            <Link
              to="/cases"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-3 py-2 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all duration-300 shrink-0 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Table / List */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 animate-bounce-slow">
              <FolderOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No cases match your search</p>
            <p className="text-xs text-slate-500 mt-1">
              Start by creating a new case-taking session or clearing search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Case ID & Date</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">AYUSH System</th>
                  <th className="py-3 px-4">Chief Complaint</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.slice(0, 5).map((caseItem, idx) => (
                  <tr
                    key={caseItem.id}
                    className="hover:bg-teal-50/40 transition-all duration-300"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `all 0.4s ease ${1000 + idx * 80}ms`,
                    }}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800">{caseItem.id}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {caseItem.caseDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{caseItem.patientName}</div>
                      <div className="text-[10px] text-slate-400">ID: {caseItem.patientId}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getSystemBadgeColor(
                          caseItem.ayushSystem
                        )}`}
                      >
                        {AYUSH_ICONS[caseItem.ayushSystem] || ''} {caseItem.ayushSystem}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {caseItem.presentingComplaints.chiefComplaints || 'No complaints recorded'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {caseItem.status === 'Saved' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Saved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/cases/${caseItem.id}`}
                          className="group/btn inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all duration-300 hover:shadow-sm"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                        </Link>
                        {caseItem.status === 'Draft' && (
                          <Link
                            to={`/cases/edit/${caseItem.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all duration-300 hover:shadow-sm"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                        )}
                        <Link
                          to={`/cases/${caseItem.id}?print=true`}
                          title="Print Case Sheet"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-300 hover:shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
