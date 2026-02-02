'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('user@fakeshop.com')
  const [password, setPassword] = useState('user123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/profile')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3 text-black"
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
            Sign In
          </h1>
          <p className="text-stone-600">
            Sign in to your account to view orders, manage addresses, and more.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Demo Credentials Notice */}
            <div className="bg-stone-50 border border-stone-200 rounded-md p-4">
              <p className="text-xs text-stone-600 mb-2 font-medium">Demo Account</p>
              <p className="text-sm text-stone-700">
                Credentials are pre-filled for quick access. Just click Sign In to continue.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                placeholder="user@fakeshop.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                placeholder="user123"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-600 text-center">
              Don&apos;t have an account?{' '}
              <Link href="/profile" className="underline hover:text-black font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Dashboard Link - Only show for demo purposes */}
        <div className="mt-8 pt-6 border-t border-stone-200 text-center">
          <Link
            href="/admin"
            className="text-sm text-stone-500 hover:text-black underline transition-colors"
          >
            Admin Dashboard Access
          </Link>
        </div>
      </div>
    </div>
  )
}
