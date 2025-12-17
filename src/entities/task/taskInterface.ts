export interface CreateTask{
    title: string,
    description: string,
    status: 'to-do' | 'in-progress' | 'done',
    board: string,
    list: string
    tags: string | string[],
}

export interface FullTaskInfo{
    id: string,
    title: string,
    description: string,
    board: string,
    list: string,
    status: 'to-do' | 'in-progress' | 'done',
    assignedTo: string[],
    tags: string | string[],
}

export interface PartialTaskInfo{
    id: string,
    title: string,
}

export interface UsersAssigned{
    id: string,
    title: string,
    assignedTo: string[],
}

export interface UpdateTask{
    title?: string,
    description?: string,
    status?: 'to-do' | 'in-progress' | 'done',
    assignedTo?: string,
    list?: string,
    tags?: string | string[],
}

export interface Filters{
    title?: string,
    status?: 'to-do' | 'in-progress' | 'done',
    tags?: string[],
    assignedTo?: string[],
}