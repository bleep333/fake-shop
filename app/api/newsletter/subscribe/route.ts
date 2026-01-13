import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log('📧 Newsletter subscription request received for:', email)

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Create transporter - for development, you can use Ethereal Email or configure SMTP
    // For production, configure with your SMTP credentials
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASSWORD || 'test-password',
      },
    }

    console.log('🔧 SMTP Configuration:')
    console.log('   Host:', smtpConfig.host)
    console.log('   Port:', smtpConfig.port)
    console.log('   Secure:', smtpConfig.secure)
    console.log('   User:', smtpConfig.auth.user)

    const transporter = nodemailer.createTransport(smtpConfig)

    // Verify connection
    console.log('🔍 Verifying SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully')

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@fakeshop.com',
      to: email,
      subject: 'Welcome to our newsletter!',
      text: `Thank you for subscribing to our newsletter!\n\nYou'll receive 10% off your first order. Use code: WELCOME10\n\nWe're excited to share the latest fashion trends and exclusive offers with you.\n\nBest regards,\nThe Fake Shop Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for subscribing!</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll receive <strong>10% off your first order</strong>. Use code: <strong>WELCOME10</strong></p>
          <p>We're excited to share the latest fashion trends and exclusive offers with you.</p>
          <p>Best regards,<br>The Fake Shop Team</p>
        </div>
      `,
    }

    console.log('📤 Sending email...')
    console.log('   From:', mailOptions.from)
    console.log('   To:', mailOptions.to)
    console.log('   Subject:', mailOptions.subject)

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log('✅ Email sent successfully!')
    console.log('   Message ID:', info.messageId)
    console.log('   Response:', info.response)
    console.log('─────────────────────────────────────────')

    return NextResponse.json({ success: true, message: 'Subscription confirmed' })
  } catch (error) {
    console.error('❌ Error sending email:')
    console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('   Error message:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && 'code' in error) {
      console.error('   Error code:', (error as any).code)
    }
    if (error instanceof Error && 'command' in error) {
      console.error('   Command:', (error as any).command)
    }
    console.error('─────────────────────────────────────────')
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}
