import jwt from "jsonwebtoken";

export default function generateToken(user, expiresIn = "15m"){
    return jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn }
    )
}

export function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET);
}
