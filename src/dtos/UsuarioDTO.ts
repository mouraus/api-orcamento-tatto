import type { Usuario } from "../../generated/prisma/client";

/**
 * DTO base para Usuario (sem senha)
 */
export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO resumido para listagem de usuários
 */
export interface UsuarioResumoDTO {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

/**
 * DTO para resposta de login
 */
export interface LoginResponseDTO {
  usuario: UsuarioDTO;
  token: string;
}

/**
 * DTO para resposta de registro
 */
export interface RegisterResponseDTO {
  usuario: UsuarioDTO;
}

/**
 * Mapper: Converte entidade Usuario para UsuarioDTO (remove senha)
 */
export function toUsuarioDTO(usuario: Usuario): UsuarioDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    ativo: usuario.ativo,
    createdAt: usuario.createdAt.toISOString(),
    updatedAt: usuario.updatedAt.toISOString(),
  };
}

/**
 * Mapper: Converte entidade Usuario para UsuarioResumoDTO
 */
export function toUsuarioResumoDTO(usuario: Usuario): UsuarioResumoDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    ativo: usuario.ativo,
  };
}

/**
 * Mapper: Converte lista de usuarios para UsuarioDTO[]
 */
export function toUsuarioDTOs(usuarios: Usuario[]): UsuarioDTO[] {
  return usuarios.map(toUsuarioDTO);
}

/**
 * Mapper: Cria LoginResponseDTO
 */
export function toLoginResponseDTO(usuario: Usuario, token: string): LoginResponseDTO {
  return {
    usuario: toUsuarioDTO(usuario),
    token,
  };
}

/**
 * Mapper: Cria RegisterResponseDTO
 */
export function toRegisterResponseDTO(usuario: Usuario): RegisterResponseDTO {
  return {
    usuario: toUsuarioDTO(usuario),
  };
}
