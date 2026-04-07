import express from 'express';
import query from './config/db.js';
import generateToken from './lib/auth.js';
import {verifyToken} from './lib/auth.js';
import SendAuthLink from './service/email.js';
import cookieParser from 'cookie-parser';
import { loginLimiter } from './middleware/rateLimit.js';
import { verifyLimiter } from './middleware/rateLimit.js';
import authenticate from './middleware/auth.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/auth", loginLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ Error: "No email provided!" });

  try {
    
    let result = await query("SELECT * FROM users WHERE email=$1", [email]);    
    if (result.rowCount === 0) {
      result = await query(
        "INSERT INTO users(email) VALUES ($1) RETURNING *",
        [email]
      );
    }

    const user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
    };
    
    const token = generateToken(user, "magic_link" ,"15m");  
    const sent = await SendAuthLink(email, token);
    if (!sent) return res.status(500).json({ Error: "Failed to send magic link!" });
    return res.status(200).json({ Success: "Magic link sent!" });

  } catch (err) {
    console.error(`Auth Error: ${err}`);
    return res.status(500).json({ Error: "Internal server error!" });
  }
});

app.get("/auth/verify/:token",verifyLimiter, async(req,res)=>{
  const {token} = req.params;
  
  try {
    const decoded = verifyToken(token);
    const used = await query(
      "SELECT 1 FROM used_tokens WHERE token=$1",
      [token]
    );
    
    if(used.rowCount>0) return res.status(401).json({Error:"Link Already Used!"});

    await query(
      "INSERT INTO used_tokens(token) VALUES($1)",[token]
    );
    
    const sessionToken = generateToken({id: decoded.id,email: decoded.email}, "session", "365d");

    res.cookie("session", sessionToken,{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge: 365*24*60*60*1000
    })

    return res.status(200).json({
      message:"Successful login!",
      user:decoded
    });
  } catch (err) {
    return res.status(401).json({Error:"Invalid or Expired token!"});
  }
});

app.get("/secret",authenticate , (req,res)=>{
  res.send("Authenticated!");
});

export default app;