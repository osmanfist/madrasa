import { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  getTotalPaid, 
  getRemainingBalance, 
  getPaymentStatus,
  calculateTotalCollected,
  calculateTotalOutstanding,
  formatCurrency 
} from '../utils/calculations';
import { exportToExcel } from '../utils/excelExport';
import './Reports.css';

function Reports() {
  const { students } = useStudents();
  const { settings } = useSettings();
  const { t, language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'outstanding'

  // Calculate summary by grade
  const gradeSummary = [
    { grade: 'first-year', label: t('first-year') },
    { grade: 'second-year', label: t('second-year') },
    { grade: 'third-year', label: t('third-year') },
  ].map(({ grade, label }) => {
    const gradeStudents = students.filter(s => s.gradeLevel === grade);
    const totalTuition = gradeStudents.reduce((sum, s) => sum + (settings.tuitionFees[grade] || 0), 0);
    const totalCollected = gradeStudents.reduce((sum, s) => sum + getTotalPaid(s), 0);
    const totalOutstanding = totalTuition - totalCollected;
    const collectionRate = totalTuition > 0 ? (totalCollected / totalTuition) * 100 : 0;

    return {
      grade,
      label,
      studentCount: gradeStudents.length,
      totalTuition,
      totalCollected,
      totalOutstanding,
      collectionRate
    };
  });

  // Get outstanding students
  const outstandingStudents = students
    .filter(student => getRemainingBalance(student, settings.tuitionFees) > 0)
    .map(student => ({
      ...student,
      totalPaid: getTotalPaid(student),
      remaining: getRemainingBalance(student, settings.tuitionFees),
      status: getPaymentStatus(student, settings.tuitionFees)
    }))
    .sort((a, b) => b.remaining - a.remaining);

  const handleExportExcel = () => {
    exportToExcel(students, settings, t);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="page-header no-print">
        <h2>{t('reports')}</h2>
        <div className="report-actions">
          <button className="btn-excel" onClick={handleExportExcel}>
            📊 {t('exportExcel')}
          </button>
          <button className="btn-print" onClick={handlePrint}>
            🖨️ {t('exportPDF')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="report-tabs no-print">
        <button 
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          {t('summaryByGrade')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'outstanding' ? 'active' : ''}`}
          onClick={() => setActiveTab('outstanding')}
        >
          {t('outstandingPayments')}
        </button>
      </div>

      {/* Summary by Grade */}
      {activeTab === 'summary' && (
        <div className="report-section">
          <div className="report-card">
            <h3 className="report-title">{t('summaryByGrade')}</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>{t('grade')}</th>
                    <th>{t('numberOfStudents')}</th>
                    <th>{t('totalTuition')}</th>
                    <th>{t('collectedAmount')}</th>
                    <th>{t('outstandingAmount')}</th>
                    <th>{t('collectionRate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeSummary.map(row => (
                    <tr key={row.grade}>
                      <td className="grade-name">{row.label}</td>
                      <td>{row.studentCount}</td>
                      <td>{formatCurrency(row.totalTuition, settings.currency)}</td>
                      <td className="collected">{formatCurrency(row.totalCollected, settings.currency)}</td>
                      <td className={row.totalOutstanding > 0 ? 'outstanding' : 'paid-text'}>
                        {formatCurrency(row.totalOutstanding, settings.currency)}
                      </td>
                      <td>
                        <div className="collection-rate">
                          <div className="rate-bar">
                            <div 
                              className="rate-fill" 
                              style={{ width: `${row.collectionRate}%` }}
                            />
                          </div>
                          <span className="rate-text">{row.collectionRate.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>{t('total')}</strong></td>
                    <td><strong>{students.length}</strong></td>
                    <td><strong>{formatCurrency(calculateTotalOutstanding(students, settings.tuitionFees) + calculateTotalCollected(students), settings.currency)}</strong></td>
                    <td><strong className="collected">{formatCurrency(calculateTotalCollected(students), settings.currency)}</strong></td>
                    <td><strong className={calculateTotalOutstanding(students, settings.tuitionFees) > 0 ? 'outstanding' : 'paid-text'}>
                      {formatCurrency(calculateTotalOutstanding(students, settings.tuitionFees), settings.currency)}
                    </strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Outstanding Payments */}
      {activeTab === 'outstanding' && (
        <div className="report-section">
          <div className="report-card">
            <h3 className="report-title">{t('outstandingPayments')}</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>{t('studentName')}</th>
                    <th>{t('gradeLevel')}</th>
                    <th>{t('totalTuition')}</th>
                    <th>{t('totalPaid')}</th>
                    <th>{t('remainingBalance')}</th>
                    <th>{t('paymentStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">{t('noOutstandingPayments')}</td>
                    </tr>
                  ) : (
                    outstandingStudents.map(student => (
                      <tr key={student.id}>
                        <td className="student-name">{student.name}</td>
                        <td>{t(student.gradeLevel)}</td>
                        <td>{formatCurrency(settings.tuitionFees[student.gradeLevel] || 0, settings.currency)}</td>
                        <td className="collected">{formatCurrency(student.totalPaid, settings.currency)}</td>
                        <td className="outstanding">{formatCurrency(student.remaining, settings.currency)}</td>
                        <td>
                          <span className={`status-badge status-${student.status}`}>
                            {t(student.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Print Header (only visible when printing) */}
      <div className="print-header">
        <h2>{t('appName')} - {t('reports')}</h2>
        <p>{t('schoolYear')}: {settings.schoolYear}</p>
        <p>{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
      </div>
    </div>
  );
}

export default Reports;