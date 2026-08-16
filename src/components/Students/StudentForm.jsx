import { useState } from 'react';
import { useStudents } from '../../context/StudentContext';
import { useLanguage } from '../../context/LanguageContext';
import './StudentForm.css';

function StudentForm({ student, onClose }) {
  const { addStudent, updateStudent } = useStudents();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: student?.name || '',
    gradeLevel: student?.gradeLevel || 'first-year',
    academicPercentage: student?.academicPercentage || 0,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.academicPercentage < 0 || formData.academicPercentage > 100) {
      newErrors.academicPercentage = 'Percentage must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (student) {
      updateStudent(student.id, formData);
    } else {
      addStudent(formData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'academicPercentage' ? Number(value) : value
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
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
            >
              <option value="first-year">{t('first-year')}</option>
              <option value="second-year">{t('second-year')}</option>
              <option value="third-year">{t('third-year')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="academicPercentage">{t('academicPerformance')} (%)</label>
            <input
              type="number"
              id="academicPercentage"
              name="academicPercentage"
              value={formData.academicPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              className={errors.academicPercentage ? 'error' : ''}
            />
            {errors.academicPercentage && (
              <span className="error-text">{errors.academicPercentage}</span>
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