import express from 'express';
import { checkDoctorAvailability } from '../controller/doctorAvailability.controller.js';

const router = express.Router();

router.get('/doctor-availability', checkDoctorAvailability);

export default router;