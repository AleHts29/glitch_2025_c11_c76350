const socket = io()

let user;
const chatBox = document.getElementById("chatBox")
const logHbs = document.getElementById("messageLogs")


/* =====================================
=               SweetAlert             =
===================================== */

Swal.fire({
    icon: "info",
    title: "Identificarse con el nikUser",
    input: "text",
    text: "Ingrese el userName para identificarse en el chat",

    inputValidator: (value) => {
        if (!value) {
            return "Necesitas escribir tu userName para continuar!..."
        } else {
            // 2da - parte
            socket.emit('userConnected', { user: value })
        }
    },
    allowOutsideClick: false // esto es para no dejar pasar al usuario si no completa el input, dando cli-ck afuera.
}).then((result) => {
    user = result.value

    // Cargar el Nombre en el HTML
    document.getElementById("myName").innerHTML = user
});



//Guardar mensaje por usuario y mostrarlo en el messageLog
chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {

        //pre-procesado de la cadenaString
        let newData = chatBox.value.trim()
        if (newData.length > 0) {
            socket.emit('message', { user: user, message: newData });
            chatBox.value = '' //esto limpia el cahtBox despues de enviar el mensaje
        } else {
            Swal.fire({
                icon: 'warning',
                title: "Alert",
                text: 'Por favor ingresar un mensaje!..'
            })
        }
    }
})



// Escuchamos el mesanje con key: messageLogs ya que este mensaje lo necesito pintar en el HTML
socket.on('messageLogs', data => {
    let logs = ''
    data.forEach(log => {
        logs += `<div>
        <span> <b>${log.user}</b>: </span>${log.message}</div>`
    })
    document.getElementById('messageLogs').innerHTML = logs
})



// Aaqui escuchamos al nuevo usuario que se conecto
socket.on('userConnected', userData => {
    if (!user) return

    let message = `New user conect: ${userData}`
    Swal.fire({
        icon: 'info',
        text: message,
        toast: true,
        position: "top-right"
    })
})


// close chatBox
const closeChat = document.getElementById('closeChatBox')
closeChat.addEventListener('click', evt => {
    // alert("Test")
    socket.emit('closeChat', { close: true })
    logHbs.innerHTML = ''
})