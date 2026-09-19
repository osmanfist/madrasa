import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSchoolLevel } from '../context/SchoolLevelContext';
import { SCHOOL_LEVELS, SCHOOL_LEVEL_KEYS } from '../utils/schoolLevels';
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
  const { activeLevel, getFilteredStudents } = useSchoolLevel();
  const navigate = useNavigate();

  // Scope students to the active level (or all if 'all')
  const scopedStudents = getFilteredStudents(students);

  // Calculate key metrics (scoped)
  const totalCollected = calculateTotalCollected(scopedStudents);
  const totalOutstanding = calculateTotalOutstanding(scopedStudents, settings.tuitionFees);
  const totalStudents = scopedStudents.length;
  const fullyPaidStudents = scopedStudents.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'paid'
  ).length;
  const partialPaidStudents = scopedStudents.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'partial'
  ).length;
  const unpaidStudents = scopedStudents.filter(s => 
    getPaymentStatus(s, settings.tuitionFees) === 'unpaid'
  ).length;

  // Collection rate (scoped)
  const totalTuition = totalCollected + totalOutstanding;
  const collectionRate = totalTuition > 0 ? (totalCollected / totalTuition) * 100 : 0;

  // Recent payments — scoped to students in active level
  const scopedStudentIds = new Set(scopedStudents.map(s => s.id));
  const recentPayments = getAllPayments()
    .filter(p => scopedStudentIds.has(p.studentId))
    .slice(0, 5);

  // Overdue students — scoped
  const overdueStudents = scopedStudents
    .filter(s => getRemainingBalance(s, settings.tuitionFees) > 0)
    .map(s => ({
      ...s,
      remaining: getRemainingBalance(s, settings.tuitionFees),
      status: getPaymentStatus(s, settings.tuitionFees)
    }))
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 5);

  // Build the grade-progress data for a given list of students + grades
  const buildGradeRows = (studentList, gradeKeys) => {
    return gradeKeys.map(gradeKey => {
      const gradeStudents = studentList.filter(s => s.gradeLevel === gradeKey);
      const gradeTuition = gradeStudents.reduce(
        (sum, s) => sum + (settings.tuitionFees[gradeKey] || 0), 0
      );
      const gradeCollected = gradeStudents.reduce((sum, s) => sum + getTotalPaid(s), 0);
      const gradeRate = gradeTuition > 0 ? (gradeCollected / gradeTuition) * 100 : 0;

      return {
        grade: gradeKey,
        label: t(gradeKey),
        studentCount: gradeStudents.length,
        tuition: gradeTuition,
        collected: gradeCollected,
        rate: gradeRate,
      };
    });
  };

  // Grade summary — depends on activeLevel
  const gradeSummary = activeLevel === 'all'
    ? SCHOOL_LEVEL_KEYS.map(levelKey => ({
        levelKey,
        levelLabel: t(levelKey),
        rows: buildGradeRows(scopedStudents, SCHOOL_LEVELS[levelKey].grades),
      }))
    : [{
        levelKey: activeLevel,
        levelLabel: t(activeLevel),
        rows: buildGradeRows(scopedStudents, SCHOOL_LEVELS[activeLevel].grades),
      }];

  // Level breakdown (only used when activeLevel === 'all')
  const levelBreakdown = SCHOOL_LEVEL_KEYS.map(levelKey => {
    const levelStudents = students.filter(
      s => (s.schoolLevel || 'secondary') === levelKey
    );
    const levelTuition = levelStudents.reduce(
      (sum, s) => sum + (settings.tuitionFees[s.gradeLevel] || 0), 0
    );
    const levelCollected = levelStudents.reduce((sum, s) => sum + getTotalPaid(s), 0);
    const levelOutstanding = levelTuition - levelCollected;
    const levelRate = levelTuition > 0 ? (levelCollected / levelTuition) * 100 : 0;

    return {
      levelKey,
      label: t(levelKey),
      studentCount: levelStudents.length,
      tuition: levelTuition,
      collected: levelCollected,
      outstanding: levelOutstanding,
      rate: levelRate,
    };
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>{t('dashboard')}</h2>
        <p className="school-year">{t('schoolYear')}: {settings.schoolYear}</p>
      </div>

      {/* Stats Cards (scoped to active level) */}
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

      {/* Breakdown by Level — only visible under "All Levels" */}
      {activeLevel === 'all' && (
        <div className="dashboard-section">
          <h3 className="section-title">🏫 {t('breakdownByLevel')}</h3>
          <div className="level-breakdown-grid">
            {levelBreakdown.map(lvl => (
              <div key={lvl.levelKey} className="level-breakdown-card">
                <h4 className="level-breakdown-title">{lvl.label}</h4>
                <div className="level-breakdown-stats">
                  <div className="level-stat">
                    <span className="level-stat-label">{t('totalStudents')}</span>
                    <span className="level-stat-value">{lvl.studentCount}</span>
                  </div>
                  <div className="level-stat">
                    <span className="level-stat-label">{t('totalCollected')}</span>
                    <span className="level-stat-value collected">
                      {formatCurrency(lvl.collected, settings.currency)}
                    </span>
                  </div>
                  <div className="level-stat">
                    <span className="level-stat-label">{t('totalOutstanding')}</span>
                    <span className={`level-stat-value ${lvl.outstanding > 0 ? 'outstanding' : 'paid-text'}`}>
                      {formatCurrency(lvl.outstanding, settings.currency)}
                    </span>
                  </div>
                  <div className="level-stat">
                    <span className="level-stat-label">{t('collectionRate')}</span>
                    <span className="level-stat-value">{lvl.rate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="level-progress-bar">
                  <div
                    className="level-progress-fill"
                    style={{ width: `${lvl.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade Collection Progress (grouped under All, single-level otherwise) */}
      <div className="dashboard-section">
        <h3 className="section-title">📊 {t('summaryByGrade')}</h3>
        <div className="grade-progress-list">
          {gradeSummary.map(group => (
            <div key={group.levelKey} className="grade-level-group">
              {activeLevel === 'all' && (
                <h4 className="grade-level-header">{group.levelLabel}</h4>
              )}
              <div className="grade-level-rows">
                {group.rows.map(grade => (
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