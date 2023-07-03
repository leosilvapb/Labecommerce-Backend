import { TProducts, TUsers } from "./types";

const data = (new Date()).getTimezoneOffset() * 60000;
const dataBase = (new Date(Date.now() - data)).toISOString();

export const users: TUsers[] = [
    {
        id: "u001",
        name: "Fulano",
        email: "fulano@email.com",
        password: "fulano123",
        createdAt: dataBase
    }, {
        id: "u002",
        name: "Beltrana",
        email: "beltrana@email.com",
        password: "beltrana00",
        createdAt: dataBase
    }
]

export const products: TProducts[] = [
    {
        id: "prod001",
        name: "Mouse gamer",
        price: 250,
        description: "Melhor mouse do mercado!",
        imageUrl: "https://picsum.photos/seed/Monitor/400"
    }, {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400"
    }
]

export const createUser = (id: string, name: string, email: string, password: string): void => {
    const newUser: TUsers = {
        id,
        name,
        email,
        password,
        createdAt: dataBase
    }
    users.push(newUser)
    console.log("Cadrastro realizado com sucesso");

}

export const getAllUsers = (): TUsers[] => {
    return users
}

export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string) => {
    const newProduct: TProducts = {
        id,
        name,
        price,
        description,
        imageUrl
    }
    products.push(newProduct)
    console.log("Produto criado com sucesso");

}

export const getAllProducts = (): TProducts[] => {
    return products
}

export const searchProductsByName = (name: string): TProducts[] => {
    const result = products.filter((product) => {
        return product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    })

    return result
}