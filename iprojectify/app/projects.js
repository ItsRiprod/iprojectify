import { db } from "~/utils/db.server"

export async function getProjects() {
    const querySnapshot = db.collection("projects").get();

    const data = {};
    querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id });
    });

    return data;
}

export async function getProject(id) {
    const doc = await db.collection("projects").doc(id).get();
    if (doc.exists) {
        return doc.data();
    } else {
        console.log("No such document!");
    }
}