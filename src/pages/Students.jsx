import { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { getTotalPaid, getRemainingBalance, getPaymentStatus, formatCurrency } from '../utils/calculations';
import StudentForm from '../components/Students/StudentForm';
import './Students.css';

function Students() {
  const { students, deleteStudent } = useStudents();
  const { getTuitionFee, settings } = useSettings();
  const { t, language } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    // Search by name
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by grade
    const matchesGrade = gradeFilter === 'all' || student.gradeLevel === gradeFilter;
    
    // Filter by payment status
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

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (confirmDelete === studentId) {
      deleteStudent(studentId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(studentId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
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
          value={gradeFilter} 
          onChange={(e) => setGradeFilter(e.target.value)}
          className="filter-select"
        >
            <option value="all">{t('allGrades')}</option>
            <option value="first-year">{t('first-year')}</option>
            <option value="second-year">{t('second-year')}</option>
            <option value="third-year">{t('third-year')}</option>
        </select>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
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
              <th>{t('academicPerformance')}</th>
              <th>{t('totalPaid')}</th>
              <th>{t('remainingBalance')}</th>
              <th>{t('paymentStatus')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">{t('noData')}</td>
              </tr>
            ) : (
              sortedStudents.map(student => {
                const totalPaid = getTotalPaid(student);
                const remaining = getRemainingBalance(student, settings.tuitionFees);
                const status = getPaymentStatus(student, settings.tuitionFees);
                const tuition = getTuitionFee(student.gradeLevel);
                
                return (
                  <tr key={student.id}>
                    <td className="student-name">{student.name}</td>
                    <td>{t(student.gradeLevel)}</td>
                    <td>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill" 
                          style={{ width: `${student.academicPercentage || 0}%` }}
                        />
                        <span className="percentage-text">{student.academicPercentage || 0}%</span>
                      </div>
                    </td>
                    <td>{formatCurrency(totalPaid, settings.currency)}</td>
                    <td className={remaining > 0 ? 'remaining' : 'paid-text'}>
                      {formatCurrency(remaining, settings.currency)}
                    </td>
                    <td>
                      <span className={`status-badge status-${status}`}>
                        {t(status)}
                      </span>
                    </td>
                    <td>
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

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default Students;