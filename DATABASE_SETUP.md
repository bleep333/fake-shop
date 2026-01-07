# PostgreSQL Database Setup Guide

## Option 1: Install via Homebrew (Recommended)

### Step 1: Install Homebrew (if not already installed)

Run this command in your terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions. After installation, you may need to add Homebrew to your PATH.

### Step 2: Install PostgreSQL

```bash
brew install postgresql@15
```

### Step 3: Start PostgreSQL service

```bash
brew services start postgresql@15
```

### Step 4: Create the database

```bash
createdb fake_shop
```

If `createdb` is not found, you may need to add PostgreSQL to your PATH:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
createdb fake_shop
```

## Option 2: Install via Postgres.app (GUI Application)

1. Download Postgres.app from: https://postgresapp.com/
2. Move it to your Applications folder
3. Open Postgres.app
4. Click "Initialize" to create a new server
5. Click the elephant icon in the menu bar and select "Open psql"
6. Run: `CREATE DATABASE fake_shop;`

## Option 3: Install via Official Installer

1. Download PostgreSQL from: https://www.postgresql.org/download/macosx/
2. Run the installer and follow the instructions
3. Remember the password you set for the `postgres` user
4. After installation, create the database:
   ```bash
   createdb fake_shop
   ```

## After Installation: Configure the Project

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env  # if .env.example exists
   # OR create .env manually
   ```

2. Add your DATABASE_URL to `.env`:
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/fake_shop?schema=public"
   ```

   Replace `YOUR_USERNAME` with your macOS username (you can find it by running `whoami`).

   If you set a password during installation, use:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fake_shop?schema=public"
   ```

3. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

4. Push the schema to the database:
   ```bash
   npm run db:push
   ```

5. (Optional) Open Prisma Studio to view your database:
   ```bash
   npm run db:studio
   ```

## Verify Installation

To verify PostgreSQL is working:
```bash
psql -d fake_shop -c "SELECT version();"
```

You should see PostgreSQL version information.

