/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Page, FeatureImportance } from '../types';
import { 
  ArrowRight, 
  Settings, 
  Sparkles, 
  Cpu, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface FeaturesPageProps {
  onNavigate: (page: Page) => void;
}

export default function FeaturesPage({ onNavigate }: FeaturesPageProps) {
  const [importance, setImportance] = useState<FeatureImportance[]>([]);
  const [newFeatures, setNewFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await fetch('/api/dataset/features');
        const json = await res.json();
        setImportance(json.importance);
        setNewFeatures(json.newFeatures);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Computing Feature Coefficients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Feature Engineering Pipeline</h1>
          <p className="text-slate-500 text-sm">Create compound educational indices and evaluate mathematical variable importance coefficients.</p>
        </div>
        <button 
          onClick={() => onNavigate('training')}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-100 flex items-center gap-1.5 transition-colors"
        >
          Train Predictive Models <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Feature Importance Recharts Graph */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Feature Importance Coefficients</h3>
            <p className="text-xs text-slate-400 mb-6">Relative contribution strengths of engineered and raw variables derived by XGBoost.</p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importance} layout="vertical" margin={{ top: 10, right: 15, left: 35, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={130} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Bar dataKey="importance" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engineered Features List */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Engineered Feature Vectors</h3>
            <div className="space-y-4">
              {newFeatures.map((feat, index) => (
                <div key={index} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#2563EB]" /> {feat.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[9px] font-bold font-mono uppercase">
                      {feat.type}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded">
                    Derivation: {feat.derivation}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Purpose: {feat.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pipeline State Synchronized
            </div>
            <p className="text-emerald-700 leading-relaxed">
              Newly engineered indicators added to the analytical vector buffer. Ready for model training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
