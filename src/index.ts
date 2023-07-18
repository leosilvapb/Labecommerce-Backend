import express, { Request, Response } from 'express'
import cors from 'cors'
import { createProduct, createUser, dataAtualizada, products, searchProductsByName, searchUsersByName, users } from "./database";
import { db } from './database/knex';

createUser("u003", "leonardo", "leo@email.com", "123456")
createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/Monitor/400")


const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando da porta 3003");
})


app.get('/users', async (req: Request, res: Response) => {
    try {

        const name = req.query.name as string

        if (name !== undefined && name.length < 2) {
            res.status(400)
            throw new Error("O nome tem que ter pelo menos dois caracteres")
        }

        if (name) {
            const result = await db.raw(`
            SELECT * FROM users
            WHERE name LIKE '%${name}%';
            `)


            // const result = searchUsersByName(name)
            res.status(200).send(result)

        } else {
            const users = await db.raw(`
            SELECT * FROM users;
            `)
            res.status(200).send(users)
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


app.get('/products', async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string

        if (name !== undefined && name.length < 2) {
            res.status(400)
            throw new Error("O nome tem que ter pelo menos dois caracteres")
        }

        if (name) {
            const result = await db.raw(`
        SELECT * FROM products
        WHERE name LIKE '%${name}%';
        `)

            if (result.length === 0) {
                res.status(404)
                throw new Error("O produto não foi encontrado")
            }
            res.status(200).send(result)

        } else {
            const products = await db.raw(`
            SELECT * FROM products;          
            `)
            res.status(200).send(products)
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const purchases = await db.raw(`
            SELECT * FROM purchases;
        `)
        res.status(200).send(purchases)

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.post('/users', async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const email = req.body.email as string
        const password = req.body.password as string

        // const newIdExiste = users.find((user) => user.id === id)

        const [newIdExiste] = await db.raw(`
        SELECT * FROM users
        WHERE id = '${id}'
        `)

        if (typeof id !== "string") {
            res.status(400)
            throw new Error('"id" deve ser uma string')
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error('"name" deve ser uma string')
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error('"email" deve ser uma string')
        }

        if (typeof password !== "string") {
            res.status(400)
            throw new Error('"password" deve ser uma string')
        }

        if (newIdExiste) {
            res.status(400)
            throw new Error("Essa ID já foi cadastrada")
        }

        // const newEmailExiste = users.find((user) => user.email === email)
        const [newEmailExiste] = await db.raw(`
        SELECT * FROM users
        WHERE email = '${email}'
        `)
        if (newEmailExiste) {
            res.status(400)
            throw new Error("Esse email já foi cadastrado")
        }

        if (!password) {
            res.status(400)
            throw new Error("o campo senha não pode ficarm vazio")
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            res.status(400)
            throw new Error("Formato de E-mail incorreto")
        }


        // const newUser: string = createUser(id, name, email, password)
        // res.status(201).send(newUser)

        await db.raw(`
            INSERT INTO users (id, name, email, password, created_at )
            VALUES('${id}', '${name}', '${email}', '${password}', '${dataAtualizada()}');
        `)
        res.status(201).send({ message: "Usuário criado com sucesso" })

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.post('/products', async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const description = req.body.description as string
        const imageUrl = req.body.description as string

        // const newIdExiste = products.find((product) => product.id === id)
        const [newIdExiste] = await db.raw(`
            SELECT * FROM products
            WHERE id = '${id}'
        `)

        if (typeof id !== "string") {
            res.status(400)
            throw new Error('"id" deve ser uma string')
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error('"name" deve ser uma string')
        }

        if (typeof price !== "number") {
            res.status(400)
            throw new Error('"price" deve ser um número')
        }
        if (typeof description !== "string") {
            res.status(400)
            throw new Error('"description" deve ser uma string')
        }

        if (typeof imageUrl !== "string") {
            res.status(400)
            throw new Error('"imageUrl" deve ser uma string')
        }

        if (newIdExiste) {
            res.status(400)
            throw new Error("'Id' do produto já está cadastrado")
        }

        if (id[0] !== "p" || id[1] !== "r" || id[2] !== "o" || id[3] !== "d") {
            res.status(400)
            throw new Error('ID não foi iniciada corretamente, a Id deve iniciar com "prod"')
        }

        // const newProduct: string = createProduct(id, name, price, description, imageUrl)
        await db.raw(`
            INSERT INTO products(id, name, price, description, image_url)
            VALUES('${id}', '${name}', '${price}', '${description}', '${imageUrl}');
        `)
        res.status(201).send({ message: "Produto cadastrado com sucesso." })

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.post('/purchases', async (req: Request, res: Response) => {
    try {

        const id = req.body.id as string
        const buyer = req.body.buyer as string
        const totalPrice = req.body.totalPrice as number

        const [newPurchase] = await db.raw(`
            SELECT * FROM purchases
            WHERE id = '${id}'
        `)

        if (typeof id !== "string") {
            res.status(400)
            throw new Error('"id" deve ser uma string')
        }

        if (typeof buyer !== "string") {
            res.status(400)
            throw new Error('"buyer" deve ser uma string')
        }

        if (typeof totalPrice !== "number") {
            res.status(400)
            throw new Error('"totalPrice" deve ser um número')
        }

        if (newPurchase) {
            res.status(400)
            throw new Error('"Id" do pedido já cadastrado no sistema')
        }

        if (id[0] !== "p" || id[1] !== "u" || id[2] !== "r" || id[3] !== "c" || id[4] !== "h") {
            res.status(400)
            throw new Error('ID não foi iniciada corretamente, a Id deve iniciar com "purch"')
        }


        await db.raw(`
        INSERT INTO purchases(id, buyer, total_price ,created_at)
        VALUES('${id}', '${buyer}', '${totalPrice}', '${dataAtualizada()}');
        `)
        res.status(201).send({ message: "Pedido realizado com sucesso" })

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id
        const userIndex = users.findIndex((user) => user.id === idToDelete)

        if (userIndex >= 0) {
            users.splice(userIndex, 1)

            res.status(200).send("Usuário deletado com sucesso")
        } else {
            return res.status(404).send("Usuário não encontrado")
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id
        const productsIndex = products.findIndex((product) => product.id === idToDelete)

        if (productsIndex >= 0) {
            products.splice(productsIndex, 1)

            res.status(200).send("Produto deletado com sucesso")
        } else {
            res.status(404).send("Produto não encontrado")
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [purchase] = await db.raw(`
            SELECT * FROM purchases
            WHERE id ='${idToDelete}';
        `)
        if (!purchase) {
            res.status(404)
            throw new Error('"id" não encontrada')
        }
        await db.raw(`
            DELETE FROM purchases
            WHERE id = '${idToDelete}';
        `)
        res.status(200).send("pedido cancelado com sucesso")

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id


        if (!idToEdit) {
            res.status(400)
            throw new Error("Id não foi informada")
        }

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined as number
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        // const product = products.find((product) => product.id === idToEdit)
        const [products] = await db.raw(`
                SELECT * FROM products
                WHERE id = '${idToEdit}'
        `)

        if (products) {
            await db.raw(`
                UPDATE products
                SET
                    id = '${newId || products.id}',
                    name = '${newName || products.name}',
                    description = '${newDescription || products.description}',
                    image_url = '${newImageUrl || products.image_url}',
                    price = '${isNaN(newPrice) ? products.price : newPrice}'
                WHERE 
                    id = '${idToEdit}';
            `)

            if (products.price !== undefined) {
                res.status(200).send("Produto atualizado com sucesso")
            }

        }
        else {
            return res.status(404).send("Produto não encontrado")
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }


})