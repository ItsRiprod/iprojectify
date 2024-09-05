
import { useLoaderData, redirect, Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getSession, } from "../sessions.ts";
import SideNavBar from "../components/sideNav"

export const loader = async ({ request }) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );
    const { getDBProjects } = await import("../utils/db.firebase.server.js");
    if (!session.has("userId")) {
      // Redirect to the home page if they are already signed in.
      console.error("Not logged in!");
      return redirect("/login");
    }

    // Fetch the user's projects from the database
    let projects;
    try {
 
        projects = await getDBProjects(session.get("userId"));
        
    } catch (exception) {
      // Do nothing
      console.error("Error in loader: ", exception);
      return new Response("Unable to get projects!" + exception , { status: 500 });
    }
    return { projects };
};




export default function Portal() {
  const { projects } = useLoaderData();

  return (
    <div className="flex lg:flex-row flex-col">
      <SideNavBar />
      <div className="w-full">
        <Outlet context={ projects } />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="py-10">
        
        <div className="lg:pl-[19.5rem] p-5 bg-white border-red-500 border-4 rounded-lg shadow-lg">
          <h1 className="text-red-600 text-2xl">Something went wrong!</h1>
          <p>{error.status}</p>
          <p>{error.data}</p>

        </div>
      </div>
    )
  }
}