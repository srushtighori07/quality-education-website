# EduQuality — Quality Education Website & Excel Data Storage System

> **“Quality Education – Learn Today, Build a Better Tomorrow.”**  
> Aligned with United Nations Sustainable Development Goal 4 (UN SDG 4).

EduQuality is a fully responsive, modern, aesthetic, and professional Quality Education platform designed with a calm, educational color palette and clean typography. It features an automated **Excel (.xlsx)** student registry system, interactive assessments, attendance tracking, and faculty directory.

---

## 🎨 Color Palette & Typography

Strict adherence to the requested soft color palette:
* **Navy Blue**: `#1E3A5F` — Primary brand, headings, primary buttons, footers
* **Sage Green**: `#A8C3B0` — Accents, badges, highlights, focus rings, success indicators
* **Cream**: `#F8F6F0` — Calm canvas background, alternate section surfaces
* **White**: `#FFFFFF` — Card surfaces, input fields, navbar backdrop

**Typography**:
* **Poppins**: Headings, brand titles, numbers, and badges
* **Inter**: Clean UI body copy, input text, and table data

---

## 🌐 The 11 Dedicated Website Sections

1. **Home (`#home`)**: Inspiring hero banner with motto, live learner counters (14,200+ Learners, 98.6% Pass Rate, 48 Accredited Courses), core value pillars, and fast-action navigation buttons.
2. **About Quality Education (`#about`)**: Deep dive into UN SDG 4, the 4 Foundational Pillars (Inclusivity, Qualified Educators, Modern Pedagogy, Safe Spaces), and an academic comparison table (Traditional Rote Learning vs. Holistic Quality Education).
3. **Student Registration (`#registration`)**: A standalone card-style form with rounded corners, soft shadows, spacious input fields, and icons. Automatically saves validated student records to `students_records.xlsx`. *(Does NOT include Teacher Information or any dashboards)*.
4. **Courses (`#courses`)**: Multidisciplinary course directory with category filtering (Tech & AI, Environmental Science, Mathematics, Humanities, Business), syllabus preview modals, and 1-click enrollment navigation.
5. **Study Materials (`#materials`)**: Curated open-access resources with live search and category filters (PDFs, Lecture Slides, Video Masterclasses, Problem Sets) and instant download.
6. **Online Quiz / Assessment (`#quiz`)**: Interactive assessment engine with 3 curriculum tracks (SDG 4, Digital Literacy, Environmental Science), timer countdown, instant score calculation, distinction grading, detailed review explanations, and Certificate of Mastery preview.
7. **Attendance & Activity Records (`#attendance`)**: Search attendance and activity transcripts by Student ID (e.g., `STU-2026-001`, `STU-2026-002`, `STU-2026-003`). Features radial attendance gauge, subject-by-subject percentage bars, and activity logs.
8. **Announcements (`#announcements`)**: Notice board with category filters (Academics, Exams, Events, Scholarships), date stamps, and priority badges.
9. **Teacher Information (`#teachers`)**: Standalone faculty directory with teacher names, subjects, qualifications, experience, office hours, and consultation request modals.
10. **Feedback (`#feedback`)**: Interactive feedback form with a 5-star rating widget, category selector, suggestion box, and live testimonials showcase wall.
11. **Contact / Help (`#contact`)**: Help desk channels (physical campus address, toll-free helpline, emails), interactive ticket generation form, and an interactive FAQ accordion.

*(Notice: As strictly instructed, **no Student Dashboard** is present anywhere on the platform).*

---

## 📊 Excel (.xlsx) Data Storage & Owner Access Control

Every student registration is automatically and securely processed through `excelService.js`:
* **File Location**: `e:\Srushti\website\students_records.xlsx`
* **Column Headers**:
  1. `Student ID`
  2. `Student Name`
  3. `Age`
  4. `Gender`
  5. `Email`
  6. `Contact Number`
  7. `Class/Course`
  8. `Enrollment Date`
  9. `Registration Timestamp`

### 🔒 Restricted Owner-Only Access:
* **Public Users & Students**: Never see any "Download Excel" buttons. Registration is a clean, simple enrollment flow that confirms receipt without exposing master institutional files.
* **Direct URL Protection**: Attempts to hit `/api/students/download-excel` or `/api/students/excel-data` directly without authorization are **blocked with HTTP 403 Forbidden**.
* **Owner Authentication Portal**:
  - The main website owner can click **"Owner Access"** in the footer or press `Ctrl + Shift + O`.
  - Enter the configured **Owner Secret Passkey** (Default: `AdminEdu@2026`, configurable via the `OWNER_PASSKEY` environment variable).
  - Once verified, the owner console unlocks:
    - Live student enrollment count
    - Full searchable registry table read directly from `students_records.xlsx`
    - Exclusive **"Download Master Excel (.xlsx)"** button
    - **"Lock / Sign Out"** button to terminate the owner session.


---

## 🚀 How to Run the Project

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open the platform**:
   Visit [http://localhost:3000](http://localhost:3000) in any web browser.

4. **Run API & Excel verification tests**:
   ```bash
   npm test
   ```
