const socket = io()

// emito mensaje al Servidor
socket.emit("mensaje", "Hola soy el cliente!!..")


// Escucho mensaje del server
socket.on('msg_03', data => {
    console.log("Data: ", data);
})