import Bee from 'bee-queue';
import NewSubscriptionMail from '../app/jobs/NewSubscriptionMail';
import redisConfig from '../config/redis';

const jobs = [NewSubscriptionMail];

class Queue {
	constructor() {
		this.queues = {};

		this.init();
	}

	init() {
		jobs.forEach(({ key, handle }) => {
			this.queues[key] = {
				bee: new Bee(key, {
					redis: redisConfig,
				}),
				handle,
			};
		});
	}

	add(queue, job) {
		return this.queues[queue].bee.createJob(job).save();
	}

	processQueue() {
		jobs.forEach(job => {
			const { bee, handle } = this.queues[job.key];

			bee
				.on('ready', this.handleStart)
				.on('failed', this.handleFailure)
				.on('succeeded', this.handleSucceeded)
				.process(handle);
		});
	}

	handleStart() {
		console.log('# Queue now ready to start doing things');
	}

	handleSucceeded(job) {
		console.log(`# Job ${job.id} succeeded`);
	}

	handleFailure(job, err) {
		console.log(`# Queue ${job.queue.name}: FAILED`, err);
	}
}

export default new Queue();
