
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://abhivardhan:abhivardhan@cluster0.vrhaf.mongodb.net/nquery?retryWrites=true&w=majority&appName=Cluster0')

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const messageRoutes = require('./routes/messages.routes')
const communityRoutes = require('./routes/community.routes')
const postRoutes = require('./routes/post.routes')
const port = 3001

const {io, server, app} = require('./lib/socket.lib')

const allowedOrigins = [
  "https://bookverse-jade.vercel.app",
  "http://localhost:3000" 
];

app.use(
  cors({
    origin: allowedOrigins,
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