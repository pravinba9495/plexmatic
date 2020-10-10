const { response } = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./src/database/sqlite.db', (error) => {
	if (error) {
		console.error(error.message);
	}
	console.log('Connected to the database.');
	init();
});

const init = () => {
	db.run(
		`
		CREATE TABLE IF NOT EXISTS profiles
		 (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255), container varchar(255), v_codec varchar(255), v_quality varchar(255), a_codec varchar(255), a_quality int, a_channels int, a_passthrough text, lang_wanted text, lang_primary varchar(255))
		`,
		(error) => {
			if (error) {
				console.error(error);
			}
			console.log('Profiles table created');
		}
	);
}

const getProfilesFromDb = () => {
	return new Promise((resolve, reject) => {
		db.all(
			`
			SELECT id, name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary from profiles
			`,
			(error, rows) => {
				if (error) {
					reject(error);
				}
				resolve(profileMapper(rows));
			}
		)
	});
}

const profileMapper = (rows) => {
	return rows.map((row) => {
		return {
			id: row.id,
			name: row.name,
			container: row.container,
			video: {
				codec: row.v_codec,
				quality: row.v_quality
			},
			audio: {
				codec: row.a_codec,
				quality: row.a_quality,
				channels: row.a_channels,
				passthrough: row.a_passthrough.split(',')
			},
			language: {
				wanted: row.lang_wanted.split(','),
				primary: row.lang_primary
			}
		};
	})
}

const saveProfileInDb = (profile) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO profiles
			(name, container, v_codec, v_quality, a_codec, a_quality, a_channels, a_passthrough, lang_wanted, lang_primary)
			VALUES (?,?,?,?,?,?,?,?,?,?)
			`,
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
				profile.language.primary
			],
			(error) => {
				if (error) {
					reject(error);
				}
				resolve();
			}
		);
	});
};

const updateProfileInDb = (profile, id) => {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE profiles
			SET name = ?, container = ?, v_codec = ?, v_quality = ?, a_codec = ?, a_quality = ?, a_channels = ?, a_passthrough = ?, lang_wanted = ?, lang_primary = ?
			WHERE id = ?
			`,
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
				id
			],
			(error) => {
				if (error) {
					reject(error);
				}
				resolve();
			}
		);
	});
};

module.exports = {
	db,
	getProfilesFromDb,
	saveProfileInDb,
	updateProfileInDb,
};