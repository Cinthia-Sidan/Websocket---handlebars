const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor de WebSocket');
});

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', async (event) => {
        //evitamos el comportamiento normal de un formulario de recargar la pagina
        event.preventDefault();

        //obtenemos el valor de cada input
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;
        const code = document.getElementById('code').value;

        const response = await fetch('/addproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, stock, code })
        });

        const data = await response.json();
        console.log('Producto agregado:', data);

        // Emite el nuevo producto al servidor a través de Socket.io
        socket.emit('newProduct', data);

        // Limpia los campos del formulario
        productForm.reset();
    });

    socket.on('newProduct', (product) => {
        // Agrega el nuevo producto a la lista en tiempo real
        const productList = document.getElementById('productList');
        const productItem = document.createElement('li');
        productItem.textContent = product.name;
        productList.appendChild(productItem);
    });
});