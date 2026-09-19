// Central definition of school levels and their grades
// Single source of truth for the entire app

export const SCHOOL_LEVELS = {
  elementary: {
    key: 'elementary',
    order: 1,
    grades: ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6'],
  },
  middle: {
    key: 'middle',
    order: 2,
    grades: ['grade-7', 'grade-8', 'grade-9'],
  },
  secondary: {
    key: 'secondary',
    order: 3,
    grades: ['first-year', 'second-year', 'third-year'],
  },
};

// Ordered array of level keys: ['elementary', 'middle', 'secondary']
export const SCHOOL_LEVEL_KEYS = Object.keys(SCHOOL_LEVELS).sort(
  (a, b) => SCHOOL_LEVELS[a].order - SCHOOL_LEVELS[b].order
);

// All grade keys in display order (elementary → middle → secondary)
export const ALL_GRADES = SCHOOL_LEVEL_KEYS.flatMap(
  (level) => SCHOOL_LEVELS[level].grades
);

/**
 * Returns the school level key that a given grade belongs to.
 * @param {string} grade - e.g. 'grade-1', 'first-year'
 * @returns {'elementary'|'middle'|'secondary'|null}
 */
export const getLevelFromGrade = (grade) => {
  if (!grade) return null;
  for (const levelKey of SCHOOL_LEVEL_KEYS) {
    if (SCHOOL_LEVELS[levelKey].grades.includes(grade)) {
      return levelKey;
    }
  }
  return null;
};

/**
 * Returns an array of grade keys belonging to a given level.
 * If level is 'all' or invalid, returns all grades.
 * @param {string} level
 * @returns {string[]}
 */
export const getGradesForLevel = (level) => {
  if (!level || level === 'all') return ALL_GRADES;
  return SCHOOL_LEVELS[level]?.grades || [];
};

/**
 * Checks if a given grade exists in any level.
 * @param {string} grade
 * @returns {boolean}
 */
export const isValidGrade = (grade) => {
  return ALL_GRADES.includes(grade);
};

/**
 * Checks if a given level key is valid.
 * @param {string} level
 * @returns {boolean}
 */
export const isValidLevel = (level) => {
  return level === 'all' || SCHOOL_LEVEL_KEYS.includes(level);
};