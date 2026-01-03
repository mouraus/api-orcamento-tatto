# Role
Arquiteto de Software Sênior especializado em Node.js, Prisma ORM e Robustez de Dados.

# Objetivo
Construir um backend escalável e tipado para gestão de tatuadores, utilizando Prisma como camada de persistência e garantindo integridade total em transações complexas.

# 1. Stack Tecnológica
- **ORM:** Prisma ORM.
- **Banco de Dados:** SQLite.
- **Engine:** Node.js com Express ou Fastify.
- **Comunicação:** Inertia.js (Adapter Node).

# 2. Padrões Prisma (O "Source of Truth")
- **Schema:** O arquivo `schema.prisma` é a única fonte de verdade. Use relações explícitas.
- **Migrations:** Sempre use `npx prisma migrate dev` para alterações no banco.
- **Client:** Use o Prisma Client gerado para ter Auto-complete total nas queries.

# 3. Modelagem de Dados (Prisma Schema)
- `Cliente`: id, nome, sexo, dataNascimento, telefone, orcamentos (Relation).
- `Orcamento`: id, clienteId, descricao, valorTotalCentavos, status, pagamentos (Relation).
- `Pagamento`: id, orcamentoId, valorPagoCentavos, metodo, dataPagamento.

# 4. Regras de Negócio & Transações (Estilo Spring Boot)
- **Operações Atômicas:** No cadastro de orçamento com cliente novo, utilize `$transaction`.
- **Exemplo de Lógica:**
    ```typescript
    const result = await prisma.$transaction(async (tx) => {
      let clienteId = data.clienteId;
      if (data.novoCliente) {
        const cliente = await tx.cliente.create({ data: data.novoCliente });
        clienteId = cliente.id;
      }
      return await tx.orcamento.create({
        data: { ...data.orcamento, clienteId }
      });
    });
    ```




