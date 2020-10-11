const router = require('express').Router();
const { mediaProcessor } = require('../utils/media');
const { ffmpeg } = require('./../utils/bash');
let queues = [];
router.get('/', (request, response) => {
	response.send({
		data: queues.map((q) => {
			return {
				...q,
				started: q.started || false,
				finished: q.finished || false,
		}
	}) });
});

router.get('/start', (request, response) => {
	if (queues.length > 0) {
		if (queues.filter(q => q.started).length > 0) {
			response.status(400).send({ data: 'A queue is already in progress' });
			return;
		} else {
			begin();
			response.send({ data: 'OK' });
		}
	} else {
		response.send({ data: 'OK' });
	}
});

router.get('/clear', (request, response) => {
	queues = [];
	response.send({ data: 'OK' });
});

router.post('/', (request, response) => {
	queues = queues.concat(request.body);
	response.send({ data: queues });
});

const begin = (index = 0) => {
	queue = queues[index];
	setTimeout(async () => {
		try {
			queue.started = true;
			queue.finished = false;
			await mediaProcessor(queue);
			queue.finished = true;
			console.log('finished');
		} catch (error) {
			console.error(error);
		}
		if (queues[index + 1]) {
			begin(index + 1);
		} else {
			// Add to history
			queues = [];
		}
	});
}

module.exports = router;