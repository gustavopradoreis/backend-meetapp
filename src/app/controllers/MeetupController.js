import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
	async index(req, res) {
		const meetups = await Meetup.findAll({
			where: { user_id: req.userId },
			include: [
				{ model: File, as: 'banner', attributes: ['name', 'path', 'url'] },
				{ model: User, as: 'user', attributes: ['id', 'name'] },
			],
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

		if (isBefore(parseISO(req.body.date), new Date())) {
			return res.status(400).json({ error: 'Meetup date is before today' });
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

		if (meetup.user_id !== req.userId) {
			return res
				.status(401)
				.json({ error: 'You can only update yours meetups' });
		}

		if (isBefore(parseISO(req.body.date), new Date())) {
			return res.status(400).json({ error: 'Meetup date is before today' });
		}

		if (meetup.past) {
			return res.status(400).json({ error: "You can't update past meetups!" });
		}

		const updatedMeetup = await meetup.update(req.body);

		return res.json(updatedMeetup);
	}

	async delete(req, res) {
		const meetup = await Meetup.findByPk(req.params.id);
		if (!meetup) {
			return res.status(400).json({ error: 'Meetup not found!' });
		}

		if (meetup.user_id !== req.userId) {
			return res
				.status(401)
				.json({ error: 'You can only delete yours meetups' });
		}

		if (meetup.past) {
			return res.status(400).json({ error: "You can't delete past meetups!" });
		}

		await meetup.destroy();

		return res.json({ ok: true });
	}
}

export default new MeetupController();
