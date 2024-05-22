import { Form, Link, useActionData } from "@remix-run/react"
import { json, redirect  } from "@remix-run/node";
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
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  if (_action === "in") {

    let email = formData.get("email");
    let password = formData.get("password");

    try {
      // Dynamic import for server-side code
      const { signIn } = await import("../utils/db.server.firebase.js");

      const { user, userId } = await signIn(email, password);

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

  if (_action === "out") {
    console.log("Logging Out")
    const session = await getSession(
      request.headers.get("Cookie")
    );
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="login">
      <h1>Login Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button 
          type="submit"
          name="_action"
          value="in"
        >Login</button>
      
      </Form>
      <Form method="post">
        <button 
          type="submit"
          name="_action"
          value="out"
        >Logout</button>
      </Form>
      <a href="/signup">Create Account</a>
    </div>
  );
}