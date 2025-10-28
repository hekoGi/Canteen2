# Skráseting - Local Development Setup Guide

This guide will help you run the Skráseting canteen management application on your local Windows PC.

## Prerequisites

Download and install these programs:

1. **Node.js** (version 20 or later)
   - Download from: https://nodejs.org
   - Choose the LTS (Long Term Support) version
   - The installer will also install npm automatically

2. **PostgreSQL** (version 14 or later)
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember the password you set for the `postgres` user
   - Keep the default port: 5432

## Step-by-Step Setup

### 1. Get the Project Files

Download the project from Replit:
- Click the three dots menu in Replit
- Select "Download as zip"
- Extract the zip file to a folder on your computer (e.g., `C:\Projects\Skraseting`)

### 2. Create a Database

1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to your PostgreSQL server using the password you set during installation
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `skraseting`
5. Click "Save"

### 3. Create Environment File

Create a file called `.env` in your project folder:

**Using Notepad:**
1. Open Notepad
2. Type the following (replace `yourpassword` with your actual PostgreSQL password):
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/skraseting
   ```
3. Click File → Save As
4. In the "Save as type" dropdown, select **"All Files (*.*)"**
5. Name the file: `.env` (including the dot at the start)
6. Save it in your project root folder (same location as package.json)

### 4. Install Dependencies

1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```bash
   cd C:\Projects\Skraseting
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
   This will take a few minutes to download everything.

### 5. Initialize Database Tables

Run this command to create all necessary database tables:
```bash
npm run db:push
```

If you see a data loss warning, use:
```bash
npm run db:push --force
```

### 6. Start the Application

Run the development server:
```bash
npm run dev
```

You should see:
```
serving on port 5000
```

### 7. Open in Browser

Open your web browser and go to:
```
http://localhost:5000
```

Your Skráseting application is now running locally!

## Common Issues

### Issue: "DATABASE_URL not found"
- Make sure your `.env` file is in the root folder
- Make sure the file name is exactly `.env` (not `.env.txt`)
- Check that there are no spaces around the `=` sign

### Issue: "Connection refused to database"
- Make sure PostgreSQL is running (check Windows Services)
- Verify your password is correct in the `.env` file
- Confirm the database `skraseting` exists in pgAdmin

### Issue: "PORT already in use"
- Another application is using port 5000
- You can change the port by adding `PORT=3000` (or any other port number) to your `.env` file
- Alternatively, close the application using port 5000

### Issue: "NODE_ENV is not recognized"
- This should not happen as the project is already configured for Windows
- If it does, verify that cross-env is installed: `npm install cross-env`

## Key Changes Made for Local Development

The project has been updated from Neon (cloud PostgreSQL) to work with local PostgreSQL:

1. **Database Driver**: Changed from `@neondatabase/serverless` to standard `pg` (node-postgres)
2. **Connection Method**: Now uses standard PostgreSQL connection pooling
3. **Environment Loading**: Added `dotenv` to automatically load `.env` file
4. **Cross-Platform**: Installed `cross-env` for Windows compatibility

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Update database schema**: `npm run db:push`
- **Type checking**: `npm run check`

## Database Schema

The application uses these tables:
- `activity_logs` - Tracks all movements between registrations and invoiced states
- Additional tables will be created when you run `npm run db:push`

## Need Help?

If you encounter issues:
1. Check that PostgreSQL is running
2. Verify your `.env` file is configured correctly
3. Make sure you updated package.json scripts
4. Check the console for error messages
