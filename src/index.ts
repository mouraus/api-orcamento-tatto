import { prisma } from "./lib/prisma";

async function main() {
  console.log("Sistema de Gerenciamento de Tatuadores");
  console.log("=========================================\n");

  // Exemplo de transação atômica: cadastro de orçamento com cliente novo
  const result = await prisma.$transaction(async (tx) => {
    // Criar um cliente de exemplo
    const cliente = await tx.cliente.create({
      data: {
        nome: "Maria Silva",
        sexo: "F",
        telefone: "(11) 99999-9999",
      },
    });

    console.log("Cliente criado:", cliente);

    // Criar um orçamento para o cliente
    const orcamento = await tx.orcamento.create({
      data: {
        clienteId: cliente.id,
        descricao: "Tatuagem floral no braço - 15cm",
        valorTotal: 800.00, // R$ 800,00
        status: "criado",
      },
    });

    console.log("Orcamento criado:", orcamento);

    return { cliente, orcamento };
  });

  console.log("\nResumo da Transacao:");
  console.log("------------------------");
  console.log(`Cliente: ${result.cliente.nome}`);
  console.log(`Orçamento: R$ ${result.orcamento.valorTotal}`);

  // Buscar todos os clientes com seus orçamentos
  const clientes = await prisma.cliente.findMany({
    include: {
      orcamentos: true,
    },
  });

  console.log("\nTodos os clientes:");
  console.log(JSON.stringify(clientes, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
