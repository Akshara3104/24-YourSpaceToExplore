
const { Server }  = require('socket.io')
const express = require('express')
const http = require('http')


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
        cors: {
            origin: ['https://nquery-one.vercel.app/', 'http://localhost:3000']
        }
    }
)

module.exports = {io, server, app}