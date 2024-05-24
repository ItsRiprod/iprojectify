import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, signOut, deleteUser } from "firebase/auth";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { initializeApp as initializeAdminApp, } from "firebase-admin/app";
import { deleteDoc, updateDoc, query, where, getDocs, getDoc, getFirestore, serverTimestamp, persistentLocalCache, doc, setDoc, collection, addDoc } from 'firebase/firestore';
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
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}
let Firebase;
if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

const db = getFirestore();

const adminAuth = admin.auth();
const provider = new GoogleAuthProvider();



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
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
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
  const auth = getAuth()
  await signOut(auth);
}

const signInWithGoogle = async (result) => {
  try {
    const user = result.user;

    // Create or update a user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
    }, { merge: true }); // Merge to avoid overwriting existing data

    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
async function deleteAccount() {
  const auth = getAuth();
  const user = auth.currentUser;
  
  deleteUser(user).then(() => {
    // User deleted.
  }).catch((error) => {
    // An error ocurred
    // ...
  });

}
export { db, signUp, deleteAccount, getSessionToken, signOutFirebase, signIn, provider, adminAuth, signInWithGoogle };

/**
 * Database Stuff
 */

export async function createProject(userId, projectData) {
  try {
    console.log("adding product");
    
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    //await db.collection('users/').doc(userId + "/projects/" + res.id).set({projectId: res.id, role: "owner", projectName: projectData.name})
    return { success: true, projId: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getDBProjects(userId) {
  try {

    
    const q = query(collection(db, 'projects'), where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Projects not found');
    }
    
    const projects = {};

    snapshot.forEach(doc => {
      projects[doc.id] = doc.data()
    });
    console.log("Getting Projects");
    return projects;
  } catch (error) {
    
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getDBProject(projectId, userId) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }
    const projectData = projectDoc.data();
    if (projectData.ownerId !== userId && !projectData.sharedWith.includes(userId)) {
      throw new Error('Not authorized to access project');
    }
    console.log("Getting Project");
    return projectData;
  } catch (error) {
    
    console.error('Error getting project:', error);
    throw error;
  }
}

export async function updateProject(projectId, updatedData) {
  try {
    await updateDoc(doc(db, 'projects', projectId), updatedData);
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId) {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}