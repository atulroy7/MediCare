import { Router } from 'express';
import { 
    createPrescription, 
    getUserPrescriptions, 
    getAllPrescriptions, 
    updatePrescriptionStatus 
} from '../controllers/prescriptionController.js';

const router = Router();

router.post('/', createPrescription);
router.get('/my-prescriptions', getUserPrescriptions);
router.get('/all', getAllPrescriptions);
router.patch('/:id/status', updatePrescriptionStatus);

export default router;
