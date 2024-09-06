/* eslint-disable no-unused-vars */
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

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "in") {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Dynamic import for server-side code
      const { signIn, refreshIdToken } = await import("../utils/db.firebase.server");

      const { user, userId } = await signIn({email, password});

      const refreshedToken = await refreshIdToken(user)
      const session = await getSession();

      session.set("idToken", refreshedToken);
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
    <div className="container rounded-lg m-auto my-12 max-w-sm p-5 bg-slate-100 dark:bg-slate-800">
      <h1 className="text-xl pb-5">Login Page</h1>

      <Form method="post">
          <div className="container p-2 rounded-sm mb-2 bg-slate-200 dark:bg-slate-900">
            <label className="flex gap-5 place-content-between" >
              <p>Email
                </p> 
              <input type="email" name="email" className="dark:text-black" />
            </label>
          </div>

          <div className="container p-2 rounded-sm mb-2 bg-slate-200 dark:bg-slate-900">
            <label className="flex gap-5 place-content-between">
              <p>
              Password 
              </p>
              <input type="password" name="password" className="dark:text-black" />
            </label>

          </div>
      
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button className="float-end bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          name="_action"
          value="in"
        >Login</button>
        <button className="hover:text-cyan-400 transition-colors duration-300"
          
          type="submit"
          name="_action"
          value="out"
        >Logout</button>
      
      </Form>
      <Link className="hover:text-cyan-400 transition-colors duration-300" to="/signup">Create Account</Link>
    </div>
  );
}