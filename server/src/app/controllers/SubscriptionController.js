import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

class SubscriptionController {
	async index(req, res) {
		const subscriptions = await Subscription.findAll({
			where: {
				user_id: req.userId,
			},
			include: [
				{
					model: Meetup,
					where: {
						date: {
							[Op.gte]: new Date(),
						},
					},
					required: true,
				},
			],
			order: [[Meetup, 'date']],
		});

		return res.json(subscriptions);
	}

	async store(req, res) {
		const meetup = await Meetup.findByPk(req.params.meetupId, {
			include: [
				{
					model: User,
					as: 'user',
				},
			],
		});

		// O usuário deve poder se inscrever em meetups que não organiza.
		if (meetup.user_id === req.userId) {
			return res
				.status(400)
				.json({ error: "Can't subscribe to you own meetups" });
		}

		// O usuário não pode se inscrever em meetups que já aconteceram.
		if (meetup.past) {
			return res
				.status(400)
				.json({ error: 'This meetup already happens, try another one!' });
		}

		// O usuário não pode se inscrever no mesmo meetup duas vezes.
		// O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.
		const checkSubscription = await Subscription.findOne({
			where: { user_id: req.userId },
			include: [
				{
					model: Meetup,
					required: true,
					where: {
						date: meetup.date,
					},
				},
			],
		});
		if (checkSubscription) {
			return res
				.status(400)
				.json({ error: "You can't subscribe in the same meetup!" });
		}

		const subscription = await Subscription.create({
			meetup_id: req.params.meetupId,
			user_id: req.userId,
		});

		// Send mail

		return res.json(subscription);
	}
}

export default new SubscriptionController();
