import * as XLSX from 'xlsx';

export const exportToExcel = (students, settings, t) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Calculate helper functions
  const getTotalPaid = (student) => {
    return student.payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingBalance = (student) => {
    const totalPaid = getTotalPaid(student);
    const tuition = settings.tuitionFees[student.gradeLevel] || 0;
    return Math.max(0, tuition - totalPaid);
  };

  const getPaymentStatus = (student) => {
    const remaining = getRemainingBalance(student);
    if (remaining === 0) return 'Paid';
    const totalPaid = getTotalPaid(student);
    if (totalPaid === 0) return 'Unpaid';
    return 'Partial';
  };

  // Sheet 1: Student Summary
  const studentData = students.map(student => ({
    'Name': student.name,
    'Grade': student.gradeLevel,
    'Tuition Fee': settings.tuitionFees[student.gradeLevel] || 0,
    'Total Paid': getTotalPaid(student),
    'Remaining Balance': getRemainingBalance(student),
    'Status': getPaymentStatus(student),
  }));

  const wsStudents = XLSX.utils.json_to_sheet(studentData);
  XLSX.utils.book_append_sheet(wb, wsStudents, 'Students Summary');

  // Sheet 2: Payment History
  const paymentData = [];
  students.forEach(student => {
    student.payments.forEach(payment => {
      paymentData.push({
        'Student Name': student.name,
        'Grade': student.gradeLevel,
        'Amount': payment.amount,
        'Method': payment.method,
        'Date': payment.date,
        'Received By': payment.receivedBy,
        'Transaction Number': payment.bankDetails?.transactionNumber || '',
        'Bank Name': payment.bankDetails?.bankName || '',
        'Notes': payment.notes || '',
      });
    });
  });

  const wsPayments = XLSX.utils.json_to_sheet(paymentData);
  XLSX.utils.book_append_sheet(wb, wsPayments, 'Payment History');

  // Sheet 3: Summary by Grade
  const gradeSummary = ['first-year', 'second-year', 'third-year'].map(grade => {
    const gradeStudents = students.filter(s => s.gradeLevel === grade);
    const totalTuition = gradeStudents.reduce((sum, s) => sum + (settings.tuitionFees[grade] || 0), 0);
    const totalCollected = gradeStudents.reduce((sum, s) => sum + getTotalPaid(s), 0);
    
    return {
      'Grade': grade,
      'Students': gradeStudents.length,
      'Total Tuition': totalTuition,
      'Collected': totalCollected,
      'Outstanding': totalTuition - totalCollected,
      'Collection Rate': totalTuition > 0 ? `${((totalCollected / totalTuition) * 100).toFixed(1)}%` : '0%',
    };
  });

  const wsGradeSummary = XLSX.utils.json_to_sheet(gradeSummary);
  XLSX.utils.book_append_sheet(wb, wsGradeSummary, 'Grade Summary');

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `Madrasa_Report_${date}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};