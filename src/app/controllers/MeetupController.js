import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
	async index(req, res) {
		const meetups = await Meetup.findAll({
			where: { user_id: req.userId },
		});

		return res.json(meetups);
	}

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

		const meetup = await Meetup.create({
			...req.body,
			user_id: req.userId,
		});

		return res.json(meetup);
	}

	async update(req, res) {
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

		const meetup = await Meetup.findByPk(req.params.id);
		if (!meetup) {
			return res.status(400).json({ error: 'Meetup not found!' });
		}

		const updatedMeetup = await meetup.update(req.body);

		return res.json(updatedMeetup);
	}

	async delete(req, res) {
		const meetup = await Meetup.findByPk(req.params.id);
		if (!meetup) {
			return res.status(400).json({ error: 'Meetup not found!' });
		}

		await meetup.destroy();

		return res.json({ ok: true });
	}
}

export default new MeetupController();
