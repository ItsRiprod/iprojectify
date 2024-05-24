/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useLoaderData, redirect, Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getSession, } from "../sessions.ts";
import { useState } from "react";
import { json  } from "@remix-run/node";

export async function action({ request }) {
    let formData = await request.formData();
    const { createProject, deleteAccount } = await import("../utils/db.firebase.server.js");
    let { _action, ...values } = Object.fromEntries(formData);
    
    if (_action === "_create") {
      const session = await getSession(
          request.headers.get("Cookie")
        );
      
      const product = {
          ownerId: session.get("userId"),
          name: formData.get("name"),
          description: formData.get("description"),
          priority: formData.get("priority"),
      }
      try {
        const { success, projId } = await createProject(session.get("userId"), product);
        if (!success) {
            return new Response("Unable to create product", { status: 400 });
        }
        return redirect(projId);
  
      } catch (error) {
        return new Response("Unable to create object: " + error, { status: 400 })
      }
    }

    if (_action == "_delete") {
    
      const result = deleteAccount();
      console.log("Deleted Account? " + result);

      return redirect("");
    }
}

export default function Dashboard() {
    const [showCreateProject, setShowCreateProject] = useState(false);

    const handleNewProject = () => {
        setShowCreateProject(true);
      };

    return (
        <div>
            {showCreateProject && <CreateProject setShowCreateProject={setShowCreateProject} />}
            <h1 className="text-amber-500 text-5xl mb-2">Dashboard</h1>
            <button
                className="bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleNewProject}
                >New Project</button>
            {/*<Form method="post">
                <button
                  className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  name="_action"
                  value="_delete"
                >
                  Delete Account
                </button>
            </Form>*/}
            <div className="mb-96">Problematic</div>
        </div>
    )
}

function CreateProject({ setShowCreateProject }) {
    const handleNewProject = () => {
        setShowCreateProject(false);
      };
    return (
        <div className="fixed bg-slate-200 dark:bg-slate-700 p-5 mr-5 rounded-md bg-opacity-95">
            <Form method="post">
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Name</span>
                  <input
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Description</span>
                  <textarea
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    name="description"
                    placeholder="Project Description"
                    required
                  ></textarea>
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Priority</span>
                  <select
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    name="priority"
                    required
                  >
                    <option className="dark:text-white text-black" value="">Select Priority</option>
                    <option className="dark:text-white text-black" value="low">Low</option>
                    <option className="dark:text-white text-black" value="medium">Medium</option>
                    <option className="dark:text-white text-black" value="high">High</option>
                  </select>
                </label>
                <button
                  className="bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  name="_action"
                  value="_create"
                >
                  Add Project
                </button>
            </Form>
              <button
                className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleNewProject}
              >Cancel</button>
        </div>
    )
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.log("Caught in error boundary", error);
      return (
      <div className="py-10">
        
        <div className="p-5 bg-white border-red-500 border-4 rounded-lg shadow-lg">
          <h1 className="text-red-600 text-2xl">Something went wrong!</h1>
          <p>{error.status}</p>
          <p>{error.data}</p>

        </div>
      </div>
    )
  }
}