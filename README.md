# BFP Surigao - Fire Station Management System

A modern web application for managing Bureau of Fire Protection (BFP) Surigao fire stations, personnel, equipment, and incident reports.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with shadcn/ui patterns

## Project Structure

```
bfp-surigao/
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (login, register)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── api/               # API routes
│   │
│   ├── components/           # React components
│   │   ├── layout/
│   │   ├── stations/
│   │   ├── personnel/
│   │   ├── equipment/
│   │   ├── incidents/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── supabase/          # Supabase client configurations
│   │   └── utils.ts           # Utility functions
│   │
│   ├── services/              # Data fetching services
│   │   ├── stations.ts
│   │   ├── personnel.ts
│   │   ├── equipment.ts
│   │   └── reports.ts
│   │
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware for auth
│
├── supabase/
│   └── migrations/            # Database migrations
│
├── .env.local                 # Environment variables
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project created

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bfp-surigao
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.local.example .env.local
```

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

4. Run database migrations:
```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL files in supabase/migrations/
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Public Routes
- **Landing Page**: Overview of the system
- **Login**: User authentication
- **Register Station**: New station registration

### Dashboard Routes (Protected)
- **Dashboard**: Overview of operations
- **Stations**: Manage fire stations
  - View station details
  - Manage personnel
  - Manage equipment
- **BFP Operations**:
  - RTR (Rapid, Tactical, Response)
  - Fire Incidents
  - EMS (Emergency Medical Services)
- **Admin**:
  - Station registrations

## Database Schema

The application uses the following main tables:
- `stations` - Fire station information
- `personnel` - Station personnel records
- `equipment` - Fire station equipment
- `fire_incidents` - Fire incident reports
- `ems_incidents` - Emergency medical service incidents

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
