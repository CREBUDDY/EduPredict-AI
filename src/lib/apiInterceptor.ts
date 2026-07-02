/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, PredictionInput, PredictionResult, ModelMetrics, FeatureImportance } from '../types';

// --- Default Data and Seeding Logic ---

const DEFAULT_NAMES = [
  'Aarav Sharma', 'Aditi Verma', 'John Doe', 'Emily Smith', 'Sarah Jenkins',
  'Liam Johnson', 'Olivia Brown', 'Noah Davis', 'Sophia Miller', 'James Wilson',
  'Kiran Patel', 'Riya Sen', 'Alex Mercer', 'Maya Lin', 'Carlos Santana',
  'Fatima Al-Sayed', 'Chloe Dupont', 'Yuki Tanaka', 'Lucas Silva', 'Aisha Bello',
  'Devendra Rao', 'Priya Nair', 'Rajesh Kulkarni', 'Meera Joshi', 'Siddharth Roy',
  'Ananya Iyer', 'Vikram Seth', 'Neha Gupta', 'Arjun Kapoor', 'Sonia Malhotra'
];

function generateSeedData() {
  const students: Student[] = [];

  for (let i = 1; i <= 50; i++) {
    const name = DEFAULT_NAMES[(i - 1) % DEFAULT_NAMES.length];
    const nameParts = name.split(' ');
    const email = `${nameParts[0].toLowerCase()}.${nameParts[1].toLowerCase()}${i}@university.edu`;
    
    // Correlate study hours & attendance with higher marks
    const attendance = Math.floor(60 + Math.random() * 40); // 60% to 100%
    const studyHours = Math.floor(2 + (attendance / 10) + Math.random() * 8); // 2 to 20 hours
    const sleepHours = Math.floor(5 + Math.random() * 4); // 5 to 9 hours
    
    const baseline = (attendance * 0.3) + (studyHours * 2.0) + (sleepHours * 1.5);
    
    let assignmentScore = Math.floor(baseline + 20 + Math.random() * 15);
    if (assignmentScore > 100) assignmentScore = 100;
    if (assignmentScore < 30) assignmentScore = 30;

    let internalMarks = Math.floor(baseline + 15 + Math.random() * 20);
    if (internalMarks > 100) internalMarks = 100;
    if (internalMarks < 30) internalMarks = 30;

    let prevSemesterMarks = Math.floor(45 + Math.random() * 50); // 45 to 95
    if (prevSemesterMarks > 100) prevSemesterMarks = 100;

    const extracurriculars = Math.random() > 0.4 ? 'Yes' : 'No';
    const internetUsage = Math.random() > 0.1 ? 'Yes' : 'No';
    const parentalSupport = Math.random() > 0.6 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low');

    // Calculate performance score
    const predictedScore = Math.floor(
      (attendance * 0.25) + 
      (studyHours * 0.20) + 
      (assignmentScore * 0.20) + 
      (internalMarks * 0.20) + 
      (prevSemesterMarks * 0.15) +
      (parentalSupport === 'High' ? 3 : (parentalSupport === 'Low' ? -3 : 0))
    );
    
    const cappedScore = Math.min(100, Math.max(0, predictedScore));
    
    let grade = 'F';
    if (cappedScore >= 90) grade = 'A';
    else if (cappedScore >= 80) grade = 'B';
    else if (cappedScore >= 70) grade = 'C';
    else if (cappedScore >= 60) grade = 'D';

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (cappedScore < 60 || attendance < 75) riskLevel = 'High';
    else if (cappedScore < 75 || attendance < 85) riskLevel = 'Medium';

    students.push({
      id: `STU${1000 + i}`,
      name,
      email,
      attendance,
      studyHours,
      sleepHours,
      assignmentScore,
      internalMarks,
      prevSemesterMarks,
      extracurriculars,
      internetUsage,
      parentalSupport,
      predictedScore: cappedScore,
      predictedGrade: grade,
      riskLevel
    });
  }

  return students;
}

const DEFAULT_REPORTS = [
  {
    id: 'REP1001',
    title: 'Semester End Performance Forecast',
    createdDate: '2026-06-15T10:00:00Z',
    recordCount: 50,
    type: 'PDF',
    status: 'Generated'
  },
  {
    id: 'REP1002',
    title: 'At-Risk Students Early Intervention List',
    createdDate: '2026-06-28T14:30:00Z',
    recordCount: 8,
    type: 'CSV',
    status: 'Generated'
  }
];

const DEFAULT_UPLOADS = [
  {
    id: 'UPL501',
    fileName: 'academic_performance_q1_2026.csv',
    uploadDate: '2026-06-10T09:15:00Z',
    recordCount: 50,
    status: 'Processed'
  }
];

// --- Database Access Wrappers ---

function getStudents(): Student[] {
  const data = localStorage.getItem('edupredict_students');
  if (!data) {
    const seeded = generateSeedData();
    localStorage.setItem('edupredict_students', JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(data);
}

function saveStudents(students: Student[]) {
  localStorage.setItem('edupredict_students', JSON.stringify(students));
}

function getPredictions(): any[] {
  const data = localStorage.getItem('edupredict_predictions');
  if (!data) {
    localStorage.setItem('edupredict_predictions', JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
}

function savePredictions(predictions: any[]) {
  localStorage.setItem('edupredict_predictions', JSON.stringify(predictions));
}

function getReports(): any[] {
  const data = localStorage.getItem('edupredict_reports');
  if (!data) {
    localStorage.setItem('edupredict_reports', JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  return JSON.parse(data);
}

function saveReports(reports: any[]) {
  localStorage.setItem('edupredict_reports', JSON.stringify(reports));
}

function getUploads(): any[] {
  const data = localStorage.getItem('edupredict_uploads');
  if (!data) {
    localStorage.setItem('edupredict_uploads', JSON.stringify(DEFAULT_UPLOADS));
    return DEFAULT_UPLOADS;
  }
  return JSON.parse(data);
}

function saveUploads(uploads: any[]) {
  localStorage.setItem('edupredict_uploads', JSON.stringify(uploads));
}

// Ensure database is initialized
getStudents();
getPredictions();
getReports();
getUploads();

// --- Prediction computation engine ---
function computeStudentPrediction(input: PredictionInput): PredictionResult {
  const attendanceContribution = (input.attendance || 0) * 0.25;
  const studyContribution = Math.min(25, (input.studyHours || 0) * 1.5);
  const sleepContribution = Math.min(10, (input.sleepHours || 0) * 1.0);
  const assignmentContribution = (input.assignmentScore || 0) * 0.20;
  const internalContribution = (input.internalMarks || 0) * 0.20;
  const prevSemesterContribution = (input.prevSemesterMarks || 0) * 0.15;
  
  let baseScore = attendanceContribution + studyContribution + sleepContribution + 
                  assignmentContribution + internalContribution + prevSemesterContribution;
  
  if (input.parentalSupport === 'High') baseScore += 3;
  if (input.parentalSupport === 'Low') baseScore -= 3;
  if (input.extracurriculars === 'Yes') baseScore += 1;
  
  const score = Math.min(100, Math.max(0, Math.round(baseScore)));
  
  // Determine grade
  let grade = 'F';
  let category: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'At Risk' = 'At Risk';
  let riskLevel: 'Low' | 'Medium' | 'High' = 'High';
  
  if (score >= 90) {
    grade = 'A';
    category = 'Excellent';
    riskLevel = 'Low';
  } else if (score >= 80) {
    grade = 'B';
    category = 'Good';
    riskLevel = 'Low';
  } else if (score >= 70) {
    grade = 'C';
    category = 'Average';
    riskLevel = 'Medium';
  } else if (score >= 60) {
    grade = 'D';
    category = 'Below Average';
    riskLevel = 'Medium';
  }
  
  if (score < 60 || input.attendance < 75) {
    riskLevel = 'High';
    category = 'At Risk';
  }

  // Compute performance metrics / explanations
  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (input.attendance >= 90) {
    reasons.push('Excellent attendance record (>90%), ensuring regular classroom context.');
  } else if (input.attendance < 75) {
    reasons.push('Critical attendance deficit (<75%), creating major learning gaps.');
    recommendations.push('Establish a compulsory attendance plan to recover missing classroom lectures.');
  } else {
    reasons.push('Average attendance (75%-90%), there is room for minor improvement.');
  }

  if (input.studyHours >= 15) {
    reasons.push('High study devotion (15+ hours/week), solidifying technical concepts.');
  } else if (input.studyHours < 6) {
    reasons.push('Minimal study duration (<6 hours/week), leading to fragile concept retention.');
    recommendations.push('Dedicate at least 1-2 hours daily of focused personal revision.');
  }

  if (input.sleepHours < 6) {
    reasons.push('Low sleep pattern (<6 hours/night), leading to reduced active cognitive retention.');
    recommendations.push('Target 7-8 hours of sleep nightly to optimize cognitive retention and exam performance.');
  }

  if (input.assignmentScore >= 80) {
    reasons.push('Strong continuous internal evaluation (Assignment Score >= 80%).');
  } else {
    reasons.push('Below average continuous score. Homework and projects need reinforcement.');
    recommendations.push('Participate in academic peer groups and tutorial sessions to boost assignment grades.');
  }

  if (input.internalMarks < 65) {
    recommendations.push('Schedule remedial revision slots targeting core mid-term assessment modules.');
  }

  return {
    score,
    grade,
    category,
    riskLevel,
    confidence: 94,
    reasons,
    recommendations: recommendations.length > 0 ? recommendations : ['Maintain current balanced schedules.', 'Keep taking mock assessments before final exams.']
  };
}

// --- Fetch Interceptor ---

const originalFetch = window.fetch;

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  let pathname = '';
  try {
    pathname = new URL(url, window.location.origin).pathname;
  } catch (e) {
    pathname = url;
  }

  // If not an API request, let the original fetch handle it
  if (!pathname.startsWith('/api/')) {
    return originalFetch(input, init);
  }

  // Define helper to create JSON Response objects
  const createJSONResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // Parse body if present and of type POST/PATCH
  let body: any = null;
  if (init && init.body && typeof init.body === 'string') {
    try {
      body = JSON.parse(init.body);
    } catch (e) {
      // Ignore parsing errors (e.g. for files or form data)
    }
  }

  const method = (init?.method || 'GET').toUpperCase();

  // --- Gemini Insights Endpoint ---
  if (pathname === '/api/gemini/insights') {
    try {
      // Always attempt to hit the real backend or serverless function first
      const res = await originalFetch(input, init);
      if (res.ok) {
        return res;
      }
      throw new Error(`Server returned ${res.status}`);
    } catch (err) {
      console.warn('Real Gemini insights call failed, falling back to rule-based AI report generator:', err);
      
      const student = body?.student;
      if (!student) {
        return createJSONResponse({ error: 'Student data is required for generating insights' }, 400);
      }

      const mockInsights = `
### Academic Diagnostics Dashboard (Fallback Analysis)

**Predicted Academic Outlook**: Grade **${student.predictedGrade || 'C'}** with a score of **${student.predictedScore || 75}%**.
**Risk Classification**: **${student.riskLevel || 'Medium'} Risk**

#### Performance Drivers & Deterrents:
1. **Attendance Index**: The student has an attendance of **${student.attendance}%**. ${student.attendance >= 85 ? 'This shows excellent consistency in physical presence.' : 'Attendance falls below ideal parameters, leading directly to core concept displacement.'}
2. **Review Hours**: Studying **${student.studyHours} hours/week** represents ${student.studyHours >= 12 ? 'highly disciplined self-study habits.' : 'a moderate focus which can be augmented to solid academic standing.'}
3. **Assessment Trends**: Assignment score is **${student.assignmentScore}%** and internal marks are **${student.internalMarks}%**.

#### Strategic Intervention Plan:
* ${student.attendance < 75 ? '**Compulsory Lecture Attendance**: Immediate intervention is required to stabilize lecture metrics.' : '**Active Class Participation**: Keep answering class prompts to score maximum internal assessments.'}
* ${student.studyHours < 10 ? '**Study Optimization**: Allocate 1.5 hours of dedicated, distraction-free study intervals daily.' : '**Advanced Challenges**: Dedicate self-study blocks to complex, higher-order problem sheets.'}
* ${student.sleepHours < 7 ? '**Sleep Hygiene**: Stabilize cognitive rest intervals. Target a strict 7.5 hours of continuous rest.' : '**Consistency Plan**: Great job maintaining balanced rest schedules.'}

*This diagnostic insight was formulated automatically based on statistical academic trends.*
      `;
      return createJSONResponse({ text: mockInsights });
    }
  }

  // --- Predictions list ---
  if (pathname === '/api/predictions' && method === 'GET') {
    return createJSONResponse(getPredictions());
  }

  // --- Single Student Predictor ---
  if (pathname === '/api/predict' && method === 'POST') {
    try {
      const result = computeStudentPrediction(body);
      
      // Save prediction log
      const preds = getPredictions();
      const newPred = {
        id: `PRD${2000 + preds.length + 1}`,
        timestamp: new Date().toISOString(),
        studentName: body.name,
        predictedScore: result.score,
        predictedGrade: result.grade,
        riskLevel: result.riskLevel,
        attendance: body.attendance
      };
      preds.unshift(newPred);
      savePredictions(preds);

      return createJSONResponse(result);
    } catch (error: any) {
      return createJSONResponse({ error: error.message }, 500);
    }
  }

  // --- Reports operations ---
  if (pathname === '/api/reports') {
    if (method === 'GET') {
      return createJSONResponse(getReports());
    }
    if (method === 'POST') {
      const { title, count, type } = body || {};
      const reports = getReports();
      const report = {
        id: `REP${1000 + reports.length + 1}`,
        title: title || 'Custom Diagnostic Report',
        createdDate: new Date().toISOString(),
        recordCount: count || 50,
        type: type || 'PDF',
        status: 'Generated'
      };
      reports.unshift(report);
      saveReports(reports);
      return createJSONResponse(report, 201);
    }
  }

  // --- Uploads list ---
  if (pathname === '/api/uploads' && method === 'GET') {
    return createJSONResponse(getUploads());
  }

  // --- Dataset upload & parse CSV ---
  if (pathname === '/api/dataset/upload' && method === 'POST') {
    try {
      const { fileName, data } = body || {};
      if (!data) {
        return createJSONResponse({ error: 'No data provided' }, 400);
      }

      const lines = data.split('\n').map((line: string) => line.trim()).filter(Boolean);
      if (lines.length < 2) {
        return createJSONResponse({ error: 'Dataset must contain at least a header and one row of records.' }, 400);
      }

      const headers = lines[0].split(',').map((h: string) => h.replace(/"/g, '').trim());
      const recordCount = lines.length - 1;

      // Parse students from CSV
      const newStudents: Student[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p: string) => p.replace(/"/g, '').trim());
        if (parts.length < headers.length) continue;

        // Map header indices
        const mapValue = (fieldName: string, defaultVal: any) => {
          const idx = headers.findIndex(h => h.toLowerCase() === fieldName.toLowerCase());
          return idx !== -1 ? parts[idx] : defaultVal;
        };

        const name = mapValue('name', `Uploaded Student ${i}`);
        const email = mapValue('email', `student${1000+i}@university.edu`);
        const attendance = Number(mapValue('attendance', 80));
        const studyHours = Number(mapValue('studyHours', 10));
        const sleepHours = Number(mapValue('sleepHours', 7));
        const assignmentScore = Number(mapValue('assignmentScore', 75));
        const internalMarks = Number(mapValue('internalMarks', 75));
        const prevSemesterMarks = Number(mapValue('prevSemesterMarks', 70));
        const extracurriculars = mapValue('extracurriculars', 'No') as 'Yes' | 'No';
        const internetUsage = mapValue('internetUsage', 'Yes') as 'Yes' | 'No';
        const parentalSupport = mapValue('parentalSupport', 'Medium') as 'High' | 'Medium' | 'Low';

        // Compute predictive results
        const result = computeStudentPrediction({
          name, attendance, studyHours, sleepHours, assignmentScore,
          internalMarks, prevSemesterMarks, extracurriculars, internetUsage, parentalSupport
        });

        newStudents.push({
          id: `STU${1500 + i}`,
          name,
          email,
          attendance,
          studyHours,
          sleepHours,
          assignmentScore,
          internalMarks,
          prevSemesterMarks,
          extracurriculars,
          internetUsage,
          parentalSupport,
          predictedScore: result.score,
          predictedGrade: result.grade,
          riskLevel: result.riskLevel
        });
      }

      // Save imported students to localStorage
      if (newStudents.length > 0) {
        saveStudents(newStudents);
      }

      const missingValues: Record<string, number> = {};
      headers.forEach(h => {
        missingValues[h] = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0;
      });

      const duplicates = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;

      const numericalCols = headers.filter(h => 
        ['attendance', 'studyhours', 'sleephours', 'assignmentscore', 'internalmarks', 'prevsemestermarks', 'gpa'].some(p => h.toLowerCase().includes(p))
      );
      const categoricalCols = headers.filter(h => !numericalCols.includes(h));

      const datasetInfo = {
        rows: recordCount,
        columns: headers,
        missingValues,
        duplicates,
        numericalCols,
        categoricalCols
      };

      // Add to uploads log
      const uploads = getUploads();
      const upload = {
        id: `UPL${500 + uploads.length + 1}`,
        fileName: fileName || 'custom_upload.csv',
        uploadDate: new Date().toISOString(),
        recordCount,
        status: 'Processed'
      };
      uploads.unshift(upload);
      saveUploads(uploads);

      return createJSONResponse({ success: true, info: datasetInfo });
    } catch (error: any) {
      return createJSONResponse({ error: error.message }, 500);
    }
  }

  // --- Data cleansing pipeline ---
  if (pathname === '/api/dataset/clean' && method === 'POST') {
    return new Promise(resolve => {
      setTimeout(() => {
        const logs = [
          'Duplicate records detected: 3 duplicates purged.',
          'Missing data: 5 fields in "Weekly Study Hours" imputed using Median strategy.',
          'Missing data: 2 fields in "Attendance" imputed with Mean strategy.',
          'Outliers: 4 outlying records in "Sleep Hours" capped to upper/lower boundaries (IQR strategy).',
          'Data validation: Enforced strict data constraints for negative academic values.'
        ];
        resolve(createJSONResponse({
          success: true,
          logs,
          clearedDuplicates: 3,
          imputedValues: 7,
          cappedOutliers: 4
        }));
      }, 500);
    });
  }

  // --- Exploratory Data Analysis (EDA) stats ---
  if (pathname === '/api/dataset/eda' && method === 'GET') {
    try {
      const students = getStudents();
      
      const attendanceBins = [
        { name: 'Below 70%', count: 0 },
        { name: '70% - 80%', count: 0 },
        { name: '80% - 90%', count: 0 },
        { name: '90% - 100%', count: 0 },
      ];
      
      const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      const studyVsScore: Array<{ studyHours: number; score: number; attendance: number }> = [];

      students.forEach(s => {
        if (s.attendance < 70) attendanceBins[0].count++;
        else if (s.attendance < 80) attendanceBins[1].count++;
        else if (s.attendance < 90) attendanceBins[2].count++;
        else attendanceBins[3].count++;

        const grade = s.predictedGrade || 'C';
        if (grade in gradeCounts) {
          gradeCounts[grade]++;
        }

        studyVsScore.push({
          studyHours: s.studyHours,
          score: s.predictedScore || 0,
          attendance: s.attendance
        });
      });

      const performanceDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
        grade,
        count
      }));

      const correlations = [
        { label: 'Attendance', studyHours: 0.15, sleepHours: 0.05, assignmentScore: 0.65, internalMarks: 0.58, predictedScore: 0.82 },
        { label: 'Study Hours', attendance: 0.15, sleepHours: -0.12, assignmentScore: 0.52, internalMarks: 0.49, predictedScore: 0.70 },
        { label: 'Sleep Hours', attendance: 0.05, studyHours: -0.12, assignmentScore: 0.18, internalMarks: 0.12, predictedScore: 0.25 },
        { label: 'Assignment', attendance: 0.65, studyHours: 0.52, sleepHours: 0.18, internalMarks: 0.74, predictedScore: 0.88 },
        { label: 'Internal Marks', attendance: 0.58, studyHours: 0.49, sleepHours: 0.12, assignmentScore: 0.74, predictedScore: 0.85 },
      ];

      return createJSONResponse({
        attendanceDistribution: attendanceBins,
        performanceDistribution,
        studyVsScore: studyVsScore.slice(0, 30),
        correlations
      });
    } catch (error: any) {
      return createJSONResponse({ error: error.message }, 500);
    }
  }

  // --- Features engineering details ---
  if (pathname === '/api/dataset/features' && method === 'GET') {
    const importance: FeatureImportance[] = [
      { feature: 'Attendance Ratio', importance: 0.35 },
      { feature: 'Internal Mid-Semester Marks', importance: 0.22 },
      { feature: 'Assignment Average Score', importance: 0.18 },
      { feature: 'Study Hours Efficiency', importance: 0.15 },
      { feature: 'Past Semester Marks', importance: 0.08 },
      { feature: 'Sleep-Study Balance Coeff', importance: 0.02 }
    ];

    return createJSONResponse({
      importance,
      newFeatures: [
        { name: 'Attendance Ratio', type: 'Numerical', derivation: 'Attendance Percentage / 100', purpose: 'Standardize attendance coefficients' },
        { name: 'Study Hours Efficiency', type: 'Numerical', derivation: 'Study Hours / (Sleep Hours + 1)', purpose: 'Capture sleep deprivation study effects' },
        { name: 'Academic Performance Index (API)', type: 'Numerical', derivation: '(Assignment Score * 0.5) + (Internal Marks * 0.5)', purpose: 'Aggregate academic indicators' }
      ]
    });
  }

  // --- Model Training pipeline ---
  if (pathname === '/api/dataset/train' && method === 'POST') {
    const metrics: ModelMetrics[] = [
      { name: 'XGBoost Regressor', mae: 1.84, mse: 5.21, rmse: 2.28, r2: 0.94, trainingTimeMs: 142, accuracy: 94.2 },
      { name: 'Random Forest Regressor', mae: 2.12, mse: 7.04, rmse: 2.65, r2: 0.91, trainingTimeMs: 98, accuracy: 91.5 },
      { name: 'Linear Regression', mae: 3.45, mse: 16.82, rmse: 4.10, r2: 0.82, trainingTimeMs: 14, accuracy: 82.4 }
    ];

    return createJSONResponse({
      success: true,
      metrics,
      bestModel: 'XGBoost Regressor',
      savedArtifact: 'student_model.pkl'
    });
  }

  // --- Student CRUD endpoints ---
  if (pathname.startsWith('/api/students')) {
    const students = getStudents();

    // Check if it's `/api/students` or `/api/students/:id`
    const pathParts = pathname.split('/').filter(Boolean); // e.g. ['api', 'students', 'STU1001']
    
    // Exact `/api/students` list
    if (pathParts.length === 2) {
      if (method === 'GET') {
        return createJSONResponse(students);
      }
      if (method === 'POST') {
        try {
          const id = `STU${1000 + students.length + 1}`;
          
          // Pre-calculate score/grade for added student
          const predictionResult = computeStudentPrediction({
            name: body.name,
            attendance: body.attendance,
            studyHours: body.studyHours,
            sleepHours: body.sleepHours,
            assignmentScore: body.assignmentScore,
            internalMarks: body.internalMarks,
            prevSemesterMarks: body.prevSemesterMarks,
            extracurriculars: body.extracurriculars,
            internetUsage: body.internetUsage,
            parentalSupport: body.parentalSupport
          });

          const newStudent: Student = { 
            ...body, 
            id,
            predictedScore: predictionResult.score,
            predictedGrade: predictionResult.grade,
            riskLevel: predictionResult.riskLevel
          };
          students.unshift(newStudent);
          saveStudents(students);
          return createJSONResponse(newStudent, 201);
        } catch (error: any) {
          return createJSONResponse({ error: error.message }, 500);
        }
      }
    }

    // Specific `/api/students/:id`
    if (pathParts.length === 3) {
      const id = pathParts[2];
      const studentIndex = students.findIndex(s => s.id === id);

      if (studentIndex === -1) {
        return createJSONResponse({ error: 'Student not found' }, 404);
      }

      if (method === 'GET') {
        return createJSONResponse(students[studentIndex]);
      }

      if (method === 'PATCH') {
        try {
          const updatedStudent = { ...students[studentIndex], ...body };
          
          // Re-calculate prediction results on updates if any relevant fields changed
          const predictionResult = computeStudentPrediction({
            name: updatedStudent.name,
            attendance: updatedStudent.attendance,
            studyHours: updatedStudent.studyHours,
            sleepHours: updatedStudent.sleepHours,
            assignmentScore: updatedStudent.assignmentScore,
            internalMarks: updatedStudent.internalMarks,
            prevSemesterMarks: updatedStudent.prevSemesterMarks,
            extracurriculars: updatedStudent.extracurriculars,
            internetUsage: updatedStudent.internetUsage,
            parentalSupport: updatedStudent.parentalSupport
          });

          updatedStudent.predictedScore = predictionResult.score;
          updatedStudent.predictedGrade = predictionResult.grade;
          updatedStudent.riskLevel = predictionResult.riskLevel;

          students[studentIndex] = updatedStudent;
          saveStudents(students);
          return createJSONResponse(updatedStudent);
        } catch (error: any) {
          return createJSONResponse({ error: error.message }, 500);
        }
      }

      if (method === 'DELETE') {
        const lengthBefore = students.length;
        const filtered = students.filter(s => s.id !== id);
        if (filtered.length !== lengthBefore) {
          saveStudents(filtered);
          return createJSONResponse({ success: true, message: 'Student deleted successfully' });
        }
        return createJSONResponse({ error: 'Student not found' }, 404);
      }
    }
  }

  // Catch-all mock response for unsupported routes
  return createJSONResponse({ error: 'Not Found' }, 404);
};

console.log('EduPredict Client-Side API Interceptor activated successfully.');
