/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  FileSpreadsheet, 
  AlertCircle,
  Plus
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ReportsPage({ onNavigate }: ReportsPageProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function loadReports() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const handleCreateReport = async (title: string, type: 'PDF' | 'CSV' | 'XLSX') => {
    setCreating(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, count: 50 })
      });
      if (res.ok) {
        setSuccessMsg(`Compiled report "${title}" (${type}) successfully!`);
        await loadReports();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const downloadReportFile = (title: string, type: string) => {
    const header = "Indicator,AggregateValue,PercentageStrength\n";
    const body = "MeanAttendance,84.2%,High\nMeanStudyHours,10.4h,Medium\nPassPercentage,90%,Excellent\n";
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + header + body);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/ /g, '_')}.${type.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Synchronizing generated records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full px-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-3">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Reports Console</h1>
          <p className="text-slate-500 text-xs">Download aggregated prediction spreadsheets, early-warning warning logs, and system audits.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => handleCreateReport('Intervention List Forecast', 'CSV')}
            disabled={creating}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Export CSV List
          </button>
          <button 
            onClick={() => handleCreateReport('Academic Performance Forecaster', 'PDF')}
            disabled={creating}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-semibold shadow-none flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Compile PDF Dossier
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2 animate-fade-in shadow-none">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-none space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Generated Academic Dossiers</h3>
        
        <div className="space-y-2.5">
          {reports.map((rep) => (
            <div key={rep.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 text-left">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${
                  rep.type === 'PDF' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {rep.type === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{rep.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-400 font-medium">
                    <span className="font-mono">{rep.id}</span>
                    <span>•</span>
                    <span>{rep.recordCount} students forecast</span>
                    <span>•</span>
                    <span>Compiled: {new Date(rep.createdDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600">
                  {rep.status}
                </span>

                <button 
                  onClick={() => downloadReportFile(rep.title, rep.type)}
                  className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded shadow-none hover:text-[#2563EB] hover:border-blue-100 transition-colors"
                  title="Download report archive"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-xs">No reports generated in this workspace session yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
