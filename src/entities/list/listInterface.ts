export interface CreateList{
    title: string,
}

export interface FullListInfo{
    id: string,
    title: string,
    boardId: string,
}

export interface UpdateList{
    title?: string,
    board?: string,
}

export interface FullListInfo{
    id: string,
    title: string,
    boardId: string,
}

export interface PartialCourseInfo{
    id: string,
    title: string,
}