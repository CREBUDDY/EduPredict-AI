/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Page } from '../types';
import { 
  User, 
  Settings, 
  Sparkles, 
  Bell, 
  Database, 
  Lock,
  Radio,
  Monitor
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full px-1">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">System Settings</h1>
        <p className="text-slate-500 text-sm">Review profile attributes, database configurations, and AI services status indicators.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left main settings */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm md:col-span-2 space-y-8">
          {/* Guest Profile Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Active Administrator Profile</h3>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                D
              </div>
              <div className="space-y-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#2563EB] text-[9px] font-bold uppercase">Guest Login Mode</span>
                <h4 className="text-xs font-bold text-slate-800">demo@edupredict.org</h4>
                <p className="text-[10px] text-slate-400">Authorized Session Admin • University Registry</p>
              </div>
            </div>
          </div>

          {/* Theme & Display Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Appearance & Preference</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/20">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="font-bold text-slate-800">Visual Theme Selection</h4>
                    <p className="text-[10px] text-slate-400">Minimalist Stripe Light theme preset</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#2563EB] uppercase">Light Mode (Enforced)</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/20">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="font-bold text-slate-800">Risk Threshold Warning Notifications</h4>
                    <p className="text-[10px] text-slate-400">Trigger warnings for students &lt; 75% attendance</p>
                  </div>
                </div>
                <div className="w-8 h-4 bg-blue-500 rounded-full p-0.5 cursor-pointer flex justify-end">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side status sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Services Status</h3>
            <div className="space-y-4 text-xs">
              {/* Database */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">Mock SQLite DB</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ACTIVE
                </div>
              </div>

              {/* Server */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">API Gateway</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OPERATIONAL
                </div>
              </div>

              {/* Gemini */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">Gemini 3.5 Flash</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> CONNECTED
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 relative overflow-hidden">
            <Lock className="w-8 h-8 text-slate-700 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Standard</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              All client prediction calls are proxied securely server-side to hide administrative tokens and intellectual properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
