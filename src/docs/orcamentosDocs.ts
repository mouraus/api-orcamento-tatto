/**
 * @swagger
 * /orcamentos:
 *   get:
 *     summary: Lista todos os orçamentos
 *     description: Retorna uma lista com todos os orçamentos cadastrados, incluindo dados do cliente
 *     tags: [Orçamentos]
 *     responses:
 *       200:
 *         description: Lista de orçamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orcamento'
 *
 *   post:
 *     summary: Cria um novo orçamento
 *     description: Cadastra um novo orçamento vinculado a um cliente
 *     tags: [Orçamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrcamentoInput'
 *     responses:
 *       201:
 *         description: Orçamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orcamento'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /orcamentos/status/{status}:
 *   get:
 *     summary: Lista orçamentos por status
 *     description: Filtra orçamentos pelo status especificado
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendente, aprovado, em_andamento, concluido, cancelado]
 *         description: Status dos orçamentos a filtrar
 *         example: pendente
 *     responses:
 *       200:
 *         description: Orçamentos filtrados por status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orcamento'
 *
 * /orcamentos/{id}:
 *   get:
 *     summary: Busca orçamento por ID
 *     description: Retorna os dados de um orçamento específico com cliente e pagamentos
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do orçamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Orçamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Orcamento'
 *                 - type: object
 *                   properties:
 *                     totalPago:
 *                       type: integer
 *                       description: Total já pago em centavos
 *                       example: 40000
 *                     saldoRestante:
 *                       type: integer
 *                       description: Saldo restante em centavos
 *                       example: 40000
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Atualiza um orçamento
 *     description: Atualiza os dados de um orçamento existente
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do orçamento
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrcamentoInput'
 *     responses:
 *       200:
 *         description: Orçamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orcamento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 *   delete:
 *     summary: Remove um orçamento
 *     description: Remove permanentemente um orçamento do sistema
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do orçamento
 *         example: 1
 *     responses:
 *       204:
 *         description: Orçamento removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /orcamentos/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um orçamento
 *     description: Atualiza apenas o status de um orçamento existente
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do orçamento
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, aprovado, em_andamento, concluido, cancelado]
 *                 example: aprovado
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orcamento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /clientes/{clienteId}/orcamentos:
 *   get:
 *     summary: Lista orçamentos de um cliente
 *     description: Retorna todos os orçamentos de um cliente específico
 *     tags: [Orçamentos]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Orçamentos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orcamento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
