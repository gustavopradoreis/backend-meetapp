import Mail from '../../lib/Mail';

class NewSubscriptionMail {
	get key() {
		return 'NewSubscriptionMail';
	}

	async handle({ data }) {
		const { meetup, user } = data;

		await Mail.sendMail({
			to: `${meetup.user.name} <${meetup.user.email}>`,
			subject: 'Nova inscrição no meetup!',
			template: 'new-subscription',
			context: {
				host: meetup.user.name,
				meetup: meetup.title,
				user: user.name,
				email: user.email,
			},
		});
	}
}

export default new NewSubscriptionMail();
