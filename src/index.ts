import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex';

const dataAtualizada = () => {
    const data = (new Date()).getTimezoneOffset() * 60000;
    const dataBase = (new Date(Date.now() - data)).toISOString();

    return dataBase
}

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
            const result = await db("users").where("name", "LIKE", `%${name}%`)

            res.status(200).send(result)

        }
        else {
            const users = await db("users")
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
            const result = await db("products").where("name", "LIKE", `%${name}%`)

            if (result.length === 0) {
                res.status(404)
                throw new Error("O produto não foi encontrado")
            }
            res.status(200).send(result)

        } else {
            const products = await db("products")
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
        const purchases = await db("purchases")
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

        const [newIdExiste] = await db("users").where({ id })

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

        const [newEmailExiste] = await db("users").where({ email })
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

        const newUser = {
            id,
            name,
            email,
            password,
            created_at: dataAtualizada()
        }
        await db("users").insert(newUser)

        res.status(201).send({ message: "Usuário cadastrado com sucesso" })

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 201) {
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

        const [newIdExiste] = await db("products").where({ id })

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

        const newProduct = {
            id,
            name,
            price,
            description,
            image_url: imageUrl
        }
        await db("products").insert(newProduct)

        res.status(201).send({ message: "Produto cadastrado com sucesso." })

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 201) {
            res.status(500)
        }
        res.send(error.message)
    }

})

app.post('/purchases', async (req: Request, res: Response) => {
    try {

        const id = req.body.id as string
        const buyer = req.body.buyer as string
        const products = req.body.products

        const [purchaseExiste] = await db("purchases").where({ id })

        if (purchaseExiste) {
            res.status(400)
            throw new Error('purchase ja existe')
        }

        if (typeof id !== "string") {
            res.status(400)
            throw new Error('"id" deve ser uma string')
        }

        if (typeof buyer !== "string") {
            res.status(400)
            throw new Error('"buyer" deve ser uma string')
        }

        let totalPrice = 0

        const resultProducts = []

        for (let prod of products) {
            const [product] = await db('products').where({ id: prod.id })
            if (!product) {
                res.status(404)
                throw new Error('"id" não encontrado')
            }
            resultProducts.push({ ...product, quantity: prod.quantity })
            console.log(product);

        }

        for (let prod of resultProducts) {
            totalPrice = prod.price * prod.quantity
        }

        const newPurchase = {
            id,
            buyer,
            total_price: totalPrice,
            created_at: dataAtualizada()
        }
        // console.log(resultProducts);

        await db("purchases").insert(newPurchase)

        for (let prod of products) {
            const newPurchaseProducts = {
                purchase_id: id,
                product_id: prod.id,
                quantity: prod.quantity
            }

            await db("purchases_products").insert(newPurchaseProducts)
        }

        res.status(201).send({ message: "pedido com sucesso" })



    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 201) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id
        const user = await db("users").del().where({ id: idToDelete })

        if (!user) {
            res.status(404)
            throw new Error('"id" não encontrada')
        }
        await db("users").del().where({ id: idToDelete })

        res.status(200).send({ message: "Usuário deletado com sucesso" })

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

        const product = await db("products").del().where({ id: idToDelete })

        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }
        await db("products").del().where({ id: idToDelete })

        res.status(200).send("Produto deletado com sucesso")


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

        const purchase = await db("purchases").del().where({ id: idToDelete })
        if (!purchase) {
            res.status(404)
            throw new Error('"id" não encontrada')
        }
        await db("purchases").del().where({ id: idToDelete })

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

        const [products] = await db("products").where({ id: idToEdit })

        if (!products) {
            res.status(404)
            throw new Error('"id" não encontrada')
        }

        if (products) {

            const updateProduct = {
                id: newId || products.id,
                name: newName || products.name,
                description: newDescription || products.description,
                image_url: newImageUrl || products.image_url,
                price: newPrice || products.price
            }
            await db("products").update(updateProduct).where({ id: idToEdit })
            res.status(200).send("Produto atualizado com sucesso")

        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }


})


app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToFind = req.params.id;

        if (idToFind) {
            const purchase = await db
                .select(
                    "purchases.id AS purchaseId",
                    "purchases.buyer AS buyerId",
                    "users.name AS buyerName",
                    "users.email AS buyerEmail",
                    "purchases.total_price AS totalPrice",
                    "purchases.created_at AS createdAt"
                )
                .from("purchases")
                .innerJoin("users", "purchases.buyer", "=", "users.id")
                .where("purchases.id", "LIKE", `${idToFind}`);

            if (purchase.length === 0) {
                res.status(404);
                throw new Error('"id" não econtrada');
            }

            const products = await db
                .select(
                    "products.id AS id",
                    "products.name AS name",
                    "products.price AS price",
                    "products.description AS description",
                    "products.image_url AS imageUrl",
                    "purchases_products.quantity AS quantity"
                )
                .from("products")
                .leftJoin("purchases_products", "products.id", "=", "purchases_products.product_id")
                .where("purchases_products.purchase_id", "=", purchase[0].purchaseId);

            const result = {
                purchaseId: purchase[0].purchaseId,
                buyerId: purchase[0].buyerId,
                buyerName: purchase[0].buyerName,
                buyerEmail: purchase[0].buyerEmail,
                totalPrice: purchase[0].totalPrice,
                createdAt: purchase[0].createdAt,
                products: products,
            };

            res.status(200).send(result);
        }
    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

});
