const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING QUALITY EDUCATION SECURITY & ACCESS TESTS ===\n');

  console.log('--- TEST 1: Unauthorized Excel Download Blocked (Public user) ---');
  let res = await request({ host: 'localhost', port: 3000, path: '/api/students/download-excel', method: 'GET' });
  console.log('Status:', res.status, '| Message:', res.data.message);
  if (res.status !== 403) throw new Error('Expected 403 Forbidden for public unauthenticated download');

  console.log('\n--- TEST 2: Owner Verification with Invalid Passkey ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/owner/verify',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { passkey: 'wrong-passkey-123' });
  console.log('Status:', res.status, '| Message:', res.data.message);
  if (res.status !== 401) throw new Error('Expected 401 Unauthorized for bad passkey');

  console.log('\n--- TEST 3: Owner Verification with Valid Passkey ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/owner/verify',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { passkey: 'AdminEdu@2026' });
  console.log('Status:', res.status, '| Message:', res.data.message, '| Key granted:', !!res.data.ownerKey);
  if (res.status !== 200 || !res.data.success) throw new Error('Owner verification failed with valid passkey');

  console.log('\n--- TEST 4: Authorized Excel Download for Main Website Owner ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/students/download-excel?owner_key=AdminEdu@2026',
    method: 'GET'
  });
  console.log('Status:', res.status, '| Content-Type:', res.headers['content-type']);
  if (res.status !== 200) throw new Error('Authorized Excel download failed');

  console.log('\n--- TEST 5: Authorized Owner Excel Data Registry Inspection ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/students/excel-data',
    method: 'GET',
    headers: { 'x-owner-key': 'AdminEdu@2026' }
  });
  console.log('Status:', res.status, '| Excel rows:', res.data.count, '| File:', res.data.filePath);
  if (res.status !== 200 || !res.data.success) throw new Error('Owner Excel data inspection failed');

  console.log('\n--- TEST 6: Public Student Registration (Securely saved to Excel on server) ---');
  const testStudentId = 'STU-SEC-' + Math.floor(100 + Math.random() * 900);
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/students/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    student_id: testStudentId,
    student_name: 'Aditya Deshmukh',
    age: 20,
    gender: 'Male',
    email: 'aditya.d@qualityedu.org',
    contact_number: '+91 98331 45678',
    class_course: 'Environmental Science & Sustainability',
    enrollment_date: '2026-09-27'
  });
  console.log('Status:', res.status, '| Message:', res.data.message);
  if (res.status !== 201) throw new Error('Student registration failed');

  console.log('\n=== ALL SECURITY & RESTRICTED OWNER ACCESS TESTS PASSED! ===\n');
}

if (require.main === module) {
  runTests().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
