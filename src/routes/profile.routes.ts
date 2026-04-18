import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';

const router = Router();

router.post('/', profileController.createProfileHandler);
router.get('/', profileController.getAllProfilesHandler);
router.get('/:id', profileController.getProfileHandler);
router.delete('/:id', profileController.deleteProfileHandler);

export default router;