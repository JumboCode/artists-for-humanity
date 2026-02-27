# Artists for Humanity - Tech Stack Setup

## 🛠️ Implemented Tech Stack

### Frontend

- ✅ **React 19.2.0** - Latest React with concurrent features
- ✅ **TypeScript 5.9.3** - Type-safe development
- ✅ **TailwindCSS 3.x** - Utility-first CSS framework
- ✅ **Next.js 15.5.4** - Full-stack React framework with App Router

### Backend & Database

- ✅ **Neon/PostgreSQL** - Database setup ready (see .env.example)
- ✅ **NextAuth.js 4.24.10** - Authentication system with Google OAuth
- ✅ **Prisma 6.1.0** - Database ORM with schema models

### Development Tools

- ✅ **ESLint** - Code linting with Next.js configuration
- ✅ **Prettier** - Code formatting
- ✅ **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
AFH/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with TailwindCSS
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts     # NextAuth configuration
├── lib/
│   └── prisma.ts               # Prisma client setup
├── prisma/
│   └── schema.prisma           # Database schema
├── backup-src/                 # Backup of original components
│   ├── components/
│   └── pages/
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # TailwindCSS configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Available Scripts

### Next.js (Recommended)

```bash
npm run dev          # Start Next.js development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio GUI
```

## 🗄️ Database Schema

The Prisma schema currently includes:

- **NextAuth models**: User, Account, Session, VerificationToken
- **Custom models**: Project, Application
- **User fields**: role, bio, skills, location, timestamps

## 🔐 Authentication Setup

NextAuth.js is planned to be configured with:

- Google OAuth provider
- Prisma adapter for database sessions
- JWT strategy
- Custom user fields support

## 🌐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/afh_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🎨 Styling with TailwindCSS

The app uses TailwindCSS with:

- Typography plugin for rich text
- Custom color schemes
- Responsive design utilities
- Dark mode support

## 📋 Next Steps

1. **Database Setup**:
   - Set up Neon PostgreSQL database
   - Update DATABASE_URL in .env
   - Run `npm run db:push` to create tables

2. **Authentication**:
   - Create Google OAuth app
   - Add client ID/secret to .env
   - Test login functionality

3. **Development**:
   - Visit http://localhost:3000 to see your app
   - Start building components in `app/` directory
   - Use TailwindCSS for styling

4. **Deployment**:
   - Deploy to Vercel for optimal Next.js hosting
   - Connect Neon database
   - Set environment variables in Vercel

## 🔗 Current Status

- ✅ **Next.js Server**: Running on http://localhost:3000
- ✅ **TailwindCSS**: Configured and working
- ✅ **TypeScript**: Full type safety enabled
- ✅ **Prisma**: Schema ready for database connection (for later tickets)
- ✅ **NextAuth**: Authentication routes configured (for later tickets)
