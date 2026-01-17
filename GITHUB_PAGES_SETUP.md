# GitHub Pages Deployment Setup

This document provides instructions for enabling GitHub Pages deployment for the Scholarship Tracker app.

## What's Been Set Up

The following components have been configured for automatic deployment:

1. **Vite Configuration** - `vite.config.js` has been updated with `base: '/scholarship-tracker/'` for proper GitHub Pages routing
2. **GitHub Actions Workflow** - `.github/workflows/deploy.yml` will automatically deploy on push to main branch
3. **Seed Data** - `src/data/seedData.json` contains default scholarship data that will load on first visit
4. **Database Seeding** - `src/utils/seedDatabase.js` automatically seeds the IndexedDB on first load
5. **Deploy Script** - `npm run deploy` script added for manual deployment

## Enabling GitHub Pages

Follow these steps to enable GitHub Pages for your repository:

### Step 1: Go to Repository Settings

1. Navigate to your repository on GitHub
2. Click on the **Settings** tab
3. In the left sidebar, click on **Pages** (under "Code and automation")

### Step 2: Configure Build and Deployment

1. Under **Build and deployment**, find the **Source** section
2. Change the source from "Deploy from a branch" to **"GitHub Actions"**
3. Click **Save**

Alternatively, if you prefer the branch-based deployment:

1. Set **Source** to "Deploy from a branch"
2. Set **Branch** to `gh-pages` and folder to `/ (root)`
3. Click **Save**

### Step 3: Trigger Deployment

Once GitHub Pages is enabled:

- **Automatic**: Push any changes to the `main` branch to trigger automatic deployment via GitHub Actions
- **Manual**: Run `npm run deploy` locally (requires gh-pages to be installed)

## Deployment Workflow

When you push to the `main` branch:

1. GitHub Actions workflow triggers automatically
2. Node.js 20 environment is set up
3. Dependencies are installed with `npm ci`
4. The app is built with `npm run build`
5. The `dist/` folder is uploaded as a Pages artifact
6. The site is deployed to GitHub Pages

Your app will be available at: `https://[your-username].github.io/scholarship-tracker/`

## Seed Data Behavior

The app includes seed data to demonstrate functionality:

- **First Visit**: If IndexedDB is empty, seed data is automatically loaded
- **Subsequent Visits**: Existing user data is preserved, seed data is NOT reloaded
- **User Data**: All user-created scholarships, checklists, and documents are stored locally in the browser
- **Reset**: Users can clear their browser data to reset to seed data

### Seed Data Includes:
- 2 sample scholarships with deadlines
- 3 checklist items across scholarships
- 3 document templates
- Links between scholarships and required documents

## Manual Deployment (Optional)

If you need to deploy manually from your local machine:

```bash
# Install gh-pages package (if not already installed)
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

This will:
1. Build the production version of your app
2. Create a `gh-pages` branch in your repository
3. Push the built files to that branch
4. Deploy to GitHub Pages

## Troubleshooting

### Site Not Loading After Deployment

1. Wait a few minutes for GitHub Pages to complete deployment
2. Check the GitHub Actions tab for any build errors
3. Ensure your repository name is exactly `scholarship-tracker` (or update the base path in vite.config.js)

### Assets Not Loading

If CSS, JS, or images fail to load:

1. Verify the `base` path in `vite.config.js` matches your repository name
2. Clear your browser cache
3. Check the browser console for 404 errors

### Seed Data Not Appearing

If seed data doesn't load on first visit:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for "Database already seeded" or "Seeding database" messages
4. Clear browser LocalStorage and IndexedDB to force re-seeding

## Updating Seed Data

To modify the seed data:

1. Edit `src/data/seedData.json` with your desired scholarships, checklists, and documents
2. Update the version number in the JSON
3. Deploy your changes
4. For existing deployments, users can clear their data to see new seed data

## Customizing the Base Path

If your repository name is different from `scholarship-tracker`:

1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/your-repo-name/', // Change this
     // ...
   })
   ```

2. Update this documentation accordingly

## Security Notes

- The app runs entirely in the browser with client-side storage
- No server-side processing or databases are required
- User data is stored locally in IndexedDB and is not transmitted
- The app is suitable for personal use or demonstration purposes
- For production use with real user data, consider adding authentication and server-side storage
