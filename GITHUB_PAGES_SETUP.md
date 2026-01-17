# GitHub Pages Deployment Setup

## Overview

The Scholarship Tracker app is now configured for GitHub Pages deployment with IndexedDB data seeding. All visitors will see the default scholarships by default, and you can easily update the deployed data using the dual export feature.

## Features Implemented

### ✅ Dual Export System
- **Regular Data Export**: For personal backup and portability (scholarships, checklist items, documents)
- **Seed Data Export**: For GitHub Pages deployment (includes all data + built-in templates)
- **Save Seed Data**: Generates `seedData.json` file for repository update

### ✅ Automatic Data Seeding
- App automatically seeds IndexedDB on first load if database is empty
- Includes all 11 built-in scholarship templates
- Won't overwrite existing user data after first deployment
- Uses localStorage marker to track seeding status

### ✅ GitHub Pages Configuration
- Vite configured with `base: "/scholarship-tracker/"`
- GitHub Actions workflow for automatic deployment
- All assets load correctly from subpath

### ✅ Complete Data Support
- Exports include: scholarships, checklistItems, documents, templates
- Import validates all data types
- Template system fully integrated

## Repository Setup Instructions

### 1. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/scholarship-tracker`
2. Click **Settings** tab
3. Scroll down to **Pages** section in left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **gh-pages** branch and **/ (root)** folder
6. Click **Save**

### 2. Repository Structure

Ensure your repository has this structure:
```
scholarship-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── data/
│   │   └── seedData.json      # Default data for new visitors
│   ├── db/
│   ├── components/
│   └── ...
├── dist/                      # Built files (auto-generated)
├── package.json
├── vite.config.js            # Configured with base path
└── README.md
```

### 3. Automatic Deployment

The GitHub Actions workflow automatically:
- Triggers on push to `main` branch
- Installs dependencies
- Builds the Vite app
- Deploys to `gh-pages` branch
- Your site will be available at: `https://YOUR_USERNAME.github.io/scholarship-tracker/`

## How to Update Deployed Data

### Method 1: Using the App's Export Feature (Recommended)

1. **Open the app** (either locally or on GitHub Pages)
2. **Go to Data Management** tab
3. **Export Seed Data**:
   - Click **"Save to seedData.json"** button
   - Download the generated file
4. **Update Repository**:
   - Replace the content of `src/data/seedData.json` with the downloaded file
   - Commit and push changes to GitHub
5. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy the updated data
   - New visitors will see the updated scholarships

### Method 2: Manual Update

1. Edit `src/data/seedData.json` directly in your repository
2. Add/modify scholarships, documents, checklist items, or templates
3. Commit and push changes
4. GitHub Actions will redeploy automatically

## Data Structure

### Seed Data Format

The `seedData.json` file contains:

```json
{
  "version": "1.0",
  "exportedAt": "2025-01-17T00:00:00Z",
  "description": "Default seed data for Scholarship Tracker app",
  "data": {
    "scholarships": [...],
    "checklistItems": [...],
    "documents": [...],
    "templates": [...]
  }
}
```

### Built-in Templates Included

1. **LPDP Indonesia** - Indonesian Education Fund
2. **MEXT Japan** - Japanese Government Scholarship
3. **Chevening UK** - UK Government Scholarship
4. **Erasmus+ Europe** - EU Exchange Program
5. **Fulbright USA** - US Government Scholarship
6. **DAAD Germany** - German Academic Exchange
7. **Australia Awards** - Australian Government
8. **Commonwealth Scholarships** - Commonwealth Countries
9. **Swedish Institute** - Swedish Government
10. **General Master's Scholarship** - Generic Template
11. **General PhD Scholarship** - Generic Template

## Export Options Comparison

| Feature | Regular Export | Seed Data Export | Save Seed Data |
|---------|---------------|------------------|----------------|
| **Purpose** | Personal backup | GitHub Pages deployment | Repository update |
| **Includes** | Scholarships, checklist, documents | All data + templates | All data + templates |
| **File Name** | `scholarship-tracker-backup-YYYY-MM-DD.json` | `seedData-YYYY-MM-DD.json` | `seedData.json` |
| **Templates** | ❌ | ✅ | ✅ |
| **Use Case** | Backup/transfer | Download for GitHub Pages | Direct repository update |

## Technical Details

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  base: '/scholarship-tracker/',
  plugins: [react(), tailwindcss()],
})
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

### Database Seeding Logic

```javascript
// src/utils/seedDatabase.js
export const seedDatabase = async () => {
  // Check if already seeded
  if (isDatabaseSeeded()) return;
  
  // Check if existing data
  const existing = await getAllScholarships();
  if (existing.length > 0) {
    markDatabaseSeeded();
    return;
  }
  
  // Import seed data
  // ...
}
```

## Troubleshooting

### Site Not Loading
- Check GitHub Pages settings point to `gh-pages` branch
- Verify repository name matches `scholarship-tracker`
- Wait 2-3 minutes for deployment to complete

### Assets Not Loading (404s)
- Ensure `base` in `vite.config.js` matches repository name
- Check GitHub Pages source is set to `gh-pages` branch

### Data Not Seeding
- Clear browser storage and reload
- Check browser console for errors
- Verify `seedData.json` exists and is valid JSON

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are properly installed
- Review GitHub Actions logs for specific errors

## Advanced Usage

### Custom Templates in Seed Data

You can add custom templates to the seed data:

```json
{
  "templates": [
    {
      "id": "custom-scholarship",
      "name": "Custom University Scholarship",
      "description": "Template for custom university scholarships",
      "category": "Custom",
      "country": "University",
      "createdBy": "user",
      "version": "1.0",
      "items": [
        { "text": "University application", "note": "Complete university form" },
        { "text": "Financial aid form", "note": "FAFSA or equivalent" }
      ]
    }
  ]
}
```

### Large Dataset Considerations

For datasets with many items:
- Consider breaking into multiple exports
- Monitor browser memory usage
- Test on mobile devices
- Use pagination for large lists

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify GitHub Actions workflow completed successfully
3. Ensure repository structure matches the expected layout
4. Test locally before pushing to repository

## Future Enhancements

Potential improvements:
- Admin interface for GitHub Pages data updates
- Automated data sync from external sources
- Multi-language template support
- Advanced filtering and search for seed data
- Data validation and cleanup tools