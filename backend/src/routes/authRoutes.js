import { Router } from 'express';
import { adminLogin, loginUser, registerUser, getCurrentUser } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { adminLoginSchema, userLoginSchema, userRegisterSchema } from '../utils/validators.js';

const router = Router();

router.post('/admin/login', validate(adminLoginSchema), adminLogin);
router.post('/login', validate(userLoginSchema), loginUser);
router.post('/register', validate(userRegisterSchema), registerUser);
router.get('/me', getCurrentUser);

export default router;
