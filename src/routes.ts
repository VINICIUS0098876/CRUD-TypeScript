import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateClientsController, ListClient, DeleteClients } from "./controllers/CreateClientsController";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions){
    fastify.get("/teste", async (resquest: FastifyRequest, reply: FastifyReply) => {
        return {ok: true}
    })

    fastify.post("/customer",async (resquest: FastifyRequest, reply: FastifyReply) =>{
        return new CreateClientsController().handle(resquest, reply)
    })

    fastify.get("/customers",async (resquest: FastifyRequest, reply: FastifyReply) =>{
        return new ListClient().handle(resquest, reply)
    })

    fastify.delete("/customer/:id",async (resquest: FastifyRequest, reply: FastifyReply) =>{
        return new DeleteClients().handle(resquest, reply)
    })

}