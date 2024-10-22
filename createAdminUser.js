const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const createAdminUser = async (email, password) => {
  try {
    const user = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: true,
      displayName: 'Admin',
      disabled: false
    });

    await db.collection('admins').doc(user.uid).set({
      email: email,
      firstLogin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isAdmin: true
    });

    console.log(
      'Admin user created and added to "admins" collection:',
      user.uid
    );
  } catch (error) {
    console.log('Error creating admin user:', error);
  }
};

// Call the function with the email and password of the admin user you want to create
createAdminUser('maija.tunturi@shelfcare.app', 'changeMe123');
