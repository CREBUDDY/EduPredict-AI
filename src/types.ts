/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page =
  | 'landing'
  | 'about'
  | 'dashboard'
  | 'upload'
  | 'preview'
  | 'cleaning'
  | 'eda'
  | 'features'
  | 'training'
  | 'comparison'
  | 'prediction'
  | 'profiles'
  | 'reports'
  | 'settings'
  | 'help'
  | 'contact'
  | 'error404';

export interface Student {
  id: string;
  name: string;
  email: string;
  attendance: number;       // percentage (0-100)
  studyHours: number;       // hours per week
  sleepHours: number;       // hours per night
  assignmentScore: number;  // 0-100
  internalMarks: number;    // 0-100
  prevSemesterMarks: number;// 0-100
  extracurriculars: 'Yes' | 'No';
  internetUsage: 'Yes' | 'No';
  parentalSupport: 'High' | 'Medium' | 'Low';
  predictedScore?: number;  // 0-100
  predictedGrade?: string;  // A, B, C, D, F
  riskLevel?: 'Low' | 'Medium' | 'High';
  aiRecommendations?: string;
}

export interface ModelMetrics {
  name: string;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  trainingTimeMs: number;
  accuracy: number; // percentage accuracy helper
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface DatasetInfo {
  rows: number;
  columns: string[];
  missingValues: Record<string, number>;
  duplicates: number;
  numericalCols: string[];
  categoricalCols: string[];
}

export interface PredictionInput {
  name: string;
  attendance: number;
  studyHours: number;
  sleepHours: number;
  assignmentScore: number;
  internalMarks: number;
  prevSemesterMarks: number;
  extracurriculars: 'Yes' | 'No';
  internetUsage: 'Yes' | 'No';
  parentalSupport: 'High' | 'Medium' | 'Low';
}

export interface PredictionResult {
  score: number;
  grade: string;
  category: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'At Risk';
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  reasons: string[];
  recommendations: string[];
}
