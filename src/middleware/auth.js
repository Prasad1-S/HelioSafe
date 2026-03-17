import { verifyToken } from '../lib/auth.js';

export default function authenticate(req, res, next){
    const token = req.cookies.session;
    if(!token) return res.status(401).json({Error:"Not Logged in!"});

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        res.json(401).json({Error:"Session Expired, Please login again!"});
    }
}