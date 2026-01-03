/**
 * Data Transfer Objects (DTOs)
 * 
 * Objetos de transferência de dados que definem o formato
 * dos dados retornados pela API. Nunca exponha entidades
 * do banco diretamente para o frontend.
 */

// Exportar OrcamentoDTO primeiro para evitar dependência circular
export * from "./OrcamentoDTO";
export * from "./ClienteDTO";
export * from "./UsuarioDTO";
