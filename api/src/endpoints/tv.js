const router = require("express").Router();
const {
  getTvShowsListFromDb,
  refreshList,
  saveTvShowInDb,
} = require("../utils/db");

router.get("/", async (request, response) => {
  try {
    const data = await getTvShowsListFromDb();
    response.send({ data });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
});

router.get("/refresh", async (request, response) => {
  try {
    const data = await refreshList("tv");
    await Promise.all(
      data.map((tv) => {
        return saveTvShowInDb(tv);
      })
    );
    response.send({ data });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error });
  }
});

module.exports = router;
