// caso a conexão seja com outro servidor colocar a url em io()
const socket = io() 
let username = ''
let userList = []

let loginPage = document.querySelector('#loginPage')
let chatPage = document.querySelector('#chatPage')

let loginInput = document.querySelector('#loginNameInput')
let textInput = document.querySelector('#chatTextInput')

loginPage.style.display = 'flex'
chatPage.style.display = 'none'

function renderUserList() {
    let ul = document.querySelector('.userList')
    ul.innerHTML = ''

    userList.forEach(user => {
        ul.innerHTML += `<li>${user}</li>`
    })
}

loginInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        let name = loginInput.value.trim()

        if(name !== ''){
            username = name
            document.title = `Chat ( ${name} )`

            socket.emit('join-request', username)
        }
    }
})

socket.on('user-ok', (list) => {
    loginPage.style.display = 'none'
    chatPage.style.display = 'flex'
    textInput.focus()

    userList = list
    renderUserList()
})
