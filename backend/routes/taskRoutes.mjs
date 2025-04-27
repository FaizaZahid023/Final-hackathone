import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, moveTask } from '../controller/taskController.mjs';
// import tokenVerification from "../Middleware/tokenVerification.mjs";
import tokenVerification from "../Middleware/tokenVerification.mjs";


const router = express.Router();

// All routes tokenVerificationed
router.post('/', tokenVerification, createTask);
router.get('/', tokenVerification, getTasks);
router.put('/:id', tokenVerification, updateTask);
router.delete('/:id', tokenVerification, deleteTask);
router.patch('/:id/status', tokenVerification, moveTask);

export default router;
