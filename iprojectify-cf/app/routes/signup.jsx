import { Form, Link, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "../sessions";

export async function loader({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    console.log("Already Logged In!")
    //return redirect("/login");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }) {
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  console.log(_action);

  if (_action === "email") {
    try {
      const { signUp } = await import("../utils/db.server.firebase.js");
      
      const email = formData.get("email");
      const password = formData.get("password");
      
      const { user, userId } = await signUp(email, password);
      const idToken = await user.getIdToken();
      const session = await getSession();
      session.set("idToken", idToken);
      session.set("userId", userId);

      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      return json({ error: error.message }, { status: 400 });
    }
  }

  if (_action === "google") {
    try {
      const { signInWithGoogle } = await import("../utils/db.server.firebase.js");
      const { createUserSession } = await import("../utils/session.server.js");

      const { user, userId } = await signInWithGoogle();
      const idToken = await user.getIdToken();
      
      return createUserSession(idToken, userId, "/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return json({ error: error.message }, { status: 400 });
    }
  }
}

export default function SignUp() {
  const actionData = useActionData();
  

  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
        </p>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button 
          type="submit"
          name="_action"
          value="email"
        >Sign Up</button>
      </Form>
      <Form method="post">
        <button 
          type="submit"
          name="_action"
          value="google"
        ><s>Sign Up with Google</s></button>
      </Form>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}