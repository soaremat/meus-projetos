// elementos do login
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// elementos do chat
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "aqua",
    "chartreuse",
    "blue",
    "green",
    "gold",
    "eeppink",
    "darkviolet"
]

const user = {id: "", name:"", color: ""}

let websocket

const createSelfMessage = (content) =>{
    const div = document.createElement("div")

    div.classList.add("message__self")
    div.innerHTML = content

    return div
}

const createOtherfMessage = (content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message__self")
    div.classList.add("message__other")
    span.classList.add("message__sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}
const processMessage = ({ data }) =>{
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message = userId == user.id ? createSelfMessage(content) : createOtherfMessage(content, userName, userColor)

    chatMessages.appendChild(message)
    scrollScreen()

}

const handleLogin = (event) =>{
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

}

const sendMessage = (event) =>{
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

login.addEventListener("submit" , handleLogin)
chat.addEventListener("submit" , sendMessage)