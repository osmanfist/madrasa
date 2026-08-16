# LLM README - Project Context for AI Assistants

## Project Overview

**Project Name:** Madrasa (مدرسة)
**Purpose:** Web-based accounting system for a private secondary school to manage student tuition payments
**Current Version:** 1.0.0
**Deployment:** https://madrasa-lake.vercel.app/
**GitHub:** https://github.com/osmanfist/madrasa

## Project Status

The project is in its **first iteration** and is **fully functional**. It's being tested by the customer (a school accountant). Future iterations may require rebuilding with different architecture based on feedback.

## Business Context

### Customer Requirements
- **User:** Single user - the school accountant
- **No authentication** needed (data is local to one browser)
- **Students:** ~200 students in secondary school
- **Academic Year:** Single year tracking (2024-2025)
- **Language:** Arabic (default) with English toggle
- **Currency:** Sudanese Pound (SDG)
- **Data Storage:** Browser localStorage (no backend database)
- **Hosting:** Vercel (frontend only)

### Grade System
- **First Year** (السنة الأولى) - Tuition: 10,000 SDG
- **Second Year** (السنة الثانية) - Tuition: 12,000 SDG
- **Third Year** (السنة الثالثة) - Tuition: 15,000 SDG

### Payment Methods
1. **Cash** (نقداً)
2. **Bank Transfer** (تحويل بنكي) with three supported banks:
   - Bank of Khartoum - Bankak (بنك الخرطوم - بنكك)
   - Omdurman National Bank - O-CASH (بنك أم درمان الوطني - اوكاش)
   - Faisal Islamic Bank - Fawry (بنك فيصل الإسلامي - فوري)

## Technical Architecture

### Tech Stack
- **Frontend:** React 18 + Vite
- **Routing:** React Router DOM v6
- **State Management:** React Context API
- **Styling:** Plain CSS (no framework)
- **Data Storage:** Browser localStorage
- **Excel Export:** xlsx library
- **Deployment:** Vercel (automatic from GitHub main branch)
- **Build Tool:** Vite

### Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.0",
  "xlsx": "^0.18.5"
}
```

### Data Models

#### Student Object

```javascript
{
  id: "unique-string",
  name: "Student Name",
  gradeLevel: "first-year" | "second-year" | "third-year",
  payments: [
    {
      id: "payment-id",
      amount: 5000,
      method: "cash" | "bank",
      date: "2024-09-15",
      receivedBy: "Accountant Name",
      notes: "Optional notes",
      bankDetails: { // Only for bank transfers
        bankName: "Bank of Khartoum (Bankak)",
        transactionNumber: "TRX123456",
        transferDate: "2024-09-15"
      }
    }
  ],
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

#### Settings Object

```javascript
{
  schoolYear: "2024-2025",
  currency: "SDG",
  tuitionFees: {
    "first-year": 10000,
    "second-year": 12000,
    "third-year": 15000
  }
}
```

### localStorage Keys
- `madrasa-students` - Array of student objects
- `madrasa-settings` - Settings object
- `madrasa-language` - Language preference ('ar' or 'en')

## Project Structure

```
madrasa/
├── public/
│   └── madrasa-icon.svg (custom book and pen icon)
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx (main layout with header, sidebar, navigation)
│   │   │   └── Layout.css
│   │   ├── Students/
│   │   │   ├── StudentForm.jsx (add/edit student modal)
│   │   │   └── StudentForm.css
│   │   ├── Payments/
│   │   │   ├── PaymentForm.jsx (record payment modal with bank selection)
│   │   │   └── PaymentForm.css
│   │   ├── WelcomeAnimation.jsx (loading screen on app start)
│   │   ├── WelcomeAnimation.css
│   │   ├── PageTransition.jsx (page transition wrapper)
│   │   └── PageTransition.css
│   ├── context/
│   │   ├── LanguageContext.jsx (Arabic/English with RTL/LTR)
│   │   ├── SettingsContext.jsx (tuition fees, school year)
│   │   └── StudentContext.jsx (students and payments CRUD)
│   ├── pages/
│   │   ├── Dashboard.jsx (stats, charts, recent payments)
│   │   ├── Dashboard.css
│   │   ├── Students.jsx (student list with filters and quick actions)
│   │   ├── Students.css
│   │   ├── Payments.jsx (payment history and recording)
│   │   ├── Payments.css
│   │   ├── Reports.jsx (summary and outstanding reports)
│   │   ├── Reports.css
│   │   ├── Settings.jsx (tuition config, data management)
│   │   └── Settings.css
│   ├── translations/
│   │   ├── ar.js (Arabic translations - DEFAULT)
│   │   └── en.js (English translations)
│   ├── utils/
│   │   ├── calculations.js (financial calculations)
│   │   ├── excelExport.js (Excel export functionality)
│   │   ├── dataBackup.js (JSON import/export)
│   │   ├── loadSampleData.js (sample data for testing)
│   │   └── migrateData.js (data migration helpers)
│   ├── App.jsx (main app with providers and routing)
│   ├── App.css (global styles and animations)
│   └── main.jsx (entry point)
├── index.html (with RTL default and Arabic title)
├── package.json
├── vercel.json (for SPA routing on Vercel)
├── README.md (main documentation)
├── USER_GUIDE.md (end-user guide)
├── TECHNICAL.md (technical documentation)
└── CHANGELOG.md (version history)
```

## Implemented Features

### 1. Dashboard
- Stats cards (Total Collected, Outstanding, Students, Collection Rate)
- Payment status summary (Paid/Partial/Unpaid counts)
- Grade collection progress bars
- Recent payments list (last 5)
- Overdue students list (top 5 by balance)
- Quick action buttons

### 2. Students Page
- Full CRUD operations (Add/Edit/Delete)
- Search by name
- Filter by grade level
- Filter by payment status (Paid/Partial/Unpaid)
- Sort by name (locale-aware)
- Click to select student row
- Quick action menu on selection:
  - Record Payment (disabled if fully paid)
  - Edit Student
  - Delete Student (with confirmation)
- Payment status badges (color-coded)
- Responsive table design

### 3. Payments Page
- Record payments (modal form)
- Payment history list
- Filter by student name
- Filter by payment method
- Delete payments
- Bank transfer support with 3 Sudanese banks
- Real-time balance calculation
- Validation (can't exceed remaining balance)

### 4. Reports Page
- Summary by grade level (students, tuition, collected, outstanding, rate)
- Outstanding payments report
- Collection rate with progress bars
- Export to Excel (3 sheets: Students, Payments, Grade Summary)
- Export to PDF (via browser print)
- Print-friendly styles

### 5. Settings Page
- Edit tuition fees for each grade
- Change school year
- Data export (JSON backup)
- Data import (JSON restore)
- Load sample data (for testing)
- Clear all data
- System info (student count, payment count, version)

### 6. Language Support
- Arabic default with RTL layout
- English with LTR layout
- Language toggle in header
- All UI elements translated
- Locale-aware sorting
- Date formatting based on locale

### 7. Visual Features
- Welcome animation on page load
- Page transitions
- Card hover effects
- Button animations
- Progress bar animations
- Loading spinners
- Custom SVG icon (book and pen)

## Current Issues / Pending Tasks

### Known Issues
- No authentication (intentionally removed - customer agreed)
- Data not synced across devices (localStorage limitation)
- No offline backup mechanism
- Manual data backup required

### Customer Feedback History
1. Changed grades from "Grade 10/11/12" to "First/Second/Third Year"
2. Changed currency to SDG
3. Removed academic performance tracking (not needed)
4. Added Sudanese banks to payment system
5. Requested wider payment modal
6. Added quick action menu on student selection
7. Requested visual animations
8. Custom icon with book and pen requested

### Planned Future Features
- Student details view (click to see full payment history)
- Printable payment receipts
- Advanced date filtering
- Payment reminders
- Data visualization charts
- Multi-user support
- Cloud database integration

## Critical Implementation Details

### Context Providers Order

```jsx
<LanguageProvider>
  <SettingsProvider>
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  </SettingsProvider>
</LanguageProvider>
```

### Translation System
- All text uses `t('key')` function from `useLanguage()`
- Keys defined in both `ar.js` and `en.js`
- Add new translations to BOTH files

### Currency Formatting
```javascript
formatCurrency(amount, 'SDG') // Uses Intl.NumberFormat
```

### Payment Status Logic
```javascript
if (totalPaid === 0) return 'unpaid';
if (totalPaid >= tuition) return 'paid';
return 'partial';
```

### Mobile Responsiveness
- All pages use CSS media queries
- Tables become scrollable on mobile
- Filters stack vertically on mobile
- Sidebar becomes drawer on mobile

## Development Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

## Important Notes for Future Development

1. **Data Persistence:** All data is in localStorage. Adding a backend would require significant refactoring of contexts.

2. **Translation:** Always add new strings to BOTH `ar.js` and `en.js`. Arabic is default.

3. **RTL Support:** When adding new UI components, test both RTL (Arabic) and LTR (English) layouts.

4. **Mobile First:** Customer accesses on mobile frequently. Test all features on mobile viewport.

5. **Sample Data:** The Settings page has "Load Sample Data" button that adds 6 test students. This is for testing only.

6. **Data Migration:** If changing data structure, use `migrateData.js` pattern to handle existing localStorage data.

7. **Excel Export:** The `xlsx` library creates workbooks with 3 sheets. Modify `excelExport.js` to change export format.

8. **Bank List:** Currently hardcoded in `PaymentForm.jsx`. Move to config if adding more banks.

9. **Vercel Routing:** `vercel.json` has rewrite rules for SPA routing. Don't remove.

10. **Icon:** Custom SVG at `public/madrasa-icon.svg`. Must be at root for favicon.

## Project Evolution History

### Initial Requirements
- Simple student tracking
- Boolean paid/unpaid status

### Evolved To
- Full payment tracking with partial payments
- Bank transfer support
- Reports and analytics
- Data backup/restore
- Multi-language support

### Removed Features
- Academic performance tracking (customer decided not needed)
- Authentication (customer agreed unnecessary)

## Contact & Support

**Developer:** Osman Fist
**GitHub:** @osmanfist
**Repository:** https://github.com/osmanfist/madrasa
**Live Demo:** https://madrasa-lake.vercel.app/

## How to Continue This Project

### For New Features
1. Check existing context providers for state management
2. Add new page component and route
3. Add translations (Arabic and English)
4. Test mobile responsiveness
5. Update documentation

### For Bug Fixes
1. Check browser console for errors
2. Verify localStorage data structure
3. Test both Arabic and English
4. Check mobile viewport
5. Update CHANGELOG.md

### For Refactoring
1. Preserve existing data structures
2. Maintain context API patterns
3. Keep all translations
4. Update all documentation
5. Test thoroughly before deploying
```

## **Commit and Deploy**

```bash
# Add the LLM README
git add LLMREADME.md

# Commit
git commit -m "Add LLM README for AI-assisted development continuity"

# Push
git push
```
