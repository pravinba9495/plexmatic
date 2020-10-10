const router = require('express').Router();

const queues = [];
router.get('/', (request, response) => {
	response.send({ data: queues });
});

router.post('/', (request, response) => {
	queues.concat(request.body);
	response.send({ data: queues });
});

module.exports = router;