import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno


type SessionData = {
  userId: string;
  idToken: string
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
        cookie: {
          name: "session",
          secure: process.env.NODE_ENV === "production",
          secrets: ["thisIsASecretYouShouldChange"],
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          httpOnly: true,
        },
      }
  );

export { getSession, commitSession, destroySession };