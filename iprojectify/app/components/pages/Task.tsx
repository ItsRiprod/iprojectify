import { Form } from "@remix-run/react"
import { Priority, SimpleTask } from "../../types/tasks"
import { IconChecked, IconSquare } from "../../assets/Icons"


const Task = ({ task, children }: { task: SimpleTask, children: React.ReactNode }) => {
    return (
      <div className="rounded my-2 mx-3 bg-slate-400 overflow-hidden">
        <div className="flex justify-between p-2 bg-slate-500 items-center" >
          <div className="flex items-center">
            <Form method="post">
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="completed" value={task.completed ? "false" : "true"} />
              <button 
                type="submit"
                name="_action"
                value="_completeTask">
                {task.completed ? <IconChecked fill="none" iconSize="40" /> : <IconSquare fill="none" iconSize="40" />}
              </button>
            </Form>
            <h1 className="font-bold dark:text-cyan-500 text-xl">
              {task.name}
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <p>
                Priority: {Priority[task.priority]}
            </p>
            <Form method="post" className="ml-auto mx-3 mt-2">
              <input type="hidden" name="id" value={task.id} />
              <button className=" bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                name="_action"
                value="_deleteTask"
              >Delete Task</button>
            </Form>
          </div>
        </div>
        <div className="p-5 text-white">
          {children}
        </div>
  
      </div>
    )
  
  }

  export default Task