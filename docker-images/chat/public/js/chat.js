const socket = io() // connect to ws


// elements
const $messageForm = document.querySelector("#messageForm")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $messageBox = document.querySelector("#messageBox")
const $sendLocationButton = document.querySelector("#sendLocation")

// tempaltes
const messageTemplate = document.querySelector("#messageTemplate").innerHTML
const locationTemplate = document.querySelector("#locationTemplate").innerHTML
const sidebarTemplate = document.querySelector("#sidebarTemplate").innerHTML

// options
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


const token = getCookie('accessToken')


// autoscroll if the user is currently viewing the newest message
const autoscroll = () => {
    // new message element
    const $newMessage = $messageBox.lastElementChild

    // height of the $newMessage
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messageBox.offsetHeight

    // height of message container
    const messageBoxHeight = $messageBox.scrollHeight

    // how far have i scrolled
    const scrollOffset = $messageBox.scrollTop + visibleHeight

    if (messageBoxHeight - newMessageHeight <= scrollOffset) {  // if currently viewing at the bottom
        $messageBox.scrollTop = messageBoxHeight
    }
}


const errorHandling = (error) => {
    if (error) {
        alert(error)
        location.href = '/logout'
    }
}


// initial connection
socket.emit('userJoinRoom', { token }, errorHandling)


// receives updated room information
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector("#sidebar").innerHTML = html
})

// client receive message
socket.on('serverSentMessage', (message) => {
    // console.log(`${message}`)

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    $messageBox.insertAdjacentHTML("beforeend", html)
    autoscroll()
})


// client sent message
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    //disable the button until server ack
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('clientSentMessage', message, (error) => {
        // acknowledgement callback function

        //re-enable the button
        $messageFormButton.removeAttribute('disabled')
        //clear the input form and refocus on the input
        $messageFormInput.value = ''
        $messageFormInput.focus()


        if (error) {
            return errorHandling(error)
        }

        // console.log("Message Delivered")



    })
})


// client receive location
socket.on('serverSentLocation', (location) => {
    // console.log(`${location}`)

    const html = Mustache.render(locationTemplate, {
        username: location.username,
        location: location.location,
        createdAt: moment(location.createdAt).format('hh:mm a')
    })
    $messageBox.insertAdjacentHTML("beforeend", html)
    autoscroll()
})


// client sent location
$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert('Browser does not support Geolocation')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    // async with no promise support
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('clientSentLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            // console.log("Location Shared")
            $sendLocationButton.removeAttribute('disabled')
            if (error) {
                return errorHandling(error)
            }
        })
    })
})