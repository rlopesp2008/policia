// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Analytics import removed to prevent cookie errors
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAODf4DjINoC9Ag9MZezWFfvo4vDgq0C5M',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'policiaalerta-26b65.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'policiaalerta-26b65',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'policiaalerta-26b65.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '715691183500',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:715691183500:web:a5cd5e3ff6943f328b5aa9',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-M0D4MQB2SV'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Log Firebase initialization
console.log('🔥 Firebase inicializado com:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? 'configurado' : 'não configurado'
});

// Initialize Firebase services
// Analytics disabled to prevent cookie errors
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Log auth service initialization
console.log('🔐 Firebase Auth inicializado:', auth ? 'sim' : 'não');

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  // Uncomment these if you want to use Firebase emulators in development
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFunctionsEmulator(functions, 'localhost', 5001);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, db, auth, functions, storage };