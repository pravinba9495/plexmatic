const router = require("express").Router();
const { mediaProcessor } = require("../utils/media");

let queues = [];

router.get("/", (request, response) => {
  response.send({
    data: queues.map((q) => {
      return {
        ...q,
        started: q.started || false,
        finished: q.finished || false,
        status: q.status || "",
      };
    }),
  });
});

router.get("/start", (request, response) => {
  if (queues.length > 0) {
    if (queues.filter((q) => q.started).length > 0) {
      response.status(400).send({ data: "A queue is already in progress" });
      return;
    } else {
      begin(0);
      response.send({ data: "OK" });
    }
  } else {
    response.send({ data: "OK" });
  }
});

router.get("/clear", (request, response) => {
  queues = [];
  response.send({ data: "OK" });
});

router.post("/remove", (request, response) => {
  const { filename } = request.body;
  if (filename) {
    queues.splice(queues.map(q => q.filename).indexOf(filename), 1);
  }
  response.send({ data: "OK" });
});

router.post("/", (request, response) => {
  queues = queues.concat(request.body);
  response.send({ data: queues });
});

const begin = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      queue = queues[index];
      queue.started = true;
      queue.finished = false;
      queues[index] = queue;
      await mediaProcessor(queue);
      queue.finished = true;
      queue.status = "Completed";
      console.log(`Finished: ${queue.filename}`);
      if (queues[index + 1]) {
        return begin(index + 1);
      } else {
        resolve();
      }
      resolve();
    } catch (error) {
      queue.finished = true;
      queue.status = `Error: ${error.message}`;
      console.log(`Finished: ${queue.filename}`);
      if (queues[index + 1]) {
        return begin(index + 1);
      } else {
        resolve();
      }
      resolve();
    }
  });
};

module.exports = router;
