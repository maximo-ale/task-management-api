const mongoose = require('mongoose');
const idValidator = (req, res, next) => {
    const idsToCheck = [req.params.id, req.body.listId, req.body.taskId];
    for (const id of idsToCheck){
        if (id && !mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid ID'});
        }
    }
    next();
} 

module.exports = idValidator;