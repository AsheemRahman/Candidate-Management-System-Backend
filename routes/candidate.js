import express from 'express'
import { verifyToken } from '../middleware/UserAuth.js'
import { candidateLogin, upload, signout } from '../controller/userController.js';

const router = express.Router();


router.post('/login', candidateLogin)

router.post('/upload/:id', verifyToken(["candidate"]), upload)

router.get('/signout', signout);

export default router;