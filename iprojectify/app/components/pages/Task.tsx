import { Form, useFetcher } from "@remix-run/react"
import { Priority, SimpleTask } from "../../types/tasks"
import { IconChecked, IconSquare, IconX } from "../../assets/Icons"
import { useEffect, useState } from "react"


const Task = ({ task, children }: { task: SimpleTask, children: React.ReactNode }) => {
  const [isComplete, setIsCompleted] = useState(task.completed)
  const fetcher = useFetcher()

  useEffect(() => {
    setIsCompleted(task.completed)
  }, [task])

  const handleComplete = () => {
    setIsCompleted(!isComplete)
    fetcher.submit({ id: task.id, completed: (!isComplete).toString(), _action: "_completeTask" }, { method: "post" })
  }


    return (
      <div className="rounded my-2 mx-3 border border-slate-400 dark:bg-slate-400 overflow-hidden">
        <div className="flex justify-between p-2 bg-slate-200 dark:bg-slate-500 items-center" >
          <div className="flex items-center">
            <fetcher.Form method="post">
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="completed" value={task.completed ? "false" : "true"} />
              <button 
                type="button"
                onClick={handleComplete}>
                {isComplete ? <IconChecked fill="none" iconSize="40" /> : <IconSquare fill="none" iconSize="40" />}
              </button>
            </fetcher.Form>
            <h1 className="font-bold dark:text-cyan-500 text-xl">
              {task.name}
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <p>
                Priority: {Priority[task.priority as number]}
            </p>
            <Form method="post" className="ml-auto mx-3 mt-2">
              <input type="hidden" name="id" value={task.id} />
              <button className=" bg-red-500 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                name="_action"
                value="_deleteTask"
              ><IconX /></button>
            </Form>
          </div>
        </div>
        <div className="p-5 dark:text-white">
          {children}
        </div>
  
      </div>
    )
  
  }

  export default Task