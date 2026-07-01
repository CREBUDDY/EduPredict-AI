/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Page } from '../types';
import { 
  GraduationCap, 
  ArrowRight, 
  Database, 
  Sparkles, 
  LineChart, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  FileSpreadsheet, 
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onLoginAsGuest: () => void;
  isLoggedIn: boolean;
}

export default function LandingPage({ onNavigate, onLoginAsGuest, isLoggedIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="bg-[#2563EB] text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display text-slate-900">EduPredict <span className="text-[#2563EB]">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => onNavigate('about')} className="hover:text-[#2563EB] transition-colors">About</button>
          <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
          <a href="#workflow" className="hover:text-[#2563EB] transition-colors">Workflow</a>
          <button onClick={() => onNavigate('help')} className="hover:text-[#2563EB] transition-colors">Documentation</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-[#2563EB] transition-colors">Contact</button>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button 
                onClick={onLoginAsGuest}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
              >
                Continue as Guest <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 py-16 lg:py-24 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Educational ML
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 font-display leading-[1.1] mb-6">
            Predict & Improve <br />
            <span className="text-[#2563EB]">Student Outcomes</span> with AI
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Upload student datasets, validate academic indicators, train state-of-the-art predictive ML models, and generate tailored, AI-driven intervention recommendations in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={onLoginAsGuest}
              className="px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 text-base group"
            >
              Continue as Guest 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#features"
              className="px-8 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-all flex items-center justify-center gap-2 text-base"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* AI Illustration Placeholder */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
          <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 p-8 shadow-2xl shadow-slate-100 relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-100 rounded-full blur-3xl opacity-60"></div>
            
            {/* Mock Dashboard Widget */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="font-mono text-xs text-slate-400">student_model_v2.pkl</span>
            </div>

            {/* Simulated Data Flow Graphics */}
            <div className="my-auto py-4 space-y-4 z-10">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">CSV</div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">raw_student_data.csv</h4>
                    <p className="text-[10px] text-slate-400">12 Columns • 50 Students</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">Validated</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">ML Model Training</h4>
                    <p className="text-[10px] text-slate-400">XGBoost Regressor • 94.2% Acc.</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-semibold">Trained</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">Early Intervention Flag</h4>
                    <p className="text-[10px] text-slate-400">Sarah Jenkins • Attendance Deficit</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">Medium Risk</div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 z-10">
              <span className="text-xs text-slate-500">Live Prediction Accuracy</span>
              <span className="text-xs font-bold font-mono text-emerald-600">R² = 0.94</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-1">94.2%</div>
            <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">XGBoost Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-1">100%</div>
            <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">No-Code ML Pipeline</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-1">&lt; 150ms</div>
            <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Inference Latency</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-1">Zero</div>
            <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Setup Cost</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display mb-4">A Complete Predictive SaaS Solution</h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            EduPredict AI delivers industry-grade predictive machine learning models coupled with intelligent AI insights to assist teachers in making optimal curriculum decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">Data Ingestion & Cleaning</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Drag and drop student spreadsheets. Validate types, handle duplicate records, impute missing values with mean or median columns, and filter outliers.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">Multi-Model Training</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Train Linear Regression, Random Forest, and XGBoost models instantly. View actual statistical validation metrics including MAE, MSE, RMSE, and R².
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">Gemini AI Diagnostics</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Generate actionable study advice, risk analysis, and tailored curriculum guidance for at-risk students leveraging server-side LLM diagnostic models.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Timeline Section */}
      <section id="workflow" className="bg-slate-50/50 border-t border-slate-100 px-6 lg:px-16 py-20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display mb-4">SaaS Analytical Workflow</h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Follow the standard machine learning lifestyle right inside your web-browser dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-bold flex items-center justify-center mb-4 z-10 text-sm">1</div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">Dataset Ingestion</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Upload CSV files with headers and review raw records.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-bold flex items-center justify-center mb-4 z-10 text-sm">2</div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">Automated Cleaning</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Execute missing values imputation, remove duplicates, and cap outliers.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-bold flex items-center justify-center mb-4 z-10 text-sm">3</div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">Engine Training</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Train XGBoost models and compare evaluation regression benchmarks.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center mb-4 z-10 text-sm">4</div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">AI Diagnostics</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Review student risk categories and fetch Google Gemini intervention reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight leading-tight mb-4">
              "We improved our retention index by 18% in the first semester using intervention predictions."
            </h3>
            <div className="text-sm text-slate-400 font-medium">Dr. Harrison • Academic Dean, National Tech Institute</div>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={onLoginAsGuest}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] font-bold shadow-lg transition-all flex items-center gap-2"
            >
              Start Predicting <ArrowRight className="w-4 h-4 text-[#0F172A]" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-50 border-t border-slate-100 py-12 px-6 lg:px-16 w-full text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#2563EB] text-white p-1.5 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 font-display">EduPredict AI</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              Deploying enterprise analytics and generative recommendation models directly to education administrators and teachers globally.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h5 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Platform</h5>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-slate-800">Dashboard</button></li>
                <li><button onClick={() => onNavigate('upload')} className="hover:text-slate-800">Upload CSV</button></li>
                <li><button onClick={() => onNavigate('prediction')} className="hover:text-slate-800">Single Prediction</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Resources</h5>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('about')} className="hover:text-slate-800">About Us</button></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-slate-800">Help Center</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-slate-800">Contact</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Legal</h5>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="w-3 h-3" /> Security Audited
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
          <span>&copy; 2026 EduPredict AI. All rights reserved. Built for educators worldwide.</span>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
