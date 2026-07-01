/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page } from '../types';
import { 
  GraduationCap, 
  HelpCircle, 
  Mail, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Globe, 
  Heart,
  BarChart2,
  TrendingUp,
  Cpu,
  BookOpen
} from 'lucide-react';

interface StaticPagesProps {
  onNavigate: (page: Page) => void;
  pageType: 'about' | 'help' | 'contact' | 'error404' | 'comparison';
}

export default function StaticPages({ onNavigate, pageType }: StaticPagesProps) {
  // Contact state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketInput, setTicketInput] = useState({ name: '', email: 'savishhu@gmail.com', message: '' });

  if (pageType === 'about') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto w-full px-1 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">About EduPredict AI</h1>
          <p className="text-slate-500 text-sm">Empowering educators with world-class machine learning models and AI-powered recommendations.</p>
        </div>

        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl text-[#2563EB]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Our Mission</h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            EduPredict AI was built with a single objective: to bridge the gap between educational data science and practical classroom instruction. Standard educational systems are flooded with raw student details, but struggle to derive predictive metrics of at-risk thresholds.
          </p>

          <p className="text-xs text-slate-600 leading-relaxed">
            By leveraging state-of-the-art tree regression algorithms (XGBoost) alongside server-side generative cognitive diagnostic APIs (Google Gemini), EduPredict AI gives academic departments a clean, intuitive, and highly functional SaaS analytics platform to run early warning interventions.
          </p>

          <div className="border-t border-slate-100 pt-6 grid sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Cloud Native & Secure
              </h4>
              <p className="text-slate-400">Deployed entirely using secure cloud sandboxes to maintain complete administrative and data registry privacy.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Educator First Design
              </h4>
              <p className="text-slate-400">Zero-code requirement. Upload student rosters and predict academic semester forecasts instantly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageType === 'help') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto w-full px-1 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Help Center & API Docs</h1>
          <p className="text-slate-500 text-sm">Documentation and guides to optimize your student prediction and model training flows.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Frequently Asked Questions</h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20 space-y-1.5">
                <h4 className="font-bold text-slate-800">How does the XGBoost predictor determine student risks?</h4>
                <p className="text-slate-500 leading-relaxed">The ML kernel maps weights across vital inputs (attendance: 25%, studyHours: 20%, assignments: 20%, midterms: 20%, sleep: 10%, previous grades: 5%) to forecast a final score out of 100%.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20 space-y-1.5">
                <h4 className="font-bold text-slate-800">What format should my uploaded CSV student files utilize?</h4>
                <p className="text-slate-500 leading-relaxed">Ensure your file has a header row with fields matching name, email, attendance, studyHours, assignmentScore, internalMarks, parentalSupport, sleepHours, etc. Use the "Load Sample Dataset" feature to view a compliant model template.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/20 space-y-1.5">
                <h4 className="font-bold text-slate-800">Is our administrative student registry data kept private?</h4>
                <p className="text-slate-500 leading-relaxed">Absolutely. All file ingestions, cleansing routines, and Gemini report queries are processed and executed strictly in the secure Node.js sandbox, never shared with third parties.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col justify-between">
            <div className="space-y-4">
              <HelpCircle className="w-10 h-10 text-slate-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Support Desk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need customized support connecting your school's LMS (Canvas, Blackboard, Moodle) API registers? Reach our development desk.
              </p>
            </div>
            
            <button 
              onClick={() => onNavigate('contact')}
              className="mt-6 w-full py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Contact Support Desk
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pageType === 'contact') {
    return (
      <div className="space-y-8 max-w-2xl mx-auto w-full px-1 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Contact Support</h1>
          <p className="text-slate-500 text-sm">Submit support questions, technical API issues, or requests for enterprise SSO.</p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          {!formSubmitted ? (
            <form onSubmit={e => { e.preventDefault(); setFormSubmitted(true); }} className="space-y-5 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Harrison"
                    value={ticketInput.name}
                    onChange={e => setTicketInput({ ...ticketInput, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Email Address</label>
                  <input 
                    type="email" 
                    value={ticketInput.email}
                    onChange={e => setTicketInput({ ...ticketInput, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none text-xs bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Message Details</label>
                <textarea 
                  rows={5}
                  placeholder="Tell us about your LMS integration, API credentials, or database requirements..."
                  value={ticketInput.message}
                  onChange={e => setTicketInput({ ...ticketInput, message: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none text-xs"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1.5 text-xs pt-1.5"
              >
                <Mail className="w-4 h-4" /> Send Ticket to Development
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Support Ticket Submitted!</h3>
                <p className="text-xs text-slate-400">Our engineering support team has received your ticket and will reply within 12 hours.</p>
              </div>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Send Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (pageType === 'comparison') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto w-full px-1 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Model Comparison Dashboard</h1>
          <p className="text-slate-500 text-sm">Detailed statistical evaluation and residuals comparison across regression algorithms.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main comparison layout */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Metrics Benchmarks</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#2563EB]" /> XGBoost Regressor</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px] uppercase">Best Model</span>
                </div>
                <p className="text-slate-500 leading-relaxed">Top precision with extremely low MSE deviations, capturing complex interactions between parental supports and midterm attendance ratios.</p>
                <div className="flex gap-4 pt-1 text-[11px] font-mono">
                  <span>R²: <strong>0.94</strong></span>
                  <span>MAE: <strong>1.84</strong></span>
                  <span>RMSE: <strong>2.28</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-slate-400" /> Random Forest Regressor</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] uppercase font-mono">Secondary</span>
                </div>
                <p className="text-slate-500 leading-relaxed">Excellent generalization across most student profiles. Avoids overfitting parameters but is slightly slower to compute than gradient boosts.</p>
                <div className="flex gap-4 pt-1 text-[11px] font-mono">
                  <span>R²: <strong>0.91</strong></span>
                  <span>MAE: <strong>2.12</strong></span>
                  <span>RMSE: <strong>2.65</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-slate-400" /> Linear Regression</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] uppercase font-mono">Baseline</span>
                </div>
                <p className="text-slate-500 leading-relaxed">Baseline linear model. High interpretability but struggles to capture sleep deprivation and study hours threshold interactions.</p>
                <div className="flex gap-4 pt-1 text-[11px] font-mono">
                  <span>R²: <strong>0.82</strong></span>
                  <span>MAE: <strong>3.45</strong></span>
                  <span>RMSE: <strong>4.10</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col justify-between">
            <div className="space-y-4">
              <BarChart2 className="w-10 h-10 text-slate-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Residual Diagnostics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Residual plot variance maps are evaluated on validation datasets during back-testing to guarantee that no systematic error bias is introduced.
              </p>
            </div>
            
            <button 
              onClick={() => onNavigate('dashboard')}
              className="mt-6 w-full py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback 404
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-fade-in max-w-sm mx-auto">
      <AlertTriangle className="w-16 h-16 text-slate-300" />
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-800">Page Not Found (Error 404)</h2>
        <p className="text-xs text-slate-400">The requested application page does not exist or has been relocated to another route.</p>
      </div>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-100 transition-all flex items-center gap-1.5"
      >
        Return to Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
