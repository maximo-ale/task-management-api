import jwt from 'jsonwebtoken';

interface Payload{
    userId: string,
}

const generateToken = (payload: Payload): string => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '7d'});
    return token;
}

export default generateToken;