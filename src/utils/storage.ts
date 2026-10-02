import { FootprintInput, Habit } from '../types';
import { DEFAULT_INPUT, INITIAL_HABITS } from '../data/initialData';

const STORAGE_KEY_INPUT = 'ecotrack_user_input_v1';
const STORAGE_KEY_HABITS = 'ecotrack_user_habits_v1';

export function loadSavedInput(): FootprintInput {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INPUT);
    if (!raw) return DEFAULT_INPUT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_INPUT, ...parsed };
  } catch (e) {
    console.warn('Could not read from localStorage', e);
    return DEFAULT_INPUT;
  }
}

export function saveInput(input: FootprintInput): void {
  try {
    localStorage.setItem(STORAGE_KEY_INPUT, JSON.stringify(input));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

export function loadSavedHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!raw) return INITIAL_HABITS;
    const parsed: Habit[] = JSON.parse(raw);
    // ensure all default habit IDs are preserved or merged
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_HABITS;
    return parsed;
  } catch (e) {
    console.warn('Could not read habits from localStorage', e);
    return INITIAL_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  } catch (e) {
    console.warn('Could not save habits to localStorage', e);
  }
}
