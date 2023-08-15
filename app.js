const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require("path");

const PORT = 8080;

app.set("view engine", "hbs" );
app.set("views", path.join(__dirname, "views"));


//Routes
app.get("/", (req,res) =>{
    res.render("index", {title: "Aplicacion Socket IO"})
});


http.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}.`);
});

//Configuracion de Socket.IO

io.on("connection", (socket)=>{
    console.log("Un cliente se ha conectado");

    //Escucha un evento personalizado llamado Mensaje desde el cliente
    socket.on("mensaje", (data)=>{
        console.log("Mensaje recibido:", data);
        //Emite mensaje a todos los clientes conectados
        io.emit("mensaje", data)
    })

    //Escucha un evento de desconexion
    socket.on("disconnect", ()=>{
        console.log("Un cliente se ha desconectado");
    })
});
