import { Form } from "@remix-run/react";

const CreateTaskForm = ({ setShowTaskCreation }: { setShowTaskCreation: (show: boolean) => void }) => {
    const handleCloseButtonClick = () => {
      setShowTaskCreation(false);
    };
    return (
      <div className="fixed transition-opacity delay-500 backdrop-blur-sm bg-slate-100/60 dark:bg-slate-500/50 p-5 mr-5 rounded-2xl overflow-hidden">
        <Form method="post">
          <label className="text-sm">
            <span className="text-black dark:text-white text-lg">Task Name</span>
            <input
              className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
              type="text"
              name="name"
              placeholder="Name"
              required
            />
          </label>
          <label className="text-sm">
            <span className="text-black dark:text-white text-lg">Task Description</span>
            <textarea
              className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
              name="description"
              placeholder="Description"
              required
            ></textarea>
          </label>
          <label className="text-sm">
            <span className="text-black dark:text-white text-lg">Task Priority</span>
            <select
              className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
              name="priority"
              required
            >
              <option className="dark:text-white text-black" value="">Select Priority</option>
              <option className="dark:text-white text-black" value="2">Low</option>
              <option className="dark:text-white text-black" value="1">Medium</option>
              <option className="dark:text-white text-black" value="0">High</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-black dark:text-white text-lg">Task Type</span>
            <select
              className="mb-5 border-2 placeholder-slate-300 dark:bg-slate-600 text-black dark:text-white border-cyan-500 rounded-md p-2 w-full"
              name="type"
              required
            >
              <option className="dark:text-white text-black" value="">Select Type</option>
              <option className="dark:text-white text-black" value="simple">Simple Task</option>
              <option className="dark:text-white text-black" value="mega">Mega Task</option>
              <option className="dark:text-white text-black" value="data">Data Task</option>
              <option className="dark:text-white text-black" value="checkbox">Checkbox Task</option>
  
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
  
  export default CreateTaskForm;