import { createProduct, createUser, getAllProducts, getAllUsers, searchProductsByName } from "./database";

// console.log("Olá, iniciei meu projeto");

createUser("u003", "leonardo", "leo@email.com", "123456")
createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/Monitor/400")

console.table(getAllUsers());
console.table(getAllProducts());

console.log(searchProductsByName("monitor")) 