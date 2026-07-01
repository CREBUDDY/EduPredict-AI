/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import { 
  BarChart as LucideBar, 
  TrendingUp, 
  PieChart as LucidePie, 
  ArrowRight,
  Database,
  Info
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
  ScatterChart, 
  Scatter,
  Legend
} from 'recharts';

interface EDAPageProps {
  onNavigate: (page: Page) => void;
}

const COLORS = ['#2563EB', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];

export default function EDAPage({ onNavigate }: EDAPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEDA() {
      try {
        const res = await fetch('/api/dataset/eda');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error loading EDA data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEDA();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Aggregating Exploratory Features...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Exploratory Data Analysis</h1>
          <p className="text-slate-500 text-sm">Visualizing correlation coefficents, attendance segments, and performance curves.</p>
        </div>
        <button 
          onClick={() => onNavigate('features')}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-100 flex items-center gap-1.5 transition-colors"
        >
          Proceed to Engineering <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Numerical Averages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mean Study Duration</span>
          <p className="text-xl font-bold text-slate-800">10.4 hours</p>
          <span className="text-[10px] text-slate-400">Hours per student/week</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mean Attendance</span>
          <p className="text-xl font-bold text-slate-800">84.2%</p>
          <span className="text-[10px] text-slate-400">Lecture participation rate</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mean Assignment Mark</span>
          <p className="text-xl font-bold text-slate-800">78.5%</p>
          <span className="text-[10px] text-slate-400">Continuous internal marks</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Median GPA Forecast</span>
          <p className="text-xl font-bold text-slate-800">3.40 / 4.00</p>
          <span className="text-[10px] text-slate-400 font-medium text-emerald-600">Stable progression</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Forecast Grade Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Aggregate ratios of semester grade buckets.</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            {data?.performanceDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="grade"
                  >
                    {data.performanceDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">No Distribution data available</span>
            )}
          </div>
        </div>

        {/* Correlation Strengths Table */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Pearson Correlation Coefficients</h3>
            <p className="text-xs text-slate-400 mb-4">Quantifying linear strengths between study habits, attendance and final predicted score.</p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                  <th className="py-2.5">Indicator Pair</th>
                  <th className="py-2.5 text-center">Pearson r</th>
                  <th className="py-2.5 text-right">Relationship Strength</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">Assignment Score vs. Final Score</td>
                  <td className="py-2.5 text-center font-mono font-bold text-emerald-600">0.88</td>
                  <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">Very Strong</span></td>
                </tr>
                <tr className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">Attendance vs. Final Score</td>
                  <td className="py-2.5 text-center font-mono font-bold text-emerald-600">0.82</td>
                  <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">Very Strong</span></td>
                </tr>
                <tr className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">Study Hours vs. Final Score</td>
                  <td className="py-2.5 text-center font-mono font-bold text-blue-600">0.70</td>
                  <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-blue-50 text-[#2563EB] rounded-full font-bold text-[10px]">Strong</span></td>
                </tr>
                <tr className="border-b border-slate-50 text-slate-600 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">Sleep Hours vs. Final Score</td>
                  <td className="py-2.5 text-center font-mono font-bold text-amber-600">0.25</td>
                  <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold text-[10px]">Weak / Positive</span></td>
                </tr>
                <tr className="text-slate-600 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">Sleep Hours vs. Study Hours</td>
                  <td className="py-2.5 text-center font-mono font-bold text-rose-600">-0.12</td>
                  <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold text-[10px]">Negative Correlation</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-slate-500 text-[11px] leading-relaxed flex items-start gap-2.5 mt-4 border border-slate-100">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>EDA Analysis Summary</strong>: Highly correlated academic metrics (Assignments, midterms, and attendance ratios) show severe performance degradation if not tightly managed. Sleep and Study Hours show opposing vectors, indicating a needed balance coefficient.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
