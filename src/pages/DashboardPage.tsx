import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
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
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { storageService } from '../services/storage';
import type { CaseRecord, Patient, AyushSystem } from '../types';

export const DashboardPage: React.FC = () => {
  const { doctor } = useAuth();
  const [patients] = useState<Patient[]>(() => storageService.getPatients());
  const [cases] = useState<CaseRecord[]>(() => storageService.getCases());
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const casesTodayCount = cases.filter((c) => c.caseDate === todayStr).length;
  const draftCasesCount = cases.filter((c) => c.status === 'Draft').length;

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

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ministry of Ayush • Clinical Case-Taking Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {doctor?.name || 'Doctor'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {doctor?.role} • {doctor?.institution}
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/cases/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-teal-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Start Case Taking</span>
            </Link>
            <Link
              to="/patients/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/25"
            >
              <Users className="w-4 h-4 text-teal-300" />
              <span>Add Patient</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Patients
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{patients.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Registered digital profiles</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Cases
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{cases.length}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {cases.filter((c) => c.status === 'Saved').length} Completed records
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Cases Today
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{casesTodayCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Recorded on {todayStr}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Draft Cases
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{draftCasesCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Pending doctor sign-off</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <FileEdit className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* AYUSH Discipline Breakdown Badges */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cases by AYUSH Discipline
          </h3>
          <span className="text-xs text-slate-400">Integrated AYUSH coverage</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.keys(systemCounts) as AyushSystem[]).map((sys) => (
            <div
              key={sys}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div className="text-xs font-bold text-slate-800">{sys}</div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-teal-800">{systemCounts[sys]}</span>
                <span className="text-[10px] text-slate-500 font-medium">cases</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/patients/new"
          className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl text-white flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Users className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="font-bold text-sm">Add New Patient</div>
              <div className="text-xs text-blue-200">Register demographics & consent</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/cases/new"
          className="p-4 bg-gradient-to-r from-teal-800 to-emerald-900 rounded-xl text-white flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <PlusCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-sm">Start Case Taking</div>
              <div className="text-xs text-emerald-200">Voice-assisted AYUSH intake</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/cases"
          className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <FolderOpen className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <div className="font-bold text-sm">View Saved Cases</div>
              <div className="text-xs text-slate-300">Browse, filter & print case sheets</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Cases Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Patient Case Records</h2>
            <p className="text-xs text-slate-500">
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
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>
            <Link
              to="/cases"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-colors shrink-0 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Table / List */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
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
                {filteredCases.slice(0, 5).map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-slate-50/80 transition-colors">
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
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getSystemBadgeColor(
                          caseItem.ayushSystem
                        )}`}
                      >
                        {caseItem.ayushSystem}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/cases/${caseItem.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                        {caseItem.status === 'Draft' && (
                          <Link
                            to={`/cases/edit/${caseItem.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                        )}
                        <Link
                          to={`/cases/${caseItem.id}?print=true`}
                          title="Print Case Sheet"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
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
