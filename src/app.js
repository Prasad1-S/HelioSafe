import express from 'express';
const app = express();

app.get("/", (req, res) => {
  res.send("Server working");
});

export default app;