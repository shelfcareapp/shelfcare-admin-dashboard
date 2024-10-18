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
    subject: 'Order Confirmation',
    text: `Hello ${userName},\n\nYour order has been confirmed. Here are the details:\n\n${orderDetails}\n\nTotal Price: ${totalPrice} €\n\nThank you for your order!

    View your order details: https://shelfcare.com/orders

    Best regards,
    Shelfcare Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Order confirmation email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return NextResponse.json(
      { message: 'Failed to send order confirmation email.' },
      { status: 500 }
    );
  }
}
