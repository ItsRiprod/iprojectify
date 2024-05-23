import { useLoaderData, redirect, Form } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "../sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  let user = "Not Logged In";
  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    console.log("Already Logged In!")
    user = session.get("userId");
    
  }


  return { user }
}

export default function Index() {
  const { user } = useLoaderData();


  return (
    <>
      <div className="py-10 h-screen">
        <h1 className="text-amber-500 text-5xl">Welcome to iProjectify!</h1>
        <p>User Id: {user}</p>
      </div>
    </>
  );
}
