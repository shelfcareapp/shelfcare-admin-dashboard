import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { userName, userEmail, messageContent } = body;

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
    subject: 'New Message Notification',
    text: `Hello ${userName},\n\nYou have received a new message:\n\n${messageContent}\n\nPlease log in to your account to view the message.`
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
