import { SimpleTask, Task, MegaTask, DataTask } from "./tasks"

export type Project = {
    description: string
    name: string
    ownerId: string
    admin: string[]
    viewer: string[]
    priority: number | string
    tasks: (SimpleTask | Task | MegaTask | DataTask)[]
}

export type ActionResponse = {message: string; action: string;}