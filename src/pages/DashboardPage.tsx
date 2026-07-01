/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Page, Student } from '../types';
import { 
  Users, 
  Percent, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  UploadCloud, 
  FileText, 
  BrainCircuit, 
  UserPlus, 
  ArrowRight,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onSelectStudentProfile: (studentId: string) => void;
}

const COLORS = ['#2563EB', '#38BDF8', '#34D399', '#FBBF24', '#F87171'];

export default function DashboardPage({ onNavigate, onSelectStudentProfile }: DashboardPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [edaData, setEdaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [studentsRes, predictionsRes, uploadsRes, edaRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/predictions'),
          fetch('/api/uploads'),
          fetch('/api/dataset/eda')
        ]);

        const studentsData = await studentsRes.json();
        const predictionsData = await predictionsRes.json();
        const uploadsData = await uploadsRes.json();
        const edaDataResponse = await edaRes.json();

        setStudents(studentsData);
        setRecentPredictions(predictionsData);
        setRecentUploads(uploadsData);
        setEdaData(edaDataResponse);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Compute stats
  const totalStudents = students.length;
  
  const avgAttendance = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents) 
    : 0;

  const avgScore = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.predictedScore || 0), 0) / totalStudents) 
    : 0;

  const avgAssignments = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.assignmentScore, 0) / totalStudents) 
    : 0;

  const atRiskCount = students.filter(s => s.riskLevel === 'High').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'Medium').length;

  const passPercentage = totalStudents > 0
    ? Math.round((students.filter(s => (s.predictedScore || 0) >= 60).length / totalStudents) * 100)
    : 0;

  async function handleGenerateReport() {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'EduPredict System Forecaster Summary',
          count: totalStudents,
          type: 'PDF'
        })
      });
      if (res.ok) {
        setReportSuccess('System report successfully compiled! Visit the Reports page to review/download.');
        setTimeout(() => setReportSuccess(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Loading EduPredict Analytics Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-1">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-xs">System forecasts, risk registers, and exploratory student data analyses.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onNavigate('prediction')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" /> Predict Student
          </button>
          <button 
            onClick={() => onNavigate('upload')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#2563EB]" /> Ingest Dataset
          </button>
          <button 
            onClick={handleGenerateReport}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Report
          </button>
        </div>
      </div>

      {reportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{reportSuccess}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Total Students */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
          </div>
          <div className="text-xl font-bold font-display text-slate-900">{totalStudents}</div>
          <div className="text-[9px] text-slate-400">Active records loaded</div>
        </div>

        {/* Average Marks */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Marks</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-display text-slate-900">{avgScore}%</div>
          <div className="text-[9px] text-emerald-600 font-medium">Predicted Final Term</div>
        </div>

        {/* Attendance */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
            <Percent className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-display text-slate-900">{avgAttendance}%</div>
          <div className="text-[9px] text-slate-400">Average lecture presence</div>
        </div>

        {/* Assignments */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assignments</span>
            <Clock className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <div className="text-xl font-bold font-display text-slate-900">{avgAssignments}%</div>
          <div className="text-[9px] text-slate-400">Continuous assessments</div>
        </div>

        {/* Pass Percentage */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pass Rate</span>
            <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-xl font-bold font-display text-slate-900">{passPercentage}%</div>
          <div className="text-[9px] text-slate-400">Passing grade forecast</div>
        </div>

        {/* At Risk Students */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">At Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold font-display text-rose-600">{atRiskCount}</div>
          <div className="text-[9px] text-rose-500 font-semibold">{mediumRiskCount} Medium Warning</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Performance Distribution */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Performance Distribution</h3>
            <p className="text-[11px] text-slate-400 mb-4">Total calculated forecasts categorised by letter grades.</p>
          </div>
          
          <div className="h-60 w-full flex items-center justify-center">
            {edaData?.performanceDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={edaData.performanceDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="grade" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)' }} 
                    labelClassName="font-bold text-slate-800 text-xs" 
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[2, 2, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">No Distribution Loaded</span>
            )}
          </div>
        </div>

        {/* Attendance and At-Risk Analytics */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Attendance Distribution</h3>
            <p className="text-[11px] text-slate-400 mb-4">Grouping records across vital physical lecture presence thresholds.</p>
          </div>

          <div className="h-60 w-full">
            {edaData?.attendanceDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={edaData.attendanceDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)' }} 
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#38BDF8" radius={[0, 2, 2, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">No Attendance Loaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Second Analytics Row (Scatter Plot Correlation) */}
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Study Hours vs. Predicted Score</h3>
            <p className="text-[11px] text-slate-400 mb-4">Analyzing study dedication against forecasted semester ending grades.</p>
          </div>

          <div className="h-60 w-full">
            {edaData?.studyVsScore ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" dataKey="studyHours" name="Study Hours" unit="h/wk" stroke="#94A3B8" fontSize={11} />
                  <YAxis type="number" dataKey="score" name="Predicted Score" unit="%" stroke="#94A3B8" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Scatter name="Students" data={edaData.studyVsScore} fill="#2563EB" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">Scatter Plot Loading...</span>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Quick Operations</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('prediction')}
                className="w-full p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-100 text-[#2563EB] flex items-center justify-center">
                    <BrainCircuit className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">ML Forecast Tool</h4>
                    <p className="text-[9px] text-slate-400">Perform individual forecast</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('upload')}
                className="w-full p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-sky-100 text-sky-600 flex items-center justify-center">
                    <UploadCloud className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Dataset Manager</h4>
                    <p className="text-[9px] text-slate-400">Ingest CSV Spreadsheet</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('reports')}
                className="w-full p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Export Manager</h4>
                    <p className="text-[9px] text-slate-400">Compile academic dossiers</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 text-center">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Kernel Platform v3.5</span>
          </div>
        </div>
      </div>

      {/* Grid of Tables (Recent Predictions & Uploads) */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Predictions Log */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Live Predictions Log</h3>
              <p className="text-[10px] text-slate-400">Real-time model inferences generated by active users.</p>
            </div>
            <button onClick={() => onNavigate('prediction')} className="text-xs text-[#2563EB] font-bold hover:underline">New Prediction</button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-2">Student Name</th>
                  <th className="py-2 text-center">Predicted Marks</th>
                  <th className="py-2 text-center">Grade</th>
                  <th className="py-2 text-center">Risk Level</th>
                  <th className="py-2 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.length > 0 ? (
                  recentPredictions.slice(0, 5).map((pred, idx) => (
                    <tr key={pred.id || idx} className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50 transition-colors text-[11px]">
                      <td className="py-2.5 font-semibold text-slate-800">{pred.studentName}</td>
                      <td className="py-2.5 text-center font-bold text-blue-600">{pred.predictedScore}%</td>
                      <td className="py-2.5 text-center font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{pred.predictedGrade}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          pred.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                          pred.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {pred.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold">{pred.attendance}%</td>
                    </tr>
                  ))
                ) : (
                  // Display seed fallback
                  students.slice(0, 5).map((st) => (
                    <tr key={st.id} className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50 transition-colors text-[11px]">
                      <td className="py-2.5 font-semibold text-slate-800">{st.name}</td>
                      <td className="py-2.5 text-center font-bold text-blue-600">{st.predictedScore}%</td>
                      <td className="py-2.5 text-center font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{st.predictedGrade}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          st.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                          st.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {st.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold">{st.attendance}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Dataset Uploads */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Ingested Datasets</h3>
              <p className="text-[10px] text-slate-400">Spreadsheets parsed and aligned for predictive model training.</p>
            </div>
            <button onClick={() => onNavigate('upload')} className="text-xs text-[#2563EB] font-bold hover:underline">Upload CSV</button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-2">File Name</th>
                  <th className="py-2 text-center">Upload Timestamp</th>
                  <th className="py-2 text-center">Row Count</th>
                  <th className="py-2 text-right">Ingestion Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((u, idx) => (
                  <tr key={u.id || idx} className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50 transition-colors text-[11px]">
                    <td className="py-2.5 font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> {u.fileName}
                    </td>
                    <td className="py-2.5 text-center text-slate-400">{new Date(u.uploadDate).toLocaleDateString()}</td>
                    <td className="py-2.5 text-center font-semibold">{u.recordCount} records</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
