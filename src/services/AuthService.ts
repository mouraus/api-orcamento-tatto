import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { Prisma, Usuario } from "../../generated/prisma/client";
import {
  type UsuarioDTO,
  type LoginResponseDTO,
  toUsuarioDTO,
  toUsuarioDTOs,
  toLoginResponseDTO,
} from "../dtos/UsuarioDTO";

// Tipo para payload do JWT
export interface JwtPayload {
  id: number;
  email: string;
  nome: string;
}

// Tipo para usuario sem senha (mantido para compatibilidade interna)
export type UsuarioSemSenha = Omit<Usuario, "senha">;

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Retorna a chave secreta do JWT
   */
  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET nao configurado no ambiente");
    }
    return secret;
  }

  /**
   * Retorna o tempo de expiracao do JWT
   */
  private getJwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  /**
   * Criptografa uma senha
   */
  async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, this.SALT_ROUNDS);
  }

  /**
   * Compara senha com hash
   */
  async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  /**
   * Gera um token JWT
   */
  generateToken(usuario: UsuarioSemSenha): string {
    const payload: JwtPayload = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    };

    // Usar número em segundos para expiresIn (7 dias = 604800 segundos)
    const expiresInSeconds = this.parseExpiresIn(this.getJwtExpiresIn());

    return jwt.sign(payload, this.getJwtSecret(), { expiresIn: expiresInSeconds });
  }

  /**
   * Converte string de expiração para segundos
   */
  private parseExpiresIn(value: string): number {
    const match = value.match(/^(\d+)([smhdw])$/);
    if (!match) return 604800; // default 7 dias
    
    const num = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
      case "s": return num;
      case "m": return num * 60;
      case "h": return num * 3600;
      case "d": return num * 86400;
      case "w": return num * 604800;
      default: return 604800;
    }
  }

  /**
   * Verifica e decodifica um token JWT
   */
  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.getJwtSecret()) as JwtPayload;
  }

  /**
   * Remove a senha do objeto usuario
   */
  excludePassword(usuario: Usuario): UsuarioSemSenha {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  /**
   * Registra um novo usuario
   */
  async register(data: Prisma.UsuarioCreateInput): Promise<UsuarioDTO> {
    // Verificar se email ja existe
    const existente = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existente) {
      throw new Error("Email ja cadastrado");
    }

    // Criptografar senha
    const senhaHash = await this.hashPassword(data.senha);

    // Criar usuario
    const usuario = await prisma.usuario.create({
      data: {
        ...data,
        senha: senhaHash,
      },
    });

    return toUsuarioDTO(usuario);
  }

  /**
   * Realiza login do usuario
   */
  async login(email: string, senha: string): Promise<LoginResponseDTO> {
    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new Error("Credenciais invalidas");
    }

    if (!usuario.ativo) {
      throw new Error("Usuario desativado");
    }

    // Verificar senha
    const senhaValida = await this.comparePassword(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error("Credenciais invalidas");
    }

    // Gerar token
    const usuarioSemSenha = this.excludePassword(usuario);
    const token = this.generateToken(usuarioSemSenha);

    return toLoginResponseDTO(usuario, token);
  }

  /**
   * Busca usuario por ID
   */
  async findById(id: number): Promise<UsuarioDTO | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) return null;
    return toUsuarioDTO(usuario);
  }

  /**
   * Atualiza dados do usuario
   */
  async update(
    id: number, 
    data: { nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }
  ): Promise<UsuarioDTO> {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    
    if (!usuario) {
      throw new Error("Usuario nao encontrado");
    }

    // Se estiver alterando senha, verificar senha atual
    if (data.novaSenha) {
      if (!data.senhaAtual) {
        throw new Error("Senha atual e obrigatoria");
      }
      
      const senhaValida = await this.comparePassword(data.senhaAtual, usuario.senha);
      if (!senhaValida) {
        throw new Error("Senha atual incorreta");
      }
    }

    // Preparar dados para atualizacao
    const updateData: Prisma.UsuarioUpdateInput = {};
    
    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.novaSenha) {
      updateData.senha = await this.hashPassword(data.novaSenha);
    }

    const atualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    return toUsuarioDTO(atualizado);
  }

  /**
   * Lista todos os usuarios
   */
  async findAll(): Promise<UsuarioDTO[]> {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { createdAt: "desc" },
    });

    return toUsuarioDTOs(usuarios);
  }
}

export const authService = new AuthService();
