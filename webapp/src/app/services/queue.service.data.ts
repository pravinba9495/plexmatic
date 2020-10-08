import { QueueItem } from 'src/app/models/queue-item';
declare let Chance: any;

export const SampleQueueItems: QueueItem[] = Array.from(new Array(20)).map(() => {
	let chance = new Chance();
	return {
		filename: `${chance.animal()}.mkv`,
		progress: chance.integer({min: 0, max: 100}),
	}
})