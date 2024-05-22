import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, signOut, } from "firebase/auth";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { applicationDefault, initializeApp as initializeAdminApp, } from "firebase-admin/app";
import dotenv from "dotenv";
dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

if (!admin.apps.length) {
  initializeAdminApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-firebase-project.firebaseio.com'
  });
}

const db = admin.firestore();
const adminAuth = admin.auth();
const provider = new GoogleAuthProvider();

let Firebase;
if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

const signIn = async (email, password) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return {user, userId: user.uid }
}

const signUp = async (email, password) => {
  try {
    const auth = getAuth(Firebase); // Ensure the correct Firebase app instance is used
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user document in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

async function getSessionToken(idToken) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

const signInWithGoogle = async (result) => {
  try {
    //const auth = getAuth(Firebase);
    //const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create or update a user document in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }); // Merge to avoid overwriting existing data

    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export { db, signUp, getSessionToken, signOutFirebase, signIn, provider, adminAuth, signInWithGoogle };

/**
 * Database Stuff
 */

export async function createProject(userId, projectData) {
  try {
    const res = await db.collection('projects').add(projectData);
    //await db.collection('users').doc(userId + "/projects/" + res.id).set({projectId: res.id, role: "owner"})
    return { success: true };
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Unable to create project', error);
  }
}

export async function getProjects(userId) {
  try {
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.where("ownerId", "==", userId).get()

    if (snapshot.empty) {
      throw new Error('Project not found');
    }
    const projects = {};

    snapshot.forEach(doc => { projects[doc.id] = doc.data() });
    //console.log(projects);
    return projects;
  } catch (error) {
    console.error('Error getting project:', error);
    throw new Error('Unable to get project');
  }
}

export async function getProject(projectId) {
  try {
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }
    return projectDoc.data();
  } catch (error) {
    console.error('Error getting project:', error);
    throw new Error('Unable to get project');
  }
}

export async function updateProject(projectId, updatedData) {
  try {
    await db.collection('projects').doc(projectId).update(updatedData);
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Unable to update project');
  }
}

export async function deleteProject(projectId) {
  try {
    await db.collection('projects').doc(projectId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Unable to delete project');
  }
}