
const { Server }  = require('socket.io')
const express = require('express')
const http = require('http')


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
        cors: {
        origin: ['https://24-your-space-to-explore.vercel.app', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
    }
)

module.exports = {io, server, app}
