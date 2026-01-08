import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Fake user database with address information
const fakeUsers = {
  'user@fakeshop.com': {
    id: '1',
    email: 'user@fakeshop.com',
    name: 'Fake User',
    password: 'user123',
    address: {
      street: '123 Main St',
      city: 'Sydney',
      postcode: '2000',
      state: 'NSW',
      phone: '+61 412 345 678',
    },
  },
  'admin': {
    id: 'admin',
    email: 'admin@fakeshop.com',
    name: 'Admin',
    password: 'admin',
    isAdmin: true,
  },
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Handle admin login (username can be "admin" or "admin@fakeshop.com")
        const emailKey = credentials.email.toLowerCase() === 'admin' 
          ? 'admin' 
          : credentials.email.toLowerCase()
        
        const user = fakeUsers[emailKey as keyof typeof fakeUsers]
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            address: user.address,
            isAdmin: user.isAdmin || false,
          }
        }

        return null
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fake-shop-secret-key-change-in-production',
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        if (token.address) {
          ;(session.user as any).address = token.address
        }
        if (token.isAdmin !== undefined) {
          ;(session.user as any).isAdmin = token.isAdmin
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if ((user as any).address) {
          token.address = (user as any).address
        }
        if ((user as any).isAdmin !== undefined) {
          token.isAdmin = (user as any).isAdmin
        }
      }
      return token
    },
  },
}

