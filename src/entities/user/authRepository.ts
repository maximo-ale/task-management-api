import User from './User.js';

// Interfaces
import { RegisterUser, ProtectedUserInfo, LoginInfo } from './userInterface.js';

class AuthRepository{
    async registerUser(data: RegisterUser): Promise<ProtectedUserInfo>{
        const newUser = new User(data);

        await newUser.save();

        return {id: newUser._id.toString(), name: newUser.name};
    }

    async findUserByNameOrEmail(name?: string, email?: string): Promise<LoginInfo | null>{
        const user = await User.findOne({
            $or: [
                { name },
                { email },
            ],
        });

        if (!user){
            return null;
        }

        return {id: user._id.toString(), password: user.password};
    }

    async findUserById(userId: string): Promise<ProtectedUserInfo | null>{
        const user = await User.findById(userId);

        if (!user){
            return null;
        }

        return {
            id: user._id.toString(),
            name: user.name,
        }
    }
}

export default new AuthRepository();