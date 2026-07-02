/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS & Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { student } = req.body || {};
    if (!student) {
      return res.status(400).json({ error: 'Student data is required for generating insights' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      return res.status(400).json({ error: 'GEMINI_API_KEY environment variable is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
You are an expert academic advisor, predictive educational analytics model, and student retention specialist.
Analyze the following student academic performance metrics and generate a highly professional, constructive, and actionable educational diagnostic report.

Student Metrics:
- Name: ${student.name}
- Attendance: ${student.attendance}%
- Weekly Study Hours: ${student.studyHours} hours/week
- Nightly Sleep Hours: ${student.sleepHours} hours/night
- Continuous Assessment Assignment Score: ${student.assignmentScore}%
- Term Mid-Semester Internal Marks: ${student.internalMarks}%
- Past Semester Score: ${student.prevSemesterMarks}%
- Sports & Extracurriculars: ${student.extracurriculars}
- Home Broadband Internet Access: ${student.internetUsage}
- Parental Advisory Support Level: ${student.parentalSupport}
- Model Predicted Score: ${student.predictedScore}%
- Model Forecasted Grade: ${student.predictedGrade}
- Assigned Failure Risk Classification: ${student.riskLevel}

Provide your report in clean Markdown format with the following specific headers:
1. ### Academic Diagnostics Dashboard (A beautiful summary analysis)
2. ### Performance Drivers & Deterrents (Specific indicators based on the numbers)
3. ### Strategic Intervention Plan (Give 3 targeted, highly specific suggestions)

Keep the language professional, encouraging, objective, and styled like a top-tier premium SaaS analytics card.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Serverless Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
