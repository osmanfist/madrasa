export const loadSampleData = () => {
  const sampleStudents = [
    // Original 6 students
    {
      id: '1',
      name: 'أحمد محمد',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p1',
          amount: 500000,
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
      payments: [
        {
          id: 'p2',
          amount: 600000,
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
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '4',
      name: 'فاطمة ترطيبة الحفري',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p3',
          amount: 1000000,
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
      name: 'عمر إبراهيم فلس',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '6',
      name: 'فاتح ففتي ففتي',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p4',
          amount: 750000,
          method: 'cash',
          date: '2024-09-18',
          receivedBy: 'محاسب المدرسة',
          notes: 'نصف المبلغ'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-18'
    },

    // 20 New Students
    // First Year Students (7 students)
    {
      id: '7',
      name: 'محمد عثمان الطيب',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p7',
          amount: 300000,
          method: 'cash',
          date: '2024-09-05',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        },
        {
          id: 'p8',
          amount: 200000,
          method: 'cash',
          date: '2024-10-15',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة ثانية'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-15'
    },
    {
      id: '8',
      name: 'آمنة عبد الرحمن حسن',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p9',
          amount: 1000000,
          method: 'bank',
          date: '2024-09-01',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX789012',
            bankName: 'بنك أم درمان الوطني',
            transferDate: '2024-09-01'
          },
          notes: 'دفعة كاملة عبر البنك'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '9',
      name: 'خالد أحمد البشير',
      gradeLevel: 'first-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '10',
      name: 'سارة محمود عبد الله',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p10',
          amount: 400000,
          method: 'cash',
          date: '2024-09-12',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-12'
    },
    {
      id: '11',
      name: 'إبراهيم علي نور',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p11',
          amount: 600000,
          method: 'bank',
          date: '2024-09-08',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX345678',
            bankName: 'بنك فيصل الإسلامي',
            transferDate: '2024-09-08'
          },
          notes: 'تحويل بنكي'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-08'
    },
    {
      id: '12',
      name: 'زينب محمد علي',
      gradeLevel: 'first-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '13',
      name: 'حسن إبراهيم موسى',
      gradeLevel: 'first-year',
      payments: [
        {
          id: 'p13',
          amount: 500000,
          method: 'cash',
          date: '2024-09-14',
          receivedBy: 'محاسب المدرسة',
          notes: 'نصف المبلغ'
        },
        {
          id: 'p14',
          amount: 300000,
          method: 'cash',
          date: '2024-10-01',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة إضافية'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-01'
    },

    // Second Year Students (7 students)
    {
      id: '14',
      name: 'مريم عبد الله محمد',
      gradeLevel: 'second-year',
      payments: [
        {
          id: 'p14',
          amount: 600000,
          method: 'cash',
          date: '2024-09-06',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-06'
    },
    {
      id: '15',
      name: 'عبد الله علي كرار',
      gradeLevel: 'second-year',
      payments: [
        {
          id: 'p15',
          amount: 1200000,
          method: 'bank',
          date: '2024-09-02',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX901234',
            bankName: 'بنك الخرطوم',
            transferDate: '2024-09-02'
          },
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-02'
    },
    {
      id: '16',
      name: 'فاطمة أحمد عمر',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '17',
      name: 'محمد الفاتح بشرى',
      gradeLevel: 'second-year',
      payments: [
        {
          id: 'p17',
          amount: 800000,
          method: 'cash',
          date: '2024-09-10',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        },
        {
          id: 'p18',
          amount: 200000,
          method: 'bank',
          date: '2024-09-25',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX567890',
            bankName: 'بنك أم درمان الوطني',
            transferDate: '2024-09-25'
          },
          notes: 'دفعة ثانية'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-25'
    },
    {
      id: '18',
      name: 'رهام عوض محمد',
      gradeLevel: 'second-year',
      payments: [
        {
          id: 'p19',
          amount: 400000,
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
      id: '19',
      name: 'طلحة عبد الرحمن العجب',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '20',
      name: 'آسيا محمدين عبد الله',
      gradeLevel: 'second-year',
      payments: [
        {
          id: 'p20',
          amount: 600000,
          method: 'bank',
          date: '2024-09-07',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX234567',
            bankName: 'بنك فيصل الإسلامي',
            transferDate: '2024-09-07'
          },
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-07'
    },

    // Third Year Students (6 students)
    {
      id: '21',
      name: 'بشير محمد الأمين',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p21',
          amount: 1000000,
          method: 'cash',
          date: '2024-09-04',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى كبيرة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-04'
    },
    {
      id: '22',
      name: 'هدى محمد أحمد',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p22',
          amount: 1500000,
          method: 'bank',
          date: '2024-09-03',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX678901',
            bankName: 'بنك الخرطوم',
            transferDate: '2024-09-03'
          },
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-03'
    },
    {
      id: '23',
      name: 'عباس الحسن حامد',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p23',
          amount: 500000,
          method: 'cash',
          date: '2024-09-12',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        },
        {
          id: 'p24',
          amount: 300000,
          method: 'cash',
          date: '2024-10-05',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة ثانية'
        },
        {
          id: 'p25',
          amount: 200000,
          method: 'bank',
          date: '2024-10-20',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX345678',
            bankName: 'بنك أم درمان الوطني',
            transferDate: '2024-10-20'
          },
          notes: 'دفعة ثالثة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-20'
    },
    {
      id: '24',
      name: 'سمية محمد نور',
      gradeLevel: 'third-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '25',
      name: 'عاطف محمد الأمين',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p26',
          amount: 750000,
          method: 'cash',
          date: '2024-09-09',
          receivedBy: 'محاسب المدرسة',
          notes: 'نصف المبلغ'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-09'
    },
    {
      id: '26',
      name: 'نورا عوض الكريم',
      gradeLevel: 'third-year',
      payments: [
        {
          id: 'p27',
          amount: 400000,
          method: 'bank',
          date: '2024-09-06',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX789012',
            bankName: 'بنك فيصل الإسلامي',
            transferDate: '2024-09-06'
          },
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-06'
    }
  ];

  const sampleSettings = {
    schoolYear: '2024-2025',
    currency: 'SDG',
    tuitionFees: {
      'first-year': 1000000,
      'second-year': 1200000,
      'third-year': 1500000,
    }
  };

  localStorage.setItem('madrasa-students', JSON.stringify(sampleStudents));
  localStorage.setItem('madrasa-settings', JSON.stringify(sampleSettings));
  
  // Calculate total tuition for all students
  const totalTuition = sampleStudents.reduce((sum, student) => {
    return sum + (sampleSettings.tuitionFees[student.gradeLevel] || 0);
  }, 0);

  // Calculate total collected
  const totalCollected = sampleStudents.reduce((sum, student) => {
    return sum + student.payments.reduce((s, p) => s + p.amount, 0);
  }, 0);

  // Calculate number of students by status
  const statusCounts = {
    paid: 0,
    partial: 0,
    unpaid: 0
  };

  sampleStudents.forEach(student => {
    const tuition = sampleSettings.tuitionFees[student.gradeLevel] || 0;
    const paid = student.payments.reduce((s, p) => s + p.amount, 0);
    
    if (paid >= tuition) {
      statusCounts.paid++;
    } else if (paid > 0) {
      statusCounts.partial++;
    } else {
      statusCounts.unpaid++;
    }
  });

  return {
    students: sampleStudents.length,
    totalTuition,
    totalCollected,
    statusCounts,
    settings: sampleSettings
  };
};