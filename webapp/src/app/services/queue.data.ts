import { QueueItem } from 'src/app/models/queue-item';
declare let Chance: any;

export const SampleQueueItems: QueueItem[] = Array.from(new Array(25)).map(() => {
	let chance = new Chance();
	return {
		filename: `${chance.animal()} (${chance.exp_year()}).${chance.bool() ? 'mkv' : 'mp4'}`,
		progress: chance.integer({ min: 0, max: 100 }),
		started: chance.bool(),
		finished: false,
	}
});