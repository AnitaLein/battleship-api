import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'battleship_images',
});

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export { admin };
