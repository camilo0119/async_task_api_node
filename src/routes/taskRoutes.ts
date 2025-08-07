import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/tasks', asyncHandler(taskController.createTask));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página (máximo 100)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Campo para ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de clasificación
 *     responses:
 *       200:
 *         description: Tareas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/tasks', asyncHandler(taskController.getAllTasks));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea específica por ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/tasks/:id', asyncHandler(taskController.getTaskById));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar completamente una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTask'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/tasks/:id', asyncHandler(taskController.updateTask));

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTask'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.patch('/tasks/:id', asyncHandler(taskController.patchTask));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/tasks/:id', asyncHandler(taskController.deleteTask));

/**
 * @swagger
 * /tasks/status/{status}:
 *   get:
 *     summary: Obtener tareas por estado
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Estado de las tareas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Tareas obtenidas exitosamente
 *       400:
 *         description: Estado inválido
 */
router.get('/tasks/status/:status', asyncHandler(taskController.getTasksByStatus));

/**
 * @swagger
 * /tasks/{id}/schedule:
 *   post:
 *     summary: Programar un trabajo asíncrono para una tarea
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleJob'
 *     responses:
 *       201:
 *         description: Trabajo programado exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.post('/tasks/:id/schedule', asyncHandler(taskController.scheduleJob));

/**
 * @swagger
 * /jobs/{jobId}/status:
 *   get:
 *     summary: Obtener el estado de un trabajo
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo
 *     responses:
 *       200:
 *         description: Estado del trabajo obtenido exitosamente
 *       404:
 *         description: Trabajo no encontrado
 */
router.get('/jobs/:jobId/status', asyncHandler(taskController.getJobStatus));

/**
 * @swagger
 * /queue/stats:
 *   get:
 *     summary: Obtener estadísticas de la cola
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
router.get('/queue/stats', asyncHandler(taskController.getQueueStats));

export { router as taskRoutes };