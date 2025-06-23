import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io'



import viewRouter from './routes/views.router.js'
import __dirname from './utils.js';


const app = express();

// prepara la confiuguracion del servidor para trabajar con archivos JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
const PORT = 9090;

// configuracion de HBS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views/");
app.set('view engine', 'handlebars');



// para renderizar vistas
app.use('/views', viewRouter)


const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`);
})


// Instanciamos Socket
const socketServer = new Server(httpServer)



const messages = []
socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado!!...");

    //propagamos el log de mensaje al nuevo usuario
    socket.emit('messageLogs', messages)




    // escuchando al cliente
    socket.on('message', data => {
        console.log("Data: ", data);
        messages.push(data)


        // enviamos un array de objetos ---> [{ user: "Juan", message: "Hola" }, { user: "Elias", message: "Como estas?" }]
        socketServer.emit('messageLogs', messages)
    })


    // hacemos un broadcast del nuevo user que se conecto
    socket.on('userConnected', data => {
        console.log("userConnected", data);

        socket.broadcast.emit('userConnected', data.user)

    })




    socket.on('closeChat', data => {
        console.log("close:", data);
        if (data.close) {
            socket.disconnect() // <- esto hace el cierre del canal de socket
            console.log("Canal de chat cerrado para un user especifico");

        }
    })




})