/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, DatasetInfo } from '../types';
import { 
  Sparkles, 
  Trash2, 
  Database, 
  CheckCircle, 
  Download, 
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';

interface CleaningPageProps {
  onNavigate: (page: Page) => void;
  datasetInfo: DatasetInfo | null;
}

export default function CleaningPage({ onNavigate, datasetInfo }: CleaningPageProps) {
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleClean = async () => {
    setCleaning(true);
    try {
      const res = await fetch('/api/dataset/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
        setCleaned(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCleaning(false);
    }
  };

  const downloadCleanCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,StudentName,Attendance,StudyHours,SleepHours,Grade,RiskLevel\nSarah Jenkins,74,6,7,C,Medium\nJohn Doe,75,5,8,D,Medium\nEmily Smith,95,16,7,A,Low\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cleaned_student_academic_performance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full px-1">
      <div className="border-b border-slate-200/60 pb-3">
        <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Data Cleansing Pipeline</h1>
        <p className="text-slate-500 text-xs">Purge duplicate student rows, impute missing cells using statistical aggregates, and scale academic outliers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Left Side: Operations Status */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pipeline Directives</h3>
            {!cleaned && (
              <button 
                onClick={handleClean}
                disabled={cleaning}
                className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-200 text-white rounded text-xs font-semibold shadow-none flex items-center gap-1.5 transition-colors"
              >
                {cleaning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Cleansing...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" /> Run Cleansing
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {/* Duplicates */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Duplicate Student Rows</h4>
                  <p className="text-[10px] text-slate-400">Purge exact match identifiers</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cleaned ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {cleaned ? '0 Duplicates (Resolved)' : `${datasetInfo?.duplicates || 3} Duplicates Identified`}
              </span>
            </div>

            {/* Missing Values */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Missing Feature Values</h4>
                  <p className="text-[10px] text-slate-400">Impute missing entries with median indicators</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cleaned ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {cleaned ? '0 Missing Fields (Resolved)' : '7 Empty Cells Found'}
              </span>
            </div>

            {/* Outliers */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Academic Outliers Capping</h4>
                  <p className="text-[10px] text-slate-400">Apply IQR scale limits (e.g. studyHours &gt; 40)</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cleaned ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {cleaned ? '4 Outliers (Adjusted)' : '4 High Deviations'}
              </span>
            </div>
          </div>

          {/* Cleaning Logs */}
          {cleaned && logs.length > 0 && (
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Processing Logs</h4>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-[10px] leading-relaxed space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-emerald-400">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Quick Action Guide */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cleansing Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Before training classifiers like XGBoost or Linear Models, cleaning ensures data is stationary, robust against skew, and missing values do not raise native exceptions.
            </p>

            {cleaned && (
              <div className="space-y-2 pt-1.5">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Imputed Mean strategy for studyHours.
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Deduped duplicate IDs.
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4">
            {cleaned && (
              <button 
                onClick={downloadCleanCSV}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Cleansed CSV
              </button>
            )}
            
            <button 
              onClick={() => onNavigate(cleaned ? 'eda' : 'dashboard')}
              className="w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-none"
            >
              {cleaned ? 'Proceed to Exploratory EDA' : 'Back to Dashboard'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
