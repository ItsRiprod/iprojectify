import { Form } from "@remix-run/react";
import { Project } from "../../types/tasks";

const EditProject = ({ setShowCreateProject, projectData }: { setShowCreateProject: (show: boolean) => void, projectData: Project }) => {
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

  export default EditProject;