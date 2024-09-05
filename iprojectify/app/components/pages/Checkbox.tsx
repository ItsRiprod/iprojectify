import { CheckboxTask } from "../../types/tasks"
import Task from "./Task"


const CheckboxTaskComponent = ({ task }: { task: CheckboxTask }) => {
    return (
      <Task task={task}>
          <p>
            {task.description}
          </p>
      </Task>   
    )
  }
export default CheckboxTaskComponent