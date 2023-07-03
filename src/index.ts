import express, { Request, Response } from 'express'
import cors from 'cors'
import { createProduct, createUser, getAllProducts, getAllUsers, products, searchProductsByName, users } from "./database";

// console.log("Olá, iniciei meu projeto");

createUser("u003", "leonardo", "leo@email.com", "123456")
createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/Monitor/400")

// console.table(getAllUsers());
// console.table(getAllProducts());

// console.log(searchProductsByName("monitor")) 

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando da porta 3003");
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
})

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
})

app.get('/products/search', (req: Request, res: Response) => {
    const name = req.query.name as string

    if (name) {
        const result = searchProductsByName(name)
        res.status(200).send(result)

    } else {
        res.status(200).send(products)
    }
})

// app.get('/users/search', (req: Request, res: Response) => {
//     const name = req.query.name as string

//     if (name) {
//         const result = searchUsersByName(name)
//         res.status(200).send(result)

//     } else {
//         res.status(200).send("não deu certo")
//     }
// })


app.post('/users', (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const email = req.body.email as string
    const password = req.body.password as string

    const newUser: string = createUser(id, name, email, password)
    res.status(201).send(newUser)
})

app.post('/products', (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const description = req.body.description as string
    const imageUrl = req.body.description as string

    const newProduct: string = createProduct(id, name, price, description, imageUrl)
    res.status(201).send(newProduct)
})
