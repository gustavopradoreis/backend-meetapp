import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupFilterController {
	async index(req, res) {
		const where = {};
		const { page = 1, past = 1, date } = req.query;

		const parsedPast = past !== '0';

		if (date) {
			const parsedDate = parseISO(date);

			if (!parsedPast) {
				where.date = {
					$and: [
						{ [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
						{ [Op.gte]: new Date() },
					],
				};
			} else {
				where.date = {
					[Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
				};
			}
		}

		if (!parsedPast && !date) {
			where.date = {
				[Op.gte]: new Date(),
			};
		}

		const meetups = await Meetup.findAll({
			where,
			limit: 10,
			offset: (page - 1) * 10,
			include: [
				{ model: File, as: 'banner', attributes: ['name', 'path', 'url'] },
				{ model: User, as: 'user', attributes: ['id', 'name'] },
			],
		});

		return res.json(meetups);
	}
}

export default new MeetupFilterController();
