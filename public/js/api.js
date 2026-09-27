/**
 * Quality Education Portal - API Connector Module
 * Handles all network requests for student registration, Excel synchronization,
 * owner authentication, attendance records, feedback, and help desk.
 */

const API_BASE = '/api';

const EduAPI = {
  /**
   * Fetch all registered students with optional search
   */
  async getStudents(search = '') {
    const url = search ? `${API_BASE}/students?search=${encodeURIComponent(search)}` : `${API_BASE}/students`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students.');
    return await res.json();
  },

  /**
   * Register a new student:
   * Saves to SQLite DB and appends to students_records.xlsx
   */
  async registerStudent(studentData) {
    const res = await fetch(`${API_BASE}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const result = await res.json();
    if (!res.ok) {
      const err = new Error(result.message || 'Registration failed.');
      err.status = res.status;
      err.data = result;
      throw err;
    }
    return result;
  },

  /**
   * Authenticate the main website owner using passkey
   */
  async verifyOwner(passkey) {
    const res = await fetch(`${API_BASE}/owner/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey })
    });
    const result = await res.json();
    if (!res.ok) {
      const err = new Error(result.message || 'Owner authentication failed.');
      err.status = res.status;
      throw err;
    }
    return result;
  },

  /**
   * Retrieve records directly from the server's Excel file
   * (RESTRICTED: Requires owner passkey)
   */
  async getExcelData(ownerKey) {
    const key = ownerKey || this.getSavedOwnerKey();
    const res = await fetch(`${API_BASE}/students/excel-data`, {
      headers: { 'x-owner-key': key || '' }
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to read Excel data. Restricted access.');
    }
    return await res.json();
  },

  /**
   * Get direct download URL for students_records.xlsx
   * (RESTRICTED: Requires owner passkey in query)
   */
  getExcelDownloadUrl(ownerKey) {
    const key = ownerKey || this.getSavedOwnerKey();
    return `${API_BASE}/students/download-excel?owner_key=${encodeURIComponent(key || '')}&t=${Date.now()}`;
  },

  /**
   * Session storage helpers for owner authentication
   */
  saveOwnerKey(key) {
    sessionStorage.setItem('edu_owner_passkey', key);
  },

  getSavedOwnerKey() {
    return sessionStorage.getItem('edu_owner_passkey') || '';
  },

  clearOwnerKey() {
    sessionStorage.removeItem('edu_owner_passkey');
  },

  isOwnerLoggedIn() {
    return !!this.getSavedOwnerKey();
  },

  /**
   * Fetch attendance and activity log for a specific student ID
   */
  async getAttendance(studentId) {
    const res = await fetch(`${API_BASE}/attendance/${encodeURIComponent(studentId)}`);
    const result = await res.json();
    if (!res.ok) {
      const err = new Error(result.message || 'Failed to retrieve attendance record.');
      err.status = res.status;
      throw err;
    }
    return result;
  },

  /**
   * Submit feedback
   */
  async submitFeedback(data) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit feedback.');
    return result;
  },

  /**
   * Get public feedback testimonials
   */
  async getFeedback() {
    const res = await fetch(`${API_BASE}/feedback`);
    if (!res.ok) throw new Error('Failed to retrieve feedback.');
    return await res.json();
  },

  /**
   * Submit support / help inquiry
   */
  async submitHelpInquiry(data) {
    const res = await fetch(`${API_BASE}/help-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit inquiry.');
    return result;
  },

  /**
   * Retrieve system status
   */
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to retrieve status.');
    return await res.json();
  }
};

window.EduAPI = EduAPI;
