import { useLoaderData, redirect, Form } from "@remix-run/react";
import { getSession, commitSession, destroySession } from "../sessions";

export const loader = async ({ request }) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );

    if (!session.has("userId")) {
      // Redirect to the home page if they are already signed in.
      console.log("Not logged in!");
      return redirect("/login");
    }

    // Fetch the user's projects from the database
    let projects;
    try {
        const { getProjects } = await import("../utils/db.server.firebase.js");
        
        projects = await getProjects(session.get("userId"));


    } catch (exception) {
      console.error(exception);
    }
    console.log("Idk whats happening here");
    return { projects };
};

export async function action({ request }) {
    const { createProject } = await import("../utils/db.server.firebase.js");
    const session = await getSession(
        request.headers.get("Cookie")
      );
    
    
    createProject(session.get("userId"), {ownerId: session.get("userId")});

    return redirect("/dashboard");
}


export default function Dashboard() {
  const { projects } = useLoaderData();

  return (
    <div>
      <h1>Dashboard</h1>
      <Form method="post">
        <button type="submit">Add Project</button>
      </Form>
      <ul>
        {projects != null ? Object.keys(projects).map((index, project) => (
          <li key={index}>
            <h2>{index}</h2>
            <p>{project}</p>
            {/* Add more project details as needed */}
          </li>
        )) : <>Nothing In Your Dashboard</>}
      </ul>
    </div>
  );
}