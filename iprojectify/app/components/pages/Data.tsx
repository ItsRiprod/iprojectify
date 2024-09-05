import { DataTask } from "../../types/tasks"
import Task from "./Task"


const DataTaskComponent = ({ task }: { task: DataTask }) => {
    return (
      <Task task={task}>
          <p>
            {task.description}
          </p>
      </Task>   
    )
  }
export default DataTaskComponent