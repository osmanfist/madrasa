// Export all data to JSON file
export const exportData = (students, settings) => {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    students,
    settings,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `madrasa-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import data from JSON file
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate data structure
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('Invalid data: missing students array');
    }
    
    if (!data.settings) {
      throw new Error('Invalid data: missing settings');
    }
    
    // Save to localStorage
    localStorage.setItem('madrasa-students', JSON.stringify(data.students));
    localStorage.setItem('madrasa-settings', JSON.stringify(data.settings));
    
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};