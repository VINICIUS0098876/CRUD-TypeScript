"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilUser = exports.LoginUser = exports.ResetPassword = exports.DeleteClients = exports.ListClient = exports.CreateClientsController = void 0;
const CreateClientsService_1 = require("../services/CreateClientsService");
const config_1 = require("../modulo/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Inserir Clientes
class CreateClientsController {
    async handle(request, reply) {
        const { nome, email, senha } = request.body;
        if (!nome || !email || !senha) {
            return reply.send(config_1.ERROR_REQUIRED_FIELDS);
        }
        try {
            const customerService = new CreateClientsService_1.CreateClientsService();
            const customer = await customerService.execute({ nome, email, senha });
            return reply.send({ customer, ...config_1.SUCCESS_CREATED_ITEM });
        }
        catch (error) {
            return reply.send(config_1.ERROR_INTERNAL_SERVER);
        }
    }
}
exports.CreateClientsController = CreateClientsController;
//Listar Clientes
class ListClient {
    async handle(request, reply) {
        try {
            const listCustomerService = new CreateClientsService_1.ListClients();
            const customer = await listCustomerService.execute();
            return reply.status(200).send(customer);
        }
        catch (error) {
            return reply.send(config_1.ERROR_INTERNAL_SERVER_DB);
        }
    }
}
exports.ListClient = ListClient;
// Deletar Clientes
class DeleteClients {
    async handle(request, reply) {
        const { id } = request.params;
        try {
            const deleteService = new CreateClientsService_1.DeleteClientsService();
            const client = await deleteService.execute({ id: Number(id) });
            return reply.send({ ...config_1.SUCCESS_DELETED_ITEM, client });
        }
        catch (error) {
            return reply.send(config_1.ERROR_NOT_FOUND);
        }
    }
}
exports.DeleteClients = DeleteClients;
class ResetPassword {
    async handle(resquest, reply) {
        const { email, novaSenha, token } = resquest.body;
        const redefinirSenha = new CreateClientsService_1.RedefinirSenha();
        try {
            await redefinirSenha.execute(email, novaSenha, token);
            return reply.send({ message: "Senha redefinida com sucesso!!" });
        }
        catch (error) {
            return reply.send({ ERROR_REQUIRED_FIELDS: config_1.ERROR_REQUIRED_FIELDS });
        }
    }
}
exports.ResetPassword = ResetPassword;
class LoginUser {
    async handle(resquest, reply) {
        const { email, senha } = resquest.body;
        if (!email || !senha) {
            return reply.send(config_1.ERROR_REQUIRED_FIELDS);
        }
        try {
            const loginService = new CreateClientsService_1.Login();
            const { token, nome } = await loginService.execute(email, senha);
            return reply.send({ message: 'Login bem sucedido!', token, nome });
        }
        catch (error) {
            return reply.send(config_1.ERROR_INVALID_CREDENTIALS);
        }
    }
}
exports.LoginUser = LoginUser;
class PerfilUser {
    async handle(request, reply) {
        try {
            // 1. Obtendo o token do cabeçalho da requisição 
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.send(config_1.ERROR_INVALID_CREDENTIALS);
            }
            // 2. Extraindo o token 
            const token = authHeader.split(" ")[1];
            // 3. verificando e decodificando o token 
            const decoded = jsonwebtoken_1.default.verify(token, CreateClientsService_1.SECRET_KEY);
            // 4. Chamando o service para busacar os dados do usuario
            const profile = new CreateClientsService_1.Perfil();
            const userData = await profile.execute(decoded.id_usuario);
            // 5. Retornando os dados do usuario
            return reply.send(userData);
        }
        catch (error) {
            return reply.status(401).send("Token inválido ou expirado!");
        }
    }
}
exports.PerfilUser = PerfilUser;
