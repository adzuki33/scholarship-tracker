# Scholarship Tracker

A personal scholarship tracking application built with Vite, React, and IndexedDB for persistent data storage.

## Features

- Track scholarship applications with key details
- Persistent data storage using IndexedDB
- Clean, responsive UI with Tailwind CSS
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
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── ScholarshipList.jsx   # Main list/grid view of scholarships
│   │   ├── ScholarshipForm.jsx   # Form for creating/editing scholarships
│   │   └── ScholarshipCard.jsx   # Individual scholarship card component
│   ├── db/
│   │   └── indexeddb.js          # IndexedDB initialization and CRUD operations
│   ├── App.jsx                   # Main app component with view management
│   ├── index.css                 # Global styles and Tailwind imports
│   └── main.jsx                  # React entry point
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── postcss.config.js            # PostCSS configuration for Tailwind
```

## Data Storage

The application uses **IndexedDB**, a browser-based database that stores data persistently on the client side. This means:

- Data survives page refreshes and browser restarts
- No server or backend required
- All CRUD operations happen directly in the browser
- Database name: `ScholarshipTrackerDB`
- Object store: `scholarships` with auto-increment ID

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

## Future Extensions

### Checklist Features
To add checklist functionality for each scholarship:
1. Create a new object store in IndexedDB called `checklists` with `scholarshipId` as a key
2. Add checklist items with fields: `id`, `scholarshipId`, `task`, `completed`
3. Create a `ChecklistItem` component to display individual tasks
4. Add a `Checklist` component in the `ScholarshipCard` or a detail view
5. Implement CRUD operations for checklist items similar to scholarships
6. Update `ScholarshipForm` to include checklist item management

### SQLite Support
To add SQLite as an alternative database option:
1. Install `sql.js` (SQLite compiled to WebAssembly)
2. Create a database abstraction layer with interfaces for both IndexedDB and SQLite
3. Add configuration option to switch between databases
4. Migrate existing IndexedDB data to SQLite format if needed
5. Update `db/indexeddb.js` to use SQLite functions when configured

SQLite would offer:
- Better querying capabilities (JOIN, complex WHERE clauses)
- Easier data export/import
- More familiar SQL-based operations
- Better performance for large datasets

However, IndexedDB remains a good choice because:
- Native browser support (no WebAssembly loading)
- Simpler setup and configuration
- Good performance for typical use cases
- No additional dependencies

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## License

MIT
