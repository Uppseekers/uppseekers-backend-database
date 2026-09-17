import { StudentProfile } from '../types';
import { cleanText } from './textCleaner';

/**
 * Robust CSV parser that handles:
 * - Quoted fields containing commas
 * - Quoted fields containing newlines
 * - Escaped quotes ("")
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quote
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.some(c => c.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else if (char === '\n') {
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.some(c => c.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentField += char;
      }
    }
  }

  // Push last field & row if pending
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(c => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Converts parsed CSV rows into StudentProfile array with flexible column matching
 */
export function parseStudentsFromCSV(csvText: string): StudentProfile[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const rawHeaders = rows[0].map(h => cleanText(h).toLowerCase().trim());

  // Find column index helper
  const findCol = (aliases: string[]): number => {
    return rawHeaders.findIndex(h =>
      aliases.some(alias => h.includes(alias.toLowerCase()))
    );
  };

  const nameIdx = findCol(['name', 'student name']);
  const uniIdx = findCol(['university', 'college', 'school']);
  const linkedinIdx = findCol(['linkedin', 'linkedin account']);
  const courseIdx = findCol(['course', 'major', 'degree', 'program']);
  const academicIdx = findCol(['academics performance', 'academic performance', 'grades', 'gpa', 'academic']);
  const classOfIdx = findCol(['class of', 'graduation year', 'grad year', 'cohort']);
  const apIdx = findCol(['ap taken', 'ap exams', 'ap']);
  const testIdx = findCol(['act/sat', 'sat/act', 'sat', 'act', 'test score']);
  const langIdx = findCol(['language test', 'ielts', 'toefl', 'language']);
  const internIdx = findCol(['internship', 'work experience', 'experience', 'internship (with year)/work']);
  const researchIdx = findCol(['research (with year)', 'research']);
  const summerIdx = findCol(['summer programs', 'summer program']);
  const certIdx = findCol(['certificate and moocs', 'certificate', 'mooc', 'certifications']);
  const awardIdx = findCol(['competition and awards', 'competition', 'award', 'honors']);
  const projectIdx = findCol(['projects', 'project']);
  const activitiesIdx = findCol(['other activities', 'extracurricular', 'activities']);
  const notesIdx = findCol(['notes', 'note', 'additional remarks']);

  const getVal = (row: string[], idx: number): string => {
    if (idx === -1 || idx >= row.length) return '';
    return cleanText(row[idx]).trim();
  };

  const students: StudentProfile[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = getVal(row, nameIdx);
    const university = getVal(row, uniIdx);

    // Skip empty rows
    if (!name && !university) continue;

    // Normalize class of year (e.g., extracts "2028", "2029", "2030")
    let rawClass = getVal(row, classOfIdx);
    const yearMatch = rawClass.match(/20\d\d/);
    const classOf = yearMatch ? yearMatch[0] : (rawClass || 'N/A');

    students.push({
      id: `student-${r}-${Date.now().toString(36)}`,
      name: name || 'Student Profile',
      university: university || 'University',
      linkedin: getVal(row, linkedinIdx),
      course: getVal(row, courseIdx),
      academicsPerformance: getVal(row, academicIdx),
      classOf: classOf,
      apTaken: getVal(row, apIdx),
      actSat: getVal(row, testIdx),
      languageTest: getVal(row, langIdx),
      internshipWork: getVal(row, internIdx),
      research: getVal(row, researchIdx),
      summerPrograms: getVal(row, summerIdx),
      certificatesMoocs: getVal(row, certIdx),
      competitionsAwards: getVal(row, awardIdx),
      projects: getVal(row, projectIdx),
      otherActivities: getVal(row, activitiesIdx),
      notes: getVal(row, notesIdx),
    });
  }

  return students;
}
