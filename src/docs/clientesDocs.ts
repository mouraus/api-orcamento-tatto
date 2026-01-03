/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     description: Retorna uma lista com todos os clientes cadastrados, ordenados por data de criação (mais recentes primeiro)
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *
 *   post:
 *     summary: Cria um novo cliente
 *     description: Cadastra um novo cliente no sistema
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /clientes/search:
 *   get:
 *     summary: Busca clientes por nome
 *     description: Realiza busca parcial de clientes pelo nome
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo para busca no nome do cliente
 *         example: Maria
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *
 * /clientes/{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     description: Retorna os dados de um cliente específico com seus orçamentos
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Cliente'
 *                 - type: object
 *                   properties:
 *                     orcamentos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Orcamento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Atualiza um cliente
 *     description: Atualiza os dados de um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 *   delete:
 *     summary: Remove um cliente
 *     description: Remove permanentemente um cliente do sistema
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
