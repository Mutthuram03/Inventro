import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

let adminApp;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized with service account.');
} else {
  // Fallback or warning
  console.warn('WARNING: serviceAccountKey.json not found. Token verification will fail.');
}

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Development Bypass: If Firebase Admin is not initialized, allow requests for local testing
  if (!adminApp) {
    console.warn('Development Bypass: Firebase Admin not initialized. Using mock user.');
    req.user = { 
      uid: 'dev-user-id', 
      name: 'Developer', 
      email: 'dev@inventro.com',
      email_verified: true
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Unauthorized', error: error.message });
  }
};

export default admin;
