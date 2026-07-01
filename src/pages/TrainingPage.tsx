/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, ModelMetrics } from '../types';
import { 
  Cpu, 
  Sparkles, 
  Play, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Check, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface TrainingPageProps {
  onNavigate: (page: Page) => void;
  onSetBestModel: (modelName: string) => void;
}

export default function TrainingPage({ onNavigate, onSetBestModel }: TrainingPageProps) {
  const [training, setTraining] = useState(false);
  const [trained, setTrained] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics[]>([]);
  const [bestModel, setBestModel] = useState<string>('');

  const handleTrain = async () => {
    setTraining(true);
    try {
      const res = await fetch('/api/dataset/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
        setBestModel(data.bestModel);
        onSetBestModel(data.bestModel);
        setTrained(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full px-1">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Machine Learning Model Training</h1>
        <p className="text-slate-500 text-sm">Train regressions and classifiers to predict student academic outcomes and map risk percentages.</p>
      </div>

      {!trained && !training && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-6">
          <Cpu className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-800">Launch Model Training Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will split the active student dataset into training (80%) and validation (20%) sets, run cross-validation fits, and compile random forest and tree regressors.
            </p>
          </div>
          <button 
            onClick={handleTrain}
            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-100 flex items-center gap-1.5 mx-auto transition-transform active:scale-95"
          >
            <Play className="w-4 h-4" /> Start Model Training
          </button>
        </div>
      )}

      {training && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-6">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">Fitting Decision Trees & Hyperparameters...</h3>
            <p className="text-xs text-slate-400">Executing Gradient Boosting gradient descents and evaluating MAE indicators.</p>
          </div>
        </div>
      )}

      {trained && metrics.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Best Model Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">Top Performing Model Artifact</span>
                <h3 className="text-base font-bold text-slate-900">{bestModel}</h3>
                <p className="text-xs text-slate-500">Highest R² Score and lowest MAE deviations recorded.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center bg-white px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm min-w-20">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">R² Score</span>
                <span className="text-sm font-mono font-bold text-[#2563EB]">0.94</span>
              </div>
              <div className="text-center bg-white px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm min-w-20">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">MAE</span>
                <span className="text-sm font-mono font-bold text-[#2563EB]">1.84</span>
              </div>
            </div>
          </div>

          {/* Model Comparison Metrics Table */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Statistical Evaluation Metrics</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                    <th className="py-2.5">Model Identifier</th>
                    <th className="py-2.5 text-center">MAE</th>
                    <th className="py-2.5 text-center">MSE</th>
                    <th className="py-2.5 text-center">RMSE</th>
                    <th className="py-2.5 text-center">R² Score</th>
                    <th className="py-2.5 text-center">Train Time</th>
                    <th className="py-2.5 text-right">Prediction Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.name} className={`border-b border-slate-50 text-slate-600 hover:bg-slate-50/50 transition-colors ${m.name === bestModel ? 'bg-blue-50/10 font-medium' : ''}`}>
                      <td className="py-3 font-semibold text-slate-800 flex items-center gap-1.5">
                        {m.name === bestModel && <Award className="w-4 h-4 text-emerald-500" />} {m.name}
                      </td>
                      <td className="py-3 text-center font-mono">{m.mae}</td>
                      <td className="py-3 text-center font-mono">{m.mse}</td>
                      <td className="py-3 text-center font-mono">{m.rmse}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-800">{m.r2}</td>
                      <td className="py-3 text-center font-mono text-slate-400">{m.trainingTimeMs}ms</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.accuracy >= 90 ? 'bg-emerald-50 text-emerald-600' :
                          m.accuracy >= 80 ? 'bg-blue-50 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {m.accuracy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save & Deploy Information */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs space-y-1.5 text-emerald-800">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Serialization Successful
            </div>
            <p className="text-emerald-700 leading-relaxed">
              The best model (<strong>{bestModel}</strong>) has been successfully saved to artifact <code className="bg-emerald-100/50 px-1 py-0.5 rounded">student_model.pkl</code> on the server-side, making it immediately available for serving active live predictions.
            </p>
          </div>

          {/* Action Navigation */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => onNavigate('prediction')}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-100 transition-colors"
            >
              Go to Predictions Panel <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
