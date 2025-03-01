"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const CreateClientsController_1 = require("./controllers/CreateClientsController");
const prisma_1 = __importDefault(require("./prisma"));
const config_1 = require("./modulo/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CreateClientsService_1 = require("./services/CreateClientsService");

async function routes(fastify, options) {

    fastify.post("/customer", async (resquest, reply) => {
        return new CreateClientsController_1.CreateClientsController().handle(resquest, reply);
    });

    fastify.get("/customers", async (resquest, reply) => {
        return new CreateClientsController_1.ListClient().handle(resquest, reply);
    });

    fastify.delete("/customer/:id", async (resquest, reply) => {
        return new CreateClientsController_1.DeleteClients().handle(resquest, reply);
    });

    fastify.patch("/customer/redefinir-senha", async (resquest, reply) => {
        return new CreateClientsController_1.ResetPassword().handle(resquest, reply);
    });

    fastify.post("/customer/recuperar-senha", async (resquest, reply) => {
        const { email } = resquest.body;
        const user = await prisma_1.default.tbl_usuarios.findUnique({
            where: { email }
        });
        if (!user) {
            return reply.send(config_1.ERROR_NOT_FOUND);
        }
        const token = jsonwebtoken_1.default.sign({ email }, CreateClientsService_1.SECRET_KEY, { expiresIn: 3600 });
        return reply.send({ message: `Token de recuperação gerado para ${email}: ${token}` });
    });


    fastify.post("/login", async (resquest, reply) => {
        return new CreateClientsController_1.LoginUser().handle(resquest, reply);
    });
    
    fastify.get("/customer/perfil", async (resquest, reply) => {
        return new CreateClientsController_1.PerfilUser().handle(resquest, reply);
    });
}
