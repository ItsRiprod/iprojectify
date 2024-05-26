
import { useLoaderData, Form, isRouteErrorResponse, useRouteError, useActionData } from "@remix-run/react";
import { getSession } from "../sessions";
import { redirect, json } from "@remix-run/node";
import { getDBProject, deleteProject } from "../utils/db.firebase.server.js";
import { useEffect, useState  } from "react";

export async function loader({ params, request }) {
    
    const session = await getSession(
        request.headers.get("Cookie")
      );
    const userId = session.get("userId");
    let project;
    try {
        project = await getDBProject(params.product, userId);
    } catch (error)
    {
        console.error('Error in loader:', error);

        if (error.message === 'Project not found') {
          throw new Response('Project not found', { status: 404 });
        } else if (error.message === 'Not authorized to access project') {
          throw new Response('Not authorized', { status: 401 });
        } else {
          throw new Response('Unable to get project', { status: 500 });
        }
    }

    return { project };
}

export async function action({ params, request }) {
    let formData = await request.formData();
    let { _action } = Object.fromEntries(formData);
    const { updateProject, createTask, deleteTask } = await import("../utils/db.firebase.server.js");

    if (_action === "_delete") {
        try {
            const result = await deleteProject(params.product);
            console.log("Deleted project: ", result.success);
            if (!result) {
                console.error("Unable to delete project");
                throw new Response("Unable to delete project", { status: 400 });
            }
        }
        catch (exception) {
            console.error("Unable to delete product " + exception);
            throw new Response("Unable to delete product!" + exception, { status: 400 });
        }
        return redirect("/portal")
    }
    if (_action === "_edit") {
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
          const { success } = await updateProject(params.product, product);
          if (!success) {
              return new Response("Unable to edit project", { status: 400 });
          }
          return json( {message: "Successfully updated project!", action: "updateProject"} );
      
        } catch (error) {
            console.error("Error editing project", error)
          return new Response("Unable to edit project: " + error, { status: 400 })
        }
    }

    if (_action === "_createTask") {
        const session = await getSession(
            request.headers.get("Cookie")
          );
        
        const task = {
            name: formData.get("name"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            type: formData.get("type"),
        }
        try {
          const { success } = await createTask(session.get("userId"), params.product, task);
          if (!success) {
              return new Response("Unable to create task", { status: 400 });
          }
          return json( {message: "Successfully added task!", action: "addTask"} );
    
        } catch (error) {
          return new Response("Unable to create task: " + error, { status: 400 })
        }
      }
    if (_action === "_deleteTask") {
        //const session = await getSession(
        //    request.headers.get("Cookie")
        //  );
        //
        //const name = formData.get("name");
        //try {
        //  const { success } = await deleteTask(session.get("userId"), params.product, name);
        //  if (!success) {
        //      return new Response("Unable to delete task", { status: 400 });
        //  }
        //  return json( {message: "Successfully deleted task!", action: "delTask"} );
        //
        //} catch (error) {
            //  return new Response("Unable to delete task: " + error, { status: 400 })
            //}
            return json( {message: "Currently unable to delete tasks!", action: "delTask"} );
      }
    
    return null;

  }

export default function Dashboard() {
    const { project } = useLoaderData();
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showTaskCreation, setShowTaskCreation] = useState(false);
    const newActionData = useActionData();
    const [actionData, setActionData] = useState(newActionData || {});

    useEffect(() => {
        setActionData(newActionData);
        
        if (newActionData?.action == "updateProject") {
            setShowCreateProject(false);
        }
        if (newActionData?.action == "addTask") {
            setShowTaskCreation(false);
        }
        
    }, [newActionData]);
    
    const handleEditProject = () => {
        setShowCreateProject(true);
      };
    const handleAddTask = () => {
        setShowTaskCreation(true);
      };
    
    const handleMessageClick = () => {
        setActionData();
      };

    return (
        <>
        {actionData?.message && <div className="bg-red-500 text-white p-2 rounded-lg mb-2 flex"><p>{actionData.message}</p><button onClick={handleMessageClick} className="ml-auto">X</button></div>}
        {showTaskCreation && <CreateTaskForm setShowTaskCreation={setShowTaskCreation} />}
        {showCreateProject && <EditProject setShowCreateProject={setShowCreateProject} projectData={project} />}
        <div className="w-full pb-2 bg-slate-100 dark:bg-slate-600 rounded-r-xl overflow-hidden  mb-2">
            <div className="flex p-2 w-full bg-amber-300 dark:bg-slate-700">
                <h1 className="font-bold dark:text-amber-500 text-5xl p-2">{project.name}</h1>
                <Form method="post" className="hidden sm:block content-center ml-auto">
                    <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleEditProject}

                    >Edit</button>
                    <button className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

                      type="submit"
                      name="_action"
                      value="_delete"
                    >Delete</button>
                </Form>

            </div>
            <Form method="post" className="sm:hidden mx-3 mt-2">
                <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                name="_action"
                value="_edit"
                >Edit</button>
                <button className=" bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  name="_action"
                  value="_delete"
                >Delete</button>
            </Form>
            <p className="px-3">OwnerID: {project.ownerId}</p>
            <p className="px-3">Priority {project.priority}</p>
        </div>
            <p>{project.description}</p>
        <div className="w-full pb-2 bg-slate-100 dark:bg-slate-600 rounded-r-xl overflow-hidden  mb-2">
            <div className="flex p-2 w-full bg-amber-300 dark:bg-slate-700">
                    <h2 className="font-bold dark:text-amber-500 text-3xl p-2">Tasks:</h2>
                    <div className="hidden sm:block content-center ml-auto">
                        <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleAddTask}

                        >Add Task</button>
                    </div>
                </div>
                <div className="flex flex-col">
                    {project.tasks && project.tasks.map((task, index) => (
                        <Task task={task} key={index} />
                    ))}
                </div>
        </div>
        
        </>
    )
}

function Task({ task }) {

    return (
        <div className="rounded my-2 mx-3 bg-slate-400 overflow-hidden">
            
            <div >
                <h1 className="font-bold dark:text-amber-500 text-xl p-2 bg-slate-500">
                    {task.name}
                </h1>
            </div>
            <div className="py-5 text-white">
                <p>
                    {task.description}
                </p>
            </div>
            <div className="flex">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-r-xl w-fit py-2 pl-1 pr-5 overflow-hidden  mb-2">
                    <p>
                        Priority: {task.priority}
                    </p>
                    <p>
                        Type: {task.type}
                    </p>
                </div>
                <Form method="post" className="ml-auto mx-3 mt-2">
                    <input type="hidden" name="name" value={task.name} />
                    <button className=" bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      type="submit"
                      name="_action"
                      value="_deleteTask"
                    >Delete Task</button>
            </Form>
            </div>
            
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

  function CreateTaskForm( { setShowTaskCreation } ) {
    const handleCloseButtonClick = () => {
        setShowTaskCreation(false);
      };
    return (
        <div className="fixed transition-opacity delay-500 backdrop-blur-sm bg-slate-100/60 dark:bg-slate-500/50 p-5 mr-5 rounded-2xl overflow-hidden">
            <Form method="post">
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Task Name</span>
                  <input
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Task Description</span>
                  <textarea
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    name="description"
                    placeholder="Description"
                    required
                  ></textarea>
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Task Priority</span>
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
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Task Type</span>
                  <select
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    name="type"
                    required
                  >
                    <option className="dark:text-white text-black" value="">Select Priority</option>
                    <option className="dark:text-white text-black" value="simple">Simple Task</option>

                  </select>
                </label>
                <button className=" bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

                      type="submit"
                      name="_action"
                      value="_createTask"
                    >Create Task</button>
                
                    <button
                          className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleCloseButtonClick}
                        >Cancel</button>
            </Form>
        </div>
    )
}

  function EditProject({ setShowCreateProject, projectData }) {
    const handleNewProject = () => {
        setShowCreateProject(false);
      };
    return (
        <div className="fixed transition-opacity delay-500 backdrop-blur-sm bg-slate-100/60 dark:bg-slate-500/50 p-5 mr-5 rounded-2xl overflow-hidden">
            <Form method="post">
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Name</span>
                  <input
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    type="text"
                    name="name"
                    placeholder="Name"
                    defaultValue={projectData.name}
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Description</span>
                  <textarea
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-amber-500 rounded-md p-2 w-full"
                    name="description"
                    placeholder="Description"
                    defaultValue={projectData.description}
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
                <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

                      type="submit"
                      name="_action"
                      value="_edit"
                    >Confirm</button>
                <button
                  className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleNewProject}
                >Cancel</button>
            </Form>
        </div>
    )
}