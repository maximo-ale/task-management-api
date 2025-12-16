import bcrypt from 'bcrypt';
import authDB from './authRepository.js';
import generateToken from '../../utils/generateToken.js';
import { InvalidTokenError, NotFoundError } from '../../utils/errors.js';

// Interfaces
import { RegisterUser, ProtectedUserInfo, LoginUser} from './userInterface.js';

class UserService{
    async register(data: RegisterUser): Promise<ProtectedUserInfo>{
        const {name, email, password} = data;

        // Hash password to protect sensitive info
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = authDB.registerUser({
            name,
            email,
            password: hashedPassword,
        });

        return newUser;
    }

    async login(data: LoginUser): Promise<string>{
        const {name, email, password} = data;

        const user = await authDB.findUserByNameOrEmail(name, email);

        
        if (!user){
            throw new NotFoundError('User not found');
        }

        // Compare hashed password with the given one
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            throw new InvalidTokenError('Wrong password');
        }

        // Generate token
        const token = generateToken({userId: user.id});
        
        return token;
    }
}

export default new UserService();