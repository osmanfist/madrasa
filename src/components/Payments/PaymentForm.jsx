import { useState } from 'react';
import { useStudents } from '../../context/StudentContext';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTotalPaid, getRemainingBalance, formatCurrency } from '../../utils/calculations';
import './PaymentForm.css';

function PaymentForm({ student: preselectedStudent, onClose }) {
  const { students, addPayment } = useStudents();
  const { settings } = useSettings();
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    studentId: preselectedStudent?.id || '',
    amount: '',
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    receivedBy: '',
    notes: '',
    bankDetails: {
      bankName: '',
      transactionNumber: '',
      transferDate: new Date().toISOString().split('T')[0],
    }
  });

  const [errors, setErrors] = useState({});

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const remainingBalance = selectedStudent 
    ? getRemainingBalance(selectedStudent, settings.tuitionFees) 
    : 0;

  const banks = [
    { 
      id: 'bank-of-khartoum', 
      name: language === 'ar' ? 'بنك الخرطوم' : 'Bank of Khartoum',
      app: language === 'ar' ? 'بنكك' : 'Bankak'
    },
    { 
      id: 'omdurman-national-bank', 
      name: language === 'ar' ? 'بنك أم درمان الوطني' : 'Omdurman National Bank',
      app: language === 'ar' ? 'اوكاش' : 'O-CASH'
    },
    { 
      id: 'faisal-islamic-bank', 
      name: language === 'ar' ? 'بنك فيصل الإسلامي' : 'Faisal Islamic Bank',
      app: language === 'ar' ? 'فوري' : 'Fawry'
    }
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = t('selectStudent');
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('enterValidAmount');
    }
    
    if (formData.amount > remainingBalance && selectedStudent) {
      newErrors.amount = `${t('amountExceedsBalance')} (${formatCurrency(remainingBalance, settings.currency)})`;
    }
    
    if (!formData.receivedBy.trim()) {
      newErrors.receivedBy = t('enterReceiverName');
    }
    
    if (formData.method === 'bank') {
      if (!formData.bankDetails.bankName) {
        newErrors.bankName = t('selectBank');
      }
      if (!formData.bankDetails.transactionNumber.trim()) {
        newErrors.transactionNumber = t('enterTransactionNumber');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedBank = banks.find(b => b.id === formData.bankDetails.bankName);
    
    const paymentData = {
      amount: Number(formData.amount),
      method: formData.method,
      date: formData.date,
      receivedBy: formData.receivedBy,
      notes: formData.notes,
      ...(formData.method === 'bank' && {
        bankDetails: {
          bankName: selectedBank ? `${selectedBank.name} (${selectedBank.app})` : formData.bankDetails.bankName,
          transactionNumber: formData.bankDetails.transactionNumber,
          transferDate: formData.bankDetails.transferDate,
        }
      })
    };

    addPayment(formData.studentId, paymentData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('recordPayment')}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              {/* Student Selection */}
              <div className="form-group">
                <label htmlFor="studentId">{t('selectStudent')} *</label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={errors.studentId ? 'error' : ''}
                  disabled={!!preselectedStudent}
                >
                  <option value="">{t('selectStudent')}</option>
                  {students.map(student => {
                    const remaining = getRemainingBalance(student, settings.tuitionFees);
                    return (
                      <option key={student.id} value={student.id}>
                        {student.name} - {t(student.gradeLevel)} ({formatCurrency(remaining, settings.currency)})
                      </option>
                    );
                  })}
                </select>
                {errors.studentId && <span className="error-text">{errors.studentId}</span>}
              </div>

              {/* Balance Info */}
              {selectedStudent && (
                <div className="balance-info">
                  <div className="balance-row">
                    <span>{t('totalPaid')}:</span>
                    <strong>{formatCurrency(getTotalPaid(selectedStudent), settings.currency)}</strong>
                  </div>
                  <div className="balance-row">
                    <span>{t('remainingBalance')}:</span>
                    <strong className="remaining">{formatCurrency(remainingBalance, settings.currency)}</strong>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="form-group">
                <label htmlFor="amount">{t('paymentAmount')} *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={errors.amount ? 'error' : ''}
                  placeholder={t('enterAmount')}
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label htmlFor="method">{t('paymentMethod')} *</label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                >
                  <option value="cash">{t('cash')}</option>
                  <option value="bank">{t('bankTransfer')}</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              {/* Bank Details (only for bank transfers) */}
              {formData.method === 'bank' && (
                <div className="bank-details">
                  <div className="form-group">
                    <label htmlFor="bankName">{t('selectBank')} *</label>
                    <select
                      id="bankName"
                      name="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleBankDetailsChange}
                      className={errors.bankName ? 'error' : ''}
                    >
                      <option value="">{t('selectBank')}</option>
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} - {bank.app}
                        </option>
                      ))}
                    </select>
                    {errors.bankName && <span className="error-text">{errors.bankName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="transactionNumber">{t('transactionNumber')} *</label>
                    <input
                      type="text"
                      id="transactionNumber"
                      name="transactionNumber"
                      value={formData.bankDetails.transactionNumber}
                      onChange={handleBankDetailsChange}
                      className={errors.transactionNumber ? 'error' : ''}
                      placeholder={t('transactionNumber')}
                    />
                    {errors.transactionNumber && <span className="error-text">{errors.transactionNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="transferDate">{t('transferDate')}</label>
                    <input
                      type="date"
                      id="transferDate"
                      name="transferDate"
                      value={formData.bankDetails.transferDate}
                      onChange={handleBankDetailsChange}
                    />
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="form-group">
                <label htmlFor="date">{t('paymentDate')} *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              {/* Received By */}
              <div className="form-group">
                <label htmlFor="receivedBy">{t('receivedBy')} *</label>
                <input
                  type="text"
                  id="receivedBy"
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  className={errors.receivedBy ? 'error' : ''}
                  placeholder={t('receivedBy')}
                />
                {errors.receivedBy && <span className="error-text">{errors.receivedBy}</span>}
              </div>

              {/* Notes */}
              <div className="form-group">
                <label htmlFor="notes">{t('notes')}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder={t('notes')}
                />
              </div>
            </div>
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

export default PaymentForm;