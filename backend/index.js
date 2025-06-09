
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL)

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const messageRoutes = require('./routes/messages.routes')
const communityRoutes = require('./routes/community.routes')
const postRoutes = require('./routes/post.routes')
const port = 3001

const {io, server, app} = require('./lib/socket.lib')

const allowedOrigins = [
  "https://24-your-space-to-explore.vercel.app",
  "http://localhost:3000" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/message', messageRoutes)
app.use('/community', communityRoutes)
app.use('/post', postRoutes)




server.listen(port, ()=>{
    console.log(`Server started at ${port}`)
})