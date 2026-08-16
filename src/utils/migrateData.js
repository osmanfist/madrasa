export const migrateGradeLevels = () => {
  // Migration mapping
  const gradeMapping = {
    'grade-10': 'first-year',
    'grade-11': 'second-year',
    'grade-12': 'third-year',
  };

  // Migrate students
  const students = JSON.parse(localStorage.getItem('madrasa-students') || '[]');
  let studentsChanged = false;

  const migratedStudents = students.map(student => {
    if (gradeMapping[student.gradeLevel]) {
      studentsChanged = true;
      return {
        ...student,
        gradeLevel: gradeMapping[student.gradeLevel]
      };
    }
    return student;
  });

  if (studentsChanged) {
    localStorage.setItem('madrasa-students', JSON.stringify(migratedStudents));
  }

  // Migrate settings
  const settings = JSON.parse(localStorage.getItem('madrasa-settings') || '{}');
  let settingsChanged = false;

  if (settings.tuitionFees) {
    const migratedFees = {};
    Object.keys(settings.tuitionFees).forEach(grade => {
      if (gradeMapping[grade]) {
        settingsChanged = true;
        migratedFees[gradeMapping[grade]] = settings.tuitionFees[grade];
      } else {
        migratedFees[grade] = settings.tuitionFees[grade];
      }
    });
    settings.tuitionFees = migratedFees;
  }

  if (settingsChanged) {
    localStorage.setItem('madrasa-settings', JSON.stringify(settings));
  }

  return {
    studentsMigrated: studentsChanged,
    settingsMigrated: settingsChanged
  };
};