import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Search,
  PlusCircle,
  Eye,
  FileEdit,
  Trash2,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { CaseRecord, AyushSystem } from '../types';

export const SavedCasesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseRecord[]>(() => storageService.getCases());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete case record ${id} for ${name}?`)) {
      storageService.deleteCase(id);
      setCases(storageService.getCases());
    }
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

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.patientName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.presentingComplaints.chiefComplaints.toLowerCase().includes(q) ||
      c.notesAndPlan.provisionalDiagnosis.toLowerCase().includes(q);

    const matchesSystem = selectedSystem === 'ALL' || c.ayushSystem === selectedSystem;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchesSearch && matchesSystem && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-teal-700" />
            <span>Saved Clinical Cases</span>
          </h1>
          <p className="text-xs text-slate-500">
            Repository of completed case records, intake assessments, and ongoing drafts
          </p>
        </div>

        <Link
          to="/cases/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>New Case Intake</span>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient name, Case ID, Complaint or Diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Filter AYUSH System */}
          <div className="md:col-span-3">
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white"
            >
              <option value="ALL">All AYUSH Systems</option>
              <option value="Ayurveda">Ayurveda</option>
              <option value="Yoga & Naturopathy">Yoga & Naturopathy</option>
              <option value="Unani">Unani</option>
              <option value="Siddha">Siddha</option>
              <option value="Homoeopathy">Homoeopathy</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white"
            >
              <option value="ALL">All Statuses (Saved & Draft)</option>
              <option value="Saved">Saved / Completed</option>
              <option value="Draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Active Filter summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredCases.length}</strong> of{' '}
            {cases.length} recorded cases
          </div>
          {(selectedSystem !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSystem('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-teal-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Cases List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Case Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No clinical cases match your active search and filter criteria. You can register a new
              case or reset filters.
            </p>
            <Link
              to="/cases/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-teal-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Case</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Case ID & Date</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">AYUSH Discipline</th>
                  <th className="py-3 px-4">Chief Complaint & Diagnosis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{caseItem.id}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{caseItem.caseDate}</span>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{caseItem.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {caseItem.patientId}
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-md border ${getSystemBadgeColor(
                          caseItem.ayushSystem
                        )}`}
                      >
                        {caseItem.ayushSystem}
                      </span>
                    </td>

                    {/* Complaints / Diagnosis Preview */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-medium text-slate-800 line-clamp-1">
                        {caseItem.presentingComplaints.chiefComplaints || 'No complaints noted'}
                      </p>
                      {caseItem.notesAndPlan.provisionalDiagnosis && (
                        <p className="text-[11px] text-teal-800 font-semibold line-clamp-1 mt-0.5">
                          Dx: {caseItem.notesAndPlan.provisionalDiagnosis}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {caseItem.status === 'Saved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Saved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/cases/${caseItem.id}`}
                          title="View Case Sheet"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>

                        {caseItem.status === 'Draft' && (
                          <Link
                            to={`/cases/edit/${caseItem.id}`}
                            title="Edit Draft"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                        )}

                        <Link
                          to={`/cases/${caseItem.id}?print=true`}
                          title="Print Case Summary"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(caseItem.id, caseItem.patientName)}
                          title="Delete Case"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
