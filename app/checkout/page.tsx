'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

type PaymentMethod = 'credit-card' | 'paypal'
type BillingOption = 'same' | 'different'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card')
  const [billingOption, setBillingOption] = useState<BillingOption>('same')
  
  // Contact form state
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('Australia')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('NSW')
  const [postcode, setPostcode] = useState('')
  const [phone, setPhone] = useState('')
  
  // Credit card form state
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const prevExpirationRef = useRef('')

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const previousValue = prevExpirationRef.current || expirationDate
    
    // Remove all non-digits to get raw digits
    let digits = input.replace(/\D/g, '')
    
    // Limit to 4 digits
    if (digits.length > 4) {
      digits = digits.slice(0, 4)
    }
    
    // Check if user is deleting by comparing digit counts
    const prevDigits = previousValue.replace(/\D/g, '')
    const isDeleting = digits.length < prevDigits.length || input.length < previousValue.length
    
    // If deleting and we had 2 digits with formatting, check if user deleted through formatting
    if (isDeleting && prevDigits.length === 2 && previousValue.includes(' / ')) {
      // If input is now just digits (no formatting) or very short, they deleted through formatting
      // Check if input length suggests they deleted a digit
      const expectedLengthWithFormatting = 5 // "12 / "
      if (input.length < expectedLengthWithFormatting && digits.length === 2) {
        // Input is shorter than expected, likely deleted a digit along with formatting
        digits = digits.slice(0, -1)
      }
    }
    
    // Format as MM / YY
    let formatted = digits
    
    if (digits.length > 2) {
      // More than 2 digits: always show as "MM / YY"
      formatted = digits.slice(0, 2) + ' / ' + digits.slice(2)
    } else if (digits.length === 2) {
      // Exactly 2 digits: add slash only if typing forward or formatting still present
      const hasFormatting = input.includes(' / ') || (input.includes('/') && input.length > 2)
      
      if (!isDeleting || hasFormatting) {
        // Typing forward, or deleting but formatting still present
        formatted = digits + ' / '
      } else {
        // User deleted the formatting, so don't add it back
        formatted = digits
      }
    } else if (digits.length === 1) {
      // Single digit: no slash
      formatted = digits
    }
    // If digits.length === 0, formatted stays as empty string
    
    prevExpirationRef.current = formatted
    setExpirationDate(formatted)
  }
  
  // Billing address form state
  const [billingCountry, setBillingCountry] = useState('Australia')
  const [billingFirstName, setBillingFirstName] = useState('')
  const [billingLastName, setBillingLastName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('NSW')
  const [billingPostcode, setBillingPostcode] = useState('')
  const [billingPhone, setBillingPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Checkout submitted')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Contact Section */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Contact</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-1.5">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1.5">
                Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-1.5">
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-1.5">
                State/territory
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>

            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-900 mb-1.5">
                Postcode
              </label>
              <input
                type="text"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p className="text-sm text-gray-600 mb-5">All transactions are secure and encrypted.</p>
          <div className="space-y-3">
            {/* Credit Card Option */}
            <div>
              <label
                className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'credit-card'
                    ? 'border-blue-600 bg-blue-50 rounded-t-md border-b-0'
                    : 'border-gray-200 hover:border-gray-300 rounded-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  />
                  <span className="text-sm font-medium">Credit card</span>
                </div>
                {paymentMethod === 'credit-card' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600">VISA</span>
                    <span className="text-xs font-semibold text-blue-600">Mastercard</span>
                    <span className="text-xs font-semibold text-blue-600">AMEX</span>
                    <span className="text-xs text-gray-500">+2</span>
                  </div>
                )}
              </label>
              
              {/* Credit Card Form - Slides under credit card option */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  paymentMethod === 'credit-card' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`pt-4 pb-4 px-4 space-y-4 bg-gray-50 border-2 border-blue-600 border-t-0 rounded-b-md ${
                  paymentMethod === 'credit-card' ? '' : 'border-0'
                }`}>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Expiration date (MM / YY)
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      value={expirationDate}
                      onChange={handleExpirationDateChange}
                      placeholder="MM / YY"
                      maxLength={7} // "MM / YY" = 7 characters
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="securityCode" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Security code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="securityCode"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="CVV"
                        maxLength={4}
                        required
                        className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Name on card
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                </div>
              </div>
            </div>

            {/* PayPal Option */}
            <div>
              <label
                className={`flex items-center justify-between p-4 border-2 rounded-md cursor-pointer transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  />
                  <span className="text-sm font-medium">PayPal</span>
                </div>
                {paymentMethod === 'paypal' && (
                  <span className="text-sm font-semibold text-blue-600">PayPal</span>
                )}
              </label>
              
              {/* PayPal Message - Slides under PayPal option */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  paymentMethod === 'paypal' ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pt-4 pl-2">
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      After clicking 'Pay with PayPal', you will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Billing Address Section */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Billing Address</h2>
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 border-2 rounded-md cursor-pointer transition-colors ${
                billingOption === 'same'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="billing"
                value="same"
                checked={billingOption === 'same'}
                onChange={(e) => setBillingOption(e.target.value as BillingOption)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
              />
              <span className="ml-3 text-sm font-medium">Same as shipping address</span>
            </label>

            <label
              className={`flex items-center p-4 border-2 rounded-md cursor-pointer transition-colors ${
                billingOption === 'different'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="billing"
                value="different"
                checked={billingOption === 'different'}
                onChange={(e) => setBillingOption(e.target.value as BillingOption)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
              />
              <span className="ml-3 text-sm font-medium">Use a different billing address</span>
            </label>

            {billingOption === 'different' && (
              <div className="mt-4 space-y-4 pl-2">
                <div>
                  <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Country
                  </label>
                  <select
                    id="billingCountry"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  >
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billingFirstName" className="block text-sm font-medium text-gray-900 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      id="billingFirstName"
                      value={billingFirstName}
                      onChange={(e) => setBillingFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="billingLastName" className="block text-sm font-medium text-gray-900 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="billingLastName"
                      value={billingLastName}
                      onChange={(e) => setBillingLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="billingAddress"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="billingCity" className="block text-sm font-medium text-gray-900 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    id="billingCity"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="billingState" className="block text-sm font-medium text-gray-900 mb-1.5">
                    State/territory
                  </label>
                  <select
                    id="billingState"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  >
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="ACT">ACT</option>
                    <option value="NT">NT</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="billingPostcode" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="billingPostcode"
                    value={billingPostcode}
                    onChange={(e) => setBillingPostcode(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="billingPhone" className="block text-sm font-medium text-gray-900 mb-1.5">
                    Phone <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="billingPhone"
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {paymentMethod === 'credit-card' ? (
              'Pay now'
            ) : (
              <>
                Pay with <span className="italic">PayPal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
