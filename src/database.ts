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
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400"
    }
] 
