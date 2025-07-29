import { Router } from 'express';
import { SettingController } from './settings.controller';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();
// router.get('/generals', SettingController.getSettingGenerals);
// router.post('/generals', SettingController.updateGenerals);

router.get('/:key', SettingController.getSetting);
router.post('/:key', authMiddleware('admin'), SettingController.createOrUpdate);

export const SettingsRoutes = router;
