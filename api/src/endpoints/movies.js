const {
  getMoviesListFromDb,
  refreshList,
  saveMovieInDb,
} = require("../utils/db");
const router = require("express").Router();

router.get("/", async (request, response) => {
  try {
    const data = await getMoviesListFromDb();
    response.send({ data });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
});

router.get("/refresh", async (request, response) => {
  try {
    const data = await refreshList("movies");
    response.send({ data });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
});

module.exports = router;
