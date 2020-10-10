const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();
const tv = require('./endpoints/tv');
const movies = require('./endpoints/movies');
const queues = require('./endpoints/queues');
const profiles = require('./endpoints/profiles');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/movies', movies);
app.use('/tv', tv);
app.use('/profiles', profiles);
app.use('/queues', queues);

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});