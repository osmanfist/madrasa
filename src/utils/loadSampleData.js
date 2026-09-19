export const loadSampleData = () => {
  const sampleStudents = [
    // ============================================================
    // SECONDARY (existing 26 students + schoolLevel tag)
    // ============================================================
    {
      id: '1',
      name: 'أحمد محمد',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'third-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '4',
      name: 'فاطمة ترطيبة الحفري',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '6',
      name: 'فاتح ففتي ففتي',
      schoolLevel: 'secondary',
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
    {
      id: '7',
      name: 'محمد عثمان الطيب',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'first-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '10',
      name: 'سارة محمود عبد الله',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'first-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '13',
      name: 'حسن إبراهيم موسى',
      schoolLevel: 'secondary',
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
    {
      id: '14',
      name: 'مريم عبد الله محمد',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '17',
      name: 'محمد الفاتح بشرى',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'second-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '20',
      name: 'آسيا محمدين عبد الله',
      schoolLevel: 'secondary',
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
    {
      id: '21',
      name: 'بشير محمد الأمين',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
      gradeLevel: 'third-year',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '25',
      name: 'عاطف محمد الأمين',
      schoolLevel: 'secondary',
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
      schoolLevel: 'secondary',
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
    },

    // ============================================================
    // MIDDLE SCHOOL (grades 7–9) — 9 students
    // ============================================================
    {
      id: '27',
      name: 'يوسف إبراهيم الطيب',
      schoolLevel: 'middle',
      gradeLevel: 'grade-7',
      payments: [
        {
          id: 'p27',
          amount: 400000,
          method: 'cash',
          date: '2024-09-10',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-10'
    },
    {
      id: '28',
      name: 'رقية محمد الحسن',
      schoolLevel: 'middle',
      gradeLevel: 'grade-7',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '29',
      name: 'معاذ عبد الله الأمين',
      schoolLevel: 'middle',
      gradeLevel: 'grade-7',
      payments: [
        {
          id: 'p29',
          amount: 800000,
          method: 'bank',
          date: '2024-09-05',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX112233',
            bankName: 'بنك الخرطوم',
            transferDate: '2024-09-05'
          },
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-05'
    },
    {
      id: '30',
      name: 'سلمى عثمان النور',
      schoolLevel: 'middle',
      gradeLevel: 'grade-8',
      payments: [
        {
          id: 'p30',
          amount: 500000,
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
      id: '31',
      name: 'خليل محمود بشير',
      schoolLevel: 'middle',
      gradeLevel: 'grade-8',
      payments: [
        {
          id: 'p31',
          amount: 300000,
          method: 'cash',
          date: '2024-09-18',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        },
        {
          id: 'p32',
          amount: 300000,
          method: 'bank',
          date: '2024-10-02',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX445566',
            bankName: 'بنك فيصل الإسلامي',
            transferDate: '2024-10-02'
          },
          notes: 'دفعة ثانية'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-02'
    },
    {
      id: '32',
      name: 'ليلى عبد الرحيم',
      schoolLevel: 'middle',
      gradeLevel: 'grade-8',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '33',
      name: 'أنس الطيب عبد القادر',
      schoolLevel: 'middle',
      gradeLevel: 'grade-9',
      payments: [
        {
          id: 'p33',
          amount: 1000000,
          method: 'cash',
          date: '2024-09-03',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-03'
    },
    {
      id: '34',
      name: 'تسنيم إدريس محمد',
      schoolLevel: 'middle',
      gradeLevel: 'grade-9',
      payments: [
        {
          id: 'p34',
          amount: 700000,
          method: 'bank',
          date: '2024-09-08',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX778899',
            bankName: 'بنك أم درمان الوطني',
            transferDate: '2024-09-08'
          },
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-08'
    },
    {
      id: '35',
      name: 'مصعب الفاتح الأمين',
      schoolLevel: 'middle',
      gradeLevel: 'grade-9',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },

    // ============================================================
    // ELEMENTARY (grades 1–6) — 15 students
    // ============================================================
    {
      id: '36',
      name: 'ريان محمد الأمين',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-1',
      payments: [
        {
          id: 'p36',
          amount: 500000,
          method: 'cash',
          date: '2024-09-05',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-05'
    },
    {
      id: '37',
      name: 'جنى عثمان إبراهيم',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-1',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '38',
      name: 'حمزة الطيب النور',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-1',
      payments: [
        {
          id: 'p38',
          amount: 300000,
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
      id: '39',
      name: 'ملك محمود عبد الله',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-2',
      payments: [
        {
          id: 'p39',
          amount: 500000,
          method: 'bank',
          date: '2024-09-04',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX100200',
            bankName: 'بنك الخرطوم',
            transferDate: '2024-09-04'
          },
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-04'
    },
    {
      id: '40',
      name: 'آدم عبد الرحمن محمد',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-2',
      payments: [
        {
          id: 'p40',
          amount: 200000,
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
      id: '41',
      name: 'لين إبراهيم الأمين',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-2',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '42',
      name: 'محمد عبد الله الطيب',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-3',
      payments: [
        {
          id: 'p42',
          amount: 600000,
          method: 'cash',
          date: '2024-09-06',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-06'
    },
    {
      id: '43',
      name: 'سارة عوض الكريم',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-3',
      payments: [
        {
          id: 'p43',
          amount: 300000,
          method: 'bank',
          date: '2024-09-10',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX300400',
            bankName: 'بنك فيصل الإسلامي',
            transferDate: '2024-09-10'
          },
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-10'
    },
    {
      id: '44',
      name: 'عبد الله محمد الحسن',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-3',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '45',
      name: 'هبة الطيب عبد القادر',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-4',
      payments: [
        {
          id: 'p45',
          amount: 600000,
          method: 'cash',
          date: '2024-09-07',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-07'
    },
    {
      id: '46',
      name: 'عمر إدريس محمد',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-4',
      payments: [
        {
          id: 'p46',
          amount: 300000,
          method: 'cash',
          date: '2024-09-14',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        },
        {
          id: 'p47',
          amount: 200000,
          method: 'cash',
          date: '2024-10-10',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة ثانية'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-10'
    },
    {
      id: '47',
      name: 'ريم الفاتح النور',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-5',
      payments: [
        {
          id: 'p47',
          amount: 700000,
          method: 'bank',
          date: '2024-09-03',
          receivedBy: 'محاسب المدرسة',
          bankDetails: {
            transactionNumber: 'TRX500600',
            bankName: 'بنك أم درمان الوطني',
            transferDate: '2024-09-03'
          },
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-03'
    },
    {
      id: '48',
      name: 'زياد محمود بشير',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-5',
      payments: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01'
    },
    {
      id: '49',
      name: 'دانة عبد الرحيم عثمان',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-6',
      payments: [
        {
          id: 'p49',
          amount: 700000,
          method: 'cash',
          date: '2024-09-05',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة كاملة'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-05'
    },
    {
      id: '50',
      name: 'سامي إبراهيم عبد الله',
      schoolLevel: 'elementary',
      gradeLevel: 'grade-6',
      payments: [
        {
          id: 'p50',
          amount: 400000,
          method: 'cash',
          date: '2024-09-11',
          receivedBy: 'محاسب المدرسة',
          notes: 'دفعة أولى'
        }
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-11'
    }
  ];

  const sampleSettings = {
    schoolYear: '2024-2025',
    currency: 'SDG',
    tuitionFees: {
      // Elementary
      'grade-1': 500000,
      'grade-2': 500000,
      'grade-3': 600000,
      'grade-4': 600000,
      'grade-5': 700000,
      'grade-6': 700000,
      // Middle
      'grade-7': 800000,
      'grade-8': 900000,
      'grade-9': 1000000,
      // Secondary
      'first-year': 1000000,
      'second-year': 1200000,
      'third-year': 1500000,
    }
  };

  localStorage.setItem('madrasa-students', JSON.stringify(sampleStudents));
  localStorage.setItem('madrasa-settings', JSON.stringify(sampleSettings));
  
  // Compute summary counts for the toast message
  const totalTuition = sampleStudents.reduce((sum, student) => {
    return sum + (sampleSettings.tuitionFees[student.gradeLevel] || 0);
  }, 0);

  const totalCollected = sampleStudents.reduce((sum, student) => {
    return sum + student.payments.reduce((s, p) => s + p.amount, 0);
  }, 0);

  const statusCounts = { paid: 0, partial: 0, unpaid: 0 };
  sampleStudents.forEach(student => {
    const tuition = sampleSettings.tuitionFees[student.gradeLevel] || 0;
    const paid = student.payments.reduce((s, p) => s + p.amount, 0);
    
    if (paid >= tuition) statusCounts.paid++;
    else if (paid > 0) statusCounts.partial++;
    else statusCounts.unpaid++;
  });

  return {
    students: sampleStudents.length,
    totalTuition,
    totalCollected,
    statusCounts,
    settings: sampleSettings
  };
};