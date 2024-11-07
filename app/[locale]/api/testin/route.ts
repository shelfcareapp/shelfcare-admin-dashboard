// app/[locale]/api/send-reminders/route.ts
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();
import admin from 'firebase-admin';

export async function GET() {
  try {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const ordersSnapshot = await db.collection("orders")
      .where("pickupTime", ">=", now)
      .where("pickupTime", "<=", twentyFourHoursLater)
      .where("status", "==", "confirmed")
      .where("notificationSent", "==", false)
      .get();

    ordersSnapshot.forEach(async (orderDoc) => {
      const orderData = orderDoc.data();
      const userId = orderData.customerId;

      await db.collection("chats").doc(userId).update({
        messages: admin.firestore.FieldValue.arrayUnion({
          sender: "Admin",
          content: `Reminder: Your pickup is scheduled for ${orderData.pickupTime}.`,
          time: new Date().toISOString(),
        })
      });
      await orderDoc.ref.update({ notificationSent: true });
    });

    return NextResponse.json({ message: "Reminders checked and sent." });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json({ error: "Error sending reminders" }, { status: 500 });
  }
}
