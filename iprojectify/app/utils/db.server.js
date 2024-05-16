import admin from 'firebase-admin';
import { applicationDefault, initalizeApp as initializeAdminApp } from 'firebase-admin/app'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

require('dotenv').config();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: 'https://iprojectify-default-rtdb.firebaseio.com'
  });
}

const db = admin.firestore();

let Firebase;

if (!Firebase?.apps?.length) {
    Firebase = initializeApp(firebaseConfig);
}

export { db }