const mysql = require('mysql2');
let { walk } = require("./walk");

const pool = mysql.createPool({
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	host: process.env.MYSQL_HOST || 'localhost',
	port: Number(process.env.MYSQL_PORT) || 3306,
	user: process.env.MYSQL_USER || 'plexmatic',
	password: process.env.MYSQL_PWD || 'plexmatic',
	database: process.env.MYSQL_DB || 'plexmatic',
	charset: 'utf8mb4'
});

console.log("Connected to MySQL");

const init = async () => {
	try {
		await createProfilesTable();
		await createMoviesTable();
		await createTvShowsTable();
	} catch (error) {
		console.error(error);
	}
};

const createProfilesTable = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			{
				sql: `CREATE TABLE IF NOT EXISTS profiles (id int PRIMARY KEY AUTO_INCREMENT, name varchar(255), container varchar(255), v_codec varchar(255), v_quality varchar(255), a_codec varchar(255), a_quality int, a_channels int, a_passthrough text, lang_wanted text, lang_primary varchar(255))`,
				timeout: 10000
			},
			(error, results, fields) => {
				if (error) {
					console.error(error);
					reject(error);
				}
				console.log('Profiles table created in MySQL');
				resolve();
			}
		);
	});
};

const createMoviesTable = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			{
				sql: `CREATE TABLE IF NOT EXISTS movies (id int PRIMARY KEY AUTO_INCREMENT, file text, type text, path text, parentId int)`,
				timeout: 10000
			},
			(error, results, fields) => {
				if (error) {
					console.error(error);
					reject(error);
				}
				console.log('Movies table created in MySQL');
				resolve();
			}
		);
	});
};

const createTvShowsTable = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			{
				sql: `CREATE TABLE IF NOT EXISTS tv (id int PRIMARY KEY AUTO_INCREMENT, file text, type text, path text, parentId int)`,
				timeout: 10000
			},
			(error, results, fields) => {
				if (error) {
					console.error(error);
					reject(error);
				}
				console.log('TV shows table created in MySQL');
				resolve();
			}
		);
	});
};

const truncateTable = (table) => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `TRUNCATE TABLE ${table}`,
			timeout: 10000
		}, (error, results, fields) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
};

const refreshList = (list) => {
	return new Promise(async (resolve, reject) => {
		try {
			await truncateTable(list);
			const data = await refreshData(list);
			resolve(data);
		} catch (error) {
			reject(error);
		}
	});
};

const refreshData = (list) => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await walk("/" + list);
			resolve(data);
		} catch (error) {
			reject(error);
		}
	});
};

const getProfilesFromDb = () => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `SELECT id, name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary from profiles`,
			timeout: 10000
		}, (error, results, fields) => {
			if (error) {
				reject(error);
			}
			resolve(profileMapper(results || []));
		});
	});
};

const getProfilebyIdFromDb = (id) => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `SELECT id, name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary from profiles  WHERE id = ?`,
			timeout: 10000
		},
			id,
			(error, results, fields) => {
				if (error) {
					reject(error);
				}
				resolve(profileMapper(results || []));
			});
	});
};

const profileMapper = (rows) => {
	return rows.map((row) => {
		return {
			id: row.id,
			name: row.name,
			container: row.container,
			video: {
				codec: row.v_codec,
				quality: row.v_quality,
			},
			audio: {
				codec: row.a_codec,
				quality: row.a_quality,
				channels: row.a_channels,
				passthrough: row.a_passthrough.split(","),
			},
			language: {
				wanted: row.lang_wanted.split(","),
				primary: row.lang_primary,
			},
		};
	});
};

const saveProfileInDb = (profile) => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `INSERT INTO profiles (name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary) VALUES (?,?,?,?,?,?,?,?,?,?)`,
			timeout: 10000
		},
			[
				profile.name,
				profile.container,
				profile.video.codec,
				profile.video.quality,
				profile.audio.codec,
				profile.audio.quality,
				profile.audio.channels,
				profile.audio.passthrough.join(),
				profile.language.wanted.join(),
				profile.language.primary,
			],
			(error, results, fields) => {
				if (error) {
					reject(error);
				}
				resolve();
			}
		);
	});
};

const saveMoviesInDb = (movies, parentId) => {
	if (!parentId) {
		parentId = 0;
	}
	return Promise.all(movies.map((movie) => {
		return new Promise((resolve, reject) => {
			pool.query({
				sql: `INSERT INTO movies (file, type, path, parentId) VALUES (?,?,?,?)`,
				timeout: 10000
			}, [
				movie.file,
				movie.type,
				movie.path,
				parentId
			],
				async (error, results, fields) => {
					if (error) {
						reject(error);
					}
					if (movie.children.length > 0) {
						await saveMoviesInDb(movie.children, results.insertId);
					}
					resolve();
				}
			);
		});
	}));
};

const saveTvShowsInDb = (tvShows, parentId) => {
	if (!parentId) {
		parentId = 0;
	}
	return Promise.all(tvShows.map((tv) => {
		return new Promise((resolve, reject) => {
			pool.query({
				sql: `INSERT INTO tv (file, type, path, parentId) VALUES (?,?,?,?)`,
				timeout: 10000
			}, [
				tv.file,
				tv.type,
				tv.path,
				parentId
			],
				async (error, results, fields) => {
					if (error) {
						reject(error);
					}
					if (tv.children.length > 0) {
						await saveTvShowsInDb(tv.children, results.insertId);
					}
					resolve();
				}
			);
		});
	}));
};

const updateProfileInDb = (profile, id) => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `UPDATE profiles SET name = ?, container = ?, v_codec = ?, v_quality = ?, a_codec = ?, a_quality = ?, a_channels = ?, a_passthrough = ?, lang_wanted = ?, lang_primary = ? WHERE id = ?`,
			timeout: 10000
		},
			[
				profile.name,
				profile.container,
				profile.video.codec,
				profile.video.quality,
				profile.audio.codec,
				profile.audio.quality,
				profile.audio.channels,
				profile.audio.passthrough.join(),
				profile.language.wanted.join(),
				profile.language.primary,
				id,
			],
			(error, results, fields) => {
				if (error) {
					reject(error);
				}
				resolve();
			}
		);
	});
};

const getMoviesListFromDb = () => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `SELECT id, file, type, path, parentId from movies`,
			timeout: 10000
		},
			(error, results, fields) => {
				if (error) {
					reject(error);
				}
				resolve(results || []);
			}
		);
	});
};

const getTvShowsListFromDb = () => {
	return new Promise((resolve, reject) => {
		pool.query({
			sql: `SELECT id, file, type, path, parentId from tv`,
			timeout: 10000
		},
			(error, results, fields) => {
				if (error) {
					reject(error);
				}
				resolve(results || []);
			}
		);
	});
};

init();

module.exports = {
	getProfilesFromDb,
	saveProfileInDb,
	updateProfileInDb,
	getMoviesListFromDb,
	getProfilebyIdFromDb,
	getTvShowsListFromDb,
	saveMoviesInDb,
	saveTvShowsInDb,
	refreshData,
	refreshList,
};