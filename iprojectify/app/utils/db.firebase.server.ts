/* eslint-disable no-undef */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  connectAuthEmulator,
} from "firebase/auth";
import { FirebaseApp, initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import {
  arrayUnion,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  connectFirestoreEmulator,
  serverTimestamp,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
import { User } from "../types/users";
import { Project } from "../types/projects";
import {
  CheckboxTask,
  DataTask,
  MegaTask,
  SimpleTask,
  Task,
} from "../types/tasks";
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

const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || "");

let Firebase: FirebaseApp | undefined;
if (!Firebase) {
  Firebase = initializeApp(firebaseConfig);
}

if (!admin.apps.length) {
  initializeAdminApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}
const auth = getAuth();
const db = getFirestore();
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Emulator connected");
}
const adminAuth = admin.auth();

const provider = new GoogleAuthProvider();

const signIn = async (User: Partial<User>) => {
  const auth = getAuth();
  if (!User.email || !User.password) {
    throw new Error("Email and password are required for sign in");
  }
  const userCredential = await signInWithEmailAndPassword(
    auth,
    User.email,
    User.password
  );
  const user = userCredential.user;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: User.displayName || null,
      photoURL: User.photoURL || null,
      emailVerified: false,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { user, userId: user.uid };
};

const signUp = async (User: Partial<User>) => {
  try {
    const auth = getAuth(Firebase); // Ensure the correct Firebase app instance is used
    if (!User.email || !User.password) {
      throw new Error("Email and password are required for sign up");
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      User.email,
      User.password
    );
    const user = userCredential.user;

    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: User.displayName || null,
      photoURL: User.photoURL || null,
      emailVerified: false,
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return { user, userId: user.uid };
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  const auth = getAuth();
  await signOut(auth);
}

/**
 * Not currently implemented
 * 
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
*/

async function deleteAccount() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not found");
  }

  deleteUser(user)
    .then(() => {
      // User deleted.
    })
    .catch((error) => {
      console.error("Error deleting user: ", error);
      throw error;
    });
}
export {
  db,
  signUp,
  deleteAccount,
  getSessionToken,
  signOutFirebase,
  signIn,
  provider,
  adminAuth,
};

/**
 * Database Stuff
 */

export async function createProject(userId: string, projectData: Project) {
  try {
    console.log("adding product");

    const docRef = await addDoc(collection(db, "projects"), projectData);
    //await db.collection('users/').doc(userId + "/projects/" + res.id).set({projectId: res.id, role: "owner", projectName: projectData.name})
    return { success: true, projId: docRef.id };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}
export async function createTask(
  projectId: string,
  taskData: Task | MegaTask | SimpleTask | DataTask | CheckboxTask
) {
  try {
    console.log("adding task");
    const taskId = Date.now().toString();
    const idTask = { ...taskData, id: taskId };

    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      tasks: arrayUnion(idTask),
    });
    //await db.collection('users/').doc(userId + "/projects/" + res.id).set({projectId: res.id, role: "owner", projectName: projectData.name})
    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}
export async function deleteTask(projectId: string, taskId: string) {
  try {
    console.log("deleting task", taskId);
    const projectRef = doc(db, "projects", projectId);

    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists) {
      throw new Error("Project not found");
    }

    const projectData = projectDoc.data();
    if (!projectData?.tasks) {
      throw new Error("Tasks not found in the project");
    }
    const tasks = projectData.tasks || [];

    const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);

    await updateDoc(projectRef, {
      tasks: updatedTasks,
    });
    //await db.collection('users/').doc(userId + "/projects/" + res.id).set({projectId: res.id, role: "owner", projectName: projectData.name})
    return { success: true };
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}

export async function updateTask(
  projectId: string,
  taskData: Task | MegaTask | SimpleTask | DataTask | CheckboxTask
) {
  try {
    console.log("updating task");
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists) {
      throw new Error("Project not found");
    }

    const projectData = projectDoc.data();

    if (!projectData?.tasks) {
      throw new Error("Tasks not found in the project");
    }

    const tasks = projectData.tasks || [];
    // Find and update the specific task
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskData.id) {
        console.log("old task", task);
        return { ...task, ...taskData }; // Merge existing task data with updated data
      }
      return task;
    });
    console.log("new task", updatedTasks);

    // Update tasks array in Firestore
    await updateDoc(projectRef, { tasks: updatedTasks });

    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function getDBProjects(userId: string) {
  try {
    const q = query(collection(db, "projects"), where("ownerId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Projects not found");
    }

    const projects: { [key: string]: Project } = {};

    snapshot.forEach((doc) => {
      projects[doc.id] = doc.data() as Project;
    });
    console.log("Getting Projects");
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
}

export async function getDBProject(projectId: string) {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists) {
      throw new Error("Project not found");
    }
    const projectData = projectDoc.data();
    if (!projectData) {
      throw new Error("Project data not found");
    }

    console.log("Getting Project");
    return projectData;
  } catch (error) {
    console.error("Error getting project:", error)
  }
}

export async function updateProject(projectId: string, updatedData: Project) {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, updatedData);

    return { success: true };
  } catch (error) {
    console.error("Error updating project: ", error);
    return { success: false };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await deleteDoc(doc(db, "projects", projectId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
