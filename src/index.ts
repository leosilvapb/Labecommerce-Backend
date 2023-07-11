import express, { Request, Response } from 'express'
import cors from 'cors'
import { createProduct, createUser, products, searchProductsByName, searchUsersByName, users } from "./database";

createUser("u003", "leonardo", "leo@email.com", "123456")
createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/Monitor/400")


const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando da porta 3003");
})

const verificaId = () => {

}

app.get('/users', (req: Request, res: Response) => {
    try {

        const name = req.query.name as string


        if (name !== undefined && name.length < 2) {
            res.status(400)
            throw new Error("O nome tem que ter pelo menos dois caracteres")
        }

        if (name) {
            const result = searchUsersByName(name)
            res.status(200).send(result)

        } else {
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


app.get('/products', (req: Request, res: Response) => {
    try {
        const name = req.query.name as string

        if (name !== undefined && name.length < 2) {
            res.status(400)
            throw new Error("O nome tem que ter pelo menos dois caracteres")
        }

        if (name) {
            const result = searchProductsByName(name)
            if (result.length === 0) {
                res.status(404)
                throw new Error("O produto não foi encontrado")
            }
            res.status(200).send(result)

        } else {
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

app.post('/users', (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const email = req.body.email as string
        const password = req.body.password as string

        const newIdExiste = users.find((user) => user.id === id)
        if (newIdExiste) {
            res.status(400)
            throw new Error("Essa ID já foi cadastrada")
        }

        const newEmailExiste = users.find((user) => user.email === email)
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


        const newUser: string = createUser(id, name, email, password)
        res.status(201).send(newUser)


    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.post('/products', (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const description = req.body.description as string
        const imageUrl = req.body.description as string

        const newIdExiste = products.find((product) => product.id === id)
        if (newIdExiste) {
            res.status(400)
            throw new Error("'Id' do produto já está cadastrado")
        }

        if (id[0] !== "p" || id[1] !== "r" || id[2] !== "o" || id[3] !== "d") {
            res.status(400)
            throw new Error('ID não foi iniciada corretamente, a Id deve iniciar com "prod"')
        }

        verificaId()
        const newProduct: string = createProduct(id, name, price, description, imageUrl)
        res.status(201).send(newProduct)

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.delete('/users/:id', (req: Request, res: Response) => {
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

app.delete('/products/:id', (req: Request, res: Response) => {
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

app.put('/products/:id', (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id



        console.log(idToEdit);


        if (idToEdit === ":id") /* ":id"  é o resultado que retorna caso não seja digitado nenhum valor no campo Id na busca no postman */ {
            res.status(400)
            throw new Error("Id não foi informada")
        }

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined as number
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        const product = products.find((product) => product.id === idToEdit)

        if (product) {
            product.id = newId || product.id
            product.name = newName || product.name
            product.description = newDescription || product.description
            product.imageUrl = newImageUrl || product.imageUrl
            product.price = isNaN(newPrice) ? product.price : newPrice

            if (product.price !== undefined) {
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