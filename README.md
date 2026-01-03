# 🎨 Sistema de Gerenciamento de Tatuadores

Sistema backend para gestao de estudio de tatuagem, incluindo clientes e orcamentos. Desenvolvido com **Node.js**, **TypeScript**, **Prisma ORM** e autenticacao **JWT**.

## 📑 Indice

- [Funcionalidades](#funcionalidades)
- [Stack Tecnologica](#stack-tecnologica)
- [Requisitos](#requisitos)
- [Instalacao](#instalacao)
- [Configuracao](#configuracao)
- [Banco de Dados](#banco-de-dados)
- [Executando a Aplicacao](#executando-a-aplicacao)
- [Autenticacao](#autenticacao)
- [Endpoints da API](#endpoints-da-api)
- [Documentacao Swagger](#documentacao-swagger)
- [Testes](#testes)
- [Deploy em Producao](#deploy-em-producao)
- [Versionamento](#versionamento)

## ✨ Funcionalidades

- **Autenticacao JWT**: Sistema completo de login com tokens seguros
- **Gestao de Clientes**: CRUD completo para clientes do estudio
- **Gestao de Orcamentos**: Criacao e acompanhamento de orcamentos
- **Documentacao Swagger**: API documentada e interativa
- **Validacao de Dados**: Validacao robusta com Zod
- **Seguranca**: Senhas criptografadas com bcrypt, rotas protegidas

## 📋 Stack Tecnologica

| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| Node.js | 20+ | Runtime JavaScript |
| TypeScript | 5.9 | Tipagem estatica |
| Express | 5.x | Framework web |
| Prisma ORM | 7.x | ORM para banco de dados |
| SQLite | - | Banco de dados (desenvolvimento) |
| PostgreSQL | 18 | Banco de dados (producao) |
| JWT | - | Autenticacao via tokens |
| Zod | 4.x | Validacao de schemas |
| Vitest | 4.x | Framework de testes |

## 📦 Requisitos

- Node.js v20.19+ ou v22.12+
- npm ou yarn
- PostgreSQL 18 (para producao)

## 🚀 Instalacao

```bash
# Clonar repositorio
git clone <url-do-repositorio>
cd gerenciamentoTatto

# Instalar dependencias
npm install
```

## ⚙️ Configuracao

### 1. Criar arquivo de variaveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Configurar variaveis

Edite o arquivo `.env` com suas configuracoes:

```env
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000

# Banco de Dados
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./prisma/dev.db

# Autenticacao JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d

# Producao (opcional)
# PRODUCTION_URL=https://api.seudominio.com
```

### Variaveis de Ambiente

| Variavel | Obrigatoria | Descricao |
|----------|-------------|-----------|
| `NODE_ENV` | Sim | Ambiente: `development` ou `production` |
| `PORT` | Nao | Porta do servidor (padrao: 3000) |
| `DATABASE_PROVIDER` | Sim | Provider: `sqlite` ou `postgresql` |
| `DATABASE_URL` | Sim | URL de conexao do banco |
| `JWT_SECRET` | Sim | Chave secreta para tokens JWT |
| `JWT_EXPIRES_IN` | Nao | Tempo de expiracao do token (padrao: 7d) |
| `PRODUCTION_URL` | Nao | URL de producao para Swagger |

## 🗄️ Banco de Dados

### Desenvolvimento (SQLite)

```bash
# Gerar Prisma Client
npm run prisma:generate

# Aplicar migracoes
npm run prisma:migrate

# Visualizar dados (Prisma Studio)
npm run prisma:studio
```

### Producao (PostgreSQL)

Configure a variavel `DATABASE_URL` para PostgreSQL:

```env
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_banco?schema=public
```

## 🏃 Executando a Aplicacao

### Desenvolvimento

```bash
npm run dev
```

Servidor inicia em `http://localhost:3000`

### Producao

```bash
# Build
npm run build

# Executar
npm start
```

## 🔐 Autenticacao

A API utiliza autenticacao JWT. O fluxo e:

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome": "Joao Silva", "email": "joao@email.com", "senha": "senha123"}'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "senha123"}'
```

Resposta:
```json
{
  "success": true,
  "data": {
    "usuario": { "id": 1, "nome": "Joao Silva", "email": "joao@email.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Usar Token nas Requisicoes

```bash
curl -X GET http://localhost:3000/clientes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## 📡 Endpoints da API

### Autenticacao (Publico)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuario |
| POST | `/auth/login` | Fazer login |

### Autenticacao (Protegido)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/auth/me` | Dados do usuario logado |
| PUT | `/auth/me` | Atualizar dados do usuario |
| GET | `/auth/users` | Listar todos usuarios |

### Clientes (Protegido)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/clientes` | Listar clientes |
| POST | `/clientes` | Criar cliente |
| GET | `/clientes/:id` | Buscar cliente por ID |
| PUT | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Remover cliente |
| GET | `/clientes/search?nome=` | Buscar por nome |
| GET | `/clientes/:id/orcamentos` | Orcamentos do cliente |

### Orcamentos (Protegido)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/orcamentos` | Listar orcamentos |
| POST | `/orcamentos` | Criar orcamento |
| GET | `/orcamentos/:id` | Buscar orcamento por ID |
| PUT | `/orcamentos/:id` | Atualizar orcamento |
| DELETE | `/orcamentos/:id` | Remover orcamento |
| PATCH | `/orcamentos/:id/status` | Atualizar status |

### Status de Orcamento

- `criado`: Aguardando aprovacao
- `feito`: Trabalho finalizado
- `cancelado`: Orcamento cancelado

## 📖 Documentacao Swagger

Acesse a documentacao interativa em:

```
http://localhost:3000/api-docs
```

Spec JSON disponivel em:

```
http://localhost:3000/api-docs.json
```

## 🧪 Testes

```bash
# Executar testes em modo watch
npm test

# Executar uma vez
npm run test:run

# Com cobertura
npm run test:coverage

# Interface visual
npm run test:ui
```

## 🚢 Deploy em Producao

### 1. Configurar variaveis de ambiente

```env
NODE_ENV=production
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=chave_muito_segura_e_longa
PRODUCTION_URL=https://api.seudominio.com
```

### 2. Build e execucao

```bash
npm run build
npm start
```

### 3. Migracoes em producao

```bash
npx prisma migrate deploy
```

## 🔢 Versionamento

O projeto segue versionamento semantico. A versao e definida em `package.json` e e utilizada automaticamente em:

- Swagger (documentacao da API)
- Endpoint raiz (`GET /`)
- Endpoint de health check (`GET /health`)

Para atualizar a versao:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 📁 Estrutura do Projeto

```
gerenciamentoTatto/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── migrations/        # Migracoes do banco
├── src/
│   ├── config/            # Configuracoes (Swagger)
│   ├── controllers/       # Controllers da API
│   ├── docs/              # Documentacao Swagger
│   ├── lib/               # Utilitarios (Prisma client)
│   ├── middleware/        # Middlewares (auth, error)
│   ├── routes/            # Rotas da API
│   ├── services/          # Logica de negocio
│   ├── tests/             # Testes automatizados
│   ├── validators/        # Schemas de validacao (Zod)
│   ├── app.ts             # Configuracao do Express
│   └── server.ts          # Ponto de entrada
├── .env.example           # Exemplo de variaveis de ambiente
├── package.json           # Dependencias e scripts
└── README.md              # Esta documentacao
```

## 📄 Licenca

ISC
