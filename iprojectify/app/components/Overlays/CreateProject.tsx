import { Form } from "@remix-run/react";

export const CreateProject = ({ setShowCreateProject }) => {
    const handleNewProject = () => {
        setShowCreateProject(false);
      };
    return (
        <div className="fixed bg-slate-200 dark:bg-slate-700 p-5 mr-5 rounded-md bg-opacity-95">
            <Form method="post">
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Name</span>
                  <input
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Description</span>
                  <textarea
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
                    name="description"
                    placeholder="Project Description"
                    required
                  ></textarea>
                </label>
                <label className="text-sm">
                  <span className="text-black dark:text-white text-lg">Project Priority</span>
                  <select
                    className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
                    name="priority"
                    required
                  >
                    <option className="dark:text-white text-black" value="">Select Priority</option>
                    <option className="dark:text-white text-black" value="3">Low</option>
                    <option className="dark:text-white text-black" value="2">Medium</option>
                    <option className="dark:text-white text-black" value="1">High</option>
                  </select>
                </label>
                <button
                  className="bg-cyan-500 transition-colors duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
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

export default CreateProject