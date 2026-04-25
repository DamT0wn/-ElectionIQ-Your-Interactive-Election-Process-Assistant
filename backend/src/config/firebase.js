const admin = require('firebase-admin');

let db = null;

/**
 * Initialize Firebase Admin SDK.
 * Uses Application Default Credentials (ADC) in Cloud Run,
 * and service account JSON locally via GOOGLE_APPLICATION_CREDENTIALS.
 */
function initializeFirebase() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
      console.log('✅ Firebase Admin initialized');
    } catch (err) {
      console.error('❌ Firebase Admin initialization failed:', err.message);
      throw err;
    }
  }
  db = admin.firestore();
  return db;
}

/**
 * Get the Firestore database instance.
 * @returns {FirebaseFirestore.Firestore}
 */
function getDb() {
  if (!db) {
    return initializeFirebase();
  }
  return db;
}

module.exports = { initializeFirebase, getDb, admin };
