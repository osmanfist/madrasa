import { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('madrasa-students');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading students:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('madrasa-students', JSON.stringify(students));
  }, [students]);

  // Add a new student
  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  // Update student information
  const updateStudent = (id, updatedData) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id 
          ? { 
              ...student, 
              ...updatedData, 
              updatedAt: new Date().toISOString() 
            } 
          : student
      )
    );
  };

  // Delete a student
  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  // Add payment to a student
  const addPayment = (studentId, paymentData) => {
    const newPayment = {
      id: Date.now().toString(),
      ...paymentData,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              payments: [...student.payments, newPayment],
              updatedAt: new Date().toISOString()
            } 
          : student
      )
    );
    return newPayment;
  };

  // Delete a payment
  const deletePayment = (studentId, paymentId) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              payments: student.payments.filter(p => p.id !== paymentId),
              updatedAt: new Date().toISOString()
            } 
          : student
      )
    );
  };

  // Get a specific student
  const getStudent = (id) => {
    return students.find(student => student.id === id);
  };

  // Calculate total paid for a student
  const getTotalPaid = (studentId) => {
    const student = getStudent(studentId);
    if (!student) return 0;
    return student.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // Calculate remaining balance for a student
  const getRemainingBalance = (studentId) => {
    const student = getStudent(studentId);
    if (!student) return 0;
    const { getTuitionFee } = useSettings();
    const tuition = getTuitionFee(student.gradeLevel);
    const totalPaid = getTotalPaid(studentId);
    return Math.max(0, tuition - totalPaid);
  };

  // Check if student is fully paid
  const isFullyPaid = (studentId) => {
    return getRemainingBalance(studentId) === 0;
  };

  // Get payment status
  const getPaymentStatus = (studentId) => {
    const totalPaid = getTotalPaid(studentId);
    if (totalPaid === 0) return 'unpaid';
    if (isFullyPaid(studentId)) return 'paid';
    return 'partial';
  };

  // Get all payments sorted by date
  const getAllPayments = () => {
    const allPayments = [];
    students.forEach(student => {
      student.payments.forEach(payment => {
        allPayments.push({
          ...payment,
          studentId: student.id,
          studentName: student.name,
          gradeLevel: student.gradeLevel
        });
      });
    });
    return allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      addPayment,
      deletePayment,
      getStudent,
      getTotalPaid,
      getRemainingBalance,
      isFullyPaid,
      getPaymentStatus,
      getAllPayments,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within StudentProvider');
  }
  return context;
}