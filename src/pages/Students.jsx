import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSchoolLevel } from '../context/SchoolLevelContext';
import { getTotalPaid, getRemainingBalance, getPaymentStatus, formatCurrency } from '../utils/calculations';
import { SCHOOL_LEVELS, SCHOOL_LEVEL_KEYS } from '../utils/schoolLevels';
import StudentForm from '../components/Students/StudentForm';
import PaymentForm from '../components/Payments/PaymentForm';
import './Students.css';

function Students() {
  const { students, deleteStudent } = useStudents();
  const { getTuitionFee, settings } = useSettings();
  const { t, language } = useLanguage();
  const { activeLevel, getFilteredStudents } = useSchoolLevel();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentStudent, setPaymentStudent] = useState(null);

  // Base list already filtered by active school level
  const levelStudents = getFilteredStudents(students);

  // Filter students (within the current level scope)
  const filteredStudents = levelStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.gradeLevel === gradeFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const status = getPaymentStatus(student, settings.tuitionFees);
      matchesStatus = status === statusFilter;
    }
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Sort students by name
  const sortedStudents = [...filteredStudents].sort((a, b) => 
    a.name.localeCompare(b.name, language === 'ar' ? 'ar' : 'en')
  );

  // Reset grade filter when the school level changes (avoid showing empty results)
  // Using a simple effect-like pattern via key on the select element instead.
  const handleLevelChange = () => {
    // intentionally empty — the grade select's key resets it
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    setSelectedStudentId(null);
  };

  const handleDeleteStudent = (studentId) => {
    if (confirmDelete === studentId) {
      deleteStudent(studentId);
      setConfirmDelete(null);
      setSelectedStudentId(null);
    } else {
      setConfirmDelete(studentId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleRecordPayment = (student) => {
    setPaymentStudent(student);
    setShowPaymentForm(true);
    setSelectedStudentId(null);
  };

  const handleStudentClick = (studentId) => {
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(studentId);
      setConfirmDelete(null);
    }
  };

  // Build the grade filter options based on active level
  const renderGradeOptions = () => {
    if (activeLevel === 'all') {
      // Show all grades grouped by level
      return (
        <>
          <option value="all">{t('allGrades')}</option>
          {SCHOOL_LEVEL_KEYS.map(levelKey => (
            <optgroup key={levelKey} label={t(levelKey)}>
              {SCHOOL_LEVELS[levelKey].grades.map(gradeKey => (
                <option key={gradeKey} value={gradeKey}>
                  {t(gradeKey)}
                </option>
              ))}
            </optgroup>
          ))}
        </>
      );
    }
    // Show only grades for the active level
    return (
      <>
        <option value="all">{t('allGrades')}</option>
        {SCHOOL_LEVELS[activeLevel].grades.map(gradeKey => (
          <option key={gradeKey} value={gradeKey}>
            {t(gradeKey)}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <h2>{t('students')}</h2>
        <button className="btn-primary" onClick={handleAddStudent}>
          + {t('addStudent')}
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          key={activeLevel} /* Force re-mount when level changes → resets to 'all' */
          value={gradeFilter} 
          onChange={(e) => setGradeFilter(e.target.value)}
          className="filter-select"
          style={{ color: '#333', backgroundColor: 'white' }}
        >
          {renderGradeOptions()}
        </select>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
          style={{ color: '#333', backgroundColor: 'white' }}
        >
          <option value="all">{t('paymentStatus')}</option>
          <option value="paid">{t('paid')}</option>
          <option value="partial">{t('partial')}</option>
          <option value="unpaid">{t('unpaid')}</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>{t('studentName')}</th>
              <th>{t('gradeLevel')}</th>
              <th>{t('totalPaid')}</th>
              <th>{t('remainingBalance')}</th>
              <th>{t('paymentStatus')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  {activeLevel === 'all' ? t('noData') : t('noStudentsInLevel')}
                </td>
              </tr>
            ) : (
              sortedStudents.map(student => {
                const totalPaid = getTotalPaid(student);
                const remaining = getRemainingBalance(student, settings.tuitionFees);
                const status = getPaymentStatus(student, settings.tuitionFees);
                const isSelected = selectedStudentId === student.id;
                
                return (
                  <tr 
                    key={student.id} 
                    className={`student-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleStudentClick(student.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="student-name">{student.name}</td>
                    <td>{t(student.gradeLevel)}</td>
                    <td>{formatCurrency(totalPaid, settings.currency)}</td>
                    <td className={remaining > 0 ? 'remaining' : 'paid-text'}>
                      {formatCurrency(remaining, settings.currency)}
                    </td>
                    <td>
                      <span className={`status-badge status-${status}`}>
                        {t(status)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEditStudent(student)}
                          title={t('edit')}
                        >
                          ✏️
                        </button>
                        <button 
                          className={`btn-icon ${confirmDelete === student.id ? 'confirm' : ''}`}
                          onClick={() => handleDeleteStudent(student.id)}
                          title={confirmDelete === student.id ? t('confirmDelete') : t('delete')}
                        >
                          {confirmDelete === student.id ? '❓' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Action Menu — unchanged */}
      {selectedStudentId && (() => {
        const student = students.find(s => s.id === selectedStudentId);
        if (!student) return null;
        
        const remaining = getRemainingBalance(student, settings.tuitionFees);
        
        return (
          <div className="quick-action-menu">
            <div className="quick-action-header">
              <h3>{student.name}</h3>
              <button 
                className="btn-close"
                onClick={() => setSelectedStudentId(null)}
              >
                ×
              </button>
            </div>
            
            <div className="quick-action-info">
              <div className="info-item">
                <span>{t('gradeLevel')}:</span>
                <strong>{t(student.gradeLevel)}</strong>
              </div>
              <div className="info-item">
                <span>{t('remainingBalance')}:</span>
                <strong className={remaining > 0 ? 'remaining' : 'paid-text'}>
                  {formatCurrency(remaining, settings.currency)}
                </strong>
              </div>
            </div>
            
            <div className="quick-action-buttons">
              <button 
                className="quick-action-btn"
                onClick={() => handleRecordPayment(student)}
                disabled={remaining <= 0}
              >
                💰 {t('recordPayment')}
              </button>
              
              <button 
                className="quick-action-btn"
                onClick={() => handleEditStudent(student)}
              >
                ✏️ {t('editStudent')}
              </button>
              
              <button 
                className="quick-action-btn danger"
                onClick={() => handleDeleteStudent(student.id)}
              >
                🗑️ {t('deleteStudent')}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm
          student={paymentStudent}
          onClose={() => {
            setShowPaymentForm(false);
            setPaymentStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;