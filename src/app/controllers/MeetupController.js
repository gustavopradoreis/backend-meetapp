import * as Yup from 'yup';

class MeetupController {
	async store(req, res) {
		return res.json({ ok: req.userId });
	}

	async update(req, res) {
		return res.json({ ok: true });
	}

	async delete(req, res) {
		return res.json({ ok: true });
	}
}

export default new MeetupController();
