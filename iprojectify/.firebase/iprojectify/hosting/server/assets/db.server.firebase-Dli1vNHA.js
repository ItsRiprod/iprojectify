var _a;
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp as initializeApp$1 } from "firebase/app";
import admin from "firebase-admin";
import { initializeApp, applicationDefault } from "firebase-admin/app";
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
if (!admin.apps.length) {
  initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://iprojectify-default-rtdb.firebaseio.com"
  });
}
const db = admin.firestore();
admin.auth();
new GoogleAuthProvider();
let Firebase;
if (!((_a = Firebase == null ? void 0 : Firebase.apps) == null ? void 0 : _a.length)) {
  Firebase = initializeApp$1(firebaseConfig);
}
const signIn = async (email, password) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return { user, userId: user.uid };
};
const signUp = async (email, password) => {
  try {
    const auth = getAuth(Firebase);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};
const signInWithGoogle = async (result) => {
  try {
    const user = result.user;
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
async function createProject(userId, projectData) {
  try {
    const res = await db.collection("projects").add(projectData);
    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Unable to create project", error);
  }
}
async function getProjects(userId) {
  try {
    const projectsRef = db.collection("projects");
    const snapshot = await projectsRef.where("ownerId", "==", userId).get();
    if (snapshot.empty) {
      throw new Error("Project not found");
    }
    const projects = {};
    snapshot.forEach((doc) => {
      projects[doc.id] = doc.data();
    });
    return projects;
  } catch (error) {
    console.error("Error getting project:", error);
    throw new Error("Unable to get project");
  }
}
export {
  createProject,
  db,
  getProjects,
  signIn,
  signInWithGoogle,
  signUp
};
