import { FastifyRequest, FastifyReply } from "fastify";
import { CreateClientsService, ListClients, DeleteClientsService } from "../services/CreateClientsService";
import { ERROR_REQUIRED_FIELDS, ERROR_NOT_FOUND, ERROR_INVALID_ID, SUCCESS_CREATED_ITEM, SUCCESS_DELETED_ITEM, ERROR_INTERNAL_SERVER_DB, ERROR_INTERNAL_SERVER } from "../../modulo/config";

class CreateClientsController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const {nome, email, senha} = request.body as {nome: string, email: string, senha: string}

        if (!nome || !email || !senha) {
            return reply.send(ERROR_REQUIRED_FIELDS);
        }

        try {

         const customerService = new CreateClientsService()

        const customer = await customerService.execute({nome, email, senha})

        return reply.send({...SUCCESS_CREATED_ITEM, customer});

        } catch (error) {
            return reply.send(ERROR_INTERNAL_SERVER);
        }
        
    }
}

class ListClient{
    async handle(request: FastifyRequest, reply: FastifyReply){

        try {
            const listCustomerService = new ListClients()

        const customer = await listCustomerService.execute()

       return reply.status(200).send(customer)
        } catch (error) {
            return reply.send(ERROR_INTERNAL_SERVER_DB)
        }

        
    }
}

class DeleteClients{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const { id } = request.params as { id: string };

        try {
            const deleteService = new DeleteClientsService()

        const client = await deleteService.execute({id: Number(id)})

        return reply.send({...SUCCESS_DELETED_ITEM,client})
        } catch (error) {
            return reply.send(ERROR_NOT_FOUND)
        }

        
    }
}

export {CreateClientsController, ListClient, DeleteClients}