# Artists for Humanity

A modern web platform for **Artists for Humanity** (AFH) that empowers young artists to showcase their work, connect with the community, and collaborate on projects that make an impact.

## Project Overview

AFH is a nonprofit organization providing under-resourced teens with the keys to self-sufficiency through paid employment in art and design. This platform helps young artists:

- Showcase their creative work in an online gallery
- Connect with peers, mentors, and the broader AFH community
- Build online profiles to present their skills and creative journeys
- Gain visibility and opportunities through gallery features

The platform is being developed in partnership with **JumboCode @ Tufts University**.

## Key Features

### Authentication & Profiles
- User registration and login with NextAuth
- Customizable profiles (display name, bio, profile pictures, banners)
- Social links and contact information

### Artwork Showcase
- Upload artwork (images, metadata)
- Combined home page with featured carousel and community gallery
- Personal user galleries on profile pages
- Tags, categories, and filtering

### Admin Moderation
- Admin dashboard for artwork approval/rejection
- Queue management for pending submissions
- Featured artwork controls (highlight talented work)


## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS, MUI 7 |
| **Backend** | Next.js API Routes, NextAuth 4 (Authentication) |
| **Database** | Prisma ORM + Neon (PostgreSQL) |
| **File Storage** | Cloudinary |
| **Deployment** | Vercel (Frontend, API) + Neon (Database) |
| **Code Quality** | ESLint, Prettier, TypeScript Strict Mode |
| **Version Control** | Git + GitHub |

## Brand Guidelines

The platform follows AFH's official brand guidelines:

- **Primary Color**: Deep Orange `#F26729`
- **Secondary Color**: Blue Gray `#313E48`
- **Typography**: Poppins (Primary), Roboto (Secondary)
- **Components**: Custom design system with accessibility features

See [AFH-BRAND-GUIDELINES.md](./resources/AFH-BRAND-GUIDELINES.md) for complete implementation details.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or Neon)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/afhdigitalart-netizen/afh.git
   cd afh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Provided through Slack)**

4. **Set up the database (No need to do this for now)**
   ```bash
   npm run db:push       # Push schema to database
   npm run db:generate   # Generate Prisma client
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server

# Database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Prisma Studio GUI

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
```

## Team

### JumboCode Team (2024-2025)
- **Project Manager**: John Puka
- **Tech Lead**: Lauren Wu & Subhanga Upadhyay (Shub)
- **Designer**: Shannon Chen

### AFH Team
- **Director, Creative Tech**: Handy Dorceus ([hdorceus@afhboston.org](mailto:hdorceus@afhboston.org))

## Development Timeline

- **September 2024**: Project kickoff, scope definition, wireframes
- **October 2024**: Frontend foundation, core backend setup
- **November 2024**: Profiles, uploads, moderation MVP
- **December 2024**: Bug fixes, UX polish, alpha testing
- **January 2025**: Beta hardening, performance optimization
- **February 2025**: Feature completion, security audit
- **March 2025**: Code freeze, user acceptance testing
- **April 2025**: Final launch preparation and deployment
