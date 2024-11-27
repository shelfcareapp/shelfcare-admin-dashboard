import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { userName, userEmail, orderDetails, totalPrice } = body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_FROM,
    to: userEmail,
    subject: 'Payment Available',
    text: `Hello ${userName},\n\nThe payment for your order is now available. Here are the details:\n\n${orderDetails}\n\nTotal Price: ${totalPrice} €\n\nPlease proceed with the payment at your earliest convenience.
    
    Link to payment page: https://shelfcare.com/orders

    Thank you!

    Best regards,
    Shelfcare Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Payment available email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending payment available email:', error);
    return NextResponse.json(
      { message: 'Failed to send payment available email.' },
      { status: 500 }
    );
  }
}
