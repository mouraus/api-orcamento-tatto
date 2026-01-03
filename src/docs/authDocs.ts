/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuario
 *     description: Cria uma nova conta de usuario no sistema
 *     tags: [Autenticacao]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario registrado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       409:
 *         description: Email ja cadastrado
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuario
 *     description: Autentica o usuario e retorna um token JWT
 *     tags: [Autenticacao]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais invalidas
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuario autenticado
 *     description: Retorna informacoes do usuario atualmente logado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   put:
 *     summary: Atualiza dados do usuario autenticado
 *     description: Permite atualizar nome, email e/ou senha do usuario logado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Novo Nome
 *               email:
 *                 type: string
 *                 format: email
 *                 example: novoemail@email.com
 *               senhaAtual:
 *                 type: string
 *                 description: Obrigatorio se for alterar a senha
 *               novaSenha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: Senha atual incorreta
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /auth/users:
 *   get:
 *     summary: Lista todos os usuarios
 *     description: Retorna lista de todos os usuarios cadastrados
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
