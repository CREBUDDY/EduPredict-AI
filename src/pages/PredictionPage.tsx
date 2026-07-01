/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, PredictionInput, PredictionResult } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PredictionPageProps {
  onNavigate: (page: Page) => void;
  bestModelName: string;
}

export default function PredictionPage({ onNavigate, bestModelName }: PredictionPageProps) {
  const [input, setInput] = useState<PredictionInput>({
    name: '',
    attendance: 85,
    studyHours: 10,
    sleepHours: 7,
    assignmentScore: 80,
    internalMarks: 75,
    prevSemesterMarks: 78,
    extracurriculars: 'Yes',
    internetUsage: 'Yes',
    parentalSupport: 'Medium'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Gemini state
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.name.trim()) {
      alert('Please provide a student name before calling the ML engine.');
      return;
    }

    setLoading(true);
    setResult(null);
    setAiInsights(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiReport = async () => {
    if (!result) return;
    setLoadingAi(true);
    setAiInsights(null);

    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: {
            name: input.name,
            attendance: input.attendance,
            studyHours: input.studyHours,
            sleepHours: input.sleepHours,
            assignmentScore: input.assignmentScore,
            internalMarks: input.internalMarks,
            prevSemesterMarks: input.prevSemesterMarks,
            extracurriculars: input.extracurriculars,
            internetUsage: input.internetUsage,
            parentalSupport: input.parentalSupport,
            predictedScore: result.score,
            predictedGrade: result.grade,
            riskLevel: result.riskLevel
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiInsights(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const resetForm = () => {
    setInput({
      name: '',
      attendance: 85,
      studyHours: 10,
      sleepHours: 7,
      assignmentScore: 80,
      internalMarks: 75,
      prevSemesterMarks: 78,
      extracurriculars: 'Yes',
      internetUsage: 'Yes',
      parentalSupport: 'Medium'
    });
    setResult(null);
    setAiInsights(null);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto w-full px-1">
      <div className="border-b border-slate-200/60 pb-3">
        <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Student Performance Predictor</h1>
        <p className="text-slate-500 text-xs">Input individual variables to trigger direct inference calls from the active {bestModelName || 'XGBoost'} kernel.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Left Form Panel */}
        <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Features Console</h3>
            <button onClick={resetForm} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Clear Form
            </button>
          </div>

          <form onSubmit={handlePredict} className="space-y-3.5 text-xs">
            {/* Student Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">Student Full Name</label>
              <input 
                type="text" 
                value={input.name}
                onChange={e => setInput({ ...input, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                required
              />
            </div>

            {/* Attendance & Study Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Attendance (0-100%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={input.attendance}
                  onChange={e => setInput({ ...input, attendance: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Study Hours (Wkly)</label>
                <input 
                  type="number" 
                  min="0"
                  max="50"
                  value={input.studyHours}
                  onChange={e => setInput({ ...input, studyHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>
            </div>

            {/* Sleep & Assignment Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Sleep Hours (Nightly)</label>
                <input 
                  type="number" 
                  min="0"
                  max="15"
                  value={input.sleepHours}
                  onChange={e => setInput({ ...input, sleepHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Assignment Score (0-100%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={input.assignmentScore}
                  onChange={e => setInput({ ...input, assignmentScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>
            </div>

            {/* Internal Exams & Past Marks */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Internal Marks (0-100%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={input.internalMarks}
                  onChange={e => setInput({ ...input, internalMarks: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Past Semester Score (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={input.prevSemesterMarks}
                  onChange={e => setInput({ ...input, prevSemesterMarks: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                  required
                />
              </div>
            </div>

            {/* Parental Advisory & Internet access */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Parental Support</label>
                <select 
                  value={input.parentalSupport}
                  onChange={e => setInput({ ...input, parentalSupport: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Extracurriculars</label>
                <select 
                  value={input.extracurriculars}
                  onChange={e => setInput({ ...input, extracurriculars: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md focus:border-[#2563EB] focus:outline-none transition-all text-xs"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-200 text-white font-semibold rounded-md transition-all shadow-none flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Running Inference...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-3.5 h-3.5" /> Predict Academic Outlook
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-5">
          {!result && !loading && (
            <div className="bg-white border border-slate-200/60 rounded-xl p-8 text-center text-slate-400 shadow-none h-full flex flex-col justify-center py-16">
              <BrainCircuit className="w-12 h-12 text-slate-200 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-700 mb-1">Awaiting Inferences</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Fill the student parameters on the left and trigger the forecasting model to display prediction outputs.</p>
            </div>
          )}

          {result && (
            <div className="space-y-5 animate-fade-in">
              {/* Primary Gauge */}
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-none grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div className="text-center md:border-r border-slate-100 py-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Forecast Score</span>
                  <div className="text-4xl font-extrabold font-display text-[#2563EB] my-1">{result.score}%</div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">Grade {result.grade}</span>
                </div>

                <div className="text-center md:border-r border-slate-100 py-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Failure Risk Level</span>
                  <div className={`text-xl font-bold font-display my-1.5 ${
                    result.riskLevel === 'High' ? 'text-rose-600' :
                    result.riskLevel === 'Medium' ? 'text-amber-500' :
                    'text-emerald-500'
                  }`}>
                    {result.riskLevel} Risk
                  </div>
                  <span className={`w-3 h-3 inline-block rounded-full ${
                    result.riskLevel === 'High' ? 'bg-rose-500 animate-ping' :
                    result.riskLevel === 'Medium' ? 'bg-amber-400' :
                    'bg-emerald-500'
                  }`}></span>
                </div>

                <div className="text-center py-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">Confidence Index</span>
                  <div className="text-2xl font-bold font-mono text-slate-700 my-1">{result.confidence}%</div>
                  <span className="text-[9px] text-slate-400 block font-mono">XGBoost Validated</span>
                </div>
              </div>

              {/* Statistical Causes and Recommendations */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Causes */}
                <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Analytical Determinants
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex gap-1.5 items-start leading-relaxed text-[11px]">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-none space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Standard Interventions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-1.5 items-start leading-relaxed text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Insights Panel (Gemini Integration) */}
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-none space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gemini AI Diagnostics Advisory</h3>
                  </div>
                  {!aiInsights && !loadingAi && (
                    <button 
                      onClick={handleGenerateAiReport}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> Generate AI Report
                    </button>
                  )}
                </div>

                {loadingAi && (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-5 h-5 border-2 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mx-auto"></div>
                    <span className="text-[11px] text-slate-400 block">Formulating educational diagnostics using Gemini 2.0 Flash...</span>
                  </div>
                )}

                {aiInsights && (
                  <div className="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-lg custom-scrollbar max-h-80 overflow-y-auto">
                    <ReactMarkdown>{aiInsights}</ReactMarkdown>
                  </div>
                )}

                {!aiInsights && !loadingAi && (
                  <p className="text-[11px] text-slate-400">
                    Generate a premium, customized advisory audit utilizing server-side LLMs to identify specific study adjustments.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
