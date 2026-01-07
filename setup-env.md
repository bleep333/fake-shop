# Environment Variables Setup

Create a `.env` file in the root directory with the following content:

```env
# Database
# PostgreSQL connection string
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
# For local PostgreSQL: postgresql://postgres:password@localhost:5432/fake_shop
DATABASE_URL="postgresql://postgres:password@localhost:5432/fake_shop"

# NextAuth.js Configuration
# Your app URL (use http://localhost:3000 for local development)
NEXTAUTH_URL="http://localhost:3000"

# NextAuth Secret
# Generate a random secret: openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

## Quick Setup

1. Copy this content into a new file named `.env` in the project root
2. Update `DATABASE_URL` with your PostgreSQL credentials
3. Generate and set `NEXTAUTH_SECRET` (see instructions below)

## Generating NEXTAUTH_SECRET

**macOS/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Or use online generator:**
https://generate-secret.vercel.app/32
