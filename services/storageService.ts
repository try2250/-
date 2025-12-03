import { Student, Question, AppState } from '../types';

const STORAGE_KEY = 'classroom_companion_data_v1';

const DEFAULT_STATE: AppState = {
  classes: [],
  activeClassId: null,
  students: [],
  questions: [],
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return DEFAULT_STATE;
    return JSON.parse(serialized);
  } catch (e) {
    console.error("Failed to load state", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const exportData = (state: AppState) => {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `classroom_data_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};