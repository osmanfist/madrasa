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
  formatCurrency,
  formatDate 
} from '../utils/calculations';
import { exportToExcel } from '../utils/excelExport';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Reports() {
  const { students } = useStudents();
  const { settings } = useSettings();
  const { t, language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'outstanding' | 'payments-list' | 'charts'

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

  // Get all students with their payment details
  const studentsWithPayments = students
    .map(student => {
      const tuition = settings.tuitionFees[student.gradeLevel] || 0;
      const totalPaid = getTotalPaid(student);
      const remaining = tuition - totalPaid;
      const status = getPaymentStatus(student, settings.tuitionFees);
      
      const sortedPayments = [...student.payments].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      return {
        ...student,
        tuition,
        totalPaid,
        remaining,
        status,
        payments: sortedPayments,
        paymentCount: student.payments.length
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, language === 'ar' ? 'ar' : 'en'));

  // Calculate chart data
  const totalCollected = calculateTotalCollected(students);
  const totalOutstanding = calculateTotalOutstanding(students, settings.tuitionFees);
  const totalTuition = totalCollected + totalOutstanding;

  // Status counts
  const statusCounts = {
    paid: students.filter(s => getPaymentStatus(s, settings.tuitionFees) === 'paid').length,
    partial: students.filter(s => getPaymentStatus(s, settings.tuitionFees) === 'partial').length,
    unpaid: students.filter(s => getPaymentStatus(s, settings.tuitionFees) === 'unpaid').length,
  };

  // Collection by grade chart data
  const gradeChartData = {
    labels: gradeSummary.map(g => g.label),
    datasets: [
      {
        label: t('collectedAmount'),
        data: gradeSummary.map(g => g.totalCollected),
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
      },
      {
        label: t('outstandingAmount'),
        data: gradeSummary.map(g => g.totalOutstanding),
        backgroundColor: 'rgba(231, 76, 60, 0.8)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Payment status pie chart
  const statusPieData = {
    labels: [t('paid'), t('partial'), t('unpaid')],
    datasets: [
      {
        data: [statusCounts.paid, statusCounts.partial, statusCounts.unpaid],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 2,
      }
    ]
  };

  // Collection rate by grade (line chart)
  const rateLineData = {
    labels: gradeSummary.map(g => g.label),
    datasets: [
      {
        label: t('collectionRate'),
        data: gradeSummary.map(g => g.collectionRate),
        borderColor: 'rgba(52, 152, 219, 1)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  // Overall financial summary doughnut
  const financialDoughnutData = {
    labels: [t('collectedAmount'), t('outstandingAmount')],
    datasets: [
      {
        data: [totalCollected, totalOutstanding],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 2,
      }
    ]
  };

  // Payment method distribution
  const paymentMethods = students.reduce((acc, student) => {
    student.payments.forEach(payment => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    });
    return acc;
  }, {});

  const methodChartData = {
    labels: Object.keys(paymentMethods).map(key => t(key) || key),
    datasets: [
      {
        label: t('amount'),
        data: Object.values(paymentMethods),
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(52, 152, 219, 0.8)',
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const handleExportExcel = () => {
    exportToExcel(students, settings, t);
  };

  const handlePrint = () => {
    window.print();
  };

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        rtl: language === 'ar',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += formatCurrency(context.parsed.y, settings.currency);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value, settings.currency);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        rtl: language === 'ar',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed, settings.currency)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        rtl: language === 'ar',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        rtl: language === 'ar',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed, settings.currency)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header no-print">
        <h2>{t('reports')}</h2>
        <div className="report-actions">
          <button className="btn-excel" onClick={handleExportExcel}>
            {t('exportExcel')}
          </button>
          <button className="btn-print" onClick={handlePrint}>
            {t('exportPDF')}
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
        <button 
          className={`tab-btn ${activeTab === 'payments-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments-list')}
        >
         {t('studentPaymentsList')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
         {t('charts')}
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

      {/* Student Payments List - New Report */}
{activeTab === 'payments-list' && (
  <div className="report-section">
    <div className="report-card">
      <h3 className="report-title">{t('studentPaymentsList')}</h3>
      <p className="report-description">
        {t('studentPaymentsDescription')}
      </p>
      
      {studentsWithPayments.length === 0 ? (
        <div className="no-data">{t('noStudents')}</div>
      ) : (
        <div className="student-payments-container">
          {studentsWithPayments.map((student, index) => (
            <div key={student.id} className="student-payment-box">
              {/* Student Header */}
              <div className="student-box-header">
                <div className="student-box-title">
                  <span className="student-number">{index + 1}.</span>
                  <h4 className="student-box-name">{student.name}</h4>
                </div>
                <div className="student-box-meta">
                  <span className="meta-tag grade-tag">
                    {t(student.gradeLevel)}
                  </span>
                  <span className={`meta-tag status-tag status-${student.status}`}>
                    {t(student.status)}
                  </span>
                </div>
              </div>

              {/* Student Financial Summary */}
              <div className="student-box-summary">
                <div className="summary-item">
                  <span className="summary-label">{t('totalTuition')}</span>
                  <span className="summary-value">{formatCurrency(student.tuition, settings.currency)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('totalPaid')}</span>
                  <span className="summary-value collected">{formatCurrency(student.totalPaid, settings.currency)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('remainingBalance')}</span>
                  <span className={`summary-value ${student.remaining > 0 ? 'outstanding' : 'paid-text'}`}>
                    {formatCurrency(student.remaining, settings.currency)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('payments')}</span>
                  <span className="summary-value">{student.paymentCount}</span>
                </div>
              </div>

              {/* Payment History Table */}
              {student.payments.length > 0 ? (
                <div className="student-box-table">
                  <table className="payment-detail-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('amount')}</th>
                        <th>{t('method')}</th>
                        <th>{t('date')}</th>
                        <th>{t('receivedBy')}</th>
                        <th>{t('notes')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.payments.map((payment, idx) => (
                        <tr key={payment.id}>
                          <td className="payment-number">{idx + 1}</td>
                          <td className="payment-amount-cell">
                            {formatCurrency(payment.amount, settings.currency)}
                          </td>
                          <td>
                            <span className={`method-badge method-${payment.method}`}>
                              {payment.method === 'cash' ? '💵' : '🏦'} {t(payment.method)}
                              {payment.method === 'bank' && payment.bankDetails && (
                                <span className="bank-name-small">
                                  {' '}({payment.bankDetails.bankName})
                                </span>
                              )}
                            </span>
                          </td>
                          <td>{formatDate(payment.date, language)}</td>
                          <td>{payment.receivedBy || '-'}</td>
                          <td className="notes-cell">{payment.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-payments-message">
                  <p>{t('noPaymentsRecorded')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="report-section">
          <div className="charts-grid">
            {/* Financial Summary Doughnut */}
            <div className="chart-card">
              <h4 className="chart-title">💰 {t('financialSummary')}</h4>
              <div className="chart-container">
                <Doughnut data={financialDoughnutData} options={doughnutOptions} />
              </div>
              <div className="chart-summary">
                <div className="chart-stat">
                  <span className="stat-label">{t('totalTuition')}:</span>
                  <span className="stat-value">{formatCurrency(totalTuition, settings.currency)}</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">{t('collectionRate')}:</span>
                  <span className="stat-value">{totalTuition > 0 ? ((totalCollected / totalTuition) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            {/* Payment Status Pie */}
            <div className="chart-card">
              <h4 className="chart-title">📊 {t('paymentStatusDistribution')}</h4>
              <div className="chart-container">
                <Pie data={statusPieData} options={pieOptions} />
              </div>
              <div className="chart-summary">
                <div className="chart-stat">
                  <span className="stat-label">{t('totalStudents')}:</span>
                  <span className="stat-value">{students.length}</span>
                </div>
              </div>
            </div>

            {/* Grade Collection Bar Chart */}
            <div className="chart-card chart-full-width">
              <h4 className="chart-title">📊 {t('collectionByGrade')}</h4>
              <div className="chart-container">
                <Bar data={gradeChartData} options={barOptions} />
              </div>
            </div>

            {/* Collection Rate Line Chart */}
            <div className="chart-card chart-full-width">
              <h4 className="chart-title">📈 {t('collectionRateTrend')}</h4>
              <div className="chart-container">
                <Line data={rateLineData} options={lineOptions} />
              </div>
            </div>

            {/* Payment Methods Chart */}
            {Object.keys(paymentMethods).length > 0 && (
              <div className="chart-card chart-full-width">
                <h4 className="chart-title">💳 {t('paymentMethodDistribution')}</h4>
                <div className="chart-container">
                  <Bar data={methodChartData} options={barOptions} />
                </div>
              </div>
            )}

            {/* Quick Stats Cards */}
            <div className="chart-card chart-full-width">
              <h4 className="chart-title">📈 {t('quickStats')}</h4>
              <div className="quick-stats-grid">
                <div className="quick-stat-item">
                  <span className="stat-icon">✅</span>
                  <div>
                    <div className="stat-number">{statusCounts.paid}</div>
                    <div className="stat-label-small">{t('paid')}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-icon">⏳</span>
                  <div>
                    <div className="stat-number">{statusCounts.partial}</div>
                    <div className="stat-label-small">{t('partial')}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-icon">❌</span>
                  <div>
                    <div className="stat-number">{statusCounts.unpaid}</div>
                    <div className="stat-label-small">{t('unpaid')}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-icon">💰</span>
                  <div>
                    <div className="stat-number">{formatCurrency(totalCollected, settings.currency)}</div>
                    <div className="stat-label-small">{t('collectedAmount')}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-icon">📊</span>
                  <div>
                    <div className="stat-number">{totalTuition > 0 ? ((totalCollected / totalTuition) * 100).toFixed(1) : 0}%</div>
                    <div className="stat-label-small">{t('collectionRate')}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-icon">👨‍🎓</span>
                  <div>
                    <div className="stat-number">{students.length}</div>
                    <div className="stat-label-small">{t('totalStudents')}</div>
                  </div>
                </div>
              </div>
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