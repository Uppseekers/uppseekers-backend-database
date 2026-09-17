import { StudentProfile } from './types';
import { parseStudentsFromCSV } from './utils/csvParser';
import rawData from './data/studentsCsvRaw';

export const INITIAL_STUDENTS: StudentProfile[] = parseStudentsFromCSV(rawData);
