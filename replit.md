# Skráseting - Canteen Meal Entry Portal

## Overview

Skráseting is a professional canteen registry system designed for recording meal entries with user details and payment information. The application serves as a utility-focused tool for canteen staff, emphasizing efficiency, clarity, and data entry accuracy. Built with React, TypeScript, and modern web technologies, it provides a clean Material Design-inspired interface for managing meal transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component system for consistent, accessible design
- **Styling**: Tailwind CSS with custom design tokens and Material Design principles
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for type safety across the stack
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API structure with /api prefix for all endpoints

### Data Storage
- **Database**: PostgreSQL with Neon serverless database provider (or local PostgreSQL for development)
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Schema Design**: 
  - `canteen_entries` table with fields for name, company, meal type, amount, representative, invoice status, and timestamps
  - `users` table with username, hashed password, approval status, admin role, and timestamps
  - `activity_logs` table for tracking meal entry movements between registrations and invoiced
  - UUID primary keys with automatic generation
  - Decimal precision for monetary amounts

### Design System
- **Theme**: Material Design approach with light/dark mode support
- **Color Palette**: Modern blue primary colors (HSL 25 85% 53% light, 25 75% 65% dark)
- **Typography**: Inter font family with consistent weight hierarchy
- **Component Library**: Custom components built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Development Tooling
- **Package Management**: npm with lockfile for consistent dependencies
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Build Process**: Separate client and server builds with esbuild for server bundling
- **Development Server**: Hot module replacement with Vite dev server

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

### UI and Component Libraries
- **Radix UI**: Headless component primitives for accessibility and keyboard navigation
- **shadcn/ui**: Pre-built component system based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and data fetching

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **PostCSS**: CSS processing with autoprefixer
- **Google Fonts**: Inter font family for typography

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type system for JavaScript
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **Class Variance Authority**: Component variant management

### Session and Security
- **connect-pg-simple**: PostgreSQL session store for Express
- **Express Sessions**: Session management middleware with CSRF protection (sameSite: lax)
- **bcryptjs**: Password hashing for user authentication
- **Session Regeneration**: Prevents session fixation attacks on login

### Authentication System
- **User Registration**: Public registration with admin approval workflow
- **Login System**: Session-based authentication with password validation
- **Default Admin User**: Automatically created on application startup
  - Username: `admin`
  - Password: `W5hoSxQFLC#P&o!3fG$s`
  - Status: Pre-approved with admin privileges
- **Protected Routes**: /registrations, /invoiced, and /log require authentication and approval
- **Admin Panel**: User management at /admin for approving users and assigning admin roles
- **Role-Based Access**: Admin-only endpoints for user management operations

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional class name utilities
- **nanoid**: URL-safe unique ID generator