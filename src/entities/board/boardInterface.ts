export interface CreateBoard{
    title: string,
    description: string,
    owner: string,
}

export interface FullBoardInfo{
    id: string,
    title: string,
    description: string,
    owner: string,
}

export interface CreateBoardService{
    title: string,
    description?: string,
}

export interface UpdateBoard{
    title?: string,
    description?: string,
    owner?: string,
}

export interface PartialBoardInfo{
    id: string,
    title: string,
}

export interface ProtectedUserInfo{
    id: string,
    name: string,
}

export interface BoardPopulated{
    _id: string,
    title: string,
}
