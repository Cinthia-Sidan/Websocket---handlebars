const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require("path");
const handlebars = require('express-handlebars');

const PORT = 8080;

app.engine('handlebars', handlebars.engine());
app.set("view engine", 'handlebars' );
app.set('views', path.join(__dirname, 'views'));



let products = []; // Array para almacenar los productos



//Routes
app.get("/", (req, res) => {
    res.render("home", { title: "Aplicacion Socket IO", products: products });
});

app.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts", { title: "Aplicacion Socket IO" });
});


http.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}.`);
});

//Configuracion de Socket.IO

io.on("connection", (socket)=>{
    socket.emit("productsList", products);
    console.log("Un cliente se ha conectado");

    //Escucha un evento personalizado llamado Mensaje desde el cliente
    socket.on("newProduct", (productName)=>{
        products.push(productName)
        console.log("Producto:", productName);
        //Emite mensaje a todos los clientes conectados
        io.emit("productList",products);
    })

    //Escucha un evento de desconexion
    socket.on("disconnect", ()=>{
        console.log("Un cliente se ha desconectado");
    })
});
