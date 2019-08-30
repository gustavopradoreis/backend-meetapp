import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
	async store(req, res) {
		const schema = Yup.object().shape({
			banner_id: Yup.number().required(),
			title: Yup.string().required(),
			description: Yup.string().required(),
			location: Yup.string().required(),
			date: Yup.date().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails!' });
		}

		const {
			banner_id,
			title,
			description,
			location,
			date,
			user_id,
		} = await Meetup.create({
			...req.body,
			user_id: req.userId,
		});

		return res.json({
			banner_id,
			title,
			description,
			location,
			date,
			user_id,
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
