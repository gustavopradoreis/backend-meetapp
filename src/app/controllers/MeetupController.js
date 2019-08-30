import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
	async store(req, res) {
		const schema = Yup.object().shape({
			file_id: Yup.number().required(),
			title: Yup.string().required(),
			description: Yup.string().required(),
			location: Yup.string().required(),
			date: Yup.date().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails!' });
		}

		const { file_id, title, description, location, date } = Meetup.create(
			req.body
		);

		return res.json({
			file_id,
			title,
			description,
			location,
			date,
		});
	}

	async update(req, res) {
		return res.json({ ok: true });
	}

	async delete(req, res) {
		return res.json({ ok: true });
	}
}

export default new MeetupController();
