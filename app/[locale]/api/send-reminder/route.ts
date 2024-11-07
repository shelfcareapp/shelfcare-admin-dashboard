import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();
import admin from "firebase-admin";

export default async function handler(req, res) {
  try {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Query for eligible orders
    const ordersSnapshot = await db.collection("orders")
      .where("pickupTime", ">=", now)
      .where("pickupTime", "<=", twentyFourHoursLater)
      .where("status", "==", "confirmed")
      .where("notificationSent", "==", false)
      .get();

    // If no orders found, return early
    if (ordersSnapshot.empty) {
      return res.status(200).json({ message: "No reminders to send." });
    }

    // Process orders in batches to avoid overwhelming Firestore
    const batchSize = 500;
    const batches = [];
    let batch = db.batch();
    let operationCount = 0;

    // Process each order
    const updatePromises = ordersSnapshot.docs.map(async (orderDoc) => {
      const orderData = orderDoc.data();
      const userId = orderData.customerId;

      // Add message to user's chat
      const chatRef = db.collection("chats").doc(userId);
      batch.update(chatRef, {
        messages: admin.firestore.FieldValue.arrayUnion({
          sender: "Admin",
          content: `Reminder: Your pickup is scheduled for ${new Date(orderData.pickupTime.toDate()).toLocaleString()}.`,
          time: now.toISOString(),
        })
      });

      // Mark order as notified
      batch.update(orderDoc.ref, { notificationSent: true });
      operationCount += 2;

      // If we've hit the batch limit, commit and start a new batch
      if (operationCount >= batchSize) {
        batches.push(batch.commit());
        batch = db.batch();
        operationCount = 0;
      }
    });

    // Commit any remaining operations in the final batch
    if (operationCount > 0) {
      batches.push(batch.commit());
    }

    // Wait for all operations to complete
    await Promise.all([...updatePromises, ...batches]);

    res.status(200).json({ 
      message: "Reminders sent successfully", 
      count: ordersSnapshot.size 
    });

  } catch (error) {
    console.error("Error sending reminders:", error);
    res.status(500).json({ 
      error: "Error sending reminders",
      message: error.message 
    });
  }
}