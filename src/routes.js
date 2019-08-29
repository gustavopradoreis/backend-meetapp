import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
	return res.json({ ok: true });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.delete('/meetups', MeetupController.delete);

export default routes;
