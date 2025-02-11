import { FastifyRequest, FastifyReply } from "fastify";
import { CreateClientsService, ListClients, DeleteClientsService } from "../services/CreateClientsService";

class CreateClientsController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const {nome, email, senha} = request.body as {nome: string, email: string, senha: string}

        const customerService = new CreateClientsService()

        const customer = await customerService.execute({nome, email, senha})

        reply.send(customer)
    }
}

class ListClient{
    async handle2(request: FastifyRequest, reply: FastifyReply){
        const listCustomerService = new ListClients()

        const customer = await listCustomerService.execute2()

        reply.send(customer)
    }
}

class DeleteClients{
    async handle3(request: FastifyRequest, reply: FastifyReply){
        const { id } = request.params as { id: string };

        const deleteService = new DeleteClientsService()

        const client = await deleteService.execute3({id: Number(id)})

        reply.send(client)
    }
}

export {CreateClientsController, ListClient, DeleteClients}