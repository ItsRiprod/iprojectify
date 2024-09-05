import { MegaTask } from "../../types/tasks"
import Task from "./Task"


const MegaTaskComponent = ({ task }: { task: MegaTask }) => {
    return (
      <Task task={task}>
          <p>
            {task.description}
          </p>
      </Task>   
    )
  }
export default MegaTaskComponent