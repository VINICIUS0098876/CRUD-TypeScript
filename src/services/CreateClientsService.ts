import { error } from "console";
import prismaClient from "../prisma";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { ERROR_INTERNAL_SERVER_DB, ERROR_NOT_FOUND } from "../modulo/config";

interface CreateClients {
  nome: string;
  email: string;
  senha: string;
}

interface DeleteClients {
  id: number;
}

// Inserir Cliente
export class CreateClientsService {
  async execute({ nome, email, senha }: CreateClients) {
    try {
      if (!nome || !email || !senha) {
        throw new Error(
            "Preencha todos os campos"
        );
      }

      const hashedPassword = await bcrypt.hash(senha,10)
      const customer = await prismaClient.tbl_usuarios.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
        },
      });

      return customer;
    } catch (error) {
      throw new Error(
        "Erro ao criar Cliente. Verifique se o e-mail já está em uso."
      );
    }
  }
}


// Listar Cliente
export class ListClients {
  async execute() {
    try {
      const customer = await prismaClient.tbl_usuarios.findMany();

      return customer;
    } catch (error) {
      throw new Error(
        "Erro ao listar clientes."
    );
    }
  }
}


// Deletar Cliente
export class DeleteClientsService {
  async execute({ id }: DeleteClients) {
    try {
      if (!id) {
        throw new Error(
            "Solicitação invalida!"
        );
      }

      const findClients = await prismaClient.tbl_usuarios.findUnique({
        where: {
          id_usuario: id,
        },
      });

      if (!findClients) {
        throw new Error(
            "Usuário não encontrado"
        );
      }

      await prismaClient.tbl_usuarios.delete({
        where: {
          id_usuario: findClients.id_usuario,
        },
      });

      return findClients;
    } catch (error) {
      throw new Error(
        "Erro ao deletar usuário."
    );
    }
  }
}

export const SECRET_KEY = "Client"

export class RedefinirSenha{
  async execute(email: string, novaSenha: string, token: string){
    try {
      // Verificação do Token JWT
      const decoded = Jwt.verify(token, SECRET_KEY) as {email: string}

      if(decoded.email !== email){
        throw new Error("Token inválido")
      }

      // Verificação de Usuário
      const user = await prismaClient.tbl_usuarios.findUnique({
        where: {email}
      })

      if(!user){
        throw new Error("Usuário não encontrado!")
      }

      // Criptografia da nova senha!
      const hashedPassword = await bcrypt.hash(novaSenha, 10)

      // Atualização da senha no banco!
      await prismaClient.tbl_usuarios.update({
        where: {email},
        data: {senha: hashedPassword}
      })

      return {message: "Senha redefinida com sucesso!!"}

    } catch (error) {
      throw new Error("Erro ao redefinir senha!")
    }
  }
}

export class Login{
  async execute(email: string, senha: string){
    const user = await prismaClient.tbl_usuarios.findUnique({
      where: {email}
    })

    if(!user){
      throw new Error('Usuário não encontrado!')
    }

    if (!user.senha) {
      throw new Error('Credenciais Inválidas!')
    }

    const senhaValidacao = await bcrypt.compare(senha, user.senha)

    if(!senhaValidacao){
      throw new Error('Credenciais Inválidas!')
    }

    const token = Jwt.sign({email: user.email, id: user.id_usuario}, SECRET_KEY, {
      expiresIn: 604800
    })
    return token
  }
}



