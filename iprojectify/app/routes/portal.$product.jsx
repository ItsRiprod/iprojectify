
import { useLoaderData, Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getSession } from "../sessions";
import { redirect  } from "@remix-run/node";
import { getDBProject, deleteProject } from "../utils/db.firebase.server.js";

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
            console.error("Unable to delete " + exception);
            throw new Response("Unable to delete product!" + exception, { status: 400 });
        }
    }

    return redirect("/portal")

  }

export default function Dashboard() {
    const { project } = useLoaderData();

    return (
        <>
        <h1 className="text-amber-500 text-5xl mb-2">{project.name}</h1>
        <p>OwnerID: {project.ownerId}</p>
        <p>{project.description}</p>
        <p>{project.priority}</p>
        <Form method="post">
            <button className="bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

              type="submit"
              name="_action"
              value="_delete"
            >Delete</button>
        </Form>
        </>
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