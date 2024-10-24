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
      disabled: false,
      isAdmin: true
    });

    await db.collection('users').doc(user.uid).set({
      firstLogin: true
    });

    console.log('Admin user created:', user.uid);
  } catch (error) {
    console.log('Error creating admin user:', error);
  }
};

createAdminUser('gyameraj@gmail.com', 'changeMe123');
// createAdminUser('maija.tunturi@shelfcare.app', 'changeMe123');
