import List from './List.js';

// Interfaces
import { FullListInfo, CreateList, UpdateList } from './listInterface.js';

class ListRepository{
    async getListById(listId: string): Promise<FullListInfo | null>{
        const list = await List.findById(listId);

        if (!list){
            return null;
        }

        return {
            id: list._id.toString(),
            title: list.title,
            boardId: list.board.toString(),
        }
    }
    async getLists(boardId: string): Promise<FullListInfo[]>{
        const lists = await List.find({ board: boardId });

        return lists.map(l => ({
            id: l._id.toString(),
            title: l.title,
            boardId: l.board.toString(),
        }));
    }

    async createList(boardId: string, data: CreateList): Promise<FullListInfo>{
        const newList = new List({board: boardId, ...data});
        await newList.save();

        return {
            id: newList._id.toString(),
            title: newList.title,
            boardId: newList.board.toString(),
        };
    }

    async updateList(listId: string, data: UpdateList): Promise<FullListInfo | null>{
        const updatedList = await List.findByIdAndUpdate(
            listId,
            {$set: data},
            {new: true, runValidators: true},
        );

        if (!updatedList){
            return null;
        }

        return {
            id: updatedList._id.toString(),
            title: updatedList.title,
            boardId: updatedList.board.toString(),
        }
    }

    async deleteList(listId: string){
        const deletedList = await List.findByIdAndDelete(listId);

        if (!deletedList){
            return null;
        }

        return {
            id: deletedList._id.toString(),
            title: deletedList.title,
            boardId: deletedList.board.toString(),
        }
    }

    async deleteListsFromBoard(boardId: string){
        await List.deleteMany({ boardId });
    }
}

export default new ListRepository();