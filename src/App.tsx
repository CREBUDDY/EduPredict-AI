/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, DatasetInfo } from './types';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import CleaningPage from './pages/CleaningPage';
import EDAPage from './pages/EDAPage';
import FeaturesPage from './pages/FeaturesPage';
import TrainingPage from './pages/TrainingPage';
import PredictionPage from './pages/PredictionPage';
import StudentProfilesPage from './pages/StudentProfilesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import StaticPages from './pages/StaticPages';

import { 
  GraduationCap, 
  LayoutDashboard, 
  UploadCloud, 
  List, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  BrainCircuit, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  User,
  Activity,
  Award
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [bestModel, setBestModel] = useState<string>('XGBoost Regressor');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Clean Navigation helper
  const navigate = (target: Page) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile navigation helper
  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    navigate('profiles');
  };

  // Landing Page needs standard display
  if (page === 'landing') {
    return (
      <LandingPage 
        onNavigate={navigate} 
        onLoginAsGuest={() => navigate('dashboard')} 
        isLoggedIn={false} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Side Navigation panel */}
      <aside className="w-full md:w-60 bg-[#0F172A] text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 md:sticky md:top-0 md:h-screen flex-shrink-0 z-20">
        <div className="space-y-5">
          {/* Logo Brand area */}
          <div className="flex items-center gap-2.5 px-1 py-1 border-b border-slate-800/80 pb-3">
            <div className="bg-[#2563EB] text-white p-1.5 rounded-lg shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-tight text-white font-display">EduPredict AI</h1>
              <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Academic Staff</span>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="space-y-5 text-xs">
            {/* Group 1: CORE PORTALS */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold px-2 block mb-1">Core Portals</span>
              <button 
                onClick={() => navigate('dashboard')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'dashboard' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </button>
              <button 
                onClick={() => navigate('profiles')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'profiles' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Roster Profiles
              </button>
            </div>

            {/* Group 2: INGESTION PIPELINE */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold px-2 block mb-1">Ingestion Pipeline</span>
              <button 
                onClick={() => navigate('upload')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'upload' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" /> Ingest Dataset
              </button>
              <button 
                onClick={() => navigate('cleaning')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'cleaning' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Data Cleansing
              </button>
              <button 
                onClick={() => navigate('eda')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'eda' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Exploratory EDA
              </button>
              <button 
                onClick={() => navigate('features')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'features' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Feature Engineering
              </button>
            </div>

            {/* Group 3: PREDICTIVE MODELS */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold px-2 block mb-1">Predictive Models</span>
              <button 
                onClick={() => navigate('training')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'training' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Model Training
              </button>
              <button 
                onClick={() => navigate('comparison')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'comparison' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Model Comparison
              </button>
              <button 
                onClick={() => navigate('prediction')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'prediction' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" /> Predictions Console
              </button>
            </div>

            {/* Group 4: DOCUMENTATION & SYSTEM */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold px-2 block mb-1">System & Docs</span>
              <button 
                onClick={() => navigate('reports')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'reports' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Reports Center
              </button>
              <button 
                onClick={() => navigate('settings')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'settings' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button 
                onClick={() => navigate('help')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-left font-medium ${
                  page === 'help' ? 'bg-[#2563EB]/10 text-blue-400' : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Help Center
              </button>
            </div>
          </nav>
        </div>

        {/* Footer Area with Guest logout */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700/80 text-[10px]">
              G
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider leading-none">Registry</span>
              <button onClick={() => navigate('settings')} className="text-white hover:underline block text-[10px] truncate w-24 text-left font-medium mt-0.5">
                demo@edupredict.org
              </button>
            </div>
          </div>
          <button 
            onClick={() => navigate('landing')} 
            className="p-1.5 hover:bg-slate-800 hover:text-white text-slate-400 rounded-md transition-all"
            title="Log Out Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Panel */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-10 shadow-none">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-800 capitalize">
              {page === 'dashboard' ? 'Overview Dashboard' : `${page} Panel`}
            </h1>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-wider">
              System Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
              Workspace: <strong className="text-slate-600 font-bold">EduPredict Engine</strong>
            </div>
            <button 
              onClick={() => navigate('prediction')}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
            >
              Quick Predict
            </button>
          </div>
        </header>

        {/* Display Screens */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          {page === 'dashboard' && <DashboardPage onNavigate={navigate} onSelectStudentProfile={handleSelectStudent} />}
          {page === 'upload' && <UploadPage onNavigate={navigate} onSetDatasetInfo={setDatasetInfo} />}
          {page === 'cleaning' && <CleaningPage onNavigate={navigate} datasetInfo={datasetInfo} />}
          {page === 'eda' && <EDAPage onNavigate={navigate} />}
          {page === 'features' && <FeaturesPage onNavigate={navigate} />}
          {page === 'training' && <TrainingPage onNavigate={navigate} onSetBestModel={setBestModel} />}
          {page === 'prediction' && <PredictionPage onNavigate={navigate} bestModelName={bestModel} />}
          {page === 'profiles' && (
            <StudentProfilesPage 
              onNavigate={navigate} 
              selectedStudentId={selectedStudentId} 
              onClearStudentId={() => setSelectedStudentId(null)}
            />
          )}
          {page === 'reports' && <ReportsPage onNavigate={navigate} />}
          {page === 'settings' && <SettingsPage onNavigate={navigate} />}
          
          {page === 'about' && <StaticPages onNavigate={navigate} pageType="about" />}
          {page === 'help' && <StaticPages onNavigate={navigate} pageType="help" />}
          {page === 'contact' && <StaticPages onNavigate={navigate} pageType="contact" />}
          {page === 'comparison' && <StaticPages onNavigate={navigate} pageType="comparison" />}
          
          {/* Default boundary check */}
          {![
            'dashboard', 'upload', 'cleaning', 'eda', 'features', 
            'training', 'prediction', 'profiles', 'reports', 'settings',
            'about', 'help', 'contact', 'comparison'
          ].includes(page) && <StaticPages onNavigate={navigate} pageType="error404" />}
        </div>
      </main>
    </div>
  );
}
