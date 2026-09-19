import { SCHOOL_LEVEL_KEYS, SCHOOL_LEVELS, getLevelFromGrade } from './schoolLevels';

// Bump this whenever you introduce a new migration step
const CURRENT_DATA_VERSION = 2;
const VERSION_KEY = 'madrasa-data-version';

// Sensible default fees for any missing grade keys.
// Existing users keep their current values for grades they already had.
const DEFAULT_TUITION_FEES = {
  'grade-1': 500000,
  'grade-2': 500000,
  'grade-3': 600000,
  'grade-4': 600000,
  'grade-5': 700000,
  'grade-6': 700000,
  'grade-7': 800000,
  'grade-8': 900000,
  'grade-9': 1000000,
  'first-year': 1000000,
  'second-year': 1200000,
  'third-year': 1500000,
};

export const getDataVersion = () => {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    return v ? parseInt(v, 10) : 1; // If no version stored, assume v1 (pre-multi-level)
  } catch {
    return 1;
  }
};

const setDataVersion = (v) => {
  try {
    localStorage.setItem(VERSION_KEY, String(v));
  } catch (err) {
    console.warn('Failed to save data version:', err);
  }
};

/**
 * Main migration entry point. Safe to call on every app load —
 * it checks the version flag and exits early if already migrated.
 */
export const runMigrationsIfNeeded = () => {
  const version = getDataVersion();
  if (version >= CURRENT_DATA_VERSION) {
    return { ran: false, version };
  }

  console.log(`[Migrate] Running migrations: v${version} → v${CURRENT_DATA_VERSION}`);

  try {
    migrateStudents();
    migrateSettings();
    setDataVersion(CURRENT_DATA_VERSION);
    console.log('[Migrate] Migration complete.');
    return { ran: true, version: CURRENT_DATA_VERSION };
  } catch (err) {
    console.error('[Migrate] Migration failed:', err);
    return { ran: false, error: err };
  }
};

/**
 * Adds `schoolLevel` to any student missing it, derived from `gradeLevel`.
 * Existing students with `schoolLevel` are left untouched.
 */
function migrateStudents() {
  const raw = localStorage.getItem('madrasa-students');
  if (!raw) return; // nothing to migrate

  let students;
  try {
    students = JSON.parse(raw);
  } catch {
    console.warn('[Migrate] Could not parse students — skipping.');
    return;
  }

  if (!Array.isArray(students)) return;

  let updatedCount = 0;
  const migrated = students.map(student => {
    if (student.schoolLevel) return student; // already migrated

    const derived = getLevelFromGrade(student.gradeLevel) || 'secondary';
    updatedCount++;
    return { ...student, schoolLevel: derived };
  });

  if (updatedCount > 0) {
    localStorage.setItem('madrasa-students', JSON.stringify(migrated));
    console.log(`[Migrate] Backfilled schoolLevel for ${updatedCount} students.`);
  }
}

/**
 * Ensures `settings.tuitionFees` contains all 12 grade keys.
 * Existing user values are preserved; only missing keys are added.
 */
function migrateSettings() {
  const raw = localStorage.getItem('madrasa-settings');
  if (!raw) return;

  let settings;
  try {
    settings = JSON.parse(raw);
  } catch {
    console.warn('[Migrate] Could not parse settings — skipping.');
    return;
  }

  if (!settings || typeof settings !== 'object') return;

  const existingFees = settings.tuitionFees || {};
  const mergedFees = { ...DEFAULT_TUITION_FEES, ...existingFees };

  // Detect if anything actually changed
  const changed =
    Object.keys(mergedFees).length !== Object.keys(existingFees).length ||
    SCHOOL_LEVEL_KEYS.some(levelKey =>
      SCHOOL_LEVELS[levelKey].grades.some(g => existingFees[g] === undefined)
    );

  if (!changed) return;

  const updatedSettings = {
    ...settings,
    tuitionFees: mergedFees,
  };

  localStorage.setItem('madrasa-settings', JSON.stringify(updatedSettings));
  console.log('[Migrate] Filled in missing tuition fee keys.');
}