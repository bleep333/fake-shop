# Fake Shop

A fake clothing store website built with Next.js, PostgreSQL, Prisma, and Auth.js.

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth.js)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running

### Installation

1. Install dependencies:
```bash
npm install
```

**Note:** Tailwind CSS is included in the dependencies. After installation, the Tailwind configuration is already set up and ready to use.

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - A random secret string

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` - Home/Landing page
- `/mens` - Mens clothing collection
- `/womens` - Womens clothing collection
- `/wishlist` - User wishlist
- `/profile` - User profile
- `/cart` - Shopping cart

## Database

Use Prisma Studio to view and edit your database:
```bash
npm run db:studio
```

## Project Structure

```
fake-shop/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # Auth.js routes
│   ├── cart/              # Cart page
│   ├── mens/              # Mens page
│   ├── profile/           # Profile page
│   ├── womens/            # Womens page
│   ├── wishlist/          # Wishlist page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles (Tailwind)
├── components/             # Reusable components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── ProductCard.tsx    # Product card component
│   ├── FilterSidebar.tsx  # Product filters
│   ├── MobileDrawer.tsx   # Mobile navigation drawer
│   └── PlaceholderImage.tsx # Image placeholder
├── lib/                    # Utility libraries
│   ├── auth.ts            # Auth.js configuration
│   ├── prisma.ts          # Prisma client
│   └── mockProducts.ts    # Mock product data
├── prisma/                 # Prisma files
│   └── schema.prisma      # Database schema
└── package.json

```
