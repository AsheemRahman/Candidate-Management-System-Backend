import express from 'express'
import { Verify } from '../middleware/auth.js'
import { adminLogin, allCandidate, createCandidate, deleteCandidate, candidateDetail,signout } from '../controller/adminController.js';

const router = express.Router();

Verify(['admin'])


router.post('/login', adminLogin);

router.post('/candidate/create', Verify(['admin']), createCandidate);

router.get('/candidates', Verify(['admin']), allCandidate);

router.delete('/candidate/delete/:id', Verify(['admin']), deleteCandidate);

router.get('/candidateDetail/:id', Verify(['admin']), candidateDetail);

router.post('/signout', signout);

export default router;