import { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { getTotalPaid, getRemainingBalance, formatCurrency, formatDate } from '../utils/calculations';
import PaymentForm from '../components/Payments/PaymentForm';
import './Payments.css';

function Payments() {
  const { students, getAllPayments, deletePayment } = useStudents();
  const { settings } = useSettings();
  const { t, language } = useLanguage();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const allPayments = getAllPayments();

  // Filter payments
  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const handleRecordPayment = (student = null) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleDeletePayment = (studentId, paymentId) => {
    if (confirm(t('confirmDeletePayment'))) {
      deletePayment(studentId, paymentId);
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h2>{t('payments')}</h2>
        <button className="btn-primary" onClick={() => handleRecordPayment()}>
          + {t('recordPayment')}
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder={t('searchStudent')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={methodFilter} 
          onChange={(e) => setMethodFilter(e.target.value)}
          className="filter-select"
          style={{ color: '#333', backgroundColor: 'white' }}
        >
          <option value="all">{t('allMethods')}</option>
          <option value="cash">{t('cash')}</option>
          <option value="bank">{t('bankTransfer')}</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>{t('studentName')}</th>
              <th>{t('gradeLevel')}</th>
              <th>{t('amount')}</th>
              <th>{t('method')}</th>
              <th>{t('date')}</th>
              <th>{t('receivedBy')}</th>
              <th>{t('remainingBalance')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">{t('noPayments')}</td>
              </tr>
            ) : (
              filteredPayments.map(payment => {
                const student = students.find(s => s.id === payment.studentId);
                const remaining = student ? getRemainingBalance(student, settings.tuitionFees) : 0;
                
                return (
                  <tr key={payment.id}>
                    <td className="student-name">{payment.studentName}</td>
                    <td>{t(payment.gradeLevel)}</td>
                    <td className="payment-amount">
                      {formatCurrency(payment.amount, settings.currency)}
                    </td>
                    <td>
                      <span className={`method-badge method-${payment.method}`}>
                        {payment.method === 'cash' ? '💵' : '🏦'} {t(payment.method)}
                      </span>
                    </td>
                    <td>{formatDate(payment.date, language)}</td>
                    <td>{payment.receivedBy}</td>
                    <td className={remaining > 0 ? 'remaining' : 'paid-text'}>
                      {formatCurrency(remaining, settings.currency)}
                    </td>
                    <td>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDeletePayment(payment.studentId, payment.id)}
                        title={t('delete')}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <PaymentForm
          student={selectedStudent}
          onClose={() => {
            setShowForm(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Payments;