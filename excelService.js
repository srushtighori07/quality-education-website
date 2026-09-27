const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Path to the primary Excel records file in the workspace root
const EXCEL_FILE_PATH = path.join(__dirname, 'students_records.xlsx');
const SHEET_NAME = 'Registered_Students';

// Standard column headers strictly matching requirement 14:
// | Student ID | Name | Age | Gender | Email | Contact | Enrollment Date |
const EXCEL_HEADERS = [
  'Student ID',
  'Student Name',
  'Age',
  'Gender',
  'Email',
  'Contact Number',
  'Enrollment Date'
];

/**
 * Ensures the Excel file exists with proper headers and initial formatting
 * @param {Array} initialStudents - Optional array of seed student objects
 */
function initExcelFile(initialStudents = []) {
  try {
    const rows = [];

    // If initial seed students provided, format them into rows
    if (initialStudents && initialStudents.length > 0) {
      initialStudents.forEach(s => {
        rows.push({
          'Student ID': s.student_id || s.enrollment_no,
          'Student Name': s.student_name || s.name,
          'Age': s.age || 20,
          'Gender': s.gender || 'Not Specified',
          'Email': s.email,
          'Contact Number': s.contact_number || s.mobile,
          'Enrollment Date': s.enrollment_date || s.registration_date || new Date().toISOString().split('T')[0]
        });
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXCEL_HEADERS });

    // Set column widths for clean readability in Excel
    worksheet['!cols'] = [
      { wch: 16 }, // Student ID
      { wch: 24 }, // Student Name
      { wch: 8 },  // Age
      { wch: 14 }, // Gender
      { wch: 30 }, // Email
      { wch: 18 }, // Contact Number
      { wch: 18 }  // Enrollment Date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    console.log(`[ExcelService] Initialized Excel file successfully with ${rows.length} records.`);
  } catch (err) {
    console.error('[ExcelService] Error initializing Excel file:', err);
  }
}

/**
 * Read all student records from the Excel file
 * @returns {Array<Object>} List of student objects from Excel
 */
function getStudentsFromExcel() {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      initExcelFile();
    }
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const worksheet = workbook.Sheets[SHEET_NAME] || workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) return [];

    const rawRecords = XLSX.utils.sheet_to_json(worksheet);
    return rawRecords.map(r => ({
      student_id: r['Student ID'] || '',
      student_name: r['Student Name'] || '',
      age: Number(r['Age']) || 0,
      gender: r['Gender'] || '',
      email: r['Email'] || '',
      contact_number: String(r['Contact Number'] || ''),
      enrollment_date: r['Enrollment Date'] || ''
    }));
  } catch (err) {
    console.error('[ExcelService] Error reading from Excel file:', err);
    return [];
  }
}

/**
 * Check if a Student ID already exists in the Excel records
 * @param {string} studentId
 * @returns {boolean}
 */
function isDuplicateStudentId(studentId) {
  if (!studentId) return false;
  const records = getStudentsFromExcel();
  const normalizedId = String(studentId).trim().toLowerCase();
  return records.some(r => String(r.student_id).trim().toLowerCase() === normalizedId);
}

/**
 * Append a newly registered student to the Excel file
 * Validates against duplicate Student IDs
 * @param {Object} student
 * @returns {Object} result
 */
function appendStudentToExcel(student) {
  try {
    if (!student.student_id || !student.student_name || !student.email) {
      throw new Error('Missing essential student information for Excel record.');
    }

    const trimmedId = String(student.student_id).trim().toUpperCase();

    // Check duplicate in Excel
    if (isDuplicateStudentId(trimmedId)) {
      const error = new Error(`Student ID "${trimmedId}" is already registered. Duplicate Student IDs are not permitted.`);
      error.statusCode = 409;
      error.isDuplicate = true;
      throw error;
    }

    // Read existing workbook or create new
    let workbook;
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      workbook = XLSX.readFile(EXCEL_FILE_PATH);
    } else {
      workbook = XLSX.utils.book_new();
    }

    let worksheet = workbook.Sheets[SHEET_NAME];
    let existingRows = [];
    if (worksheet) {
      existingRows = XLSX.utils.sheet_to_json(worksheet);
    }

    const newRecord = {
      'Student ID': trimmedId,
      'Student Name': String(student.student_name).trim(),
      'Age': Number(student.age) || '',
      'Gender': String(student.gender || '').trim(),
      'Email': String(student.email).trim().toLowerCase(),
      'Contact Number': String(student.contact_number || '').trim(),
      'Enrollment Date': String(student.enrollment_date || '').trim()
    };

    existingRows.push(newRecord);

    const updatedWorksheet = XLSX.utils.json_to_sheet(existingRows, { header: EXCEL_HEADERS });

    // Set column widths
    updatedWorksheet['!cols'] = [
      { wch: 16 }, // Student ID
      { wch: 24 }, // Student Name
      { wch: 8 },  // Age
      { wch: 14 }, // Gender
      { wch: 30 }, // Email
      { wch: 18 }, // Contact Number
      { wch: 18 }  // Enrollment Date
    ];

    // Re-attach sheet
    workbook.Sheets[SHEET_NAME] = updatedWorksheet;
    if (!workbook.SheetNames.includes(SHEET_NAME)) {
      workbook.SheetNames.push(SHEET_NAME);
    }

    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    console.log(`[ExcelService] Student "${student.student_name}" (${trimmedId}) recorded successfully in Excel.`);

    return {
      success: true,
      record: newRecord,
      totalCount: existingRows.length,
      filePath: EXCEL_FILE_PATH
    };
  } catch (err) {
    console.error('[ExcelService] Error appending student to Excel:', err.message);
    throw err;
  }
}

/**
 * Return file path for direct download
 */
function getExcelFilePath() {
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    initExcelFile();
  }
  return EXCEL_FILE_PATH;
}

module.exports = {
  initExcelFile,
  getStudentsFromExcel,
  isDuplicateStudentId,
  appendStudentToExcel,
  getExcelFilePath,
  EXCEL_FILE_PATH,
  EXCEL_HEADERS
};
