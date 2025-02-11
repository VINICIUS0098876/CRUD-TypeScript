import prismaClient from "../prisma";

interface CreateClients {
    nome: string,
    email: string,
    senha: string
}

interface DeleteClients{
    id: number
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

class DeleteClientsService{
    async execute3({id}: DeleteClients){

        if(!id){
            throw new Error("Solicitação invalida!")
        }

        const findClients = await prismaClient.tbl_usuarios.findUnique({
            where: {
                id_usuario: id
            }
        })

        if (!findClients) {
            throw new Error("Usuário não encontrado") // Tratamento de erro
        }

        await prismaClient.tbl_usuarios.delete({
            where:{
                id_usuario: findClients.id_usuario
            }
        })

        return {message: 'Usuário deletado com sucesso!'}
    }
}

export {CreateClientsService, ListClients, DeleteClientsService}