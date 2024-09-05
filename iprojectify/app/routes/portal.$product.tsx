
import { useLoaderData, Form, isRouteErrorResponse, useRouteError, useActionData } from "@remix-run/react";
import { getSession } from "../sessions";
import { redirect, json, TypedResponse } from "@remix-run/node";
import { getDBProject, deleteProject } from "../utils/db.firebase.server.js";
import { useEffect, useState } from "react";
import { CheckboxTask, DataTask, MegaTask, SimpleTask } from "../components/pages";
import { Priority, Project, Task } from "../types/tasks";
import CreateTaskForm from "../components/Overlays/CreateTask";
import EditProject from "../components/Overlays/EditProject";

export async function loader({ params, request }: { params: { product: string }, request: Request }): Promise<Project> {

  const session = await getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  let project: Project;
  try {
    project = await getDBProject(params.product, userId) as Project;
  } catch (error: unknown) {
    console.error('Error in loader:', error);
    if (error instanceof Error) {
      if (error.message === 'Project not found') {
        throw new Response('Project not found', { status: 404 });
      } else if (error.message === 'Not authorized to access project') {
        throw new Response('Not authorized', { status: 401 });
      } else {
        throw new Response('Unable to get project', { status: 500 });
      }
    } else {
      throw new Response('An unknown error occurred', { status: 500 });
    }
  }

  return project;
}
type ActionResponse = {message: string; action: string;}

export async function action({ params, request }: { params: { product: string }, request: Request }): Promise<ActionResponse | TypedResponse> {
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  const { updateProject, createTask, deleteTask, updateTask } = await import("../utils/db.firebase.server.js");
  console.log("Action: ", _action);
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
      priority: Priority[formData.get("priority") as keyof typeof Priority],
    }
    try {
      const { success } = await updateProject(params.product, product);
      if (!success) {
        return new Response("Unable to edit project", { status: 400 });
      }
      return json({ message: "Successfully updated project!", action: "updateProject" });

    } catch (error) {
      console.error("Error editing project", error)
      return new Response("Unable to edit project: " + error, { status: 400 })
    }
  }
  if (_action === "_completeTask") {
    const taskId = formData.get("id")
    const completionState = formData.get("completed")

    if (!taskId) {
      return new Response("Unable to edit project! No ID provided", { status: 400 });
    }

    const completed = completionState === "true"

    const task: Partial<Task> = {
      completed,
      id: taskId as string
    }
    try {
      const { success } = await updateTask(params.product, task);
      if (!success) {
        return new Response("Unable to edit project", { status: 400 });
      }
      return json({ message: "Successfully updated project!", action: "updateProject" });

    } catch (error) {
      console.error("Error editing project", error)
      return new Response("Unable to edit project: " + error, { status: 400 })
    }
  }

  if (_action === "_createTask") {

    const task: Task = {
      name: formData.get("name") as string || 'Task Name',
      description: formData.get("description") as string || 'Sample Description',
      priority: formData.get("priority") as string || '1',
      type: formData.get("type") as string || 'simple',
      completed: false,
      id: Date.now().toString()
    }
    try {
      const { success } = await createTask(params.product, task);
      if (!success) {
        return new Response("Unable to create task", { status: 400 });
      }
      return json({ message: "Successfully added task!", action: "addTask" });

    } catch (error) {
      return new Response("Unable to create task: " + error, { status: 400 })
    }
  }
  if (_action === "_deleteTask") {
    
    const id = formData.get("id");
    try {
      const { success } = await deleteTask(params.product, id);
      if (!success) {
          return new Response("Unable to delete task", { status: 400 });
      }
      return json( {message: "Successfully deleted task!", action: "delTask"} );
    
    } catch (error) {
      return new Response("Unable to delete task: " + error, { status: 400 })
    }
  }

  return new Response("Invalid action", { status: 400 });

}

export default function Dashboard() {
  const project = useLoaderData() as Project;
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const newActionData = useActionData() as ActionResponse;
  const [actionData, setActionData] = useState<ActionResponse | Record<string, never>>(newActionData || {});

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
    setActionData({});
  };

  return (
    <div className="px-4 py-4">
      {actionData?.message && <div className="bg-red-500 text-white p-2 rounded-lg mb-2 flex"><p>{actionData.message}</p><button onClick={handleMessageClick} className="ml-auto">X</button></div>}
      {showTaskCreation && <CreateTaskForm setShowTaskCreation={setShowTaskCreation} />}
      {showCreateProject && <EditProject setShowCreateProject={setShowCreateProject} projectData={project} />}
      <div className="w-full pb-2 bg-slate-100 dark:bg-slate-600 rounded-r-xl overflow-hidden  mb-2">
        <div className="flex p-2 w-full bg-cyan-300 dark:bg-slate-700">
          <h1 className="font-bold dark:text-cyan-500 text-5xl p-2">{project.name}</h1>
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
        <p className="px-3 text-xs font-mono italic">OwnerID: {project.ownerId}</p>
        <p className="px-3 text-xs font-mono italic">Priority {Priority[project.priority]}</p>
        <div className="p-5">
          <p>{project.description}</p>
        </div>
      </div>
      <div className="w-full pb-2 rounded-r-xl overflow-hidden  mb-2">
        <div className="flex p-2 w-full bg-cyan-300 dark:bg-slate-700">
          <h2 className="font-bold dark:text-cyan-500 text-xl p-2">Tasks:</h2>
          <div className="hidden sm:block content-center ml-auto">
            <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddTask}
            >Add Task</button>
            <Form method="post">
              <button className="mx-2 bg-slate-400 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                name="_action"
                value="_createTask"

              >Quick Add</button>
            </Form>
          </div>
        </div>
        <div className="flex flex-col">
          {project.tasks && project.tasks.map((task, index) => {
            switch (task.type) {
              case "MegaTask":
                return <MegaTask task={task} key={index} />
              case "DataTask":
                return <DataTask task={task} key={index} />
              case "CheckboxTask":
                return <CheckboxTask task={task} key={index} />
              default:
                return <SimpleTask task={task} key={index} />
            }

          })}
        </div>
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

