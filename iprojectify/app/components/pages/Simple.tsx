import { SimpleTask } from "../../types/tasks"
import Task from "./Task"


const SimpleTaskComponent = ({ task }: { task: SimpleTask }) => {
    return (
      <Task task={task}>
          <p>
            {task.description}
          </p>
      </Task>   
    )
  }
export default SimpleTaskComponent