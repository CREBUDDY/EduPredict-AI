/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Page, DatasetInfo } from '../types';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  List,
  AlertTriangle
} from 'lucide-react';

interface UploadPageProps {
  onNavigate: (page: Page) => void;
  onSetDatasetInfo: (info: DatasetInfo) => void;
}

const SAMPLE_CSV = `name,email,attendance,studyHours,sleepHours,assignmentScore,internalMarks,prevSemesterMarks,extracurriculars,internetUsage,parentalSupport
Aarav Sharma,aarav@university.edu,92,12,7,85,88,82,Yes,Yes,High
Aditi Verma,aditi@university.edu,88,14,8,90,85,91,No,Yes,High
John Doe,john@university.edu,72,5,6,55,58,62,No,No,Low
Emily Smith,emily@university.edu,95,16,7,94,92,95,Yes,Yes,High
Sarah Jenkins,sarah@university.edu,64,4,5,42,38,45,Yes,Yes,Medium
Liam Johnson,liam@university.edu,81,9,8,74,70,72,Yes,Yes,Medium
Olivia Brown,olivia@university.edu,78,11,7,68,72,75,No,Yes,Low
Noah Davis,noah@university.edu,89,13,8,81,78,80,No,Yes,High
Sophia Miller,sophia@university.edu,91,10,7,88,84,86,Yes,Yes,High
James Wilson,james@university.edu,68,6,6,50,52,55,No,Yes,Medium
Kiran Patel,kiran@university.edu,85,10,7,78,80,78,No,Yes,Medium
Riya Sen,riya@university.edu,93,15,8,92,90,92,Yes,Yes,High
Alex Mercer,alex@university.edu,75,8,7,64,66,60,Yes,Yes,Low
Maya Lin,maya@university.edu,87,12,8,82,85,83,No,Yes,High
Carlos Santana,carlos@university.edu,61,3,6,38,40,42,No,No,Medium
Fatima Al-Sayed,fatima@university.edu,96,18,7,96,95,94,Yes,Yes,High
Chloe Dupont,chloe@university.edu,84,10,8,76,74,78,Yes,No,Medium
Yuki Tanaka,yuki@university.edu,94,15,7,90,92,89,No,Yes,High
Lucas Silva,lucas@university.edu,79,8,7,70,68,70,Yes,Yes,Medium
Aisha Bello,aisha@university.edu,70,5,6,58,55,52,No,Yes,Low`;

export default function UploadPage({ onNavigate, onSetDatasetInfo }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [info, setInfo] = useState<DatasetInfo | null>(null);
  const [rawText, setRawText] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setErrorMessage('Unsupported file format. Please upload a standard CSV (.csv) student spreadsheet.');
      return;
    }

    setUploadStatus('parsing');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setRawText(text);
      await uploadDataset(file.name, text);
    };
    reader.onerror = () => {
      setUploadStatus('error');
      setErrorMessage('Error reading the local spreadsheet file.');
    };
    reader.readAsText(file);
  };

  const loadSampleDataset = async () => {
    setUploadStatus('parsing');
    setFileName('student_academic_sample_50.csv');
    setRawText(SAMPLE_CSV);
    await uploadDataset('student_academic_sample_50.csv', SAMPLE_CSV);
  };

  const uploadDataset = async (name: string, dataStr: string) => {
    try {
      const res = await fetch('/api/dataset/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: name, data: dataStr })
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Server ingestion failure');
      }

      setUploadStatus('success');
      setInfo(responseData.info);
      onSetDatasetInfo(responseData.info);
    } catch (err: any) {
      setUploadStatus('error');
      setErrorMessage(err.message || 'Error occurred during parsing dataset.');
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full px-1">
      <div className="border-b border-slate-200/60 pb-3">
        <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">Ingest Student Dataset</h1>
        <p className="text-slate-500 text-xs">Upload student CSV files with structured attendance, study hours, and assessment results.</p>
      </div>

      {/* Main Upload Area */}
      {uploadStatus !== 'success' && (
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-none space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-[#2563EB] bg-blue-50/15' 
                : 'border-slate-200 hover:border-[#2563EB]/50 hover:bg-slate-50/50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileInputChange} 
              accept=".csv" 
              className="hidden" 
            />
            
            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
            
            <h3 className="text-xs font-bold text-slate-800 mb-0.5">Drag and drop your spreadsheet here</h3>
            <p className="text-[11px] text-slate-400 mb-3">or click to browse your storage</p>
            
            <span className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors">
              Browse Files
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-4 gap-4">
            <div className="text-[11px] text-slate-400 max-w-md">
              <span className="font-bold text-slate-600 block mb-0.5">Spreadsheet Template Guidelines:</span>
              Required headers: <code className="bg-slate-50 px-1 py-0.5 rounded font-mono">name</code>, <code className="bg-slate-50 px-1 py-0.5 rounded font-mono">email</code>, <code className="bg-slate-50 px-1 py-0.5 rounded font-mono">attendance</code>, <code className="bg-slate-50 px-1 py-0.5 rounded font-mono">studyHours</code>, <code className="bg-slate-50 px-1 py-0.5 rounded font-mono">assignmentScore</code>, etc.
            </div>

            <button 
              onClick={loadSampleDataset}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0 self-start sm:self-center"
            >
              <RefreshCw className="w-3 h-3" /> Load Sample Dataset
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {uploadStatus === 'parsing' && (
        <div className="bg-white border border-slate-200/60 rounded-xl p-8 text-center shadow-none space-y-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xs font-bold text-slate-800">Ingesting student spreadsheet...</h3>
          <p className="text-[11px] text-slate-400">Verifying academic columns, scanning missing items, and validating schemas.</p>
        </div>
      )}

      {/* Error Message */}
      {uploadStatus === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 space-y-3 flex items-start gap-3 shadow-none">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs">Spreadsheet Validation Failed</h4>
            <p className="text-[11px] text-rose-700 leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => setUploadStatus('idle')}
              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-semibold rounded transition-colors"
            >
              Try Another File
            </button>
          </div>
        </div>
      )}

      {/* Upload Success Report & Dataset Preview */}
      {uploadStatus === 'success' && info && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-none space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{fileName} Ingested Successfully!</h3>
                  <p className="text-[10px] text-slate-400">File successfully validated and mapped into memory workspace.</p>
                </div>
              </div>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="text-xs text-[#2563EB] font-bold hover:underline"
              >
                Upload Different Dataset
              </button>
            </div>

            {/* Ingestion Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Rows</span>
                <p className="text-lg font-bold text-slate-800 font-display">{info.rows}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Features</span>
                <p className="text-lg font-bold text-slate-800 font-display">{info.columns.length}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Missing Fields</span>
                <p className={`text-lg font-bold font-display ${(Object.values(info.missingValues) as number[]).reduce((a, b) => a + b, 0) > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {(Object.values(info.missingValues) as number[]).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Duplicates</span>
                <p className={`text-lg font-bold font-display ${info.duplicates > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {info.duplicates}
                </p>
              </div>
            </div>

            {/* Warnings Alert */}
            {((Object.values(info.missingValues) as number[]).reduce((a, b) => a + b, 0) > 0 || info.duplicates > 0) && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-800 text-xs flex gap-2.5">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5 text-xs">Cleansing Recommended:</span>
                  The student spreadsheet contains missing cells or duplicate records. It is highly advised to complete data cleaning before training model.
                </div>
              </div>
            )}

            {/* List of Columns Identified */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identified Academic Indicators</h4>
              <div className="flex flex-wrap gap-1.5">
                {info.numericalCols.map(col => (
                  <span key={col} className="px-2 py-0.5 bg-blue-50 border border-blue-100/60 text-[#2563EB] text-[10px] font-semibold rounded font-mono">
                    {col} (num)
                  </span>
                ))}
                {info.categoricalCols.map(col => (
                  <span key={col} className="px-2 py-0.5 bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-semibold rounded font-mono">
                    {col} (cat)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => onNavigate('cleaning')}
              className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-none transition-colors"
            >
              Data Cleansing <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
