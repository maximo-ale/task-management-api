import Membership from './Membership.js';

interface ProtectedUserInfo{
    id: string,
    name: string,
}

interface PartialBoardInfo{
    id: string,
    title: string,
}

interface BoardPopulated{
    _id: string,
    title: string,
}

interface UserPopulated{
    _id: string,
    name: string,
}

class MembershipRepository{
    async addMembership(userId: string, boardId: string){
        const newMembership = new Membership({
            userId,
            boardId,
        });

        await newMembership.save();
    }

    async getUserBoards(userId: string): Promise<PartialBoardInfo[]>{
        const boards = await Membership.find({userId: userId})
        .populate<{ boardId: BoardPopulated}>('boardId');
        
        return boards.map(b => ({
            id: b.boardId.toString(),
            title: b.boardId.title,
        }));
    }

    async getBoardMembers(boardId: string): Promise<ProtectedUserInfo[]>{
        const members = await Membership.find({ boardId })
        .populate<{ userId: UserPopulated}>('userId', 'name');

        return members.map(m => ({
            id: m.userId.toString(),
            name: m.userId.name,
        }));
    }
}

export default new MembershipRepository();