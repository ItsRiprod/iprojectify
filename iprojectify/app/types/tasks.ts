export enum Priority {
    "high",
    "medium",
    "low"
  }


export type Task = {
    description: string
    name: string
    id: string
    priority: number | string
    type: string
    completed: boolean
}

export interface MegaTask extends Task {
    subtasks: (SimpleTask | Task | MegaTask | DataTask | CheckboxTask)[]
}

export interface SimpleTask extends Task {
    
}

export interface DataTask extends Task {
    data: {
        [key: string]: string
    }
}
export interface CheckboxTask extends Task {
    data: {
        [key: string]: boolean
    }
}