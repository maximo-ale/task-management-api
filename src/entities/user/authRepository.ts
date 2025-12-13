import User from './User.js';

interface RegisterUser{
    name: string,
    email: string,
    password: string,
}

interface ProtectedUserInfo{
    id: string,
    name: string,
}

interface LoginInfo{
    id: string,
    password: string,
}
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