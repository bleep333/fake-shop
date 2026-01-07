# Fake Shop

A fake clothing store website built with Next.js, PostgreSQL, Prisma, and Auth.js.

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth.js)

## Getting Started

### Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running (or Docker)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://postgres:password@localhost:5432/fake_shop`)
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

3. **Set up the database:**
```bash
npm run db:generate
npm run db:push
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

- **Email**: `user@fakeshop.com`
- **Password**: `user123`

### Database Setup Options

**Option 1: Local PostgreSQL**
- Install PostgreSQL and create a database
- Update `DATABASE_URL` in `.env`

**Option 2: Docker (Easiest)**
```bash
docker run --name fake-shop-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fake_shop \
  -p 5432:5432 \
  -d postgres:14
```

For complete setup instructions, see [SETUP.md](./SETUP.md)

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
