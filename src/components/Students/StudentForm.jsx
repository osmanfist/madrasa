import { useState } from 'react';
import { useStudents } from '../../context/StudentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSchoolLevel } from '../../context/SchoolLevelContext';
import { SCHOOL_LEVELS, SCHOOL_LEVEL_KEYS, getLevelFromGrade } from '../../utils/schoolLevels';
import './StudentForm.css';

function StudentForm({ student, onClose }) {
  const { addStudent, updateStudent } = useStudents();
  const { t } = useLanguage();
  const { activeLevel } = useSchoolLevel();

  // Determine the school level for a NEW student based on the active tab.
  // - If a specific level tab is active → use it
  // - If "All Levels" → default to secondary (matches existing default grade)
  const defaultLevel = activeLevel !== 'all' ? activeLevel : 'secondary';
  const defaultGrade = SCHOOL_LEVELS[defaultLevel].grades[0];
  
    const [formData, setFormData] = useState({
    name: student?.name || '',
    gradeLevel: student?.gradeLevel || defaultGrade,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Derive schoolLevel from gradeLevel — single source of truth.
    // Preserve the student's existing level when editing.
    const schoolLevel = student?.schoolLevel
      || getLevelFromGrade(formData.gradeLevel)
      || 'secondary';

    const finalData = {
      ...formData,
      schoolLevel,
    };

    if (student) {
      updateStudent(student.id, finalData);
    } else {
      addStudent(finalData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{student ? t('editStudent') : t('addStudent')}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('studentName')} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder={t('studentName')}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

                    <div className="form-group">
            <label htmlFor="gradeLevel">{t('gradeLevel')} *</label>
            {student ? (
              // EDITING — show only the student's current level's grades.
              // (Moving between levels is not supported yet.)
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
              >
                {SCHOOL_LEVELS[student.schoolLevel || 'secondary'].grades.map(gradeKey => (
                  <option key={gradeKey} value={gradeKey}>
                    {t(gradeKey)}
                  </option>
                ))}
              </select>
            ) : activeLevel !== 'all' ? (
              // ADDING under a specific level tab — show only that level's grades.
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
              >
                {SCHOOL_LEVELS[activeLevel].grades.map(gradeKey => (
                  <option key={gradeKey} value={gradeKey}>
                    {t(gradeKey)}
                  </option>
                ))}
              </select>
            ) : (
              // ADDING under "All Levels" — grouped by level.
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
              >
                {SCHOOL_LEVEL_KEYS.map(levelKey => (
                  <optgroup key={levelKey} label={t(levelKey)}>
                    {SCHOOL_LEVELS[levelKey].grades.map(gradeKey => (
                      <option key={gradeKey} value={gradeKey}>
                        {t(gradeKey)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;