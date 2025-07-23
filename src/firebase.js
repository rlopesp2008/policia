// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAODf4DjINcOAg9MZezWFfvo4vDqg0C5M",
  authDomain: "policiaalerta-26b65.firebaseapp.com",
  projectId: "policiaalerta-26b65",
  storageBucket: "policiaalerta-26b65.appspot.com",
  messagingSenderId: "715691183500",
  appId: "1:715691183500:web:a5cd5e3f6943f328b5aa9",
  measurementId: "G-M0D4MQB2SV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 