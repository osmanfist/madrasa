// Calculate total collected amount
export const calculateTotalCollected = (students) => {
  return students.reduce((total, student) => {
    const studentTotal = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return total + studentTotal;
  }, 0);
};

// Calculate total outstanding amount
export const calculateTotalOutstanding = (students, tuitionFees) => {
  const totalTuition = students.reduce((total, student) => {
    return total + (tuitionFees[student.gradeLevel] || 0);
  }, 0);
  
  const totalCollected = calculateTotalCollected(students);
  return Math.max(0, totalTuition - totalCollected);
};

// Calculate total tuition fees for all students
export const calculateTotalTuition = (students, tuitionFees) => {
  return students.reduce((total, student) => {
    return total + (tuitionFees[student.gradeLevel] || 0);
  }, 0);
};

// Get payment status for a student
export const getPaymentStatus = (student, tuitionFees) => {
  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
  const tuition = tuitionFees[student.gradeLevel] || 0;
  
  if (totalPaid === 0) return 'unpaid';
  if (totalPaid >= tuition) return 'paid';
  return 'partial';
};

// Get remaining balance for a student
export const getRemainingBalance = (student, tuitionFees) => {
  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
  const tuition = tuitionFees[student.gradeLevel] || 0;
  return Math.max(0, tuition - totalPaid);
};

// Get total paid for a student
export const getTotalPaid = (student) => {
  return student.payments.reduce((sum, p) => sum + p.amount, 0);
};

// Format currency
export const formatCurrency = (amount, currency = 'SAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString, locale = 'ar') => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
};