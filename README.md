
# Voice Analytics Dashboard

A React + TypeScript analytics dashboard that visualizes call analytics data and allows users to edit, save, and reload chart data using Supabase for persistence.
The application is deployed as a Static Site on Render.

🚀 Live Demo

👉 Deployed URL:

https://analytics-dashboard-ij7t.onrender.com/

# Overview

This project simulates a lightweight analytics dashboard inspired by platforms like superbryn.com.
It focuses on data visualization, user interaction, and simple persistence without requiring a custom backend API.

 - The dashboard allows users to:

 - View analytics charts

 - Modify chart values

 - Save analytics data using an email

 - Reload previously saved data

 - Confirm before overwriting existing data

# Features

 - Interactive analytics chart (Recharts)

 - Editable chart values

 - Email-based data storage

 - Overwrite confirmation flow

 - Responsive and clean UI

 - Deployed on Render as a static site


# Tech Stack

 - Framework: React

 - Language: TypeScript

 - Build Tool: Vite

 - Styling: Tailwind CSS

 - Charts: Recharts

 - Backend-as-a-Service: Supabase

 - Hosting: Render (Static Site)

 
## Application Flow


```bash
    User opens dashboard
            ↓
    Chart displays default (dummy) data
            ↓
    User edits chart values
            ↓
    Clicks "Save Changes"
            ↓
    Email is requested
            ↓
    Supabase checks for existing data
            ↓
    Overwrite confirmation (if data exists)
            ↓
    Data is saved to Supabase
            ↓
    User can reload saved data using email
```
    
## Environment Variables

The following environment variables are required and configured in Render:

`VITE_SUPABASE_URL=https://your-project-id.supabase.co`

`VITE_SUPABASE_ANON_KEY=your-public-anon-key`


# Running Locally

```bash
npm install
npm run dev
```

# Open

```bash
http://localhost:5173
```
# Build for Production

```bash
npm run build
```

The production build is generated in the dist/ directory.

# Deployment (Render)

The application is deployed as a Static Site on Render.

# Render Configuration

 - Service Type: Static Site

 - Build Command:
 ```bash
npm install && npm run build
```
 - Publish directory
 ```bash
 dist
```

# Why Supabase Is Used Directly
Simplifies persistence for frontend-only analytics

Avoids unnecessary backend APIs

Suitable for demos, dashboards, and internal tools

Matches the scope of the assessment


# Future Improvements
Authentication instead of email-only identification

Multiple charts and dashboards

Better UI polish and animations

Role-based access control

Integration with backend APIs if required
