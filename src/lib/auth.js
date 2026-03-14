import jwt from "jsonwebtoken";

export default function generateToken(user){
    return jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
}

export default function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET);
}
