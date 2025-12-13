import Board from './Board.js';
interface CreateBoard{
    title: string,
    description: string,
    owner: string,
}

interface UpdateBoard{
    title?: string,
    description?: string,
}

interface FullBoardInfo{
    id: string,
    title: string,
    description: string,
    owner: string,
}

class BoardRepository{
    async findBoardById(boardId: string): Promise<FullBoardInfo | null>{
        const board = await Board.findById(boardId);

        if (!board){
            return null;
        }

        return {
            id: board._id.toString(),
            title: board.title,
            description: board.description,
            owner: board.owner.toString(),
        };
    }

    async creteBoard(data: CreateBoard): Promise<FullBoardInfo>{
        const newBoard = new Board(data);

        await newBoard.save();

        return {
            id: newBoard._id.toString(),
            title: newBoard.title,
            description: newBoard.description,
            owner: newBoard.owner.toString(),
        }
    }

    async updateBoard(boardId: string, data: UpdateBoard): Promise<FullBoardInfo>{
        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            {$set: data},
            {new: true, runValidators: true},
        );

        return {
            id: updatedBoard!._id.toString(),
            title: updatedBoard!.title,
            description: updatedBoard!.description,
            owner: updatedBoard!.owner.toString(),
        }
    }

    async deleteBoard(boardId: string): Promise<FullBoardInfo | null>{
        const deletedBoard = await Board.findByIdAndDelete(boardId);

        if (!deletedBoard){
            return null;
        }

        return {
            id: deletedBoard._id.toString(),
            title: deletedBoard.title,
            description: deletedBoard.description,
            owner: deletedBoard.owner.toString(),
        } 
    }
}

export default new BoardRepository();