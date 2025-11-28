import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'battleship_images'
});
console.log(serviceAccount);

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export { admin }