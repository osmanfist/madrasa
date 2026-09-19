import { createContext, useContext, useState, useEffect } from 'react';
import { SCHOOL_LEVEL_KEYS, isValidLevel } from '../utils/schoolLevels';

const SchoolLevelContext = createContext();

const STORAGE_KEY = 'madrasa-active-level';
const DEFAULT_LEVEL = 'all';

export function SchoolLevelProvider({ children }) {
  const [activeLevel, setActiveLevelState] = useState(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidLevel(stored)) {
        return stored;
      }
    } catch (err) {
      console.warn('Failed to read active level from localStorage:', err);
    }
    return DEFAULT_LEVEL;
  });

  // Persist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeLevel);
    } catch (err) {
      console.warn('Failed to save active level to localStorage:', err);
    }
  }, [activeLevel]);

  /**
   * Set the active level. Validates input.
   * @param {string} level - 'all' | 'elementary' | 'middle' | 'secondary'
   */
  const setActiveLevel = (level) => {
    if (!isValidLevel(level)) {
      console.warn(`Invalid school level: ${level}. Ignoring.`);
      return;
    }
    setActiveLevelState(level);
  };

  /**
   * Filters a list of students based on the active level.
   * A student belongs to a level via `student.schoolLevel`.
   * As a defensive fallback (pre-migration), students without
   * `schoolLevel` are treated as 'secondary'.
   * @param {Array} students
   * @returns {Array}
   */
  const getFilteredStudents = (students) => {
    if (!Array.isArray(students)) return [];
    if (activeLevel === 'all') return students;

    return students.filter((student) => {
      const level = student.schoolLevel || 'secondary';
      return level === activeLevel;
    });
  };

  /**
   * Counts students per level. Useful for tab badges.
   * @param {Array} students
   * @returns {{ all: number, elementary: number, middle: number, secondary: number }}
   */
  const getStudentCountsByLevel = (students) => {
    const counts = { all: 0, elementary: 0, middle: 0, secondary: 0 };
    if (!Array.isArray(students)) return counts;

    counts.all = students.length;

    students.forEach((student) => {
      const level = student.schoolLevel || 'secondary';
      if (counts[level] !== undefined) {
        counts[level]++;
      }
    });

    return counts;
  };

  const value = {
    activeLevel,
    setActiveLevel,
    schoolLevels: SCHOOL_LEVEL_KEYS, // ['elementary', 'middle', 'secondary']
    getFilteredStudents,
    getStudentCountsByLevel,
  };

  return (
    <SchoolLevelContext.Provider value={value}>
      {children}
    </SchoolLevelContext.Provider>
  );
}

export function useSchoolLevel() {
  const context = useContext(SchoolLevelContext);
  if (!context) {
    throw new Error('useSchoolLevel must be used within a SchoolLevelProvider');
  }
  return context;
}