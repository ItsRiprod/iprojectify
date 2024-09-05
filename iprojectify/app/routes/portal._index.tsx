/* eslint-disable react/prop-types */
import { redirect, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getSession, } from "../sessions.js";
import { useState } from "react";
import { CreateProject } from "../components/Overlays/CreateProject.js";
import { Project } from "../types/projects";


export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const { createProject, deleteAccount } = await import("../utils/db.firebase.server");
    const { _action, ...values } = Object.fromEntries(formData);
    
    if (_action === "_create") {
      const session = await getSession(
          request.headers.get("Cookie")
        );
      
      const product: Project = {
          ownerId: session.get("userId") as string,
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          priority: formData.get("priority") as string,
          tasks: [],
          viewer: [],
          admin: []
      }
      try {
        const { success, projId } = await createProject(session.get("userId") as string, product);
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
            <h1 className="text-cyan-500 text-5xl mb-2">Dashboard</h1>
            <button
                className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
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
              <button onClick={() => setCount(old => old + 1)} className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                Useless Button
              </button>
              <button onClick={() => setCount(old => old - 1)} className=" bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                Useless Button 2
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Num Projects: ?</h1>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Calendar: ?</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(0)} className="bg-red-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                DONOTCLICK
              </button>
              <button onClick={() => setCount(old => old*2)} className=" bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                SPEED
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Total Somethings: ?</h1>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Important Placeholder Data: ?</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(old => old/2)} className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                SLOW
              </button>
              <button onClick={() => setCount(old => old*2)} className=" bg-sky-500 transition-colors duration-300 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                SPEED
              </button>
            </div>
            <h1 className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5">Random Number: {count}</h1>
            <div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setShow(true)} className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                SHOW
              </button>
           
            </div>
            {show && (<div className="my-2 w-full bg-slate-200 dark:bg-slate-500 rounded p-5 flex gap-2">
              <button onClick={() => setCount(old => Math.round(old*10*Math.random()))} className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                RANDOM
              </button>
              <button onClick={() => {setShow(false); setCount(0);}} style={ { transform: "scale(" + (Math.min(0.01*count, 5)) + ")"} } className=" bg-slate-700 transition-colors duration-300 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                GO AWAY
              </button>
            </div>)}
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