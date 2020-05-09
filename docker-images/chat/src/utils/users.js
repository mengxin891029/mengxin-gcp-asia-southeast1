const redis = require("redis");

const client = redis.createClient({
    host: 'redis-mengxin-ml-clusterip.tcp.svc.cluster.local',
    db: 1
})

// initialize redis
client.flushdb()


/* 
redis strucuture:

1. chat.mengxin.ml/user/<socket_id>:    {username, room}
2. chat.mengxin.ml/room/<room>:         [username1,username2, ...]

*/

/*

Methods:
addUser, removeUser, getUser, getUsersInRoom

addUser:
1. add new user to chat.mengxin.ml/user/<socket_id>
2. add new username to chat.mengxin.ml/room/<room>

removeUser
1. remove chat.mengxin.ml/user/<socket_id>
2. delete username from chat.mengxin.ml/room/<room>

getUser
1. get chat.mengxin.ml/user/<socket_id>

getUsersInRoom
1. get chat.mengxin.ml/room/<room>
*/


const addUser = ({ id, username, room }, callback) => {

    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return callback('Both username and room are required')
    }


    client.get('chat.mengxin.ml/room/' + room, (err, res) => {
        if (err) return callback("Unable to read cache")
        if (res) {
            // console.log("addUser", res)
            rooms = JSON.parse(res)
        } else { rooms = [] }

        // validate the username is unique
        if (rooms.indexOf(username) != -1) return callback('Username is in use')

        // store user and room data
        const user = { username, room }
        rooms.push(username)

        client.set('chat.mengxin.ml/user/' + id, JSON.stringify(user), () => {
            // console.log("addUser ", id, "added ", JSON.stringify(user))
            client.set('chat.mengxin.ml/room/' + room, JSON.stringify(rooms), () => {
                // console.log("addUser room ", room, "added ", JSON.stringify(rooms))
                callback(null, user)
            })
        })




    })





}

const removeUser = (id, callback) => {

    client.get('chat.mengxin.ml/user/' + id, (err, res) => {
        if (err || !res) return callback("Unable to read cache")
        var user = JSON.parse(res)
        // console.log("removeUser ", user)

        client.get('chat.mengxin.ml/room/' + user.room, (err, res) => {
            if (err || !res) return callback("Unable to read cache")
            var rooms = JSON.parse(res)
            // console.log("removeUser room", rooms)
            // rooms = rooms.filter((element) => element !== user.username)
            const index = rooms.findIndex((element) => element === user.username)
            if (index != -1) rooms.splice(index, 1)

            client.del('chat.mengxin.ml/user/' + id, () => {
                client.set('chat.mengxin.ml/room/' + user.room, JSON.stringify(rooms), () => {
                    // console.log("removeUser room updated ", JSON.stringify(rooms))
                    callback(null, user)
                })
            })
        }
        )



        // const index = users.findIndex((element) => element.id === id)
        // if (index != -1) {
        //     return users.splice(index, 1)[0]
    })
}

const getUser = (id, callback) => {
    client.get('chat.mengxin.ml/user/' + id, (err, res) => {
        if (err || !res) return callback("Unable to read cache")
        var user = JSON.parse(res)
        callback(null, user)
    })
}

const getUsersInRoom = (room, callback) => {
    // room = room.trim().toLowerCase()
    // return users.filter((element) => element.room === room)

    client.get('chat.mengxin.ml/room/' + room, (err, res) => {
        if (err || !res) return callback("Unable to read cache")
        callback(null, JSON.parse(res))
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}