import { createCookie, createCookieSessionStorage   , redirect } from "@remix-run/node";

import { getSessionToken, signOutFirebase, adminAuth } from "./db.server.firebase";

import { getSession, commitSession, destroySession } from "../sessions";

async function createUserSession(idToken, userId, redirectTo) {
  const session = await getSession();
  session.set("idToken", idToken);
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

async function getUserSession(request) {
    return await getSession(request.headers.get("idToken"));

  }
export async function getUserId(request) {
  const session = await getUserSession(request);
  return session.get("userId");
  }


async function destroyUserSession(request) {
    const session = await getSession(request.headers.get("Cookie"));
    const newCookie = await destroySession(session);
  
    return redirect("/", { headers: { "Set-Cookie": newCookie } });
  }
  
async function signOut(request) {
    await signOutFirebase();
    return await destroyUserSession(request);
  }

export { createUserSession, signOut, getUserSession, destroyUserSession  };