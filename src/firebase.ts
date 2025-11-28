import * as admin from 'firebase-admin';

const project_id = process.env.FIREBASE_PROJECT_ID;
const private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID;
const private_key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const client_id = process.env.CLIENT_ID;

const serviceAccount = {
  type: 'service_account',
  project_id: project_id,
  private_key_id: private_key_id,
  private_key: private_key,
  client_email:
    'firebase-adminsdk-fbsvc@battleship-api-c3847.iam.gserviceaccount.com',
  client_id: client_id,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40battleship-api-c3847.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'battleship_images',
});
console.log(serviceAccount);

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export { admin };
