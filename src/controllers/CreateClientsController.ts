import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateClientsService,
  ListClients,
  DeleteClientsService,
  RedefinirSenha,
  Login,
  SECRET_KEY,
  Perfil
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
import  Jwt  from "jsonwebtoken";

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

      const {token, nome} = await loginService.execute(email, senha)

      return reply.send({message: 'Login bem sucedido!', token, nome})
    } catch (error) {
      return reply.send(ERROR_INVALID_CREDENTIALS)
    }

  }
}

export class PerfilUser{
  async handle(request: FastifyRequest, reply: FastifyReply){
    try {

      // 1. Obtendo o token do cabeçalho da requisição 
      const authHeader = request.headers.authorization
      if(!authHeader){
        return reply.send(ERROR_INVALID_CREDENTIALS)
      }

      // 2. Extraindo o token 
      const token = authHeader.split(" ")[1]

      // 3. verificando e decodificando o token 
      const decoded = Jwt.verify(token, SECRET_KEY) as {id_usuario: number}

      // 4. Chamando o service para busacar os dados do usuario
      const profile = new Perfil()
      const userData = await profile.execute(decoded.id_usuario)

      // 5. Retornando os dados do usuario
      return reply.send(userData)
    } catch (error) {
      return reply.status(401).send("Token inválido ou expirado!")
    }
    

  }
}