export const loadSampleData = () => {
  const sampleStudents = [
    {
      id: '1',
      name: 'أحمد محمد',
      gradeLevel: 'first-year',
      academicPercentage: 85,
      payments: [
        {
          id: 'p1',
          amount: 5000,
          method: 'cash',
          date: '2024-09-15',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-15'
    },
    {
      id: '2',
      name: 'فلان فرتكان العِلان',
      gradeLevel: 'second-year',
      academicPercentage: 85,
      payments: [
        {
          id: 'p2',
          amount: 6000,
          method: 'bank',
          date: '2024-09-10',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX123456',
            bankName: 'بنك الخرطوم',
            transferDate: '2024-09-10'
          },
          notes: 'تحويل بنكي'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-10'
    },
    {
      id: '3',
      name: 'علي مقطع الدُمك',
      gradeLevel: 'third-year',
      academicPercentage: 53,
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '4',
      name: 'فاطمة ترطيبة الحفري',
      gradeLevel: 'first-year',
      academicPercentage: 95,
      payments: [
        {
          id: 'p3',
          amount: 10000,
          method: 'cash',
          date: '2024-09-20',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-20'
    },
    {
      id: '5',
      name: ' عمر إبراهيم فلس',
      gradeLevel: 'second-year',
      academicPercentage: 88,
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '6',
      name: 'فاتح ففتي ففتي',
      gradeLevel: 'third-year',
      academicPercentage: 50,
      payments: [
        {
          id: 'p4',
          amount: 7500,
          method: 'cash',
          date: '2024-09-18',
          receivedBy: 'محاسب المدرسة',
          notes: 'نصف المبلغ'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-18'
    }
  ];

  const sampleSettings = {
    schoolYear: '2024-2025',
    currency: 'SDG',
    tuitionFees: {
      'first-year': 10000,
      'second-year': 12000,
      'third-year': 15000,
    }
  };

  localStorage.setItem('madrasa-students', JSON.stringify(sampleStudents));
  localStorage.setItem('madrasa-settings', JSON.stringify(sampleSettings));
  
  return {
    students: sampleStudents.length,
    totalTuition: Object.values(sampleSettings.tuitionFees).reduce((a, b) => a + b, 0)
  };
};