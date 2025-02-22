import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateClientsService,
  ListClients,
  DeleteClientsService,
  RedefinirSenha,
  Login
} from "../services/CreateClientsService";
import {
  ERROR_REQUIRED_FIELDS,
  ERROR_NOT_FOUND,
  ERROR_INVALID_ID,
  SUCCESS_CREATED_ITEM,
  SUCCESS_DELETED_ITEM,
  ERROR_INTERNAL_SERVER_DB,
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_CREDENTIALS,
} from "../modulo/config";

// Inserir Clientes
export class CreateClientsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { nome, email, senha } = request.body as {
      nome: string;
      email: string;
      senha: string;
    };

    if (!nome || !email || !senha) {
      return reply.send(ERROR_REQUIRED_FIELDS);
    }

    try {
      const customerService = new CreateClientsService();

      const customer = await customerService.execute({ nome, email, senha });

      return reply.send({customer, ...SUCCESS_CREATED_ITEM });
    } catch (error) {
      return reply.send(ERROR_INTERNAL_SERVER);
    }
  }
}

//Listar Clientes
export class ListClient {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listCustomerService = new ListClients();

      const customer = await listCustomerService.execute();

      return reply.status(200).send(customer);
    } catch (error) {
      return reply.send(ERROR_INTERNAL_SERVER_DB);
    }
  }
}

// Deletar Clientes
export class DeleteClients {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const deleteService = new DeleteClientsService();

      const client = await deleteService.execute({ id: Number(id) });

      return reply.send({ ...SUCCESS_DELETED_ITEM, client });
    } catch (error) {
      return reply.send(ERROR_NOT_FOUND);
    }
  }
}

export class ResetPassword{
  async handle(resquest: FastifyRequest, reply: FastifyReply){
    const {email, novaSenha, token} = resquest.body as {
      email: string
      novaSenha: string
      token: string
    }

    const redefinirSenha = new RedefinirSenha()

    try {
      await redefinirSenha.execute(email, novaSenha, token)
      return reply.send({message: "Senha redefinida com sucesso!!"})
    } catch (error) {
      return reply.send({ERROR_REQUIRED_FIELDS})
    }
  }
}

export class LoginUser{
  async handle(resquest: FastifyRequest, reply: FastifyReply){
    const {email, senha} = resquest.body as {email: string, senha: string}

    if(!email || !senha){
      return reply.send(ERROR_REQUIRED_FIELDS)
    }

    try {
      const loginService = new Login()

      const token = await loginService.execute(email, senha)

      return reply.send({message: 'Login bem sucedido!', token})
    } catch (error) {
      return reply.send(ERROR_INVALID_CREDENTIALS)
    }

  }
}