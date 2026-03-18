import express from 'express';
import query from './config/db.js';
import generateToken from './lib/auth.js';
import {verifyToken} from './lib/auth.js';
import SendAuthLink from './lib/email.js';
import cookieParser from 'cookie-parser';
import authenticate from './middleware/auth.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/login", async(req,res)=>{
  const {email} = req.body;
  if(!email) return res.status(400).json({Error:"No Email Provided!"});

  try {
    const result = await query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if(result.rowCount===0) return res.status(404).json({Error:"No User Found!"});
    
    const user = {
      id: result.rows[0].id,
      email: result.rows[0].email
    }

    const token = generateToken(user);
    const sendEmail = await SendAuthLink(email, token);

    if (sendEmail) return res.status(200).json({ Success: "Magic Link sent to the email!" });
    else return res.status(200).json({ Error: "Failed to send the email!" });

  } catch (err) {
    console.log(`Login Error:${err}`);
    return res.status(500).json({Error:"Failed to Login!"});
  }
});

app.post("/register",(req,res)=>{
  const {email} = req.body;
  
});

app.get("/auth/verify/:token",(req,res)=>{
  const {token} = req.params;
  
  try {
    const decoded = verifyToken(token);
    const sessionToken = generateToken({id: decoded.id,email: decoded.email},"365d");

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