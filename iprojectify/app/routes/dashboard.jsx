import { useLoaderData, redirect, Form } from "@remix-run/react";
import { getSession, commitSession, destroySession } from "../sessions";

export const loader = async ({ request }) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );

    if (!session.has("userId")) {
      // Redirect to the home page if they are already signed in.
      console.log("Not logged in!");
      //return redirect("/login");
    }

    // Fetch the user's projects from the database
    let projects;
    try {
        const { getProjects } = await import("../utils/db.firebase.server.js");
        
        projects = await getProjects(session.get("userId"));


    } catch (exception) {
      // Do nothing
      //console.error(exception);
    }
    return { projects };
};

export async function action({ request }) {
    const { createProject } = await import("../utils/db.firebase.server.js");
    const session = await getSession(
        request.headers.get("Cookie")
      );
    
    
    createProject(session.get("userId"), {ownerId: session.get("userId")});

    return redirect("/dashboard");
}


export default function Dashboard() {
  const { projects } = useLoaderData();

  return (
    <div className="py-10">
      <h1 className="text-amber-500 text-5xl mb-2">Dashboard</h1>
      <Form method="post">
        <button className="bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded" type="submit">Add Project</button>
      </Form>
      <ul>
        {projects != null ? Object.keys(projects).map((prod, index) => (
          <li key={prod} className="text-black container my-4 bg-amber-100 dark:bg-amber-600 max-w-xl rounded-lg p-5">
            <h2>ID: {prod}</h2>
            <hr />
            <p className="text-slate-700">Owner Id: {projects[prod].ownerId}</p>
            <p className="text-slate-700">Product Num: {index}</p>
          </li>
        )) : <>Nothing In Your Dashboard</>}
      </ul>
    </div>
  );
}