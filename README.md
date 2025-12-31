# CargoWatch

**America's Freight Protection Network**

A collaborative community technology platform for the US maritime, intermodal, and trucking community to watch, alert, and protect against cargo theft.

## 🎯 Demo Overview

This is a **production-ready demo** showcasing the CargoWatch platform with realistic test data. Perfect for presenting to stakeholders and winning contracts.

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Seed the database with demo data
npm run db:seed

# Start development server
npm run dev
```

Visit **http://localhost:3000** to view the demo.

## ✅ What's Included

### Pages
- **Home** (`/`) - Hero, features, stats, mission
- **Alert Feed** (`/alerts`) - Real-time incident feed with 6 demo incidents
- **Report Incident** (`/report`) - Multi-step reporting form
- **About** (`/about`) - Business value, problem/solution, market opportunity
- **Resources** (`/resources`) - Security products, educational content, partnerships

### Demo Data
- ✅ **6 realistic incident reports** (theft, suspicious activity, tampering)
- ✅ **3 priority regions** (Memphis TN, Los Angeles CA, Dallas TX)
- ✅ **6 security resources** (products, guides, partnerships)
- ✅ **4 demo user accounts** (drivers, security, law enforcement)
- ✅ **3 community comments** on incidents

### Tech Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - Database toolkit
- **Supabase** - PostgreSQL + Authentication
- **Tailwind CSS 4** - Modern styling
- **Heroicons** - Beautiful icons

## 📊 Database Schema

7 production-ready tables:
1. **users** - User profiles with roles (driver, security, law_enforcement)
2. **incidents** - Cargo theft and suspicious activity reports
3. **evidence** - Photos/videos attached to incidents
4. **comments** - Community discussion
5. **regions** - Geographic areas with statistics
6. **resources** - Security products and partnerships
7. **notifications** - Real-time user alerts

## 🎨 Design System

- **Brand Red** `#D93025` - Primary CTA buttons, critical alerts
- **Navy Dark** `#151822` - Header, navigation
- **Navy** `#1B202B` - Main background
- **Navy Light** `#242936` - Cards, hover states

## 📱 Features Demonstrated

### Real-Time Intelligence
- Live incident feed with filtering by region, severity, and type
- Time-relative updates (2h ago, 5h ago, etc.)
- View counts, comments, engagement metrics

### Incident Reporting
- Multi-step form with validation
- Location selection (region + specific location)
- Cargo type classification
- Evidence upload capability (UI ready)
- Reporter contact information

### Business Value
- **$35B annual problem** addressed
- **3.5M+ potential users** (truck drivers)
- **15,000+ law enforcement agencies** integration opportunity
- Priority region targeting (Memphis, LA, Dallas)

### Community Platform
- User comments and discussion
- Verified members (drivers, carriers, law enforcement)
- Free platform for all stakeholders

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Environment variables are already configured in `.env` and will need to be added to your hosting platform.

## 📁 Project Structure

```
CargoWatch/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── alerts/page.tsx    # Alert feed
│   │   ├── report/page.tsx    # Report form
│   │   ├── about/page.tsx     # About/pitch
│   │   └── resources/page.tsx # Resources
│   ├── server/
│   │   ├── api/               # tRPC routers
│   │   └── db/
│   │       ├── schema.ts      # Database schema
│   │       ├── seed.ts        # Demo data seeder
│   │       └── index.ts       # DB client
│   └── lib/
│       └── supabase/          # Supabase utilities
├── .env                        # Environment variables
└── package.json
```

## 🎯 Perfect For

- **Stakeholder Presentations** - Beautiful UI, realistic data
- **Contract Proposals** - Shows technical competency and vision
- **Investor Pitches** - Demonstrates market opportunity ($35B problem)
- **Feature Planning** - Foundation for building full platform

## 📞 Demo Highlights to Show

1. **Home Page** - The $35 billion problem and solution
2. **Alert Feed** - 6 realistic incidents with engagement
3. **Report Page** - Professional multi-step form
4. **About Page** - Market opportunity and who you serve
5. **Resources** - Partnerships and security products

## 🔒 Security Note

This demo uses placeholder credentials. For production:
- Implement Row Level Security (RLS) in Supabase
- Add rate limiting
- Enable file upload virus scanning
- Implement content moderation

## 🎊 Status

**✅ Production-Ready Demo**
- All TypeScript checks passing
- Production build successful
- Realistic test data loaded
- Professional UI/UX
- Ready for deployment

**Dev Server:** http://localhost:3000
**Database:** ✅ Supabase PostgreSQL
**Status:** 🟢 Demo Ready
