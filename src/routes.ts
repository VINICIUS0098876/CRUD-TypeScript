import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import {
  CreateClientsController,
  ListClient,
  DeleteClients,
  ResetPassword,
} from "./controllers/CreateClientsController";
import prismaClient from "./prisma";
import { ERROR_NOT_FOUND } from "./modulo/config";
import  Jwt  from "jsonwebtoken";
import { SECRET_KEY } from "./services/CreateClientsService";

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {

  fastify.post(
    "/customer",
    async (resquest: FastifyRequest, reply: FastifyReply) => {
      return new CreateClientsController().handle(resquest, reply);
    }
  );

  fastify.get(
    "/customers",
    async (resquest: FastifyRequest, reply: FastifyReply) => {
      return new ListClient().handle(resquest, reply);
    }
  );

  fastify.delete(
    "/customer/:id",
    async (resquest: FastifyRequest, reply: FastifyReply) => {
      return new DeleteClients().handle(resquest, reply);
    }
  );

  fastify.patch(
    "/customer/redefinir-senha",
    async (resquest: FastifyRequest, reply: FastifyReply) => {
      return new ResetPassword().handle(resquest, reply);
    }
  );

  fastify.post(
    "/customer/recuperar-senha",
    async (resquest: FastifyRequest, reply: FastifyReply) => {
      const {email} = resquest.body as {email: string}  

      const user = await prismaClient.tbl_usuarios.findUnique({
        where: {email}
      })
      if(!user){
        return reply.send(ERROR_NOT_FOUND)
      }

      const token = Jwt.sign({email}, SECRET_KEY, {expiresIn: 3600})


      return reply.send({ message: `Token de recuperação gerado para ${email}: ${token}` });
    }
  );

}
