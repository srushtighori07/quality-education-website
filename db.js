const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { initExcelFile } = require('./excelService');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'education.db');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`[Database] Connected to SQLite database at: ${dbPath}`);
  }
});

// Helper for promise-based queries
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Sample quality education students
const sampleStudents = [
  {
    student_id: 'STU-2026-001',
    student_name: 'Aarav Sharma',
    age: 20,
    gender: 'Male',
    email: 'aarav.sharma@qualityedu.org',
    contact_number: '+91 98765 43210',
    class_course: 'Computer Science & AI',
    enrollment_date: '2026-01-15'
  },
  {
    student_id: 'STU-2026-002',
    student_name: 'Ananya Iyer',
    age: 19,
    gender: 'Female',
    email: 'ananya.iyer@qualityedu.org',
    contact_number: '+91 98123 45678',
    class_course: 'Environmental Science & Sustainability',
    enrollment_date: '2026-02-01'
  },
  {
    student_id: 'STU-2026-003',
    student_name: 'Rohan Verma',
    age: 21,
    gender: 'Male',
    email: 'rohan.verma@qualityedu.org',
    contact_number: '+91 97654 32109',
    class_course: 'Advanced Mathematics & Statistics',
    enrollment_date: '2026-02-14'
  },
  {
    student_id: 'STU-2026-004',
    student_name: 'Meera Patel',
    age: 22,
    gender: 'Female',
    email: 'meera.patel@qualityedu.org',
    contact_number: '+91 98451 23456',
    class_course: 'Global Literature & Communication',
    enrollment_date: '2026-03-01'
  },
  {
    student_id: 'STU-2026-005',
    student_name: 'Zaid Khan',
    age: 20,
    gender: 'Male',
    email: 'zaid.khan@qualityedu.org',
    contact_number: '+91 99012 34567',
    class_course: 'Business Ethics & Leadership',
    enrollment_date: '2026-03-10'
  }
];

// Initialize tables and default seed data
async function initDb() {
  // Enable WAL mode for better concurrency
  db.run('PRAGMA journal_mode = WAL;');

  // Create students table strictly matching required fields
  await run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      email TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      class_course TEXT NOT NULL,
      enrollment_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create attendance & activity records table
  await run(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      total_classes INTEGER NOT NULL DEFAULT 40,
      attended_classes INTEGER NOT NULL DEFAULT 38,
      percentage REAL NOT NULL DEFAULT 95.0,
      status TEXT NOT NULL DEFAULT 'Regular',
      subject_breakdown TEXT,
      activity_log TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create feedback table
  await run(`
    CREATE TABLE IF NOT EXISTS feedback_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      category TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comments TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create help inquiries table
  await run(`
    CREATE TABLE IF NOT EXISTS help_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if students table has rows; if not, seed sample records
  const countRow = await get('SELECT COUNT(*) as count FROM students');
  if (countRow && countRow.count === 0) {
    console.log('[Database] Empty students table. Seeding Quality Education student records...');

    for (const student of sampleStudents) {
      await run(`
        INSERT INTO students (
          student_id, student_name, age, gender, email, contact_number, class_course, enrollment_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        student.student_id,
        student.student_name,
        student.age,
        student.gender,
        student.email,
        student.contact_number,
        student.class_course,
        student.enrollment_date
      ]);

      // Seed corresponding attendance and activity records
      const subjectBreakdown = JSON.stringify([
        { subject: 'Pedagogy & Core Ethics', total: 10, attended: 10, pct: 100 },
        { subject: student.class_course, total: 15, attended: 14, pct: 93.3 },
        { subject: 'Collaborative Problem Solving', total: 8, attended: 8, pct: 100 },
        { subject: 'Global Citizenship & SDG 4', total: 7, attended: 6, pct: 85.7 }
      ]);

      const activityLog = JSON.stringify([
        { date: '2026-09-20', title: 'Quality Education Capstone Proposal', type: 'Assignment', status: 'Graded (A+)', points: '+50' },
        { date: '2026-09-18', title: 'SDG 4 Sustainability Forum', type: 'Participation', status: 'Completed', points: '+25' },
        { date: '2026-09-15', title: 'Mid-Term Comprehensive Assessment', type: 'Quiz', status: 'Score: 94%', points: '+45' },
        { date: '2026-09-10', title: 'Peer Mentorship Workshop', type: 'Workshop', status: 'Attended', points: '+20' }
      ]);

      await run(`
        INSERT INTO attendance_records (
          student_id, total_classes, attended_classes, percentage, status, subject_breakdown, activity_log
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        student.student_id,
        40,
        38,
        95.0,
        'Good Standing (Honor Roll)',
        subjectBreakdown,
        activityLog
      ]);
    }
  }

  // Fetch all students to ensure Excel file is properly initialized and synced
  const allStudents = await query('SELECT * FROM students ORDER BY id ASC');
  initExcelFile(allStudents);

  // Seed sample feedback if empty
  const feedbackCount = await get('SELECT COUNT(*) as count FROM feedback_records');
  if (feedbackCount && feedbackCount.count === 0) {
    const defaultFeedback = [
      { name: 'Dr. Radhika Sen', email: 'radhika@eduquality.org', category: 'Curriculum Quality', rating: 5, comments: 'The structured learning modules and UN SDG 4 emphasis provide deep, holistic educational value.' },
      { name: 'Kavita Menon', email: 'kavita.m@student.org', category: 'Study Materials', rating: 5, comments: 'The downloadable notes and quiz assessments are exceptionally well-organized and easy to revise.' },
      { name: 'David Miller', email: 'david.m@globallearn.org', category: 'Teacher Effectiveness', rating: 5, comments: 'Outstanding guidance from the faculty. The interactive sessions encourage critical inquiry rather than rote memorization.' }
    ];

    for (const fb of defaultFeedback) {
      await run(`
        INSERT INTO feedback_records (name, email, category, rating, comments)
        VALUES (?, ?, ?, ?, ?)
      `, [fb.name, fb.email, fb.category, fb.rating, fb.comments]);
    }
  }
}

module.exports = {
  db,
  query,
  get,
  run,
  initDb
};
