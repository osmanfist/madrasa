export const sampleStudents = [
  {
    id: '1',
    name: 'أحمد محمد',
    gradeLevel: 'grade-10',
    academicPercentage: 85,
    payments: [
      {
        id: 'p1',
        amount: 5000,
        method: 'cash',
        date: '2024-09-15',
        receivedBy: 'محاسب المدرسة',
        notes: ''
      }
    ],
    createdAt: '2024-09-01',
    updatedAt: '2024-09-15'
  },
  {
    id: '2',
    name: 'سارة أحمد',
    gradeLevel: 'grade-11',
    academicPercentage: 92,
    payments: [
      {
        id: 'p2',
        amount: 6000,
        method: 'bank',
        date: '2024-09-10',
        receivedBy: 'محاسب المدرسة',
        bankDetails: {
          transactionNumber: 'TRX123456',
          bankName: 'البنك الأهلي',
          transferDate: '2024-09-10'
        },
        notes: ''
      }
    ],
    createdAt: '2024-09-01',
    updatedAt: '2024-09-10'
  },
  {
    id: '3',
    name: 'محمد علي',
    gradeLevel: 'grade-12',
    academicPercentage: 78,
    payments: [],
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  }
];