const db = require('../utils/db');
const {walk} = require('../utils/walk');
const router = require('express').Router();

router.get('/', async (request, response) => {
	response.send({ data: await walk('/movies') });
});

module.exports = router;
