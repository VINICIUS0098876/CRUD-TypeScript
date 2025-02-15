import { error } from "console";
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
        try {
            if(!nome || !email || !senha){
                throw new Error("Preencha todos os campos")
            }
    
            const customer = await prismaClient.tbl_usuarios.create({
                data: {
                    nome,
                    email,
                    senha
                }
            })
    
            return customer
        } catch (error) {
            throw new Error("Erro ao criar Cliente. Verifique se o e-mail já está em uso.")
        }

        
    }
}

class ListClients{
    async execute(){
        try {
            const customer = await prismaClient.tbl_usuarios.findMany()

        return customer
        } catch (error) {
            throw new Error("Erro ao listar clientes.")
        }
        
    }
}

class DeleteClientsService{
    async execute({id}: DeleteClients){
        try {
            if(!id){
                throw new Error("Solicitação invalida!")
            }
    
            const findClients = await prismaClient.tbl_usuarios.findUnique({
                where: {
                    id_usuario: id
                }
            })
    
            if (!findClients) {
                throw new Error("Usuário não encontrado")
            }
    
            await prismaClient.tbl_usuarios.delete({
                where:{
                    id_usuario: findClients.id_usuario
                }
            })
    
            return {message: 'Usuário deletado com sucesso!'}
        }
         catch (error) {
            throw new Error("Erro ao deletar usuário.");
        }

        
}
}
export {CreateClientsService, ListClients, DeleteClientsService}