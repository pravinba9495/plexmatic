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
      setTimeout(() => {
        begin(0);
      });
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

router.post("/", (request, response) => {
  queues = queues.concat(request.body);
  response.send({ data: queues });
});

const begin = (index) => {

  queue = queues[index];
  queue.started = true;
  queue.finished = false;
  queues[index] = queue;
  mediaProcessor(queue).then(() => {
    queue.finished = true;
    queue.status = "Completed";
    console.log(`Finished: ${queue.filename}`);

    if (queues[index + 1]) {
      begin(index + 1);
    } else {
      // Add to history
    }
  }).catch((error) => {
    console.error(error);
    queue.finished = true;
    queue.status = `Error: ${error}`;

    if (queues[index + 1]) {
      begin(index + 1);
    } else {
      // Add to history
    }
  });

};

module.exports = router;
