/*
  Warnings:

  - You are about to drop the column `valorTotalCentavos` on the `Orcamento` table. All the data in the column will be lost.
  - Added the required column `valorTotal` to the `Orcamento` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorTotal" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'criado',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL,
    "observacoes" TEXT,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orcamento" ("clienteId", "dataAtualizacao", "dataCriacao", "descricao", "id", "observacoes", "status") SELECT "clienteId", "dataAtualizacao", "dataCriacao", "descricao", "id", "observacoes", "status" FROM "Orcamento";
DROP TABLE "Orcamento";
ALTER TABLE "new_Orcamento" RENAME TO "Orcamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
