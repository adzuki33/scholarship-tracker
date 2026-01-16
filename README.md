# Scholarship Tracker

A personal scholarship tracking application built with Vite, React, and IndexedDB for persistent data storage.

## Features

- Track scholarship applications with key details
- **Preset checklist templates** for popular scholarships (LPDP, MEXT, Chevening, etc.)
- Create and manage custom checklist templates
- Auto-populate checklist items from templates
- Search and filter scholarships
- Calendar view with deadline visualization
- Document tracker and requirements management
- Persistent data storage using IndexedDB
- Clean, responsive UI with Tailwind CSS and dark mode
- CRUD operations (Create, Read, Update, Delete)
- Automatic sorting by deadline
- Single-user application (no authentication required)

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** - UI framework with hooks (useState, useEffect, useCallback)
- **Tailwind CSS** - Utility-first CSS framework
- **IndexedDB** - Browser-based persistent database

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## Project Structure

```
scholarship-tracker/
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   ├── ScholarshipList.jsx    # Main list/grid view of scholarships
│   │   ├── ScholarshipForm.jsx    # Form for creating/editing scholarships
│   │   ├── ScholarshipCard.jsx    # Individual scholarship card component
│   │   ├── ChecklistView.jsx      # Checklist management for each scholarship
│   │   ├── CalendarView.jsx       # Calendar view with deadlines
│   │   ├── DocumentTracker.jsx    # Document management
│   │   ├── TemplateSelector.jsx   # Template selection modal
│   │   ├── TemplateManager.jsx    # Template management interface
│   │   ├── CustomTemplateForm.jsx # Custom template creation/editing
│   │   ├── TemplatePreview.jsx    # Template preview component
│   │   ├── SearchBar.jsx          # Search functionality
│   │   ├── FilterPanel.jsx        # Advanced filtering
│   │   └── ...                    # Other components
│   ├── data/
│   │   └── templates.js           # Built-in template definitions
│   ├── db/
│   │   └── indexeddb.js           # IndexedDB initialization and CRUD operations
│   ├── utils/
│   │   ├── searchScholarships.js  # Search utilities
│   │   ├── filterScholarships.js  # Filter utilities
│   │   └── calendarUtils.js       # Calendar utilities
│   ├── contexts/
│   │   └── ThemeContext.jsx       # Dark mode theme management
│   ├── App.jsx                    # Main app component with view management
│   ├── index.css                  # Global styles and Tailwind imports
│   └── main.jsx                   # React entry point
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── TEMPLATES_README.md           # Template system documentation
└── README.md                     # This file
```

## Data Storage

The application uses **IndexedDB**, a browser-based database that stores data persistently on the client side. This means:

- Data survives page refreshes and browser restarts
- No server or backend required
- All CRUD operations happen directly in the browser
- Database name: `ScholarshipTrackerDB` (Version 4)
- Object stores:
  - `scholarships` - Main scholarship data
  - `checklistItems` - Checklist items for each scholarship
  - `documents` - Document management and tracking
  - `templates` - Custom user-created templates

## Scholarship Data Model

Each scholarship contains:
- `id` - Auto-generated unique identifier
- `name` - Scholarship name
- `provider` - Organization providing the scholarship
- `degreeLevel` - "Master" or "Doctor"
- `country` - Country of the scholarship
- `applicationYear` - Year of application
- `deadline` - ISO date string for application deadline
- `status` - "Not Started" | "Preparing" | "Submitted" | "Interview" | "Result"
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last modified

## Template System

The application includes a comprehensive template system for quickly populating scholarship checklists:

### Built-in Templates
- 11 preset templates for popular scholarships (LPDP Indonesia, MEXT Japan, Chevening UK, etc.)
- Categories: Country-Specific, Regional, General
- Each template includes common required documents and guidance notes

### Custom Templates
- Create your own reusable templates
- Add custom checklist items with notes
- Edit and delete custom templates
- Full template preview before applying

### Usage
1. Click "Add New Scholarship"
2. Select a template from the Template Selector
3. Preview template items
4. Confirm selection
5. Fill in scholarship details
6. Checklist items are auto-populated after creation

For detailed documentation, see [TEMPLATES_README.md](./TEMPLATES_README.md)

## Future Extensions

### Potential Enhancements
- Template sharing/export functionality
- Template marketplace for community contributions
- Auto-suggest templates based on scholarship details
- Template versioning for requirement changes
- Mobile app version
- Email notifications for upcoming deadlines
- Integration with scholarship databases
- Collaborative features for group applications

### SQLite Support
IndexedDB is currently used as it provides:
- Native browser support (no WebAssembly loading)
- Simpler setup and configuration
- Good performance for typical use cases
- No additional dependencies

SQLite could be added as an alternative for:
- Better querying capabilities (JOIN, complex WHERE clauses)
- Easier data export/import
- More familiar SQL-based operations
- Better performance for very large datasets

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## License

MIT
