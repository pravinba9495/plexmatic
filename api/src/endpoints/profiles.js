const router = require('express').Router();
const { getProfilesFromDb, saveProfileInDb, updateProfileInDb } = require('./../utils/db');

router.get('/', async (request, response) => {
	try {
		const profiles = await getProfilesFromDb();
		response.send({ data: profiles || [] });
	} catch (error) {
		console.error(error);
		response.status(500).send({ error });
	}
});

router.post('/', async (request, response) => {
	try {
		await saveProfileInDb(request.body);
		response.send({ data: 'OK' });
	} catch (error) {
		console.error(error);
		response.status(500).send({ error });
	}
});

router.patch('/:id', async (request, response) => {
	try {
		await updateProfileInDb(request.body, request.params.id);
		response.send({ data: 'OK' });
	} catch (error) {
		console.error(error);
		response.status(500).send({ error });
	}
});

module.exports = router;