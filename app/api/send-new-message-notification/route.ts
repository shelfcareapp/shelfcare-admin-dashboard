import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { config } from '../../../config';

export async function POST(req: Request) {
  const body = await req.json();

  const { userEmail, messageContent, subject } = body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: { name: 'Maija Tunturi- ShelfCare', address: config.mailing.noreply },
    to: userEmail,
    subject,
    text: messageContent
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'New message notification email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending new message notification email:', error);
    return NextResponse.json(
      { message: 'Failed to send new message notification email.' },
      { status: 500 }
    );
  }
}
