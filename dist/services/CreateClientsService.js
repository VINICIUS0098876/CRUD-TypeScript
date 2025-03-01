"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perfil = exports.Login = exports.RedefinirSenha = exports.SECRET_KEY = exports.DeleteClientsService = exports.ListClients = exports.CreateClientsService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));

// Inserir Cliente
class CreateClientsService {
    async execute({ nome, email, senha }) {
        try {
            if (!nome || !email || !senha) {
                throw new Error("Preencha todos os campos");
            }
            const hashedPassword = await bcrypt_1.default.hash(senha, 10);
            const customer = await prisma_1.default.tbl_usuarios.create({
                data: {
                    nome,
                    email,
                    senha: hashedPassword,
                },
            });
            return customer;
        }
        catch (error) {
            throw new Error("Erro ao criar Cliente. Verifique se o e-mail já está em uso.");
        }
    }
}
exports.CreateClientsService = CreateClientsService;

// Listar Cliente
class ListClients {
    async execute() {
        try {
            const customer = await prisma_1.default.tbl_usuarios.findMany();
            return customer;
        }
        catch (error) {
            throw new Error("Erro ao listar clientes.");
        }
    }
}
exports.ListClients = ListClients;

// Deletar Cliente
class DeleteClientsService {
    async execute({ id }) {
        try {
            if (!id) {
                throw new Error("Solicitação invalida!");
            }
            const findClients = await prisma_1.default.tbl_usuarios.findUnique({
                where: {
                    id_usuario: id,
                },
            });
            if (!findClients) {
                throw new Error("Usuário não encontrado");
            }
            await prisma_1.default.tbl_usuarios.delete({
                where: {
                    id_usuario: findClients.id_usuario,
                },
            });
            return findClients;
        }
        catch (error) {
            throw new Error("Erro ao deletar usuário.");
        }
    }
}
exports.DeleteClientsService = DeleteClientsService;
exports.SECRET_KEY = "Client";

class RedefinirSenha {
    async execute(email, novaSenha, token) {
        try {
            // Verificação do Token JWT
            const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
            if (decoded.email !== email) {
                throw new Error("Token inválido");
            }
            // Verificação de Usuário
            const user = await prisma_1.default.tbl_usuarios.findUnique({
                where: { email }
            });
            if (!user) {
                throw new Error("Usuário não encontrado!");
            }
            // Criptografia da nova senha!
            const hashedPassword = await bcrypt_1.default.hash(novaSenha, 10);
            // Atualização da senha no banco!
            await prisma_1.default.tbl_usuarios.update({
                where: { email },
                data: { senha: hashedPassword }
            });
            return { message: "Senha redefinida com sucesso!!" };
        }
        catch (error) {
            throw new Error("Erro ao redefinir senha!");
        }
    }
}
exports.RedefinirSenha = RedefinirSenha;

class Login {
    async execute(email, senha) {
        const user = await prisma_1.default.tbl_usuarios.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('Usuário não encontrado!');
        }
        if (!user.senha) {
            throw new Error('Credenciais Inválidas!');
        }
        const senhaValidacao = await bcrypt_1.default.compare(senha, user.senha);
        if (!senhaValidacao) {
            throw new Error('Credenciais Inválidas!');
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, id_usuario: user.id_usuario }, exports.SECRET_KEY, {
            expiresIn: 604800
        });
        return { token, nome: user.nome };
    }
}
exports.Login = Login;

class Perfil {
    async execute(id_usuario) {
        const user = prisma_1.default.tbl_usuarios.findUnique({
            where: { id_usuario },
            select: {
                email: true,
                nome: true
            }
        });
        if (!user) {
            throw new Error("Usuário não encontrado!");
        }
        return user;
    }
}
exports.Perfil = Perfil;
