const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// User register
exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === ""){
            return res.status(400).json({message: 'Invalid given information'});
        }

        // Hash password to protect sensitive info
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Prepare user response without providing sensitive info
        const userResponse = {
            name,
            email,
        }

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse,
        });
    } catch (err){
        // Handle duplied name or email
        if (err.code === 11000){
            return res.status(400).json({message: 'Name and email must be unique'});
        }
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// User login
exports.login = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name && !email || !password || password.trim() === ""){
            return res.status(400).json({message: 'Invalid fields'});
        }

        const user = await User.findOne({
            $or: [
                { name },
                { email },
            ],
        });

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        // Compare hashed password with the given one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Wrong password'});
        }

        // Generate token
        const token = generateToken({userId: user._id});

        return res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({message: 'Internal server error'});
        }
}