import express from 'express';
import query from './config/db.js'
import generateToken from './lib/auth.js'
import authenticate from './middleware/auth.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/login",async(req,res)=>{
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        { message: "Email and password required" }
      );
    }

    const result = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json(
        { message: "Invalid credentials" }
      );
    }

    const user = result.rows[0];

    const isMatch = (password===user.password);

    if (!isMatch) {
      return res.status(401).json(
        { message: "Invalid credentials" }
      );
    }

    const token = generateToken(user);
    res.json({token:token});
  }catch(err){
    console.log(`LOGIN ERROR: ${err}`);
  }

});


app.get("/secret", authenticate, (req,res)=>{
  res.json(req.user);
})

export default app;