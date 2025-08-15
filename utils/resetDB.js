const Board = require('../models/Board')
const List = require('../models/List')
const Task = require('../models/Task')
const User = require('../models/User')
const resetDB = async() => {
    await Board.deleteMany();
    await List.deleteMany();
    await Task.deleteMany();
    await User.deleteMany();
}

module.exports = resetDB;