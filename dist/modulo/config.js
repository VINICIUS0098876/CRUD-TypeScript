"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_LOGIN_ITEM = exports.SUCCESS_UPDATED_ITEM = exports.SUCCESS_DELETED_ITEM = exports.SUCCESS_CREATED_ITEM = exports.ERROR_INVALID_CREDENTIALS = exports.ERROR_INTERNAL_SERVER = exports.ERROR_CONTENT_TYPE = exports.ERROR_REQUIRED_FIELDS = exports.ERROR_INTERNAL_SERVER_DB = exports.ERROR_NOT_FOUND = exports.ERROR_INVALID_ID = void 0;
// Erros
exports.ERROR_INVALID_ID = {
    status: false,
    status_code: 400,
    message: "O dado encaminhado na requisição não é válido!!",
};
exports.ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: "Não foi encontrado nenhum item!!",
};
exports.ERROR_INTERNAL_SERVER_DB = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição, devido a um erro no acesso ao banco de dados. Contate o administrador da API!!",
};
exports.ERROR_REQUIRED_FIELDS = {
    status: false,
    status_code: 400,
    message: "Existem campos requeridos que não foram preenchidos ou não atendem aos critérios de digitação!!",
};
exports.ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: "O content-type encaminhado na requisição não é suportado pelo servidor. Deve-se encaminhar apenas requisições com application/json",
};
exports.ERROR_INTERNAL_SERVER = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição, devido a um erro na camada de negócio/controle da aplicação. Contate o administrador da API!!",
};
exports.ERROR_INVALID_CREDENTIALS = {
    status: false,
    status_code: 401,
    message: "Credenciais de autenticação incorretas!!",
};
// Mensagens de Sucesso
exports.SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: "Item criado com sucesso!!",
};
exports.SUCCESS_DELETED_ITEM = {
    status: true,
    status_code: 200,
    message: "Item excluído com sucesso!!",
};
exports.SUCCESS_UPDATED_ITEM = {
    status: true,
    status_code: 200,
    message: "Item atualizado com sucesso!!",
};
exports.SUCCESS_LOGIN_ITEM = {
    status: true,
    status_code: 200,
    message: "Login bem-sucedido!!",
};
