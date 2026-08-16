import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  getTotalPaid, 
  getRemainingBalance, 
  getPaymentStatus,
  calculateTotalCollected,
  calculateTotalOutstanding,
  formatCurrency,
  formatDate 
} from '../utils/calculations';
import './Dashboard.css';

function Dashboard() {
  const { students, getAllPayments } = useStudents();
  const { settings } = useSettings();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Calculate key metrics
  const totalCollected = calculateTotalCollected(students);
  const totalOutstanding = calculateTotalOutstanding(students, settings.tuitionFees);
  const totalStudents = students.length;
  const fullyPaidStudents = students.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'paid'
  ).length;
  const partialPaidStudents = students.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'partial'
  ).length;
  const unpaidStudents = students.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'unpaid'
  ).length;

  // Calculate collection rate
  const totalTuition = totalCollected + totalOutstanding;
  const collectionRate = totalTuition > 0 ? (totalCollected / totalTuition) * 100 : 0;

  // Get recent payments (last 5)
  const recentPayments = getAllPayments().slice(0, 5);

  // Get overdue students (sorted by highest balance)
  const overdueStudents = students
    .filter(s => getRemainingBalance(s, settings.tuitionFees) > 0)
    .map(s => ({
      ...s,
      remaining: getRemainingBalance(s, settings.tuitionFees),
      status: getPaymentStatus(s, settings.tuitionFees)
    }))
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 5);

  // Grade summary
  const gradeSummary = [
    { grade: 'first-year', label: t('first-year') },
    { grade: 'second-year', label: t('second-year') },
    { grade: 'third-year', label: t('third-year') },
  ].map(({ grade, label }) => {
    const gradeStudents = students.filter(s => s.gradeLevel === grade);
    const gradeTuition = gradeStudents.reduce((sum, s) => sum + (settings.tuitionFees[grade] || 0), 0);
    const gradeCollected = gradeStudents.reduce((sum, s) => sum + getTotalPaid(s), 0);
    const gradeRate = gradeTuition > 0 ? (gradeCollected / gradeTuition) * 100 : 0;

    return {
      grade,
      label,
      studentCount: gradeStudents.length,
      tuition: gradeTuition,
      collected: gradeCollected,
      rate: gradeRate
    };
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>{t('dashboard')}</h2>
        <p className="school-year">{t('schoolYear')}: {settings.schoolYear}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-collected">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(totalCollected, settings.currency)}</div>
            <div className="stat-label">{t('totalCollected')}</div>
          </div>
        </div>

        <div className="stat-card stat-outstanding">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(totalOutstanding, settings.currency)}</div>
            <div className="stat-label">{t('totalOutstanding')}</div>
          </div>
        </div>

        <div className="stat-card stat-students">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">{t('totalStudents')}</div>
          </div>
        </div>

        <div className="stat-card stat-rate">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{collectionRate.toFixed(1)}%</div>
            <div className="stat-label">{t('collectionRate')}</div>
          </div>
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="status-summary">
        <div className="status-item">
          <span className="status-dot status-paid"></span>
          <span>{t('paid')}: {fullyPaidStudents}</span>
        </div>
        <div className="status-item">
          <span className="status-dot status-partial"></span>
          <span>{t('partial')}: {partialPaidStudents}</span>
        </div>
        <div className="status-item">
          <span className="status-dot status-unpaid"></span>
          <span>{t('unpaid')}: {unpaidStudents}</span>
        </div>
      </div>

      {/* Grade Collection Progress */}
      <div className="dashboard-section">
        <h3 className="section-title">📊 {t('summaryByGrade')}</h3>
        <div className="grade-progress-list">
          {gradeSummary.map(grade => (
            <div key={grade.grade} className="grade-progress-item">
              <div className="grade-progress-header">
                <span className="grade-name">{grade.label}</span>
                <span className="grade-stats">
                  {grade.studentCount} {t('numberOfStudents')} • 
                  {formatCurrency(grade.collected, settings.currency)} / 
                  {formatCurrency(grade.tuition, settings.currency)}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${grade.rate}%` }}
                />
              </div>
              <span className="progress-percentage">{grade.rate.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-columns">
        {/* Recent Payments */}
        <div className="dashboard-section">
          <h3 className="section-title">💳 {t('recentPayments')}</h3>
          <div className="recent-list">
            {recentPayments.length === 0 ? (
              <p className="empty-state">{t('noPayments')}</p>
            ) : (
              recentPayments.map(payment => (
                <div key={payment.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-name">{payment.studentName}</span>
                    <span className="recent-meta">
                      {t(payment.method)} • {formatDate(payment.date, language)}
                    </span>
                  </div>
                  <span className="recent-amount">
                    {formatCurrency(payment.amount, settings.currency)}
                  </span>
                </div>
              ))
            )}
          </div>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/payments')}
          >
            {t('viewAll')} →
          </button>
        </div>

        {/* Overdue Students */}
        <div className="dashboard-section">
          <h3 className="section-title">⚠️ {t('overdueStudents')}</h3>
          <div className="recent-list">
            {overdueStudents.length === 0 ? (
              <p className="empty-state">{t('noOverdueStudents')}</p>
            ) : (
              overdueStudents.map(student => (
                <div key={student.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-name">{student.name}</span>
                    <span className="recent-meta">{t(student.gradeLevel)}</span>
                  </div>
                  <span className="overdue-amount">
                    {formatCurrency(student.remaining, settings.currency)}
                  </span>
                </div>
              ))
            )}
          </div>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/reports')}
          >
            {t('viewAll')} →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3 className="section-title">⚡ {t('quickActions')}</h3>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-card"
            onClick={() => navigate('/students')}
          >
            <span className="quick-action-icon">➕</span>
            <span>{t('addStudent')}</span>
          </button>
          <button 
            className="quick-action-card"
            onClick={() => navigate('/payments')}
          >
            <span className="quick-action-icon">💰</span>
            <span>{t('recordPayment')}</span>
          </button>
          <button 
            className="quick-action-card"
            onClick={() => navigate('/reports')}
          >
            <span className="quick-action-icon">📊</span>
            <span>{t('reports')}</span>
          </button>
          <button 
            className="quick-action-card"
            onClick={() => navigate('/settings')}
          >
            <span className="quick-action-icon">⚙️</span>
            <span>{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;