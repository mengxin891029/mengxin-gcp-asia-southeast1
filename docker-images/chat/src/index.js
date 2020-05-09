// server requirement
const express = require('express')
const http = require('http')
const socketio = require('socket.io')


// utility requirement
const path = require('path')
const cookieParser = require('cookie-parser')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const jwt = require('jsonwebtoken')
// const { jwtSign } = require('./secrets/jwt')
const jwtSign = process.env.JWTSIGN


// feature requirement
const Filter = require('bad-words')



const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT


const staticDirectoryPath = path.join(__dirname, '../public')
const templateDirectoryPath = path.join(__dirname, '../templates')


app.use(express.static(staticDirectoryPath))
app.use(express.urlencoded())
app.use(cookieParser())



// Join Page
app.get('/', (req, res) => {

    const token = req.cookies.accessToken
    // console.log(token)
    if (token) {
        res.redirect('/chat')
    }
    res.sendFile(path.join(templateDirectoryPath + '/index.html'));
})


app.post('/', (req, res) => {
    // console.log(req.body)
    // res.send()`
    const { username, room } = req.body
    const token = jwt.sign({ username, room }, jwtSign, { 'expiresIn': '1d' })
    res.cookie('accessToken', token, {
        maxAge: 1000 * 36000
    }).redirect('/chat')
})


// Chat Page
app.get('/chat', (req, res) => {
    res.sendFile(path.join(templateDirectoryPath + '/chat.html'));
})


// Logout Page
app.get('/logout', (req, res) => {
    res.set('Cache-Control', 'no-cache').cookie('accessToken', '', { expires: new Date(0) }).redirect('/')
})



io.on('connection', (socket) => {
    console.log('new websocket connection')


    /*
    Initial Connection
    */
    socket.on('userJoinRoom', ({ token }, callback) => {
        if (!token) {
            return callback("User must be logged in first")
        }

        const { username, room } = jwt.verify(token, jwtSign)
        addUser({ id: socket.id, username, room }, (err, user) => {
            if (err) {
                return callback(err)
            }

            socket.join(user.room) // join a given namespace (room)

            socket.emit('serverSentMessage', generateMessage('System', "Welcome!")) // sent to this connection
            socket.broadcast.to(user.room).emit('serverSentMessage', generateMessage('System', `${user.username} has joined!`)) // sent broadcast (every other connection except for this)
            getUsersInRoom(user.room, (err, res) => {
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: res
                })
            })


            callback()

        })



        // console.log(user)
        // console.log('on connect', getUsersInRoom(user.room))




    })


    /*
    Chat Message Received
    */
    socket.on('clientSentMessage', (message, callback) => {

        getUser(socket.id, (error, user) => {
            // console.log(user)
            if (error) return callback("Unable to send message")
            const filter = new Filter()
            // if (filter.isProfane(message)) return callback('Profanity is not allowed')
            io.to(user.room).emit('serverSentMessage', generateMessage(user.username, filter.clean(message))) // sent to all connections
            callback() // server ack
        })


    })


    /*
    Location Message Received
    */
    socket.on('clientSentLocation', (position, callback) => {
        getUser(socket.id, (error, user) => {
            io.to(user.room).emit('serverSentLocation', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
            callback()
        })

    })


    /*
    Disconnect
    */
    socket.on('disconnect', () => { // built-in disconnect event
        removeUser(socket.id, (error, user) => {

            if (user) {
                io.to(user.room).emit('serverSentMessage', generateMessage('System', `${user.username} has left`)) // io.emit instead of socket.broadcast because that socket has already closed
                getUsersInRoom(user.room, (err, res) => {
                    io.to(user.room).emit('roomData', {
                        room: user.room,
                        users: res
                    })
                })
            }
        })


    })
})



server.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})