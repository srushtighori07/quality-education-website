const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { query, get, run, initDb } = require('./db');
const {
  getStudentsFromExcel,
  isDuplicateStudentId,
  appendStudentToExcel,
  getExcelFilePath,
  EXCEL_FILE_PATH
} = require('./excelService');

const app = express();
const PORT = process.env.PORT || 3000;

// Main Website Owner Secret Passkey (can be set via environment variable)
const OWNER_PASSKEY = process.env.OWNER_PASSKEY || 'AdminEdu@2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Helper to verify if the requester is the main website owner
 */
function verifyOwner(req) {
  const key = req.headers['x-owner-key'] || req.query.key || req.query.owner_key;
  return key && key.trim() === OWNER_PASSKEY;
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

/**
 * POST /api/owner/verify
 * Authenticate the main website owner using passkey
 */
app.post('/api/owner/verify', (req, res) => {
  const { passkey } = req.body;
  if (!passkey || passkey.trim() !== OWNER_PASSKEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Owner Secret Passkey. Access is strictly restricted to the main website owner.'
    });
  }

  res.json({
    success: true,
    message: 'Owner verification successful. Access granted to master Excel records.',
    ownerKey: OWNER_PASSKEY
  });
});

/**
 * GET /api/students
 * Retrieve student records with optional search
 */
app.get('/api/students', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      sql += ` AND (student_name LIKE ? OR student_id LIKE ? OR email LIKE ? OR contact_number LIKE ? OR class_course LIKE ?)`;
      params.push(term, term, term, term, term);
    }

    sql += ' ORDER BY id DESC';

    const students = await query(sql, params);
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve students: ' + err.message });
  }
});

/**
 * GET /api/students/download-excel
 * RESTRICTED: Only the main website owner can download the Excel master sheet
 */
app.get('/api/students/download-excel', (req, res) => {
  try {
    if (!verifyOwner(req)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only the main website owner has authorization to download the master Excel records.'
      });
    }

    const filePath = getExcelFilePath();
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Excel records file not found.' });
    }

    res.setHeader('Content-Disposition', 'attachment; filename="students_records.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.download(filePath, 'students_records.xlsx');
  } catch (err) {
    console.error('Error serving Excel download:', err);
    res.status(500).json({ success: false, message: 'Error downloading Excel file: ' + err.message });
  }
});

/**
 * GET /api/students/excel-data
 * RESTRICTED: Only the main website owner can inspect raw Excel records
 */
app.get('/api/students/excel-data', (req, res) => {
  try {
    if (!verifyOwner(req)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only the main website owner has authorization to view the master Excel registry.'
      });
    }

    const excelStudents = getStudentsFromExcel();
    res.json({
      success: true,
      count: excelStudents.length,
      filePath: EXCEL_FILE_PATH,
      data: excelStudents
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error reading Excel file: ' + err.message });
  }
});

/**
 * POST /api/students/register
 * Public Student Registration:
 * 1. Validate all 8 required fields
 * 2. Prevent duplicate Student IDs
 * 3. Automatically record in students_records.xlsx
 * 4. Save to SQLite DB & attendance tracking
 * (Does NOT expose public Excel download URL to the registrant)
 */
app.post('/api/students/register', async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      age,
      gender,
      email,
      contact_number,
      enrollment_date
    } = req.body;

    // 1. Validation of all 7 required fields (strictly no Class/Course)
    if (
      !student_id || !student_id.trim() ||
      !student_name || !student_name.trim() ||
      age === undefined || age === null || String(age).trim() === '' ||
      !gender || !gender.trim() ||
      !email || !email.trim() ||
      !contact_number || !contact_number.trim() ||
      !enrollment_date || !enrollment_date.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Please fill in Student ID, Student Name, Age, Gender, Email, Contact Number, and Enrollment Date.'
      });
    }

    const trimmedId = student_id.trim().toUpperCase();
    const trimmedName = student_name.trim();
    const parsedAge = parseInt(age, 10);
    const trimmedGender = gender.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContact = contact_number.trim();
    const trimmedCourse = req.body.class_course ? req.body.class_course.trim() : 'Quality Education Standard';
    const trimmedDate = enrollment_date.trim();

    // Age validation
    if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid age between 5 and 120.'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g., student@domain.com).'
      });
    }

    // Contact number validation (at least 7 digits)
    const phoneClean = trimmedContact.replace(/[^0-9]/g, '');
    if (phoneClean.length < 7 || phoneClean.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact number (7 to 15 digits).'
      });
    }

    // 2. Prevent duplicate Student IDs (Check both DB and Excel)
    const existingInDb = await get('SELECT id FROM students WHERE UPPER(student_id) = ?', [trimmedId]);
    if (existingInDb || isDuplicateStudentId(trimmedId)) {
      return res.status(409).json({
        success: false,
        message: `Student ID "${trimmedId}" is already registered. Duplicate Student IDs are not permitted. Please use a unique Student ID.`
      });
    }

    // 3. Automatically record in Excel (.xlsx) file on server
    const studentPayload = {
      student_id: trimmedId,
      student_name: trimmedName,
      age: parsedAge,
      gender: trimmedGender,
      email: trimmedEmail,
      contact_number: trimmedContact,
      enrollment_date: trimmedDate
    };

    appendStudentToExcel(studentPayload);

    // 4. Record in SQLite Database
    const insertSql = `
      INSERT INTO students (
        student_id, student_name, age, gender, email,
        contact_number, class_course, enrollment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const dbResult = await run(insertSql, [
      trimmedId,
      trimmedName,
      parsedAge,
      trimmedGender,
      trimmedEmail,
      trimmedContact,
      trimmedCourse,
      trimmedDate
    ]);

    // 5. Initialize Attendance & Activity Record for the new student
    const defaultSubjectBreakdown = JSON.stringify([
      { subject: 'Pedagogy & Core Ethics', total: 6, attended: 6, pct: 100 },
      { subject: trimmedCourse, total: 10, attended: 10, pct: 100 },
      { subject: 'Collaborative Problem Solving', total: 4, attended: 4, pct: 100 },
      { subject: 'Global Citizenship & SDG 4', total: 4, attended: 4, pct: 100 }
    ]);

    const defaultActivityLog = JSON.stringify([
      { date: trimmedDate, title: 'Student Enrollment Completed', type: 'Enrollment', status: 'Verified', points: '+20' },
      { date: trimmedDate, title: 'Quality Education Induction Module', type: 'Orientation', status: 'Pending', points: '+15' }
    ]);

    await run(`
      INSERT INTO attendance_records (
        student_id, total_classes, attended_classes, percentage, status, subject_breakdown, activity_log
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      trimmedId,
      24,
      24,
      100.0,
      'Active / Perfect Attendance',
      defaultSubjectBreakdown,
      defaultActivityLog
    ]);

    const newStudent = await get('SELECT * FROM students WHERE id = ?', [dbResult.lastID]);

    res.status(201).json({
      success: true,
      message: `Student "${trimmedName}" (${trimmedId}) registered successfully! Data has been securely archived in the institutional registry.`,
      data: newStudent
    });
  } catch (err) {
    console.error('Error during student registration:', err);
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'An error occurred during registration.'
    });
  }
});

/**
 * GET /api/attendance/:studentId
 * Retrieve attendance & activity records for a student
 */
app.get('/api/attendance/:studentId', async (req, res) => {
  try {
    const rawId = req.params.studentId.trim().toUpperCase();

    // Check student existence
    const student = await get('SELECT * FROM students WHERE UPPER(student_id) = ?', [rawId]);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student records found matching Student ID "${rawId}". Please check the ID or register the student first.`
      });
    }

    let record = await get('SELECT * FROM attendance_records WHERE UPPER(student_id) = ?', [rawId]);
    
    if (!record) {
      const defaultBreakdown = JSON.stringify([
        { subject: 'Pedagogy & Core Ethics', total: 10, attended: 10, pct: 100 },
        { subject: student.class_course, total: 12, attended: 11, pct: 91.7 },
        { subject: 'Global Citizenship & SDG 4', total: 6, attended: 6, pct: 100 }
      ]);
      const defaultActivities = JSON.stringify([
        { date: student.enrollment_date, title: 'Course Orientation', type: 'Orientation', status: 'Completed', points: '+20' }
      ]);
      await run(`
        INSERT INTO attendance_records (student_id, total_classes, attended_classes, percentage, status, subject_breakdown, activity_log)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [student.student_id, 28, 27, 96.4, 'Good Standing', defaultBreakdown, defaultActivities]);

      record = await get('SELECT * FROM attendance_records WHERE UPPER(student_id) = ?', [rawId]);
    }

    res.json({
      success: true,
      student: {
        student_id: student.student_id,
        student_name: student.student_name,
        class_course: student.class_course,
        enrollment_date: student.enrollment_date,
        email: student.email
      },
      attendance: {
        total_classes: record.total_classes,
        attended_classes: record.attended_classes,
        percentage: record.percentage,
        status: record.status,
        subject_breakdown: JSON.parse(record.subject_breakdown || '[]'),
        activity_log: JSON.parse(record.activity_log || '[]'),
        last_updated: record.updated_at
      }
    });
  } catch (err) {
    console.error('Error fetching attendance record:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

/**
 * POST /api/feedback
 * Submit visitor/student feedback
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, category, rating, comments } = req.body;

    if (!category || !rating || !comments || !comments.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Category, Star Rating, and Comments for your feedback.'
      });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const result = await run(`
      INSERT INTO feedback_records (name, email, category, rating, comments)
      VALUES (?, ?, ?, ?, ?)
    `, [name ? name.trim() : 'Anonymous Learner', email ? email.trim() : '', category.trim(), ratingNum, comments.trim()]);

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! We appreciate your commitment to quality education.',
      feedbackId: result.lastID
    });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ success: false, message: 'Failed to record feedback: ' + err.message });
  }
});

/**
 * GET /api/feedback
 * Retrieve feedback testimonials
 */
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbackList = await query('SELECT * FROM feedback_records ORDER BY id DESC LIMIT 10');
    res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving feedback: ' + err.message });
  }
});

/**
 * POST /api/help-inquiry
 * Submit contact/help message
 */
app.post('/api/help-inquiry', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Please provide Name, Email, Subject, and your Message.'
      });
    }

    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

    await run(`
      INSERT INTO help_inquiries (ticket_id, name, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [ticketId, name.trim(), email.trim(), subject.trim(), message.trim()]);

    res.status(201).json({
      success: true,
      ticketId,
      message: `Your inquiry has been received! Support Ticket ID: ${ticketId}. Our academic desk will respond within 24 hours.`
    });
  } catch (err) {
    console.error('Error submitting help inquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to process inquiry: ' + err.message });
  }
});

/**
 * GET /api/status
 * Health & system status
 */
app.get('/api/status', async (req, res) => {
  try {
    const dbCountRow = await get('SELECT COUNT(*) as count FROM students');
    const excelStudents = getStudentsFromExcel();

    res.json({
      success: true,
      platform: 'Quality Education Portal',
      status: 'operational',
      databaseStudentCount: dbCountRow ? dbCountRow.count : 0,
      excelStudentCount: excelStudents.length,
      excelStorageFile: 'students_records.xlsx',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// JSON fallback for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Catch-all static fallback for SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  Quality Education Website & Excel Management System`);
    console.log(`  Color Palette: Navy Blue (#1E3A5F) | Sage Green (#A8C3B0)`);
    console.log(`                 Cream (#F8F6F0)     | White (#FFFFFF)`);
    console.log(`  Excel Access:  RESTRICTED (Owner Secret Passkey Protected)`);
    console.log(`  Excel File:    ${EXCEL_FILE_PATH}`);
    console.log(`  Local URL:     http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error('Database initialization error:', err);
});
