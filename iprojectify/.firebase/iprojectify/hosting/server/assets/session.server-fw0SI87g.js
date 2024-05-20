import { redirect } from "@remix-run/node";
import { g as getSession, c as commitSession } from "./server-build-CJQWokd6.js";
import "react/jsx-runtime";
import "node:stream";
import "@remix-run/react";
import "isbot";
import "react-dom/server";
async function createUserSession(idToken, userId, redirectTo) {
  const session = await getSession();
  session.set("idToken", idToken);
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
export {
  createUserSession
};
