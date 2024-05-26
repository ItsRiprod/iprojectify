
import { useLoaderData, redirect, Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getSession, } from "../sessions.ts";
import SideNavBar from "../components/sideNav.jsx"

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
        const { getDBProjects } = await import("../utils/db.firebase.server.js");
        
        projects = await getDBProjects(session.get("userId"));


    } catch (exception) {
      // Do nothing
      //console.error(exception);
    }
    return { projects };
};


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

export default function Portal() {
  const { projects } = useLoaderData();

  return (
    <div className="py-10">
      <SideNavBar />
      <div className="lg:pl-[19.5rem]">

        
        <Outlet context={ projects } />
      </div>
    </div>
  );
}