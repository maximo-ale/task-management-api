import Board from '../entities/board/Board.js';
import List from '../entities/list/List.js';
import Task from '../entities/task/Task.js';
import User from '../entities/user/User.js';

const resetDB = async() => {
    await Board.deleteMany();
    await List.deleteMany();
    await Task.deleteMany();
    await User.deleteMany();
}

export default resetDB;