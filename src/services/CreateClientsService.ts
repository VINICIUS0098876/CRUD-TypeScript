import prismaClient from "../prisma";

interface CreateClients {
    nome: string,
    email: string,
    senha: string
}

class CreateClientsService{
    async execute({nome, email, senha}: CreateClients){

        if(!nome || !email || !senha){
            console.log("Preencha todos os campos")
        }

        const customer = await prismaClient.tbl_usuarios.create({
            data: {
                nome,
                email,
                senha
            }
        })

        return customer
    }
}

class ListClients{
    async execute2(){
        const customer = await prismaClient.tbl_usuarios.findMany()

        return customer
    }
}

export {CreateClientsService, ListClients}