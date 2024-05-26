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
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
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
            <h1 className="my-2 mt-10 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Num Tasks: ?</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(old => old + 1)} className="bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                Useless Button
              </button>
              <button onClick={() => setCount(old => old - 1)} className=" bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                Useless Button 2
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Num Projects: ?</h1>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Calendar: ?</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(0)} className="bg-red-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                DONOTCLICK
              </button>
              <button onClick={() => setCount(old => old*2)} className=" bg-amber-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                SPEED
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Total Somethings: ?</h1>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Important Placeholder Data: ?</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(old => old/2)} className="bg-orange-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                SLOW
              </button>
              <button onClick={() => setCount(old => old*2)} className=" bg-sky-500 transition-colors duration-300 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                SPEED
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Random Number: {count}</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setShow(true)} className="bg-orange-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                SHOW
              </button>
           
            </div>
            {show && (<div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(old => Math.round(old*10*Math.random()))} className="bg-orange-500 transition-colors duration-300 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                RANDOM
              </button>
              <button onClick={() => {setShow(false); setCount(0);}} style={ { transform: "scale(" + (Math.min(0.01*count, 5)) + ")"} } className=" bg-slate-700 transition-colors duration-300 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                GO AWAY
              </button>
            </div>)}
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