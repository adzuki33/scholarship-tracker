# Scholarship Tracker

A personal scholarship tracking application built with Vite, React, and IndexedDB. Keep track of your scholarship applications, deadlines, and statuses all in one place with offline persistence.

## Features

- ✅ **Full CRUD Operations**: Create, read, update, and delete scholarship entries
- 💾 **Offline Storage**: Data persists locally using IndexedDB (no internet required)
- 📅 **Deadline Tracking**: Visual indicators for upcoming deadlines
- 🎯 **Status Management**: Track application progress from start to result
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **Vite** - Next-generation frontend tooling
- **React 19** - UI library with hooks
- **IndexedDB** - Browser-based database for persistent storage
- **CSS3** - Custom styling with modern features

## Project Structure

```
scholarship-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ScholarshipList.jsx      # Main list view
│   │   ├── ScholarshipForm.jsx      # Create/edit form
│   │   └── ScholarshipCard.jsx      # Individual card display
│   ├── db/
│   │   └── indexeddb.js            # IndexedDB setup and CRUD operations
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # App-specific styles
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd scholarship-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

### Adding a Scholarship

1. Click the **"+ Add New Scholarship"** button
2. Fill in all required fields:
   - Scholarship Name
   - Provider
   - Degree Level (Master/Doctor)
   - Country
   - Application Year
   - Deadline
   - Status
3. Click **"Add Scholarship"** to save

### Editing a Scholarship

1. Click the **"Edit"** button on any scholarship card
2. Update the desired fields
3. Click **"Update Scholarship"** to save changes

### Deleting a Scholarship

1. Click the **"Delete"** button on any scholarship card
2. Confirm the deletion in the popup dialog

### Viewing Scholarships

- Scholarships are automatically sorted by deadline (earliest first)
- Cards show visual indicators for approaching deadlines
- Status badges are color-coded for quick identification

## Data Model

Each scholarship entry contains:

- **id**: Auto-generated unique identifier
- **name**: Scholarship name
- **provider**: Organization offering the scholarship
- **degreeLevel**: "Master" or "Doctor"
- **country**: Target country
- **applicationYear**: Year of application
- **deadline**: Application deadline (ISO date string)
- **status**: One of "Not Started", "Preparing", "Submitted", "Interview", "Result"
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

## Data Storage

### IndexedDB

This application uses **IndexedDB**, a browser-based NoSQL database that:

- Stores data locally on your device
- Works offline (no internet connection required)
- Persists data across browser sessions
- Provides fast, indexed queries

**Database Details:**
- Database Name: `ScholarshipTrackerDB`
- Object Store: `scholarships`
- Primary Key: `id` (auto-increment)
- Indexes: `deadline`, `status`, `createdAt`

### Data Persistence

All data is automatically saved to IndexedDB when you:
- Add a new scholarship
- Update an existing scholarship
- Delete a scholarship

The data persists even if you:
- Close the browser
- Restart your computer
- Clear cookies (IndexedDB is separate from cookies)

### Clearing Data

To clear all scholarship data:

1. Open browser DevTools (F12)
2. Navigate to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **IndexedDB** → **ScholarshipTrackerDB**
4. Right-click and select **Delete Database**

Or use the browser console:
```javascript
indexedDB.deleteDatabase('ScholarshipTrackerDB');
```

## Future Enhancements

### Planned Features

- **Checklist System**: Add task checklists for each scholarship (documents, essays, recommendations)
- **Document Tracking**: Link and track required documents
- **Reminders**: Email or push notifications for upcoming deadlines
- **Export/Import**: Export data to JSON/CSV for backup
- **Search & Filter**: Search by name, filter by status or deadline range
- **Dark Mode**: Toggle between light and dark themes
- **Statistics Dashboard**: Visualize application progress and success rates

### SQLite Support

For users needing server-side storage or multi-device sync, IndexedDB can be replaced with SQLite:

**Migration Path:**
1. Set up a backend API (Node.js + Express)
2. Replace `src/db/indexeddb.js` with `src/db/api.js`
3. Implement REST endpoints for CRUD operations
4. Use SQLite on the server with libraries like `better-sqlite3`
5. Add authentication for multi-user support

**Benefits of SQLite:**
- Server-side storage
- Multi-device synchronization
- Better data integrity guarantees
- Support for complex queries and relationships

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

IndexedDB is supported in all modern browsers.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Style

- React functional components with hooks
- Clean, readable code without excessive comments
- Consistent naming conventions
- ES6+ modern JavaScript

## Troubleshooting

**Problem**: Data not persisting
- **Solution**: Check if browser supports IndexedDB and it's not disabled

**Problem**: Can't add scholarship
- **Solution**: Ensure all required fields are filled

**Problem**: Date picker not working
- **Solution**: Use a modern browser with HTML5 date input support

## License

ISC

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

For questions or issues, please open an issue on the GitHub repository.
