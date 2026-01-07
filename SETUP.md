# Local Development Setup Guide

This guide will help you set up and run the Fake Shop website locally on your machine with a PostgreSQL database.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL** - Choose one of the following options:

### Option A: Install PostgreSQL Locally

#### Windows
- Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
- Or use [PostgreSQL Installer](https://www.postgresql.org/download/windows/)
- During installation, remember the password you set for the `postgres` user

#### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Option B: Use Docker (Recommended - Easier Setup)

If you have Docker installed, you can run PostgreSQL in a container:

```bash
docker run --name fake-shop-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fake_shop \
  -p 5432:5432 \
  -d postgres:14
```

To stop the container:
```bash
docker stop fake-shop-db
```

To start it again:
```bash
docker start fake-shop-db
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Windows (CMD)
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

### 3. Configure Environment Variables

Open `.env` in your editor and update the following:

#### Database URL

**If using local PostgreSQL:**
1. Create a database (if it doesn't exist):
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE fake_shop;
   
   # Exit
   \q
   ```

2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fake_shop"
   ```
   Replace `YOUR_PASSWORD` with your PostgreSQL password.

**If using Docker:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fake_shop"
```

#### NextAuth Configuration

1. **NEXTAUTH_URL**: Should already be set to `http://localhost:3000`

2. **NEXTAUTH_SECRET**: Generate a random secret:
   ```bash
   # macOS/Linux
   openssl rand -base64 32
   
   # Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```
   
   Or use an online generator: https://generate-secret.vercel.app/32
   
   Copy the generated secret and paste it as the value for `NEXTAUTH_SECRET` in your `.env` file.

### 4. Set Up the Database

Generate Prisma Client:
```bash
npm run db:generate
```

Push the schema to your database:
```bash
npm run db:push
```

This will create all the necessary tables (User, Account, Session, Order, OrderItem, etc.) in your database.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Testing the Setup

### 1. Test Database Connection

You can verify your database is working by opening Prisma Studio:

```bash
npm run db:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your database tables.

### 2. Test Authentication

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Sign In" in the header
3. Use the test credentials:
   - **Email**: `user@fakeshop.com`
   - **Password**: `user123`

### 3. Test Orders

1. Add items to your cart
2. Go to checkout and complete an order
3. Check your profile page - you should see the order in "Recent Orders"

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Make sure PostgreSQL is running
- Check that the port (5432) is correct
- Verify your password in the `DATABASE_URL`

**Error: "database does not exist"**
- Create the database: `CREATE DATABASE fake_shop;`
- Or update `DATABASE_URL` to use an existing database

**Error: "password authentication failed"**
- Double-check your password in `DATABASE_URL`
- Make sure you're using the correct username (usually `postgres`)

### Prisma Issues

**Error: "Prisma Client not generated"**
```bash
npm run db:generate
```

**Error: "Schema is out of sync"**
```bash
npm run db:push
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Use a different port
npm run dev -- -p 3001
```

Then update `NEXTAUTH_URL` in `.env` to match.

## Useful Commands

```bash
# Start development server
npm run dev

# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Create a migration (if using migrations)
npm run db:migrate

# Build for production
npm run build

# Start production server
npm start
```

## Database Management

### View Database Tables

Use Prisma Studio:
```bash
npm run db:studio
```

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

### Backup Database

```bash
# PostgreSQL dump
pg_dump -U postgres fake_shop > backup.sql
```

### Restore Database

```bash
# Restore from backup
psql -U postgres fake_shop < backup.sql
```

## Next Steps

Once everything is set up:

1. ✅ Browse products at `/mens` and `/womens`
2. ✅ Add items to cart
3. ✅ Sign in and complete checkout
4. ✅ View orders in your profile
5. ✅ Explore the order summary pages

Happy coding! 🚀
