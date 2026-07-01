/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Page, Student } from '../types';
import { 
  Search, 
  GraduationCap, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Mail, 
  Clock, 
  Calendar,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StudentProfilesPageProps {
  onNavigate: (page: Page) => void;
  selectedStudentId: string | null;
  onClearStudentId: () => void;
}

export default function StudentProfilesPage({ onNavigate, selectedStudentId, onClearStudentId }: StudentProfilesPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/students');
        const list = await res.json();
        setStudents(list);

        // If a student was selected externally (e.g., from Dashboard), open their profile
        if (selectedStudentId) {
          const matched = list.find((s: Student) => s.id === selectedStudentId);
          if (matched) {
            setSelectedStudent(matched);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [selectedStudentId]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setAiReport(null);
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
    setAiReport(null);
    onClearStudentId();
  };

  const handleGenerateAiReport = async () => {
    if (!selectedStudent) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: selectedStudent })
      });
      const data = await res.json();
      if (res.ok) {
        setAiReport(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Synchronizing profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-1">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Student Rosters & Profiles</h1>
        <p className="text-slate-500 text-sm">Query active student academic profiles, review predicted grade forecast summaries, and generate individual intervention logs.</p>
      </div>

      {!selectedStudent ? (
        <div className="space-y-6">
          {/* Search Controls */}
          <div className="flex bg-white border border-slate-100 rounded-2xl p-4 shadow-sm items-center gap-3 w-full max-w-md">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name, ID or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs focus:outline-none bg-transparent"
            />
          </div>

          {/* Student Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div 
                key={student.id} 
                onClick={() => handleSelectStudent(student)}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{student.id}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors">{student.name}</h3>
                    <p className="text-[10px] text-slate-400">{student.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Predicted Score</span>
                    <span className="font-bold text-[#2563EB]">{student.predictedScore}% (Grade {student.predictedGrade})</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    student.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                    student.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {student.riskLevel} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Student Profile view */
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">{selectedStudent.id}</span>
                <h2 className="text-xl font-bold text-slate-900 font-display">{selectedStudent.name}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedStudent.email}</span>
                  <span>•</span>
                  <span>Parental Support Level: <strong>{selectedStudent.parentalSupport}</strong></span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCloseProfile}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Index</span>
              <p className="text-lg font-bold text-slate-800">{selectedStudent.attendance}%</p>
              <span className={`text-[10px] font-semibold ${selectedStudent.attendance >= 80 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {selectedStudent.attendance >= 80 ? 'Excellent' : 'Needs Intervention'}
              </span>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Continuous Assessments</span>
              <p className="text-lg font-bold text-slate-800">{selectedStudent.assignmentScore}%</p>
              <span className="text-[10px] text-slate-400">Project / Assignment Mean</span>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Midterm Internal Marks</span>
              <p className="text-lg font-bold text-slate-800">{selectedStudent.internalMarks}%</p>
              <span className="text-[10px] text-slate-400">Term examinations score</span>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Term Forecast Score</span>
              <p className="text-lg font-bold text-[#2563EB]">{selectedStudent.predictedScore}% (Grade {selectedStudent.predictedGrade})</p>
              <span className={`text-[10px] font-bold ${
                selectedStudent.riskLevel === 'High' ? 'text-rose-600' :
                selectedStudent.riskLevel === 'Medium' ? 'text-amber-500' :
                'text-emerald-500'
              }`}>
                {selectedStudent.riskLevel} Failure Risk
              </span>
            </div>
          </div>

          {/* Specific Behavioral metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Behavioral Attributes</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Self Study Hours</span>
                  <p className="font-bold text-slate-800">{selectedStudent.studyHours} hours/week</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Nightly Rest</span>
                  <p className="font-bold text-slate-800">{selectedStudent.sleepHours} hours/night</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Extracurriculars</span>
                  <p className="font-bold text-slate-800">{selectedStudent.extracurriculars}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Broadband Access</span>
                  <p className="font-bold text-slate-800">{selectedStudent.internetUsage}</p>
                </div>
              </div>
            </div>

            {/* Standard Interventions */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Standard Remedial Interventions</h4>
              <div className="space-y-3 text-xs text-slate-500 leading-relaxed">
                {selectedStudent.attendance < 75 ? (
                  <div className="flex gap-2.5 items-start">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <p><strong>Compulsory Attendance Retainer Plan</strong>: Required to join catch-up tutorial blocks of missing modules.</p>
                  </div>
                ) : (
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p><strong>Continuous Progress Retainer</strong>: Maintain standard self-review schedules of 1.5 hours daily.</p>
                  </div>
                )}

                {selectedStudent.studyHours < 8 && (
                  <div className="flex gap-2.5 items-start">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p><strong>Study Slot Optimization</strong>: Allocate dedicated revised periods in peer workshops.</p>
                  </div>
                )}

                <div className="flex gap-2.5 items-start">
                  <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p><strong>Past Term Benchmark</strong>: Past semester score was <strong>{selectedStudent.prevSemesterMarks}%</strong>. Current forecasts indicate a { (selectedStudent.predictedScore || 0) >= selectedStudent.prevSemesterMarks ? 'positive progression' : 'slight dip needing adjustment' }.</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Advisory */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gemini Diagnostic Advisory Dossier</h4>
              </div>

              {!aiReport && !loadingAi && (
                <button 
                  onClick={handleGenerateAiReport}
                  className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Compile AI Report
                </button>
              )}
            </div>

            {loadingAi && (
              <div className="text-center py-8 space-y-3">
                <div className="w-6 h-6 border-2 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mx-auto"></div>
                <span className="text-xs text-slate-400 block font-sans">Compiling performance drivers and deterrents with Gemini...</span>
              </div>
            )}

            {aiReport && (
              <div className="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-5 rounded-xl max-h-96 overflow-y-auto custom-scrollbar">
                <ReactMarkdown>{aiReport}</ReactMarkdown>
              </div>
            )}

            {!aiReport && !loadingAi && (
              <p className="text-[11px] text-slate-400">
                Trigger Google Gemini server-side LLMs to parse and produce extensive cognitive advisory feedback logs for this student.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
