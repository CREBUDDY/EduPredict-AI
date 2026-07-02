/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { Student, ModelMetrics, FeatureImportance } from '../src/types';

// Define DB file paths:
// 1. BUNDLED_DB_FILE is relative to __dirname so Vercel statically analyzes and packages server-data.json into the function bundle
// 2. WRITE_DB_FILE is in /tmp on Vercel to allow saving updates on a stateless/read-only filesystem
const BUNDLED_DB_FILE = path.join(__dirname, '../server-data.json');
const WRITE_DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'server-data.json')
  : BUNDLED_DB_FILE;

interface DatabaseSchema {
  students: Student[];
  predictions: any[];
  reports: any[];
  uploads: any[];
}

const DEFAULT_NAMES = [
  'Aarav Sharma', 'Aditi Verma', 'John Doe', 'Emily Smith', 'Sarah Jenkins',
  'Liam Johnson', 'Olivia Brown', 'Noah Davis', 'Sophia Miller', 'James Wilson',
  'Kiran Patel', 'Riya Sen', 'Alex Mercer', 'Maya Lin', 'Carlos Santana',
  'Fatima Al-Sayed', 'Chloe Dupont', 'Yuki Tanaka', 'Lucas Silva', 'Aisha Bello',
  'Devendra Rao', 'Priya Nair', 'Rajesh Kulkarni', 'Meera Joshi', 'Siddharth Roy',
  'Ananya Iyer', 'Vikram Seth', 'Neha Gupta', 'Arjun Kapoor', 'Sonia Malhotra'
];

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      students: [],
      predictions: [],
      reports: [],
      uploads: []
    };
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(WRITE_DB_FILE)) {
        const fileContent = fs.readFileSync(WRITE_DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else if (fs.existsSync(BUNDLED_DB_FILE)) {
        const fileContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.save();
      } else {
        this.generateSeedData();
        this.save();
      }
    } catch (error) {
      console.error('Error initializing database, using in-memory fallback:', error);
      this.generateSeedData();
    }
  }

  private save() {
    try {
      fs.writeFileSync(WRITE_DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving database file:', error);
    }
  }

  private generateSeedData() {
    console.log('Generating high-fidelity student performance seed data...');
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

    this.data.students = students;

    // Seed recent reports
    this.data.reports = [
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

    // Seed uploads log
    this.data.uploads = [
      {
        id: 'UPL501',
        fileName: 'academic_performance_q1_2026.csv',
        uploadDate: '2026-06-10T09:15:00Z',
        recordCount: 50,
        status: 'Processed'
      }
    ];
  }

  // --- Student operations ---
  public getStudents(): Student[] {
    return this.data.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public addStudent(student: Omit<Student, 'id'>): Student {
    const id = `STU${1000 + this.data.students.length + 1}`;
    const newStudent: Student = { ...student, id };
    this.data.students.unshift(newStudent); // Newest first
    this.save();
    return newStudent;
  }

  public updateStudent(id: string, updated: Partial<Student>): Student | null {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.data.students[index] = { ...this.data.students[index], ...updated };
    this.save();
    return this.data.students[index];
  }

  public deleteStudent(id: string): boolean {
    const lengthBefore = this.data.students.length;
    this.data.students = this.data.students.filter(s => s.id !== id);
    if (this.data.students.length !== lengthBefore) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Prediction Operations ---
  public getPredictions() {
    return this.data.predictions;
  }

  public addPrediction(pred: any) {
    const newPred = {
      id: `PRD${2000 + this.data.predictions.length + 1}`,
      timestamp: new Date().toISOString(),
      ...pred
    };
    this.data.predictions.unshift(newPred);
    this.save();
    return newPred;
  }

  // --- Report Operations ---
  public getReports() {
    return this.data.reports;
  }

  public addReport(title: string, recordCount: number, type: 'PDF' | 'CSV' | 'XLSX') {
    const report = {
      id: `REP${1000 + this.data.reports.length + 1}`,
      title,
      createdDate: new Date().toISOString(),
      recordCount,
      type,
      status: 'Generated'
    };
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  // --- Upload Operations ---
  public getUploads() {
    return this.data.uploads;
  }

  public addUpload(fileName: string, recordCount: number) {
    const upload = {
      id: `UPL${500 + this.data.uploads.length + 1}`,
      fileName,
      uploadDate: new Date().toISOString(),
      recordCount,
      status: 'Processed'
    };
    this.data.uploads.unshift(upload);
    this.save();
    return upload;
  }

  // Save full state for upload/cleaning
  public setStudents(students: Student[]) {
    this.data.students = students;
    this.save();
  }
}

export const db = new Database();
