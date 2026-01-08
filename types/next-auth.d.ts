import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    isAdmin?: boolean
    address?: {
      street: string
      city: string
      postcode: string
      state: string
      phone: string
    }
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      isAdmin?: boolean
      address?: {
        street: string
        city: string
        postcode: string
        state: string
        phone: string
      }
    }
  }
}
