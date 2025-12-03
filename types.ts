export interface ClassGroup {
  id: string;
  name: string;
  description?: string;
}

export interface Student {
  id: string;
  classId: string; // Link to ClassGroup
  name: string;
  score: number;
  history: {
    questionId?: string;
    points: number;
    timestamp: number;
    note?: string;
  }[];
}

export interface Question {
  id: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject?: string;
  tags: string[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  QUESTIONS = 'QUESTIONS',
  SESSION = 'SESSION',
  STATS = 'STATS',
}

export interface AppState {
  classes: ClassGroup[];
  activeClassId: string | null;
  students: Student[];
  questions: Question[];
}